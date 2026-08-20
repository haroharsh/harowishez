import { connectToDatabase } from './mongodb';
import UserWish from '../models/UserWish';
import { INITIAL_SEED_WISHES, UserWishData } from './seedData';
import fs from 'fs';
import path from 'path';

const LOCAL_DATA_FILE = path.join(process.cwd(), 'data', 'localWishes.json');

// Helper to load locally saved JSON file
function loadLocalFileWishes(): UserWishData[] {
  try {
    if (fs.existsSync(LOCAL_DATA_FILE)) {
      const content = fs.readFileSync(LOCAL_DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading local wishes file:', err);
  }
  return [...INITIAL_SEED_WISHES];
}

// Helper to save to local JSON file
function saveLocalFileWishes(wishes: UserWishData[]) {
  try {
    const dir = path.dirname(LOCAL_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(wishes, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local wishes file:', err);
  }
}

// In-memory + File runtime store initialized
let memoryStore: UserWishData[] = loadLocalFileWishes();

export async function getAllWishes(): Promise<UserWishData[]> {
  const fileExists = fs.existsSync(LOCAL_DATA_FILE);

  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn && mongooseConn.connection?.readyState === 1) {
      let wishes = await UserWish.find({}).sort({ createdAt: -1 }).lean();
      
      // Only seed initial wishes if neither MongoDB nor local file has ever been initialized
      if ((!wishes || wishes.length === 0) && !fileExists) {
        console.log('🌱 Seeding initial relative wishes into MongoDB...');
        const cleanSeeds = memoryStore.map(({ _id, ...rest }) => rest);
        await UserWish.insertMany(cleanSeeds);
        saveLocalFileWishes(INITIAL_SEED_WISHES);
        wishes = await UserWish.find({}).sort({ createdAt: -1 }).lean();
      }
      
      const dbWishes = JSON.parse(JSON.stringify(wishes));
      const combined = [...dbWishes];
      for (const memItem of memoryStore) {
        if (!combined.some(w => w.hash.toLowerCase() === memItem.hash.toLowerCase())) {
          combined.push(memItem);
        }
      }
      return combined;
    }
  } catch (error) {
    console.error('⚠️ MongoDB fetch failed, using local file store:', error);
  }

  return loadLocalFileWishes();
}

export async function getWishByHash(hash: string): Promise<UserWishData | null> {
  if (!hash) return null;
  const decoded = decodeURIComponent(hash);
  const cleanHash = decoded.trim().replace(/^#\/?/, '').replace(/\/$/, '').toLowerCase();

  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn && mongooseConn.connection?.readyState === 1) {
      const wish = await UserWish.findOne({ 
        $or: [
          { hash: { $regex: new RegExp(`^${cleanHash}$`, 'i') } },
          { hash: cleanHash }
        ]
      }).lean();

      if (wish) {
        return JSON.parse(JSON.stringify(wish));
      }
    }
  } catch (error) {
    console.error('⚠️ MongoDB lookup failed, searching local file store:', error);
  }

  // Fallback to local JSON file & memory store
  const localList = loadLocalFileWishes();
  const foundInLocal = localList.find(
    (w) => w.hash.toLowerCase() === cleanHash || w.name.toLowerCase() === cleanHash
  );

  return foundInLocal || null;
}

export async function createWish(data: Partial<UserWishData>): Promise<UserWishData> {
  const generatedHash = data.hash 
    ? data.hash.trim().toLowerCase() 
    : generateRandomHash(data.name || 'relative');

  const newWishData: UserWishData = {
    name: data.name || 'Dear Relative',
    relation: data.relation || '',
    birthdayDate: data.birthdayDate || new Date().toISOString().split('T')[0],
    hash: generatedHash,
    wishes: data.wishes || ['Wishing you a wonderful birthday filled with joy and love!'],
    quotes: data.quotes || ['Celebrate every day as a gift.'],
    pictures: data.pictures || [],
    customMessage: data.customMessage || '',
    songUrl: data.songUrl || '',
    themeColor: data.themeColor || '#ff5734',
    createdAt: new Date().toISOString(),
  };

  // 1. Save to local JSON file store permanently
  const currentList = loadLocalFileWishes();
  const updatedList = [newWishData, ...currentList.filter(w => w.hash.toLowerCase() !== generatedHash)];
  saveLocalFileWishes(updatedList);
  memoryStore = updatedList;

  // 2. Save to MongoDB if connected
  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn && mongooseConn.connection?.readyState === 1) {
      const created = await UserWish.create(newWishData);
      return JSON.parse(JSON.stringify(created.toObject()));
    }
  } catch (error) {
    console.error('⚠️ MongoDB creation failed, saved to local file store:', error);
  }

  return newWishData;
}

export async function updateWish(hash: string, data: Partial<UserWishData>): Promise<UserWishData | null> {
  const cleanHash = hash.trim().toLowerCase();

  // Update local file store
  const currentList = loadLocalFileWishes();
  const index = currentList.findIndex((w) => w.hash.toLowerCase() === cleanHash);
  let updatedLocal: UserWishData | null = null;
  if (index !== -1) {
    currentList[index] = { ...currentList[index], ...data };
    saveLocalFileWishes(currentList);
    memoryStore = currentList;
    updatedLocal = currentList[index];
  }

  // Update MongoDB if connected
  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn && mongooseConn.connection?.readyState === 1) {
      const updated = await UserWish.findOneAndUpdate(
        { hash: cleanHash },
        { $set: data },
        { new: true, runValidators: true }
      ).lean();
      if (updated) {
        return JSON.parse(JSON.stringify(updated));
      }
    }
  } catch (error) {
    console.error('⚠️ MongoDB update failed, updated local file store:', error);
  }

  return updatedLocal;
}

export async function deleteWish(hash: string): Promise<boolean> {
  const cleanHash = hash.trim().toLowerCase();

  // Delete from local file store
  const currentList = loadLocalFileWishes();
  const filtered = currentList.filter((w) => w.hash.toLowerCase() !== cleanHash);
  saveLocalFileWishes(filtered);
  memoryStore = filtered;

  // Delete from MongoDB if connected
  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn && mongooseConn.connection?.readyState === 1) {
      await UserWish.deleteOne({ hash: cleanHash });
    }
  } catch (error) {
    console.error('⚠️ MongoDB delete failed:', error);
  }

  return true;
}

/**
 * Clear all wishes from both MongoDB and local file store all at once.
 */
export async function clearAllWishes(): Promise<boolean> {
  // 1. Clear local file store
  saveLocalFileWishes([]);
  memoryStore = [];

  // 2. Clear MongoDB collection
  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn && mongooseConn.connection?.readyState === 1) {
      await UserWish.deleteMany({});
      console.log('🗑️ All wishes deleted from MongoDB.');
    }
  } catch (error) {
    console.error('⚠️ MongoDB clear all failed:', error);
  }

  return true;
}

/**
 * Reset to default initial seed wishes.
 */
export async function resetToSeedWishes(): Promise<UserWishData[]> {
  saveLocalFileWishes(INITIAL_SEED_WISHES);
  memoryStore = [...INITIAL_SEED_WISHES];

  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn && mongooseConn.connection?.readyState === 1) {
      await UserWish.deleteMany({});
      const cleanSeeds = INITIAL_SEED_WISHES.map(({ _id, ...rest }) => rest);
      await UserWish.insertMany(cleanSeeds);
    }
  } catch (error) {
    console.error('⚠️ MongoDB seed reset failed:', error);
  }

  return memoryStore;
}

function generateRandomHash(name: string): string {
  const prefix = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5);
  const randomHex = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${randomHex}`;
}

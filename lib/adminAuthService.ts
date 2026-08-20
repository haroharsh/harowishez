import { connectToDatabase } from './mongodb';
import AdminUser from '../models/AdminUser';
import crypto from 'crypto';

const SALT = 'harowishez_salt_secret_2026';

export function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, SALT, 1000, 64, 'sha512').toString('hex');
}

export async function ensureDefaultAdmin(): Promise<void> {
  const defaultUsername = 'haroharsh';
  const defaultPassword = 'harshit@admin12';

  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn && mongooseConn.connection?.readyState === 1) {
      const existing = await AdminUser.findOne({ username: defaultUsername });
      if (!existing) {
        const passwordHash = hashPassword(defaultPassword);
        await AdminUser.create({
          username: defaultUsername,
          passwordHash,
        });
        console.log(`✅ Default admin account '${defaultUsername}' seeded into MongoDB.`);
      }
    }
  } catch (error) {
    console.error('⚠️ Could not seed admin user in MongoDB:', error);
  }
}

export async function authenticateAdmin(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  const cleanUsername = username.trim().toLowerCase();
  const defaultUsername = 'haroharsh';
  const defaultPassword = 'harshit@admin12';

  // Ensure default admin exists in MongoDB if connected
  await ensureDefaultAdmin();

  const inputHash = hashPassword(password);

  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn && mongooseConn.connection?.readyState === 1) {
      const admin = await AdminUser.findOne({ username: cleanUsername });
      if (admin) {
        if (admin.passwordHash === inputHash) {
          const token = Buffer.from(`${cleanUsername}:${Date.now()}:${SALT}`).toString('base64');
          return { success: true, token };
        } else {
          return { success: false, error: 'Invalid password' };
        }
      }
    }
  } catch (error) {
    console.error('⚠️ MongoDB auth error, evaluating fallback:', error);
  }

  // Fallback credentials check if MongoDB is offline or user not found in DB
  if (cleanUsername === defaultUsername && password === defaultPassword) {
    const token = Buffer.from(`${cleanUsername}:${Date.now()}:${SALT}`).toString('base64');
    return { success: true, token };
  }

  return { success: false, error: 'Invalid admin credentials' };
}

export interface UserWishData {
  _id?: string;
  name: string;
  relation?: string;
  birthdayDate: string;
  hash: string;
  wishes: string[];
  quotes: string[];
  pictures: string[];
  customMessage: string;
  songUrl?: string;
  themeColor?: string;
  createdAt?: string;
}

export const INITIAL_SEED_WISHES: UserWishData[] = [
  {
    name: "Peter",
    relation: "",
    birthdayDate: "2026-10-18",
    hash: "gdadjgajdgajjhchcjh",
    songUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=happy-birthday-114424.mp3",
    customMessage: "To Peter, who brings warmth, laughter, and endless light into all of our lives. May your day be as extraordinary as your spirit!",
    wishes: [
      "May this new chapter of your journey open doors to breathtaking adventures, deep happiness, and every dream you've worked so hard to build.",
      "Wishing you endless moments of calm clarity, laughter that echoes through the halls, and the warm embrace of family around you today.",
      "May your passion continue to illuminate every space you enter, and may good health and success follow your every step.",
      "Here is to celebrating you—your kindness, your unwavering support, and the genuine joy you bring to every gathering!"
    ],
    quotes: [
      "Life is not measured by the number of breaths we take, but by the moments that take our breath away.",
      "The secret of staying young is to live honestly, eat slowly, and lie about your age.",
      "Count your age by friends, not years. Count your life by smiles, not tears."
    ],
    pictures: [
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop"
    ],
    themeColor: "#ff5734"
  },
  {
    name: "Kashish",
    relation: "",
    birthdayDate: "2026-08-19",
    hash: "kashis-l0g8z401",
    songUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=happy-birthday-114424.mp3",
    customMessage: "To Kashish, wishing you a magical, wonderful birthday filled with happiness, love, and light!",
    wishes: [
      "May your birthday be filled with endless smiles, sweet laughter, and the warmth of everyone who holds you dear.",
      "Wishing you a year ahead overflowing with exciting opportunities, peace of mind, and inner joy.",
      "May every path you walk lead to beautiful places, and may all your heartfelt dreams unfold wonderfully.",
      "Here is to celebrating you today and always—happy birthday, Kashish!"
    ],
    quotes: [
      "The secret of staying young is to live honestly, eat slowly, and lie about your age.",
      "Count your life by smiles, not tears. Count your age by friends, not years.",
      "The best is yet to be."
    ],
    pictures: [
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop"
    ],
    themeColor: "#ff5734"
  },
  {
    name: "Aunt Daniela",
    relation: "Beloved Aunt",
    birthdayDate: "2026-06-12",
    hash: "daniela-b8f9a2e1d0",
    customMessage: "Sending all our love to the heart and soul of our family. Aunt Daniela, your kindness makes the world softer and brighter.",
    wishes: [
      "Wishing you a year ahead filled with quiet mornings, fragrant garden blooms, and peaceful starlit evenings.",
      "May your kitchen always be filled with sweet laughter and your heart with serene contentment.",
      "Thank you for being the gentlest guide and brightest warmth in our lives. Happy Birthday!"
    ],
    quotes: [
      "Grow old along with me! The best is yet to be.",
      "In the garden of life, family is the sweetest flower."
    ],
    pictures: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508672019048-805479767513?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1000&auto=format&fit=crop"
    ],
    themeColor: "#7e813c"
  },
  {
    name: "Grandpa Arthur",
    relation: "Pillar of Wisdom",
    birthdayDate: "2026-11-25",
    hash: "arthur-c4e2f901a5",
    customMessage: "To the legend of our family! Grandpa Arthur, thank you for your stories, wisdom, and eternal strength.",
    wishes: [
      "May your health remain robust, your spirit forever youthful, and your coffee always strong!",
      "Wishing you boundless happiness surrounded by children, grandchildren, and lifelong memories.",
      "Thank you for showing us how to live with honor, generosity, and humor. Cheers to your special day!"
    ],
    quotes: [
      "With age comes wisdom, but sometimes age comes alone.",
      "The longer I live, the more beautiful life becomes."
    ],
    pictures: [
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop"
    ],
    themeColor: "#193c35"
  }
];

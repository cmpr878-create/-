
export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  downloadUrl?: string;
}

export interface Activity {
  id: string;
  title: string;
  status: 'ongoing' | 'completed' | 'planned';
  description: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  type: 'image' | 'video';
}

export interface Member {
  id: string;
  name: string;
  mobile: string;
  password?: string; // Dedicated password field
  joinDate: string;
  totalSavings: number;
  imageUrl?: string;
  performance: 'red' | 'yellow' | 'green';
}

export interface Transaction {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  type: 'savings' | 'withdraw' | 'penalty';
  status: 'paid' | 'pending';
}

export interface Message {
  id: string;
  memberId?: string; // Optional if guest
  senderName: string;
  mobile: string;
  text: string;
  reply?: string;
  date: string;
  isRead: boolean;
}

export interface SamitySettings {
  name: string;
  logo: string;
  slogan: string;
  intro: string;
  aboutTitle: string;
  aboutContent: string;
  membershipRules: string;
  monthlySavingsAmount: number;
  contactAddress: string;
  contactMobile: string;
  contactEmail: string;
  whatsappLink: string;
  facebookLink: string;
  googleMapEmbed: string;
  adminPassword?: string; // Admin password stored in settings
}

export interface AppState {
  settings: SamitySettings;
  notices: Notice[];
  activities: Activity[];
  gallery: GalleryItem[];
  members: Member[];
  transactions: Transaction[];
  messages: Message[];
}

export type AppMode = 'USER' | 'ADMIN';

import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { db } from './firebase';
import { MENU_ITEMS } from '../constants';

export async function migrateMenu() {
  console.log('Starting migration...');
  
  // Check if menu already has items
  const q = query(collection(db, 'menu'), limit(1));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    console.log('Menu collection already contains data. Skipping migration.');
    return;
  }

  try {
    for (const item of MENU_ITEMS) {
      // Remove local ID and let Firestore generate a new one
      const { id, ...itemData } = item;
      await addDoc(collection(db, 'menu'), itemData);
      console.log(`Added: ${item.name}`);
    }
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export async function cleanupReviewsData() {
  console.log('Starting reviews cleanup...');
  
  try {
    const querySnapshot = await getDocs(collection(db, 'reviews'));
    let updatedCount = 0;

    for (const reviewDoc of querySnapshot.docs) {
      const data = reviewDoc.data();
      let comment = data.comment || '';
      let userName = data.userName || '';
      let needsUpdate = false;

      // Helper to fix mangled strings
      const fixString = (str: string) => {
        let newStr = str;
        // Curly quotes
        newStr = newStr.replace(/â€œ/g, '"').replace(/â€ /g, '"').replace(/â€/g, '"');
        // Curly apostrophe
        newStr = newStr.replace(/â€™/g, "'");
        return newStr;
      };

      const newComment = fixString(comment);
      const newUserName = fixString(userName);

      if (newComment !== comment || newUserName !== userName) {
        await updateDoc(doc(db, 'reviews', reviewDoc.id), {
          comment: newComment,
          userName: newUserName
        });
        updatedCount++;
        console.log(`Fixed review from: ${userName}`);
      }
    }
    
    console.log(`Cleanup completed. Fixed ${updatedCount} reviews.`);
    return updatedCount;
  } catch (error) {
    console.error('Cleanup failed:', error);
    throw error;
  }
}

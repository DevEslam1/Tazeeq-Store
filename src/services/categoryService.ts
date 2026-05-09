import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Category } from "../types/app";
import { categories as localCategories } from "../data/categories";

export const CategoryRepository = {
  async getAll(): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, "categories");
      const q = query(categoriesRef, orderBy("name"));
      const querySnapshot = await getDocs(q);
      
      const categories = querySnapshot.docs.map(doc => {
        const data = doc.data();
        let icon = data.icon || 'folder';
        
        // Sanitize legacy/invalid icon names from Firestore
        if (icon === 'bread') icon = 'bread-slice';
        if (icon === 'meat') icon = 'food-steak';
        
        return {
          id: doc.id,
          ...data,
          icon
        };
      }) as Category[];

      // Fallback if database is empty
      if (categories.length === 0) {
        return localCategories;
      }

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return localCategories;
    }
  },

  async getById(id: string): Promise<Category | null> {
    try {
      const docRef = doc(db, "categories", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Category;
      }
      return null;
    } catch (error) {
      console.error("Error fetching category by id:", error);
      throw error;
    }
  },

  async migrateToI18n(): Promise<void> {
    try {
      const { updateDoc, doc: firestoreDoc } = await import('firebase/firestore');
      const categoriesRef = collection(db, "categories");
      const snapshot = await getDocs(categoriesRef);
      
      const batchPromises = snapshot.docs.map(async (d) => {
        const data = d.data();
        const name = data.name || '';
        let nameEn = data.nameEn;

        if (!nameEn) {
          if (name.includes('سمك') || name.includes('أسماك')) nameEn = 'Seafood';
          else if (name.includes('ألبان') || name.includes('جبن')) nameEn = 'Dairy';
          else if (name.includes('خضروات') || name.includes('فواكه')) nameEn = 'Fruits & Veg';
          else if (name.includes('مخبوزات') || name.includes('خبز')) nameEn = 'Bakery';
          else if (name.includes('لحوم') || name.includes('دجاج')) nameEn = 'Meat';
          else if (name.includes('بقالة')) nameEn = 'Grocery';
          else if (name.includes('مشروبات')) nameEn = 'Drinks';
          else nameEn = name;
        }

        // Force update if nameEn is missing or if it's the same as the Arabic name
        if (!data.nameEn || data.nameEn === name) {
          const docRef = firestoreDoc(db, "categories", d.id);
          return updateDoc(docRef, { nameEn });
        }
      });

      await Promise.all(batchPromises);
      console.log("Category migration complete!");
    } catch (error) {
      console.error("Category migration error:", error);
    }
  },

  async refreshData(): Promise<void> {
    try {
      const { writeBatch, doc: firestoreDoc } = await import('firebase/firestore');
      const { categories: localCategories } = await import('../data/categories');
      const batch = writeBatch(db);
      
      localCategories.forEach((category) => {
        const categoryRef = firestoreDoc(db, "categories", category.id);
        batch.set(categoryRef, category, { merge: true });
      });
      
      await batch.commit();
      console.log("Successfully refreshed category data in Firestore");
    } catch (error) {
      console.error("Error refreshing category data:", error);
    }
  }
};

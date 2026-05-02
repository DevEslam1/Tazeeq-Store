import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Category } from "../types/app";

export const CategoryRepository = {
  async getAll(): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, "categories");
      const q = query(categoriesRef, orderBy("name"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
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
  }
};

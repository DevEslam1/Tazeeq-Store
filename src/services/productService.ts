import { collection, getDocs, doc, getDoc, query, where, limit, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Product } from "../types/app";

export const ProductRepository = {
  async getAll(categoryId?: string, maxResults: number = 50): Promise<Product[]> {
    try {
      const productsRef = collection(db, "products");
      let q = query(productsRef, limit(maxResults));
      
      if (categoryId) {
        q = query(productsRef, where("category", "==", categoryId), limit(maxResults));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return null;
    } catch (error) {
      console.error("Error fetching product by id:", error);
      throw error;
    }
  },

  async getFeatured(): Promise<Product[]> {
    try {
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("badges", "array-contains", "tazeeq"), limit(10));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },

  async search(searchTerm: string): Promise<Product[]> {
    // Basic search - in a real app, use Algolia or a proper search backend
    // For now, we'll fetch all and filter client-side, or use a simple query
    try {
      const productsRef = collection(db, "products");
      // Prevent fetching entire DB on search, limit pool to 100 for client filtering
      const querySnapshot = await getDocs(query(productsRef, limit(100)));
      const term = searchTerm.toLowerCase();
      
      return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Product))
        .filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }
};

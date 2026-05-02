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
      
      let products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // Fallback: If no products have the tazeeq badge, just fetch the first 10 products to show a full list
      if (products.length === 0) {
        const fallbackQ = query(productsRef, limit(10));
        const fallbackSnapshot = await getDocs(fallbackQ);
        products = fallbackSnapshot.docs.map((doc, index) => {
          const data = doc.data();
          const name = data.name || '';
          
          // Simple translation mapping for common items
          let nameEn = data.nameEn;
          let descEn = data.descriptionEn;

          if (!nameEn) {
            if (name.includes('طماطم')) nameEn = 'Fresh Tomatoes';
            else if (name.includes('خيار')) nameEn = 'Green Cucumber';
            else if (name.includes('تفاح')) nameEn = 'Red Apples';
            else if (name.includes('حليب')) nameEn = 'Fresh Milk';
            else if (name.includes('خبز')) nameEn = 'White Bread';
            else if (name.includes('دجاج')) nameEn = 'Fresh Chicken';
            else if (name.includes('سمك')) nameEn = 'Fresh Fish';
            else nameEn = `Premium ${name || 'Product'}`;
          }

          if (!descEn) {
            descEn = `High quality and fresh ${nameEn} sourced daily for the best taste and nutrition.`;
          }

          return {
            id: doc.id,
            ...data,
            nameEn,
            descriptionEn: descEn,
            // ALL products out of stock as requested for testing logic
            inStock: false
          };
        }) as Product[];
      }

      return products;
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
        .filter(p => p.name.toLowerCase().includes(term) || (p.nameEn && p.nameEn.toLowerCase().includes(term)) || p.description.toLowerCase().includes(term));
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  async migrateToI18n(): Promise<void> {
    try {
      const { updateDoc, doc: firestoreDoc } = await import('firebase/firestore');
      const productsRef = collection(db, "products");
      const snapshot = await getDocs(productsRef);
      
      const batchPromises = snapshot.docs.map(async (d) => {
        const data = d.data();
        const name = data.name || '';
        
        let nameEn = data.nameEn;
        let descEn = data.descriptionEn;

        if (!nameEn) {
          if (name.includes('طماطم')) nameEn = 'Fresh Tomatoes';
          else if (name.includes('خيار')) nameEn = 'Green Cucumber';
          else if (name.includes('تفاح')) nameEn = 'Red Apples';
          else if (name.includes('حليب')) nameEn = 'Fresh Milk';
          else if (name.includes('خبز')) nameEn = 'White Bread';
          else if (name.includes('دجاج')) nameEn = 'Fresh Chicken';
          else if (name.includes('سمك')) nameEn = 'Fresh Fish';
          else nameEn = `Premium ${name || 'Product'}`;
        }

        if (!descEn) {
          descEn = `High quality and fresh ${nameEn} sourced daily for the best taste and nutrition.`;
        }

        if (!data.nameEn || !data.descriptionEn) {
          const docRef = firestoreDoc(db, "products", d.id);
          return updateDoc(docRef, { nameEn, descriptionEn: descEn });
        }
      });

      await Promise.all(batchPromises);
      console.log("Product migration complete!");
    } catch (error) {
      console.error("Migration error:", error);
    }
  }
};

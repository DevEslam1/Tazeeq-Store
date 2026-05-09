import { collection, getDocs, doc, getDoc, query, where, limit, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Product } from "../types/app";
import { products as localProducts } from "../data/products";

let searchPoolCache: Product[] | null = null;

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
      if (categoryId) {
        return localProducts.filter(p => p.category === categoryId).slice(0, maxResults);
      }
      return localProducts.slice(0, maxResults);
    }
  },

  async getById(productId: string): Promise<Product | null> {
    try {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      // Fallback to local
      return localProducts.find(p => p.id === productId) || null;
    } catch (error) {
      console.error("Error fetching product by id:", error);
      return localProducts.find(p => p.id === productId) || null;
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
          
          let nameEn = '';
          if (name === 'طماطم بلدي') nameEn = 'Local Tomatoes';
          else if (name === 'خيار طازج') nameEn = 'Fresh Cucumber';
          else if (name === 'موز مستورد') nameEn = 'Imported Banana';
          else if (name === 'تفاح أحمر') nameEn = 'Red Apple';
          else if (name === 'بطاطس للطبخ') nameEn = 'Cooking Potatoes';
          else if (name === 'بصل أحمر') nameEn = 'Red Onion';
          else nameEn = name;

          let descEn = data.descriptionEn || '';
          if (!descEn) {
            descEn = `High quality and fresh ${nameEn} sourced daily for the best taste and nutrition.`;
          }

          return {
            id: doc.id,
            ...data,
            nameEn,
            descriptionEn: descEn,
          };
        }) as Product[];
      }

      return products;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      // Fallback to local featured (those with 'tazeeq' badge or first 10)
      const featured = localProducts.filter(p => p.badges?.includes('tazeeq'));
      return featured.length > 0 ? featured.slice(0, 10) : localProducts.slice(0, 10);
    }
  },

  async search(searchTerm: string): Promise<Product[]> {
    try {
      if (!searchPoolCache) {
        const productsRef = collection(db, "products");
        const querySnapshot = await getDocs(query(productsRef, limit(100)));
        searchPoolCache = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      }
      
      const term = searchTerm.toLowerCase();
      return searchPoolCache.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.nameEn && p.nameEn.toLowerCase().includes(term)) || 
        p.description.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error("Error searching products:", error);
      searchPoolCache = localProducts;
      const term = searchTerm.toLowerCase();
      return searchPoolCache.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.nameEn && p.nameEn.toLowerCase().includes(term)) || 
        p.description.toLowerCase().includes(term)
      );
    }
  },

  async migrateToI18n(): Promise<void> {
    try {
      const { updateDoc, doc: firestoreDoc } = await import('firebase/firestore');
      const productsRef = collection(db, "products");
      const querySnapshot = await getDocs(productsRef);
      
      const updates = querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        if (!data.nameEn) {
          return updateDoc(firestoreDoc(db, "products", doc.id), {
            nameEn: data.name || '',
            weightEn: data.weight || '',
            descriptionEn: data.description || ''
          });
        }
      });
      
      await Promise.all(updates);
    } catch (error) {
      console.error("Error migrating products:", error);
    }
  },

  async refreshData(): Promise<void> {
    try {
      const { writeBatch, doc: firestoreDoc } = await import('firebase/firestore');
      const { products: localProducts } = await import('../data/products');
      const batch = writeBatch(db);
      
      localProducts.forEach((product) => {
        const productRef = firestoreDoc(db, "products", product.id);
        batch.set(productRef, product, { merge: true });
      });
      
      await batch.commit();
      console.log("Successfully refreshed product data in Firestore");
    } catch (error) {
      console.error("Error refreshing product data:", error);
    }
  }
};

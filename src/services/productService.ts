import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { Product } from "../types/app";

export const fetchProductsFromFirebase = async (categoryId?: string): Promise<Product[]> => {
  try {
    const productsRef = collection(db, "products");
    let q = query(productsRef);
    
    if (categoryId) {
      q = query(productsRef, where("category", "==", categoryId));
    }
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
  } catch (error) {
    console.error("Error fetching products: ", error);
    return [];
  }
};

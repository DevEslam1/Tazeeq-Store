import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc, 
  getDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Order } from '../types/app';

export const OrderRepository = {
  async create(userId: string, orderData: Omit<Order, 'id'>): Promise<string> {
    const ordersRef = collection(db, 'users', userId, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getAll(userId: string): Promise<Order[]> {
    const ordersRef = collection(db, 'users', userId, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.createdAt ? (data.createdAt as Timestamp).toDate().toLocaleDateString() : data.date
      } as Order;
    });
  },

  async getById(userId: string, orderId: string): Promise<Order | null> {
    const orderRef = doc(db, 'users', userId, 'orders', orderId);
    const snapshot = await getDoc(orderRef);
    
    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        date: data.createdAt ? (data.createdAt as Timestamp).toDate().toLocaleDateString() : data.date
      } as Order;
    }
    return null;
  }
};

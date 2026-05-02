import { 
  collection, 
  addDoc, 
  query, 
  getDocs, 
  doc, 
  updateDoc,
  deleteDoc,
  setDoc,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import { Address } from '../types/app';

export const AddressRepository = {
  async getAll(userId: string): Promise<Address[]> {
    const addressesRef = collection(db, 'users', userId, 'addresses');
    const snapshot = await getDocs(addressesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address));
  },

  async add(userId: string, address: Omit<Address, 'id'>): Promise<string> {
    const addressesRef = collection(db, 'users', userId, 'addresses');
    const docRef = await addDoc(addressesRef, address);
    return docRef.id;
  },

  async update(userId: string, addressId: string, updates: Partial<Address>): Promise<void> {
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    await updateDoc(addressRef, updates);
  },

  async delete(userId: string, addressId: string): Promise<void> {
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    await deleteDoc(addressRef);
  },

  async setSelected(userId: string, addressId: string): Promise<void> {
    const addressesRef = collection(db, 'users', userId, 'addresses');
    const snapshot = await getDocs(addressesRef);
    
    const batchPromises = snapshot.docs.map(addressDoc => {
      const isSelected = addressDoc.id === addressId;
      return updateDoc(addressDoc.ref, { selected: isSelected });
    });

    await Promise.all(batchPromises);
  }
};

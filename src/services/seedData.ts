import { db } from './firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { categories } from '../data/categories';
import { products } from '../data/products';

export async function seedDatabase() {
  try {
    console.log('Starting database seed...');
    const batch = writeBatch(db);

    // Seed Categories
    console.log('Seeding categories...');
    for (const category of categories) {
      const categoryRef = doc(db, 'categories', category.id);
      batch.set(categoryRef, category);
    }

    // Seed Products
    console.log('Seeding products...');
    for (const product of products) {
      const productRef = doc(db, 'products', product.id);
      batch.set(productRef, product);
    }

    await batch.commit();
    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

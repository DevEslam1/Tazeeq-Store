import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth } from '../services/firebase';
import { login, logout } from '../store/slices/authSlice';
import { User } from '../types/app';

export function useAuthBootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Guest',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || undefined,
        };
        dispatch(login(user));
      } else {
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch]);
}

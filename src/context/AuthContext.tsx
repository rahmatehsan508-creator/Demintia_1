import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { RoutineItem, MemoryPerson, UserProfile } from '../types';
import { INITIAL_ROUTINE, INITIAL_MEMORIES } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  routines: RoutineItem[];
  memories: MemoryPerson[];
  signUpPatient: (email: string, pass: string, name: string) => Promise<void>;
  signInPatient: (email: string, pass: string) => Promise<void>;
  logOutPatient: () => Promise<void>;
  toggleRoutineCompleted: (id: string) => Promise<void>;
  addCustomRoutine: (item: Omit<RoutineItem, 'id' | 'completed'>) => Promise<void>;
  addCustomMemory: (item: Omit<MemoryPerson, 'id'>) => Promise<void>;
  logProgressActivity: (data: { gameId?: string; score?: number; latencyMs?: number; notes?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [routines, setRoutines] = useState<RoutineItem[]>(INITIAL_ROUTINE);
  const [memories, setMemories] = useState<MemoryPerson[]>(INITIAL_MEMORIES);

  // Sync Auth State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch or create user profile
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserProfile({
              uid: user.uid,
              email: user.email || '',
              displayName: data.displayName || user.displayName || 'Beloved Patient',
              preferredLanguage: data.preferredLanguage || 'en',
              createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
            });
          } else {
            // First time profile creation
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Beloved Patient',
              preferredLanguage: 'en',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, {
              ...newProfile,
              role: 'patient',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            setUserProfile(newProfile);

            // Seed initial routines for the patient
            const routinesCol = collection(db, 'users', user.uid, 'routines');
            for (const r of INITIAL_ROUTINE) {
              await addDoc(routinesCol, {
                ...r,
                userId: user.uid,
                createdAt: serverTimestamp()
              });
            }

            // Seed initial memories
            const memoriesCol = collection(db, 'users', user.uid, 'memories');
            for (const m of INITIAL_MEMORIES) {
              await addDoc(memoriesCol, {
                ...m,
                userId: user.uid,
                createdAt: serverTimestamp()
              });
            }
          }
        } catch (err) {
          console.error('Error fetching/creating patient profile in Firestore:', err);
        }
      } else {
        setUserProfile(null);
        // Revert to local initial data when logged out
        setRoutines(INITIAL_ROUTINE);
        setMemories(INITIAL_MEMORIES);
      }
      setIsLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to Firestore Routines for authenticated patient
  useEffect(() => {
    if (!currentUser) return;

    const routinesCol = collection(db, 'users', currentUser.uid, 'routines');
    const unsubscribeRoutines = onSnapshot(routinesCol, (snapshot) => {
      if (!snapshot.empty) {
        const cloudRoutines: RoutineItem[] = snapshot.docs.map((d) => ({
          id: d.id,
          time: d.data().time || '09:00 AM',
          period: d.data().period || 'Morning',
          title: d.data().title || '',
          description: d.data().description || '',
          pillColor: d.data().pillColor,
          category: d.data().category || 'medication',
          completed: !!d.data().completed,
        }));
        setRoutines(cloudRoutines);
      }
    }, (err) => {
      console.warn('Routines snapshot error:', err);
    });

    return () => unsubscribeRoutines();
  }, [currentUser]);

  // Listen to Firestore Memories for authenticated patient
  useEffect(() => {
    if (!currentUser) return;

    const memoriesCol = collection(db, 'users', currentUser.uid, 'memories');
    const unsubscribeMemories = onSnapshot(memoriesCol, (snapshot) => {
      if (!snapshot.empty) {
        const cloudMemories: MemoryPerson[] = snapshot.docs.map((d) => ({
          id: d.id,
          name: d.data().name || '',
          relation: d.data().relation || '',
          location: d.data().location || '',
          story: d.data().story || '',
          imageUrl: d.data().imageUrl || '',
          phone: d.data().phone,
          keyMemory: d.data().keyMemory || '',
        }));
        setMemories(cloudMemories);
      }
    }, (err) => {
      console.warn('Memories snapshot error:', err);
    });

    return () => unsubscribeMemories();
  }, [currentUser]);

  const signUpPatient = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (name.trim() && cred.user) {
      await updateProfile(cred.user, { displayName: name.trim() });
    }
  };

  const signInPatient = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logOutPatient = async () => {
    await signOut(auth);
  };

  const toggleRoutineCompleted = async (id: string) => {
    if (currentUser) {
      try {
        const routineDocRef = doc(db, 'users', currentUser.uid, 'routines', id);
        const currentItem = routines.find(r => r.id === id);
        if (currentItem) {
          await updateDoc(routineDocRef, {
            completed: !currentItem.completed,
            updatedAt: serverTimestamp()
          });
        }
      } catch (err) {
        console.error('Failed to toggle routine on Firestore:', err);
        // Fallback optimistic update
        setRoutines(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
      }
    } else {
      // Local state update when guest
      setRoutines(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    }
  };

  const addCustomRoutine = async (item: Omit<RoutineItem, 'id' | 'completed'>) => {
    if (currentUser) {
      const routinesCol = collection(db, 'users', currentUser.uid, 'routines');
      await addDoc(routinesCol, {
        ...item,
        completed: false,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } else {
      const newLocalItem: RoutineItem = {
        id: `r-${Date.now()}`,
        ...item,
        completed: false,
      };
      setRoutines(prev => [...prev, newLocalItem]);
    }
  };

  const addCustomMemory = async (item: Omit<MemoryPerson, 'id'>) => {
    if (currentUser) {
      const memoriesCol = collection(db, 'users', currentUser.uid, 'memories');
      await addDoc(memoriesCol, {
        ...item,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } else {
      const newLocalMemory: MemoryPerson = {
        id: `m-${Date.now()}`,
        ...item,
      };
      setMemories(prev => [...prev, newLocalMemory]);
    }
  };

  const logProgressActivity = async (data: { gameId?: string; score?: number; latencyMs?: number; notes?: string }) => {
    if (currentUser) {
      try {
        const progressCol = collection(db, 'users', currentUser.uid, 'progress');
        await addDoc(progressCol, {
          ...data,
          userId: currentUser.uid,
          date: new Date().toISOString().split('T')[0],
          timestamp: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Failed to log cognitive progress to cloud:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isLoading,
        routines,
        memories,
        signUpPatient,
        signInPatient,
        logOutPatient,
        toggleRoutineCompleted,
        addCustomRoutine,
        addCustomMemory,
        logProgressActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import type { AutonomousDiscoveryJob } from '../types/translation';

/**
 * Service to manage persistent user-specific discoveries in Firestore under /users/{userId}/discoveries
 */

export async function getUserDiscoveriesFromFirestore(userId: string): Promise<AutonomousDiscoveryJob[]> {
  if (!userId) return [];
  const colPath = `users/${userId}/discoveries`;
  try {
    const colRef = collection(db, 'users', userId, 'discoveries');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const jobs: AutonomousDiscoveryJob[] = [];
    snapshot.forEach((docSnap) => {
      jobs.push(docSnap.data() as AutonomousDiscoveryJob);
    });
    return jobs;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
    return [];
  }
}

export async function saveUserDiscoveryToFirestore(
  userId: string,
  job: AutonomousDiscoveryJob
): Promise<void> {
  if (!userId || !job?.id) return;
  const docPath = `users/${userId}/discoveries/${job.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'discoveries', job.id);
    await setDoc(docRef, {
      ...job,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteUserDiscoveryFromFirestore(
  userId: string,
  jobId: string
): Promise<void> {
  if (!userId || !jobId) return;
  const docPath = `users/${userId}/discoveries/${jobId}`;
  try {
    const docRef = doc(db, 'users', userId, 'discoveries', jobId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export function subscribeToUserDiscoveries(
  userId: string,
  onUpdate: (jobs: AutonomousDiscoveryJob[]) => void,
  onError?: (err: any) => void
): () => void {
  if (!userId) return () => {};
  const colRef = collection(db, 'users', userId, 'discoveries');
  const q = query(colRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const jobs: AutonomousDiscoveryJob[] = [];
      snapshot.forEach((docSnap) => {
        jobs.push(docSnap.data() as AutonomousDiscoveryJob);
      });
      onUpdate(jobs);
    },
    (err) => {
      console.warn('Discoveries snapshot listener error:', err);
      if (onError) onError(err);
    }
  );
}

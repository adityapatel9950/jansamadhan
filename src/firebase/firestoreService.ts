import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { Challenge, ChallengeFilterState, ChallengeStatus, ChallengeStats } from '../types/challenge';

const CHALLENGES_COLLECTION = 'challenges';

/**
 * Service for Firestore real-time and offline data handling
 */
export const firestoreChallengeService = {
  /**
   * Fetch all challenges with client-side or Firestore compound querying
   */
  async getChallenges(filters: ChallengeFilterState = {}): Promise<{ items: Challenge[]; total: number }> {
    try {
      const colRef = collection(db, CHALLENGES_COLLECTION);
      const snapshot = await getDocs(colRef);
      
      let items: Challenge[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Challenge, 'id'>),
      }));

      // Apply in-memory filtering for flexible prototype search
      if (filters.status) {
        items = items.filter((c) => c.status === filters.status);
      }
      if (filters.district) {
        items = items.filter((c) => c.district.toLowerCase() === filters.district!.toLowerCase());
      }
      if (filters.category) {
        items = items.filter((c) => c.category === filters.category);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.district.toLowerCase().includes(q) ||
            (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }

      // Sort by createdAt desc
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;
      const paginated = items.slice(offset, offset + limit);

      return {
        items: paginated,
        total: items.length,
      };
    } catch (err) {
      console.warn('Firestore fetch failed, falling back to local/REST API:', err);
      throw err;
    }
  },

  /**
   * Get single challenge by ID
   */
  async getChallengeById(id: string): Promise<Challenge | null> {
    try {
      const docRef = doc(db, CHALLENGES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...(docSnap.data() as Omit<Challenge, 'id'>) };
    } catch (err) {
      console.warn('Firestore getChallengeById error:', err);
      return null;
    }
  },

  /**
   * Create or save challenge to Firestore
   */
  async createChallenge(challenge: Challenge): Promise<Challenge> {
    const docRef = doc(db, CHALLENGES_COLLECTION, challenge.id);
    await setDoc(docRef, challenge);
    return challenge;
  },

  /**
   * Update challenge status in Firestore
   */
  async updateStatus(
    id: string,
    status: ChallengeStatus,
    verifiedBy?: string,
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED'
  ): Promise<void> {
    const docRef = doc(db, CHALLENGES_COLLECTION, id);
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (verifiedBy) updateData.verifiedBy = verifiedBy;
    if (verificationStatus) updateData.verificationStatus = verificationStatus;

    await updateDoc(docRef, updateData);
  },

  /**
   * Subscribe to real-time updates for SIH live presentations
   */
  subscribeToChallenges(callback: (challenges: Challenge[]) => void): Unsubscribe {
    const colRef = collection(db, CHALLENGES_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      const list: Challenge[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Challenge, 'id'>),
      }));
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(list);
    }, (error) => {
      console.warn('Real-time challenge subscription error:', error);
    });
  },

  /**
   * Calculate live aggregations from Firestore collection
   */
  async getStats(): Promise<ChallengeStats> {
    const colRef = collection(db, CHALLENGES_COLLECTION);
    const snapshot = await getDocs(colRef);
    const items: Challenge[] = snapshot.docs.map((docSnap) => docSnap.data() as Challenge);

    const stats: ChallengeStats = {
      total: items.length,
      submitted: 0,
      underReview: 0,
      accepted: 0,
      inProgress: 0,
      resolved: 0,
      byCategory: {},
      byDistrict: {},
    };

    for (const c of items) {
      if (c.status === 'SUBMITTED') stats.submitted++;
      else if (c.status === 'UNDER_REVIEW') stats.underReview++;
      else if (c.status === 'ACCEPTED') stats.accepted++;
      else if (c.status === 'IN_PROGRESS') stats.inProgress++;
      else if (c.status === 'RESOLVED') stats.resolved++;

      const cat = c.category || 'General';
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
      stats.byDistrict[c.district] = (stats.byDistrict[c.district] || 0) + 1;
    }

    return stats;
  }
};

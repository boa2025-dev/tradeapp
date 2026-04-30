import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  serverTimestamp,
  deleteField,
  Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'

export interface UserProfile {
  uid: string
  username: string
  email: string
  friends: string[]
  friendRequests: string[]
  createdAt: unknown
}

export type OwnedMap = Record<string, number>

// ── User profile ─────────────────────────────────────────────

export async function createUserProfile(uid: string, username: string, email: string) {
  await Promise.all([
    setDoc(doc(db, 'users', uid), {
      uid, username, email,
      friends: [], friendRequests: [],
      createdAt: serverTimestamp(),
    }),
    setDoc(doc(db, 'usernames', username), { uid }),
    setDoc(doc(db, 'userStickers', uid), { owned: {} }),
  ])
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export async function getUserByUsername(username: string): Promise<string | null> {
  const snap = await getDoc(doc(db, 'usernames', username))
  if (!snap.exists()) return null
  return (snap.data() as { uid: string }).uid
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'usernames', username))
  return snap.exists()
}

export function subscribeToProfile(uid: string, cb: (p: UserProfile) => void): Unsubscribe {
  return onSnapshot(doc(db, 'users', uid), snap => {
    if (snap.exists()) cb(snap.data() as UserProfile)
  })
}

// ── Stickers ──────────────────────────────────────────────────

function parseOwned(raw: unknown): OwnedMap {
  if (!raw) return {}
  // Migrate old format: string[] → Record<string, number>
  if (Array.isArray(raw)) {
    const map: OwnedMap = {}
    raw.forEach((id: string) => { map[id] = 1 })
    return map
  }
  return raw as OwnedMap
}

export function subscribeToStickers(uid: string, cb: (owned: OwnedMap) => void): Unsubscribe {
  return onSnapshot(doc(db, 'userStickers', uid), snap => {
    if (snap.exists()) cb(parseOwned(snap.data().owned))
  })
}

export async function getStickers(uid: string): Promise<OwnedMap> {
  const snap = await getDoc(doc(db, 'userStickers', uid))
  if (!snap.exists()) return {}
  return parseOwned(snap.data().owned)
}

export async function setStickerQty(uid: string, stickerId: string, qty: number): Promise<void> {
  await updateDoc(doc(db, 'userStickers', uid), {
    [`owned.${stickerId}`]: qty <= 0 ? deleteField() : qty,
  })
}

// ── Friends ───────────────────────────────────────────────────

export async function sendFriendRequest(fromUid: string, toUid: string): Promise<void> {
  await updateDoc(doc(db, 'users', toUid), {
    friendRequests: arrayUnion(fromUid),
  })
}

export async function acceptFriendRequest(myUid: string, requesterUid: string): Promise<void> {
  await Promise.all([
    updateDoc(doc(db, 'users', myUid), {
      friends: arrayUnion(requesterUid),
      friendRequests: arrayRemove(requesterUid),
    }),
    updateDoc(doc(db, 'users', requesterUid), {
      friends: arrayUnion(myUid),
    }),
  ])
}

export async function rejectFriendRequest(myUid: string, requesterUid: string): Promise<void> {
  await updateDoc(doc(db, 'users', myUid), {
    friendRequests: arrayRemove(requesterUid),
  })
}

export async function removeFriend(myUid: string, friendUid: string): Promise<void> {
  await Promise.all([
    updateDoc(doc(db, 'users', myUid), { friends: arrayRemove(friendUid) }),
    updateDoc(doc(db, 'users', friendUid), { friends: arrayRemove(myUid) }),
  ])
}

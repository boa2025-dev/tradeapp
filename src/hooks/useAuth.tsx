import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { createUserProfile, getUserProfile, isUsernameTaken, UserProfile } from '../lib/firestore'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  register: (email: string, password: string, username: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<{ needsUsername: boolean }>
  finishGoogleSetup: (username: string) => Promise<void>
  logout: () => Promise<void>
  pendingGoogleUser: User | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingGoogleUser, setPendingGoogleUser] = useState<User | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async firebaseUser => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const p = await getUserProfile(firebaseUser.uid)
        setProfile(p)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function register(email: string, password: string, username: string) {
    const trimmed = username.trim().toLowerCase()
    if (trimmed.length < 3) throw new Error('El nombre de usuario debe tener al menos 3 caracteres.')
    if (!/^[a-z0-9_]+$/.test(trimmed))
      throw new Error('Solo letras, números y guiones bajos.')
    const taken = await isUsernameTaken(trimmed)
    if (taken) throw new Error('Ese nombre de usuario ya está en uso.')

    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
    await createUserProfile(newUser.uid, trimmed, email)
    const p = await getUserProfile(newUser.uid)
    setProfile(p)
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function loginWithGoogle(): Promise<{ needsUsername: boolean }> {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const googleUser = result.user
    const existing = await getUserProfile(googleUser.uid)
    if (existing) {
      setProfile(existing)
      return { needsUsername: false }
    }
    // New Google user — needs to pick a username
    setPendingGoogleUser(googleUser)
    return { needsUsername: true }
  }

  async function finishGoogleSetup(username: string) {
    const googleUser = pendingGoogleUser
    if (!googleUser) throw new Error('No hay usuario de Google pendiente.')
    const trimmed = username.trim().toLowerCase()
    if (trimmed.length < 3) throw new Error('El nombre de usuario debe tener al menos 3 caracteres.')
    if (!/^[a-z0-9_]+$/.test(trimmed)) throw new Error('Solo letras, números y guiones bajos.')
    const taken = await isUsernameTaken(trimmed)
    if (taken) throw new Error('Ese nombre de usuario ya está en uso.')
    await createUserProfile(googleUser.uid, trimmed, googleUser.email ?? '')
    const p = await getUserProfile(googleUser.uid)
    setProfile(p)
    setPendingGoogleUser(null)
  }

  async function logout() {
    await signOut(auth)
    setProfile(null)
    setPendingGoogleUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, register, login, loginWithGoogle, finishGoogleSetup, logout, pendingGoogleUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

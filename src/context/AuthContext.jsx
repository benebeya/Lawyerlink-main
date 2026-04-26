import { createContext, useContext, useEffect, useState } from 'react'
import { storage, initStorage } from '../lib/storage'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      const sessionUser = storage.getSession()
      if (sessionUser) {
        setUser(sessionUser)
        try {
          const userProfile = await storage.getProfile(sessionUser.id)
          setProfile(userProfile)
        } catch (e) {
          console.error('Failed to load profile', e)
        }
      }
      setLoading(false)
    }
    restoreSession()
  }, [])

  async function signUp({ email, password, full_name, role = 'client' }) {
    const id = Math.random().toString(36).substr(2, 9)
    const result = await storage.signUp({ id, email, password, full_name, role })
    
    if (result.error) throw new Error(result.error)

    const newUser = { id, email }
    const newProfile = { id, full_name, role }

    storage.setSession(newUser)
    setUser(newUser)
    setProfile(newProfile)

    return { user: newUser }
  }

  async function signIn({ email, password }) {
    try {
      const { user, profile } = await storage.login({ email, password })
      
      const { password: _, ...userWithoutPassword } = user
      storage.setSession(userWithoutPassword)
      setUser(userWithoutPassword)
      setProfile(profile)

      return { user: userWithoutPassword }
    } catch (err) {
      throw new Error(err.message || 'Invalid credentials')
    }
  }

  async function signOut() {
    storage.clearSession()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

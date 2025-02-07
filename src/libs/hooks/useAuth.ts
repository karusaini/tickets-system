import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from '@/libs/firebase'
import { doc, getDoc } from 'firebase/firestore'

const useAuth = (requiredRole: string) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.email!)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const role = userDoc.data().role

          if (role === requiredRole) {
            setUser({ ...currentUser, role })
          } else {
            setUser(null) // Invalid role for the page
          }
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [requiredRole])

  const logout = () => signOut(auth)

  return { user, loading, logout }
}

export default useAuth

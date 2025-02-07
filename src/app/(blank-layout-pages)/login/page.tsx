'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/libs/firebase'
import { useRouter } from 'next/navigation'
import { TextField, Button, Box, Typography, Alert, Container, Paper, CircularProgress } from '@mui/material'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.email))

      if (userDoc.exists()) {
        const userRole = userDoc.data().role

        // Storing user role in localStorage and redirecting based on role
        localStorage.setItem('userRole', userRole)

        if (userRole === 'customer') {
          router.push('/customer-dashboard')
        } else if (userRole === 'support') {
          router.push('/support-dashboard')
        } else {
          setError('Role not recognized.')
        }
      } else {
        setError('User role not found.')
      }
    } catch (err) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth='xs' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={8} sx={{ p: 5, width: '100%', textAlign: 'center', borderRadius: 3 }}>
        <Typography variant='h4' gutterBottom fontWeight='bold'>
          Welcome Back!
        </Typography>
        <Typography variant='subtitle1' sx={{ color: 'gray' }}>
          Please sign in to your account
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component='form' onSubmit={handleLogin} sx={{ mt: 4 }}>
          <TextField
            label='Email'
            type='email'
            variant='outlined'
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label='Password'
            type='password'
            variant='outlined'
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            size='large'
            sx={{ py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color='inherit' /> : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

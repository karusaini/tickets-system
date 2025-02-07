'use client'
import { Container, Typography, Button } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function Unauthorized() {
  const router = useRouter()

  return (
    <Container>
      <Typography variant='h4' color='error'>
        Access Denied
      </Typography>
      <Typography>You do not have permission to view this page.</Typography>
      <Button variant='contained' color='primary' onClick={() => router.push('/')}>
        Go to Home
      </Button>
    </Container>
  )
}

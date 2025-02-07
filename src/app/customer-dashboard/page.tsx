'use client'

import { useEffect, useState } from 'react'
import { CircularProgress, Container, Typography, Button, Snackbar } from '@mui/material'
import useAuth from '@/libs/hooks/useAuth'
import TicketForm from '@/components/TicketForm'
import TicketTable from '@/components/TicketTable'
import { db } from '@/libs/firebase'
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore'
import Sidebar from '@/components/Sidebar'

export default function CustomerDashboard() {
  const { user, loading, logout } = useAuth('customer')
  const [openModal, setOpenModal] = useState(false)
  const [tickets, setTickets] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const toggleModal = () => {
    setOpenModal(!openModal)
  }

  const handleDeleteTicket = async ticketId => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteDoc(doc(db, 'tickets', ticketId))
        setSnackbarOpen(true)
      } catch (error) {
        console.error('Error deleting ticket:', error)
      }
    }
  }

  useEffect(() => {
    if (user) {
      const ticketQuery = query(collection(db, 'tickets'), where('createdBy', '==', user.email))
      const unsubscribe = onSnapshot(ticketQuery, snapshot => {
        const fetchedTickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setTickets(fetchedTickets)
      })

      return () => unsubscribe()
    }
  }, [user])

  if (loading) return <CircularProgress />

  if (!user) {
    return (
      <Container>
        <Typography variant='h4'>Unauthorized</Typography>
        <p>You are not authorized to access this page. Please login as a customer.</p>
      </Container>
    )
  }

  return (
    <Container>
      <Typography variant='h4'>Customer Dashboard</Typography>
      <p>Welcome, {user.email}! You can create, view, and manage your tickets.</p>
      <Button variant='contained' onClick={toggleModal}>
        Create New Ticket
      </Button>
      <Button variant='outlined' color='error' onClick={logout} sx={{ ml: 2 }}>
        Logout
      </Button>

      {/* Ticket Table */}
      <TicketTable tickets={tickets} handleDeleteTicket={handleDeleteTicket} />

      {/* Ticket submission modal */}
      {openModal && <TicketForm closeModal={toggleModal} />}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message='Ticket deleted successfully!'
      />
    </Container>
  )
}

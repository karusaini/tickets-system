'use client'
import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material'
import { Edit, Delete, Visibility } from '@mui/icons-material'
import { db } from '@/libs/firebase'
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import TicketForm from '@/components/TicketForm'

const SupportDashboard = () => {
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)

  useEffect(() => {
    const fetchTickets = async () => {
      const ticketCollection = collection(db, 'tickets')
      const ticketSnapshot = await getDocs(ticketCollection)
      const ticketList = ticketSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setTickets(ticketList)
    }

    fetchTickets()
  }, [])

  // Handle ticket edit
  const handleEditSubmit = async updatedTicket => {
    try {
      const ticketRef = doc(db, 'tickets', updatedTicket.id)
      await updateDoc(ticketRef, updatedTicket)
      setTickets(prevTickets => prevTickets.map(ticket => (ticket.id === updatedTicket.id ? updatedTicket : ticket)))
      setOpenEditModal(false)
    } catch (error) {
      console.error('Error updating ticket:', error)
    }
  }

  // Handle ticket delete
  const handleDelete = async id => {
    try {
      await deleteDoc(doc(db, 'tickets', id))
      setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== id))
    } catch (error) {
      console.error('Error deleting ticket:', error)
    }
  }

  return (
    <Box padding={4}>
      <Typography variant='h4' gutterBottom>
        Support Dashboard
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(ticket => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.priority}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>{ticket.createdBy}</TableCell>
                <TableCell>{ticket.assignedTo}</TableCell>
                <TableCell>
                  <IconButton
                    color='primary'
                    onClick={() => {
                      setSelectedTicket(ticket)
                      setOpenViewModal(true)
                    }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color='secondary'
                    onClick={() => {
                      setSelectedTicket(ticket)
                      setOpenEditModal(true)
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton color='error' onClick={() => handleDelete(ticket.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Ticket Modal */}
      {openViewModal && selectedTicket && (
        <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
          <Box p={4} m={4} bgcolor='white'>
            <Typography variant='h5'>Ticket Details</Typography>
            <Typography>Title: {selectedTicket.title}</Typography>
            <Typography>Description: {selectedTicket.description}</Typography>
            <Typography>Priority: {selectedTicket.priority}</Typography>
            <Typography>Status: {selectedTicket.status}</Typography>
          </Box>
        </Modal>
      )}

      {/* Edit Ticket Modal */}
      {openEditModal && selectedTicket && (
        <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <Box p={4} m={4} bgcolor='white'>
            <Typography variant='h5'>Edit Ticket</Typography>
            <form
              onSubmit={e => {
                e.preventDefault()
                handleEditSubmit(selectedTicket)
              }}
            >
              <TextField
                label='Title'
                value={selectedTicket.title}
                onChange={e => setSelectedTicket({ ...selectedTicket, title: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label='Description'
                value={selectedTicket.description}
                onChange={e => setSelectedTicket({ ...selectedTicket, description: e.target.value })}
                fullWidth
                required
              />
              <FormControl fullWidth margin='normal'>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={selectedTicket.priority}
                  onChange={e => setSelectedTicket({ ...selectedTicket, priority: e.target.value })}
                >
                  <MenuItem value='Low'>Low</MenuItem>
                  <MenuItem value='Medium'>Medium</MenuItem>
                  <MenuItem value='High'>High</MenuItem>
                </Select>
              </FormControl>
              <Button type='submit' variant='contained' color='primary' fullWidth>
                Save Changes
              </Button>
            </form>
          </Box>
        </Modal>
      )}

      {/* Ticket Form Modal */}
      <TicketForm closeModal={undefined} />
    </Box>
  )
}

export default SupportDashboard

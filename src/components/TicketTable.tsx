import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button
} from '@mui/material'
import { Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material'
import { useState } from 'react'

const TicketTable = ({ tickets, handleDeleteTicket }) => {
  const [selectedTicket, setSelectedTicket] = useState(null)

  const handleClose = () => setSelectedTicket(null)

  if (tickets.length === 0) {
    return (
      <Typography variant='h6' sx={{ mt: 2 }}>
        No tickets found.
      </Typography>
    )
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(ticket => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.priority}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>
                  {/* View Button */}
                  <IconButton color='primary' onClick={() => setSelectedTicket(ticket)}>
                    <ViewIcon />
                  </IconButton>

                  {/* Delete Button */}
                  <IconButton color='error' onClick={() => handleDeleteTicket(ticket.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Ticket Modal */}
      {selectedTicket && (
        <Dialog open={true} onClose={handleClose} maxWidth='sm' fullWidth>
          <DialogTitle>Ticket Details</DialogTitle>
          <DialogContent>
            <Typography variant='h6'>Title: {selectedTicket.title}</Typography>
            <Typography>Description: {selectedTicket.description}</Typography>
            <Typography>Priority: {selectedTicket.priority}</Typography>
            <Typography>Status: {selectedTicket.status}</Typography>
            <Typography>Assigned To: {selectedTicket.assignedTo || 'Unassigned'}</Typography>
            <Typography>Created By: {selectedTicket.createdBy}</Typography>
            {selectedTicket.attachment && (
              <Typography>
                <a href={selectedTicket.attachment} target='_blank' rel='noopener noreferrer'>
                  View Attachment
                </a>
              </Typography>
            )}
            <Button onClick={handleClose} variant='outlined' sx={{ mt: 2 }}>
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default TicketTable

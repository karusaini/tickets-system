import { useState } from 'react'
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Box,
  Typography,
  Paper
} from '@mui/material'
import { db, storage, auth } from '@/libs/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const TicketForm = ({ closeModal }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [category, setCategory] = useState('Technical')
  const [contactEmail, setContactEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [assignedTo, setAssignedTo] = useState('')
  const [status, setStatus] = useState('Open') // New Status field
  const [agentRemarks, setAgentRemarks] = useState('') // New Remarks field
  const [loading, setLoading] = useState(false)

  const handleAttachmentChange = e => {
    const file = e.target.files[0]
    if (file && file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB.')
    } else {
      setAttachment(file)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    // Validation Logic
    if (!title.trim() || !description.trim()) {
      alert('Title and Description are required!')
      setLoading(false)
      return
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!contactEmail.trim()) {
      alert('Please enter an email address!')
      setLoading(false)
      return
    }
    if (!emailRegex.test(contactEmail.trim())) {
      alert('Invalid email format!')
      setLoading(false)
      return
    }

    if (phone.length < 10 || isNaN(phone)) {
      alert('Please enter a valid 10-digit phone number!')
      setLoading(false)
      return
    }

    // File upload logic
    let attachmentURL = ''
    if (attachment) {
      try {
        const attachmentRef = ref(storage, `attachments/${attachment.name}`)
        const uploadResult = await uploadBytes(attachmentRef, attachment)
        attachmentURL = await getDownloadURL(uploadResult.ref)
      } catch (error) {
        console.error('Error uploading attachment:', error)
        setLoading(false)
        return
      }
    }

    // Ticket data to be stored in Firestore
    const ticketData = {
      title,
      description,
      priority,
      category,
      contactEmail,
      phone,
      attachment: attachmentURL,
      createdBy: auth.currentUser?.email || 'Unknown User',
      assignedTo,
      status,
      agentRemarks, // Adding agent remarks in ticket creation
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp() // New timestamp for updates
    }

    try {
      await addDoc(collection(db, 'tickets'), ticketData)
      alert('Ticket submitted successfully!')
      closeModal()
    } catch (error) {
      console.error('Error adding ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 2,
        backgroundColor: '#f4f6f8'
      }}
    >
      <Paper
        sx={{
          padding: 3,
          width: '100%',
          maxWidth: 600,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'white',
          overflow: 'hidden'
        }}
      >
        <Typography variant='h5' align='center' gutterBottom>
          Create a New Ticket
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label='Title'
                value={title}
                onChange={e => setTitle(e.target.value)}
                fullWidth
                required
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Description'
                value={description}
                onChange={e => setDescription(e.target.value)}
                fullWidth
                required
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required margin='normal' variant='outlined'>
                <InputLabel>Priority</InputLabel>
                <Select value={priority} onChange={e => setPriority(e.target.value)}>
                  <MenuItem value='Low'>Low</MenuItem>
                  <MenuItem value='Medium'>Medium</MenuItem>
                  <MenuItem value='High'>High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required margin='normal' variant='outlined'>
                <InputLabel>Category</InputLabel>
                <Select value={category} onChange={e => setCategory(e.target.value)}>
                  <MenuItem value='Technical'>Technical</MenuItem>
                  <MenuItem value='Billing'>Billing</MenuItem>
                  <MenuItem value='General'>General</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Contact Email'
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                fullWidth
                required
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Phone'
                value={phone}
                onChange={e => setPhone(e.target.value)}
                fullWidth
                required
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Assigned To (Support Agent)'
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                fullWidth
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required margin='normal' variant='outlined'>
                <InputLabel>Status</InputLabel>
                <Select value={status} onChange={e => setStatus(e.target.value)}>
                  <MenuItem value='Open'>Open</MenuItem>
                  <MenuItem value='In Progress'>In Progress</MenuItem>
                  <MenuItem value='Closed'>Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Agent Remarks'
                value={agentRemarks}
                onChange={e => setAgentRemarks(e.target.value)}
                fullWidth
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' component='label' fullWidth margin='normal'>
                Upload Attachment
                <input type='file' hidden onChange={handleAttachmentChange} />
              </Button>
              {attachment && (
                <Typography variant='body2' sx={{ marginTop: 1 }}>
                  Attachment: {attachment.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                margin='normal'
                disabled={loading}
                sx={{ height: 50 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Ticket'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}

export default TicketForm

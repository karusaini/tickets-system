import { Drawer, List, ListItem, ListItemText, Typography, Box } from '@mui/material'

const Sidebar = ({ open, toggleDrawer, handleNavigation }) => {
  return (
    <Drawer anchor='left' open={open} onClose={toggleDrawer}>
      <Box sx={{ width: 250, backgroundColor: '#f5f5f5', height: '100%' }}>
        <Typography variant='h6' sx={{ p: 2, textAlign: 'center' }}>
          Customer Menu
        </Typography>
        <List>
          <ListItem button onClick={() => handleNavigation('createTicket')}>
            <ListItemText primary='Create New Ticket' />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('logout')}>
            <ListItemText primary='Logout' />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidebar

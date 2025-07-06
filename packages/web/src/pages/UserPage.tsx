import { Edit, Delete } from '@mui/icons-material';
import { Container, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Box, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { User } from '@org/shared-model'

const UserPage = () => {
    const [userList, setuserList] = useState<User[]>([])
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    //
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);

    const handleDeleteClick = (userId: string, userName: string) => {
        // setUserToDelete({ id: userId, name: userName });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        // if (userToDelete) {
        //     setUserToDelete(null);
        //     setDeleteDialogOpen(false);
        // }
    };

    const handleCancelDelete = () => {
        setUserToDelete(null);
        setDeleteDialogOpen(false);
    };



    const handleAddUserOpen = () => setOpen(true);

    const handleAddUserClose = () => {
        setOpen(false);
        setUsername('');
        setEmail('');

    };

    const handleSaveUser = () => {
        console.log('New User:', { username, email });
        // You can add it to users list if needed:
        // setUsers([...users, { id: Date.now(), name: username, email, role: affiliate }]);
        handleAddUserClose();
    };

    const handleEdit = (userId: string) => {
        console.log('Edit user:', userId);
    };

    const handleDelete = (userId: number) => {
        console.log('Delete user:', userId);
    };

    useEffect(() => {

        const fethUserInit = async () => {
            const { data } = await axios.get<User[]>(`${import.meta.env.VITE_BACKEND_BASE_URL}/user`)
            console.log({ data });
            if (data) {
                setuserList(data)
            }
            //console.log(import.meta.env.VITE_BACKEND_BASE_URL);]
            return
        }

        fethUserInit()
    }, []);

    return (
        <Container maxWidth="lg">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">User List</Typography>
                <Button variant="contained" color="primary" onClick={handleAddUserOpen}>
                    Add User
                </Button>
            </Box>

            <Paper elevation={3}>
                <List>
                    {userList && userList.map((user, index) => (
                        <React.Fragment key={user.id}>
                            <ListItem alignItems="flex-start"

                                secondaryAction={
                                    <Box>
                                        <IconButton edge="end" size='small' color='info' onClick={() => handleEdit(user.id)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton edge="end" size='small' color='error' onClick={() => handleDeleteClick(user.id, user.username)}>
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                {/* <ListItemAvatar>
                                    <Avatar>{user.name[0]}</Avatar>
                                </ListItemAvatar> */}
                                <ListItemText
                                    primary={user.username}
                                    secondary={
                                        <Box>
                                            <Typography component="span" variant="body2" color="text.primary">
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            {index < userList.length - 1 && <Divider variant="middle" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>

            {/* Modal */}
            <Dialog open={open} onClose={handleAddUserClose}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField
                        size='small'
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={username.length > 0 && username.length <= 5}
                        helperText={
                            username.length > 0 && username.length <= 5
                                ? 'Username must be more than 5 characters'
                                : ''
                        }
                    />
                    <TextField
                        size='small'
                        margin="dense"
                        label="Email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                        helperText={
                            email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                                ? 'Please enter a valid email'
                                : ''
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddUserClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveUser}>Save User</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete{' '}
                        <strong>{userToDelete?.name}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default UserPage
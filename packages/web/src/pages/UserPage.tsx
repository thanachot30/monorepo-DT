import { Edit, Delete } from '@mui/icons-material';
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider, Box, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react'
import axios from 'axios';
import { User } from '@org/shared-model'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorModal } from '../components/ErrorModalProvider';
import { useSuccessModal } from '../components/SuccessModalProvider';
import { handleAxiosError } from '../utils/errorHandler';


const UserPage = () => {
    const { showError } = useErrorModal();
    const { showSuccess } = useSuccessModal()
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    //
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ userId: string; userName: string } | null>(null);

    const handleDeleteClick = (userId: string, userName: string) => {
        setUserToDelete({ userId, userName });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            DeleteUser(userToDelete.userId)
            setDeleteDialogOpen(false);
        }

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

    const handleSaveUser = async () => {
        if (username && email) {
            saveUser({ username, email });
            handleAddUserClose();
        } else {
            showError("Please input user or password")
        }

    };
    const handleEdit = (userId: string) => {
        console.log('Edit user:', userId);
    };
    const fetchUsers = async (): Promise<User[] | undefined> => {
        try {
            const { data } = await axios.get<User[]>(`${import.meta.env.VITE_BACKEND_BASE_URL}/user`);
            return data;
        } catch (error) {
            handleAxiosError(error, showError)
        }

    };
    const createUser = async (newUser: { username: string; email: string }) => {
        // console.log('createUser');
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/user`, newUser);
            // console.log({ data });
            showSuccess("Success Create User.")
            return data;
        } catch (error) {
            handleAxiosError(error, showError)
        }

    };

    const deleteUser = async (userId: string) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/delete`, {
                id: userId
            })
            return data
        } catch (error) {
            handleAxiosError(error, showError)
        }

    }

    const { data: userList, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    const { mutate: saveUser } = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] }); // ✅ Refetch user list

        },
    });

    const { mutate: DeleteUser } = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            console.log('onSuccess');
            queryClient.invalidateQueries({ queryKey: ['users'] }); // ✅ Refetch user list
        },
    })

    if (isLoading) return <p>Loading...</p>;
    if (error instanceof Error) return <p>Error: {error.message}</p>;


    return (
        <Container maxWidth="md">
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
                                        {/* <IconButton edge="end" size='small' color='info' onClick={() => handleEdit(user.id)}>
                                            <Edit />
                                        </IconButton> */}
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
                    <Typography >
                        Are you sure you want to delete{' '}
                        <strong style={{ color: 'red' }} >{userToDelete?.userName}</strong>?
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
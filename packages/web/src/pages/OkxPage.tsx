/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemSecondaryAction, ListItemText, MenuItem, Paper, TextField, Typography } from '@mui/material'

import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { User, apiById, apiList } from '@org/shared-model';
import { count } from 'console';
type Props = {}

export interface StrategyItem {
    name: string
    strategy: 'main' | 'sub'
}

export interface StrategyUser {
    name: string
    email: string
}

export interface Strategy {
    id: number
    strategyName: string
    user: StrategyUser
    items: StrategyItem[]
}

enum modeProp {
    newmain = "newmain",
    newsub = 'newsub',
    view = 'view'
}

interface NewSub {
    userId: string;
    title: string;
    apiKey: string;
    secretKey: string;
    passphrase: string;
}

const OkxPage = (props: Props) => {
    const [open, setOpen] = useState(false)
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)

    const [isAddSubOpen, setIsAddSubOpen] = useState(false)
    const [strategyType, setStrategyType] = useState<'main' | 'sub'>('sub')
    const [newSub, setNewSub] = useState<NewSub>({
        userId: '',
        title: '',
        apiKey: '',
        secretKey: '',
        passphrase: ''
    })
    const [userId, setuserId] = useState<string>()
    const [apiId, setApiId] = useState<string>()
    const [modeAddSub, setAddSub] = useState<modeProp>()
    const [isDisable, setIsDisable] = useState<boolean>(false)


    const handleOpenAddSub = (user?: string | null, mode?: modeProp) => {

        // console.log(user);
        // console.log(mode);
        setAddSub(mode)
        if (mode === modeProp.newmain) {
            setIsDisable(false)
            setStrategyType('main')

        } else if (mode === modeProp.newsub && user) {
            setIsDisable(false)
            setStrategyType('sub')

        } else if (mode === modeProp.view) {
            setIsDisable(true)
        }

        setNewSub({
            userId: '',
            title: '',
            apiKey: '',
            secretKey: '',
            passphrase: ''
        })
        setIsAddSubOpen(true)
    }
    const handleCloseAddSub = () => {
        setIsAddSubOpen(false)
        setNewSub({
            userId: '',
            title: '',
            apiKey: '',
            secretKey: '',
            passphrase: ''
        })
    }

    const handleView = async (id: string, userId: string) => {
        setuserId(userId)
        setApiId(id)
        await refetch_apiView()
        setOpen(true)

    }

    const handleClose = () => {
        setOpen(false)
        setSelectedStrategy(null)
    }

    const handleSaveApi = (newsub: NewSub) => {
        return
    }

    const fetchApiMain = async () => {
        const { data } = await axios.get<apiList[]>(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx`);
        return data;
    }

    const fetchApiView = async () => {
        const { data } = await axios.post<apiById>(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx/${apiId}`, {
            userId: userId
        })
        return data
    }

    const fetchUsers = async (): Promise<User[]> => {
        const { data } = await axios.get<User[]>(`${import.meta.env.VITE_BACKEND_BASE_URL}/user`);
        return data;
    };


    const { data: apiList, isLoading: apiList_isLoading, error: apiList_error } = useQuery({
        queryKey: ['apiMain'],
        queryFn: fetchApiMain,
    });

    const { data: apiView, isLoading: apiView_isLoading, error: apiView_error, refetch: refetch_apiView, isFetched: apiView_isFetched } = useQuery({
        queryKey: ['apiView', apiId, userId],
        queryFn: fetchApiView,
        enabled: false
    })

    const { data: users, isLoading: users_isLoading, error: users_error, refetch: users_refetch } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });



    useEffect(() => {
        if (userId && apiId) {
            refetch_apiView()
        }
    }, [userId, apiId])


    if (apiList_isLoading) return <p>Loading...</p>;
    if (apiList_error instanceof Error) return <p>Error: {apiList_error.message}</p>;

    console.log({ newSub });


    return (
        <Container maxWidth="lg">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">OKX</Typography>
                <Button variant="contained" color="primary" onClick={() => handleOpenAddSub(null, modeProp.newmain)}>
                    Add Main
                </Button>
            </Box>
            <Paper elevation={2}>
                <List>
                    {apiList && apiList.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <ListItem
                                secondaryAction={
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleView(item.id, item.userId)}
                                        >
                                            view
                                        </Button>
                                    </Box>
                                }
                            >
                                <ListItemText
                                    primary={`${item.title}`}
                                />

                            </ListItem>
                            {index < apiList.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>

            <Dialog open={open} maxWidth="md" fullWidth>
                <DialogTitle>Strategy Details</DialogTitle>
                <DialogContent dividers>
                    {apiView && apiView.user && (
                        <>
                            <Box >
                                <Typography>Name: {apiView.user.username}</Typography>
                                <Typography>Email: {apiView.user.email}</Typography>
                            </Box>
                            <Divider variant='fullWidth' />
                            <Box mt={2}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    {/* <Typography variant="subtitle1">Strategies Lists</Typography> */}
                                    <Box sx={{ display: 'flex', justifyContent: 'end', px: '16px' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleOpenAddSub(apiView.user.username, modeProp.newsub)}
                                        >
                                            Add Sub
                                        </Button>
                                    </Box>

                                    {apiView_isLoading && <p>Loading...</p>}
                                    {apiView_error && <p>Error: {apiView_error.message}</p>}
                                    <List dense >
                                        {apiView && apiView.data && apiView.data.map((item, idx) => (
                                            <ListItem key={idx}
                                                secondaryAction={
                                                    <Box >
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handleOpenAddSub(null, modeProp.view)}
                                                        >
                                                            View detail
                                                        </Button>
                                                    </Box>

                                                }
                                            >
                                                <ListItemText
                                                    primary={item.title ?? `sub${idx}`}
                                                    secondary={`Type: ${item.strategy}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>


                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isAddSubOpen} onClose={handleCloseAddSub} maxWidth="sm" fullWidth>
                <DialogTitle>{strategyType === 'main' ? 'Add Main' : 'Add Sub'}</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            disabled={isDisable}
                            select
                            label="User"
                            value={strategyType === 'main' ? newSub.userId : apiView?.user.username}
                            onChange={(e) => setNewSub({ ...newSub, userId: e.target.value, })}
                            fullWidth
                            onClick={() => {
                                if (strategyType === 'main') {
                                    users_refetch()
                                }
                            }}

                        >
                            {strategyType === 'sub' && apiView && apiView.user &&
                                <MenuItem value={apiView.user.username}>
                                    {apiView.user.username}
                                </MenuItem>}

                            {strategyType === 'main' && users && users.length > 0 &&
                                users.map((user, index) => (
                                    <MenuItem key={index} value={user.id}>
                                        {user.username}
                                    </MenuItem>
                                ))
                            }
                        </TextField>

                        <TextField
                            disabled={isDisable}
                            label="Strategy Title"
                            value={newSub.title}
                            onChange={(e) => setNewSub({ ...newSub, title: e.target.value })}
                            fullWidth
                        />

                        <TextField
                            disabled={isDisable}
                            label="API Key"
                            value={newSub.apiKey}
                            onChange={(e) => setNewSub({ ...newSub, apiKey: e.target.value })}
                            fullWidth
                        />

                        <TextField
                            disabled={isDisable}
                            label="Secret Key"
                            value={newSub.secretKey}
                            onChange={(e) => setNewSub({ ...newSub, secretKey: e.target.value })}
                            fullWidth
                        />

                        <TextField
                            disabled={isDisable}
                            label="Passphrase"
                            value={newSub.passphrase}
                            onChange={(e) => setNewSub({ ...newSub, passphrase: e.target.value })}
                            fullWidth
                        />

                        <TextField
                            label="Strategy Type"
                            value={strategyType}
                            disabled
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddSub}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => handleSaveApi(newSub)}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    )
}

export default OkxPage
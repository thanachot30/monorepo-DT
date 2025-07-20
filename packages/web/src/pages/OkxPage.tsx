/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemSecondaryAction, ListItemText, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'

import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ApiVariableDto, NewSub, Strategy, User, apiById, apiList, maskData, modeProp, saveApiVariableProp, strategyTypeProp } from '@org/shared-model';
import { count } from 'console';
import { JsonObject } from '@prisma/client/runtime/library';
type Props = {}



const OkxPage = (props: Props) => {
    const [open, setOpen] = useState(false)
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)

    const [isAddSubOpen, setIsAddSubOpen] = useState(false)
    const [strategyType, setStrategyType] = useState<modeProp>()
    const [newSub, setNewSub] = useState<NewSub>({
        userId: '',
        title: '',
        apiKey: '',
        secretKey: '',
        passphrase: '',
        strategy: strategyTypeProp.main
    })
    const [userId, setuserId] = useState<string>()
    const [apiId, setApiId] = useState<string>()
    //
    //const [apiView, setApiView] = useState<apiById | null>(null);
    //
    const [modeAddSub, setAddSub] = useState<modeProp>()
    const [isDisable, setIsDisable] = useState<boolean>(false)


    const handleOpenAddSub = async (userId?: string | null, mode?: modeProp, apiId?: string) => {

        // console.log(user);
        // console.log(mode);
        setAddSub(mode)
        if (mode === modeProp.newmain) {
            setIsDisable(false)
            setStrategyType(modeProp.newmain)
            setNewSub({
                userId: '',
                title: '',
                apiKey: '',
                secretKey: '',
                passphrase: '',
                strategy: strategyTypeProp.main
            })

        } else if (mode === modeProp.newsub) {
            if (!userId) {
                throw Error("userId is not defind")
            }
            if (!apiId) {
                throw Error("apiId is not defind")
            }
            setIsDisable(false)
            setStrategyType(modeProp.newsub)
            setNewSub({
                userId: userId,
                title: '',
                apiKey: '',
                secretKey: '',
                passphrase: '',
                strategy: strategyTypeProp.sub,
                relationToMain: apiId
            })

        } else if (mode === modeProp.view) {
            setIsDisable(true)
            setStrategyType(modeProp.view)
            // console.log('userId', userId);
            // console.log('apiId', apiId);
            // console.log('see', newSub);
            try {

                const { data } = await axios.post<ApiVariableDto>(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx/detail/${apiId}`)
                console.log({ data });
                const mask = data.dataMarking
                const _title = data.title ?? ""

                setNewSub({
                    userId: data.userId,
                    title: _title,
                    apiKey: mask.apiKey_mask,
                    secretKey: mask.secretKey_mask,
                    passphrase: mask.passphrase_mask,
                    strategy: data.strategy as unknown as strategyTypeProp

                })
            } catch (error) {
                throw Error(`Error get detail: ${error}`)
            }


        }
        setIsAddSubOpen(true)
    }
    const handleCloseAddSub = () => {
        setApiId(undefined)
        setuserId(undefined)
        // 
        setIsAddSubOpen(false)
        setNewSub({
            userId: '',
            title: '',
            apiKey: '',
            secretKey: '',
            passphrase: '',
            strategy: strategyTypeProp.main
        })
    }

    const handleView = async (_id: string, _userId: string) => {
        setuserId(_userId)
        setApiId(_id)
        if (userId === _userId && apiId === _id) {
            refetch_apiView()
        }
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSelectedStrategy(null)
    }

    const handleSaveApi = async (newsub: NewSub) => {
        try {
            console.log({ newSub });
            //check config
            const _data = {
                "apiKey": newSub.apiKey.trim(),
                "secretKey": newSub.secretKey.trim(),
                "passphrase": newSub.passphrase.trim(),
            }
            try {
                await axios.post<boolean>(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx/check/config`, _data)
            } catch (error) {
                console.error('Error checking config');
                return
            }

            // console.log({ data });
            if (!strategyType) {
                console.log('strategyType is not define')
                return
            }

            const data_save: saveApiVariableProp = {
                userId: newSub.userId.trim(),
                apiKey: newSub.apiKey.trim(),
                secretKey: newSub.secretKey.trim(),
                passphrase: newSub.passphrase.trim(),
                title: newSub.title.trim(),
                strategy: strategyType,
                relationToMain: newSub.relationToMain
            }
            try {
                const res_save = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx/save`, data_save)
                // console.log({ res_save });
                if (res_save) {
                    if (userId && apiId) {
                        await refetch_apiView()
                    }
                    await apiList_refetch()

                }
            } catch (error) {
                console.log('Error save apivariable');
            }

            setIsAddSubOpen(false)
            return
        } catch (error) {
            console.error('Error while checking config', error);
        }

    }

    const fetchApiMain = async () => {
        const { data } = await axios.get<apiList[]>(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx`);
        return data;
    }

    const fetchApiView = async () => {
        const { data } = await axios.post<apiById>(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx/id/${apiId}`, {
            userId: userId
        })
        return data
    }

    const fetchUsers = async (): Promise<User[]> => {
        const { data } = await axios.get<User[]>(`${import.meta.env.VITE_BACKEND_BASE_URL}/user`);
        return data;
    };


    const { data: apiList, isLoading: apiList_isLoading, error: apiList_error, refetch: apiList_refetch } = useQuery({
        queryKey: ['apiMain'],
        queryFn: fetchApiMain,
    });

    const { data: apiView, isLoading: apiView_isLoading, error: apiView_error, refetch: refetch_apiView, isFetched: apiView_isFetched } = useQuery({
        queryKey: ['apiView'],
        queryFn: fetchApiView,
        enabled: false
    })

    const { data: users, isLoading: users_isLoading, error: users_error, refetch: users_refetch } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    useEffect(() => {
        console.log("useEffect", userId, apiId);

        if (userId && apiId) {
            refetch_apiView()
        }
    }, [userId, apiId])


    if (apiList_isLoading) return <p>Loading...</p>;
    if (apiList_error instanceof Error) return <p>Error: {apiList_error.message}</p>;


    // console.log({ newSub });
    console.log({ apiView });
    // console.log({ users });


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
                <DialogTitle>Strategy</DialogTitle>
                <DialogContent dividers={true}>
                    {apiView && apiView.user && (
                        <>
                            <Box >
                                <Typography >User</Typography>
                                <Typography>Name: {apiView.user.username}</Typography>
                                <Typography>Email: {apiView.user.email}</Typography>
                            </Box>
                            {/* <Divider variant='inset' /> */}
                            <Box mt={2}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    {/* <Typography variant="subtitle1">Strategies Lists</Typography> */}
                                    <Box sx={{ display: 'flex', justifyContent: 'end', px: '16px' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleOpenAddSub(apiView.user.id, modeProp.newsub, apiId)}
                                        >
                                            Add Sub
                                        </Button>
                                    </Box>

                                    {!apiView && <p>Loading...</p>}
                                    <List dense >
                                        {apiView && apiView.data && apiView.data.map((item, idx) => (
                                            <ListItem key={idx}
                                                secondaryAction={
                                                    <Box >
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handleOpenAddSub(null, modeProp.view, item.id)}
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
                        <Select
                            required
                            labelId="user-select-label"
                            id="user-select"
                            value={strategyType === modeProp.newmain ? newSub.userId : apiView?.user.id}
                            label="User"
                            onChange={(e) => setNewSub({ ...newSub, userId: e.target.value })}

                        >
                            {(strategyType === modeProp.newsub || strategyType === modeProp.view) && apiView?.user && (
                                <MenuItem value={apiView.user.id}>{apiView.user.username}</MenuItem>
                            )}

                            {strategyType === modeProp.newmain && users?.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
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
                            //value={strategyType === modeProp.newmain ? modeProp.newmain : modeProp.newsub}
                            value={newSub.strategy}
                            disabled
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddSub}>{strategyType === modeProp.view ? 'close' : 'cancel'}</Button>
                    {
                        strategyType === modeProp.view ?
                            <></>
                            :
                            <Button
                                variant="contained"
                                onClick={() => handleSaveApi(newSub)}
                            >
                                Save
                            </Button>
                    }

                </DialogActions>
            </Dialog>

        </Container>
    )
}

export default OkxPage
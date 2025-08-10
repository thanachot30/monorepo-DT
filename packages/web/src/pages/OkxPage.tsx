/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemSecondaryAction, ListItemText, MenuItem, Paper, Select, TextField, Typography, IconButton, InputAdornment, InputLabel } from '@mui/material'

import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { editSub, ApiVariableDto, DeleteItemProp, NewSub, Strategy, User, apiById, apiList, maskData, modeProp, saveApiVariableProp, strategyTypeProp, StrategyItemDetail } from '@org/shared-model';
import { Edit, Delete, FamilyRestroomTwoTone } from '@mui/icons-material';
import { title } from 'process';
import { handleAxiosError } from '../utils/errorHandler';
import { useErrorModal } from '../components/ErrorModalProvider';
import { useSuccessModal } from '../components/SuccessModalProvider';


const OkxPage = () => {
    const { showError } = useErrorModal();
    const { showSuccess } = useSuccessModal()
    const [openView, setOpenView] = useState(false)
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
    const [editSub, setEditSub] = useState<editSub>({
        id: '',
        title: '',
        apiKey: '',
        secretKey: '',
        passphrase: ''
    })
    const [userId, setuserId] = useState<string>()
    const [apiId, setApiId] = useState<string>()
    //
    //const [apiView, setApiView] = useState<apiById | null>(null);
    //
    const [modeAddSub, setAddSub] = useState<modeProp>()
    const [isDisable, setIsDisable] = useState<boolean>(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<DeleteItemProp>()
    const [deleteMemberItem, setDeleteMemberItem] = useState<StrategyItemDetail[]>()
    //  
    const [isEdited, setIsEdited] = useState<boolean>(false)
    const [editingId_TITLE, setEditingId_TITLE] = useState<boolean>(false);
    const [editingId_APIKEY, setEditingId_APIKEY] = useState<boolean>(false);
    const [editingId_SECRETKEY, setEditingId_SECRETKEY] = useState<boolean>(false);
    const [editingId_PASSPHRASE, setEditingId_PASSPHRASE] = useState<boolean>(false);

    const handleOpenAddSub = async (userId?: string | null, mode?: modeProp, apiId?: string) => {

        // console.log(user);
        // console.log(mode);
        setAddSub(mode)
        if (mode === modeProp.newmain) {
            resetAllEditStates(true)

            setStrategyType(modeProp.newmain)
            reSetNewSub()

        } else if (mode === modeProp.newsub) {
            if (!userId) {
                showError("User Id is not defind")
                return
            }
            if (!apiId) {
                showError("apiId is not defind")
                return
            }
            resetAllEditStates(true)
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
            // setIsDisable(true)
            setStrategyType(modeProp.view)
            // console.log('userId', userId);
            // console.log('apiId', apiId);
            // console.log('see', newSub);
            if (!apiId) {
                showError("ApiId is not defind")
                return
            }
            const data = await fetchDetail(apiId)
            if (!data) {
                showError('Data Not Found')
                return
            }

            const mask = data.dataMarking
            const _title = data.title ?? ""
            const id_api = data.id
            setEditSub({ ...editSub, id: id_api })
            setNewSub({
                userId: data.userId,
                title: _title,
                apiKey: mask.apiKey_mask,
                secretKey: mask.secretKey_mask,
                passphrase: mask.passphrase_mask,
                strategy: data.strategy as unknown as strategyTypeProp

            })

        }
        setIsAddSubOpen(true)
    }

    const reSetNewSub = () => {
        setNewSub({
            userId: '',
            title: '',
            apiKey: '',
            secretKey: '',
            passphrase: '',
            strategy: strategyTypeProp.main
        })
    }

    const reSetEditSub = () => {
        setEditSub({
            id: '',
            title: '',
            apiKey: '',
            secretKey: '',
            passphrase: ''
        })
    }
    const handleCloseAddSub = () => {
        setIsEdited(false)
        resetAllEditStates(false)
        setIsAddSubOpen(false)

        reSetEditSub()
        reSetNewSub()

    }

    const handleView = async (_id: string, _userId: string) => {
        setuserId(_userId)
        setApiId(_id)
        if (userId === _userId && apiId === _id) {
            refetch_apiView()
        }
        setOpenView(true)
    }
    const resetAllEditStates = (status: boolean) => {
        setEditingId_TITLE(status);
        setEditingId_APIKEY(status);
        setEditingId_SECRETKEY(status);
        setEditingId_PASSPHRASE(status);
    };

    const handleClose = () => {
        //reset edit text field
        resetAllEditStates(false)
        //
        setIsEdited(false)
        setApiId(undefined)
        setuserId(undefined)
        setOpenView(false)
        setSelectedStrategy(null)
    }

    const handleEditApi = async (edit: editSub) => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx/edit`, editSub)
            showSuccess("Edit information")
            resetAllEditStates(false)
            setIsAddSubOpen(false)
        } catch (error) {
            handleAxiosError(error, showError)
        }

    }

    const handleSaveApi = async (_newsub: NewSub) => {
        //console.log({ newSub });
        //check config
        const _data = {
            "apiKey": _newsub.apiKey.trim(),
            "secretKey": _newsub.secretKey.trim(),
            "passphrase": _newsub.passphrase.trim(),
        }
        try {
            await axios.post<boolean>(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx/check/config`, _data)
        } catch (error) {
            handleAxiosError(error, showError)
            return
        }
        // console.log({ data });
        if (!strategyType) {
            showError("StrategyType is not define")
            return
        }

        const data_save: saveApiVariableProp = {
            userId: _newsub.userId.trim(),
            apiKey: _newsub.apiKey.trim(),
            secretKey: _newsub.secretKey.trim(),
            passphrase: _newsub.passphrase.trim(),
            title: _newsub.title.trim(),
            strategy: strategyType,
            relationToMain: _newsub.relationToMain
        }
        try {
            const res_save = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx/save`, data_save)
            // console.log({ res_save });
            if (res_save) {
                if (userId && apiId) {
                    await refetch_apiView()
                }
                await apiList_refetch()
                //modal success
                showSuccess("save Api")
            }
        } catch (error) {
            handleAxiosError(error, showError)
        }
        resetAllEditStates(false)
        setIsAddSubOpen(false)

        return
    }

    const handleCancelDelete = () => {
        setDeleteItem(undefined)
        setDeleteDialogOpen(false);
    };

    const handleConfirmDelete = async (_id: string, _strategy: string) => {
        if (_strategy === strategyTypeProp.main) {
            // console.log('check main');
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx`, {
                    data: {
                        id: _id,
                        isMain: true
                    }
                })
                // refetch at list api and close view
                await apiList_refetch()
                setOpenView(false)
                setDeleteDialogOpen(false);
            } catch (error) {
                handleAxiosError(error, showError)
            }
        } else {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx`, {
                    data: {
                        id: _id,
                        isMain: false
                    }
                })
                // refetch update disply
                await refetch_apiView()
                setDeleteDialogOpen(false);
            } catch (error) {
                handleAxiosError(error, showError)
            }
        }

        //
        return
    };

    const handleDelete = async (_id: string, _title: string, _strategy: strategyTypeProp) => {
        console.log({ userId, apiId });
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx/${apiId}`, {
                userId: userId
            })
            if (!data) {
                showError("Data Api not found")
                return
            }
            setDeleteMemberItem(data.data)
            setDeleteItem({
                id: _id,
                title: _title,
                strategy: _strategy
            })
            setDeleteDialogOpen(true);
        } catch (error) {
            showError(`Error handleDelete:${error}`)
        }
        //

    }

    const fetchApiMain = async () => {
        try {
            const { data } = await axios.get<apiList[]>(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx`);
            return data;
        } catch (error) {
            handleAxiosError(error, showError)
        }

    }

    const fetchApiView = async () => {
        try {
            const { data } = await axios.post<apiById>(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx/${apiId}`, {
                userId: userId
            })
            return data
        } catch (error) {
            handleAxiosError(error, showError)
        }

    }

    const fetchUsers = async (): Promise<User[] | undefined> => {
        try {
            const { data } = await axios.get<User[]>(`${import.meta.env.VITE_BACKEND_BASE_URL}/user`);
            return data;
        } catch (error) {
            handleAxiosError(error, showError)
        }

    };

    const fetchDetail = async (apiId: string) => {
        try {
            const { data } = await axios.post<ApiVariableDto>(`${import.meta.env.VITE_BACKEND_BASE_URL}/okx/detail/${apiId}`)
            return data
        } catch (error) {
            handleAxiosError(error, showError)
        }

    }


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

    // console.log({ isEdited });
    // console.log({ newSub });
    // console.log({ apiView });
    // // console.log({ users });
    // console.log({ deleteItem });
    // console.log({ userId, apiId }); //global

    console.log(deleteMemberItem);





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

            <Dialog open={openView} maxWidth="md" fullWidth>
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
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handleOpenAddSub(null, modeProp.view, item.id)}
                                                        >
                                                            View detail
                                                        </Button>
                                                        <Box>
                                                            <IconButton edge="end" color='error' onClick={() => handleDelete(item.id, item.title, item.strategy as strategyTypeProp)}>
                                                                <Delete />
                                                            </IconButton>
                                                        </Box>
                                                        {/* <Box>
                                                            <IconButton edge="end" color='secondary' onClick={() => handleOpenAddSub(null, modeProp.edit, item.id)}>
                                                                <Edit />
                                                            </IconButton>
                                                        </Box> */}
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
                        <Box>
                            <InputLabel id="user-select-label">User</InputLabel>
                            <Select
                                //disabled={isDisable}
                                sx={{ width: '100%' }}
                                labelId="user-select-label"
                                id="user-select"
                                value={strategyType === modeProp.newmain ? newSub.userId : apiView?.user.id}
                                label="User"
                                onChange={(e) => setNewSub({ ...newSub, userId: e.target.value })}
                            >
                                {(strategyType === modeProp.newsub || strategyType === modeProp.view || strategyType === modeProp.edit) && apiView?.user && (
                                    <MenuItem value={apiView.user.id}>{apiView.user.username}</MenuItem>
                                )}

                                {strategyType === modeProp.newmain && users && users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.username}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <TextField
                            disabled={!editingId_TITLE}
                            label="Strategy Title"
                            value={newSub.title}
                            onChange={(e) => {
                                setNewSub({ ...newSub, title: e.target.value })
                                // for edit mode
                                if (isEdited) {
                                    setEditSub({ ...editSub, title: e.target.value })
                                }
                            }}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {strategyType === modeProp.view ?

                                            <IconButton onClick={() => {
                                                setIsEdited(true)
                                                setEditingId_TITLE(!editingId_TITLE)
                                            }
                                            }>
                                                <Edit />
                                            </IconButton>
                                            :
                                            <></>
                                        }

                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            disabled={!editingId_APIKEY}
                            label="API Key"
                            value={newSub.apiKey}
                            onChange={(e) => {
                                setNewSub({ ...newSub, apiKey: e.target.value })
                                if (isEdited) setEditSub({ ...editSub, apiKey: e.target.value })
                            }}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {strategyType === modeProp.view ?
                                            <IconButton onClick={() => {
                                                setIsEdited(true)
                                                setEditingId_APIKEY(!editingId_APIKEY)
                                            }
                                            }>
                                                <Edit />
                                            </IconButton>
                                            :
                                            <></>
                                        }

                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            disabled={!editingId_SECRETKEY}
                            label="Secret Key"
                            value={newSub.secretKey}
                            onChange={(e) => {
                                setNewSub({ ...newSub, secretKey: e.target.value })
                                if (isEdited) setEditSub({ ...editSub, secretKey: e.target.value })
                            }}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {strategyType === modeProp.view ?
                                            <IconButton onClick={() => {
                                                setIsEdited(true)
                                                setEditingId_SECRETKEY(!editingId_SECRETKEY)
                                            }
                                            }
                                            >
                                                <Edit />
                                            </IconButton>
                                            :
                                            <></>
                                        }

                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            disabled={!editingId_PASSPHRASE}
                            label="Passphrase"
                            value={newSub.passphrase}
                            onChange={(e) => {
                                setNewSub({ ...newSub, passphrase: e.target.value })
                                if (isEdited) setEditSub({ ...editSub, passphrase: e.target.value })
                            }}
                            fullWidth

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {strategyType === modeProp.view ?
                                            <IconButton onClick={() => {
                                                setEditingId_PASSPHRASE(!editingId_PASSPHRASE)
                                                setIsEdited(true)
                                            }
                                            }
                                            >
                                                <Edit />

                                            </IconButton>
                                            :
                                            <></>
                                        }

                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label="Strategy Type"
                            value={newSub.strategy}
                            disabled
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddSub}>{strategyType === modeProp.view ? 'close' : 'cancel'}</Button>
                    {(strategyType === modeProp.newmain || strategyType === modeProp.newsub) &&
                        <Button
                            variant="contained"
                            onClick={() => handleSaveApi(newSub)}
                        >
                            Save
                        </Button>
                    }
                    {
                        (strategyType === modeProp.view && isEdited === true) &&

                        <Button
                            variant="contained"
                            onClick={() => handleEditApi(editSub)}
                        >
                            Edit
                        </Button>
                    }

                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography >
                        Are you sure you want to delete{' '}
                        <strong style={{ color: 'red' }} >{deleteItem?.title}</strong>?
                        {deleteItem?.strategy === strategyTypeProp.main && (
                            <>
                                <br />
                                <strong style={{ color: 'orange' }}>
                                    ⚠️ This is a main strategy. Deleting it will also delete all associated sub-strategies.
                                </strong>
                                <ul>
                                    {deleteMemberItem &&
                                        deleteMemberItem.map((sub) => (
                                            <li key={sub.id}>{sub.title} ({sub.strategy})</li>
                                        ))
                                    }
                                </ul>

                            </>
                        )}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={() => {

                        if (!deleteItem?.id || !deleteItem?.strategy) return;
                        handleConfirmDelete(deleteItem.id, deleteItem.strategy);
                    }}>
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    )
}

export default OkxPage
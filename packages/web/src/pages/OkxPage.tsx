import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemSecondaryAction, ListItemText, MenuItem, Paper, TextField, Typography } from '@mui/material'
import { log } from 'console'
import React, { useState } from 'react'

type Props = {}

// const mockData = [
//     { id: 1, strategyName: 'Scalping BTC/USDT' },
//     { id: 2, strategyName: 'ETH Long Swing' },
//     { id: 3, strategyName: 'Arbitrage Bot' },
//     { id: 4, strategyName: 'Short-term Momentum' }
// ]
const mockData = [
    {
        id: 1,
        strategyName: 'Scalping BTC/USDT',
        user: { name: 'Alice', email: 'alice@example.com' },
        items: [
            { name: 'Entry Point A', strategy: 'main' },
            { name: 'Exit Point B', strategy: 'sub' }
        ]
    },
    {
        id: 2,
        strategyName: 'ETH Long Swing',
        user: { name: 'Bob', email: 'bob@example.com' },
        items: [
            { name: 'Support Level', strategy: 'main' },
            { name: 'Resistance Breakout', strategy: 'sub' }
        ]
    },
    {
        id: 3,
        strategyName: 'Arbitrage Bot',
        user: { name: 'Charlie', email: 'charlie@example.com' },
        items: [
            { name: 'Exchange 1', strategy: 'main' },
            { name: 'Exchange 2', strategy: 'sub' }
        ]
    },
    {
        id: 4,
        strategyName: 'Short-term Momentum',
        user: { name: 'Dana', email: 'dana@example.com' },
        items: [
            { name: 'Spike Detection', strategy: 'main' },
            { name: 'Trailing Stop', strategy: 'sub' }
        ]
    }
]

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




const OkxPage = (props: Props) => {
    const [open, setOpen] = useState(false)
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)

    const [isAddSubOpen, setIsAddSubOpen] = useState(false)
    const [strategyType, setStrategyType] = useState<'main' | 'sub'>('sub')
    const [newSub, setNewSub] = useState({
        userEmail: '',
        title: '',
        apiKey: '',
        secretKey: '',
        passphrase: ''
    })
    const [userSelect, setUserSelect] = useState<any[]>([])
    const [modeAddSub, setAddSub] = useState<modeProp>()
    const [isDisable, setIsDisable] = useState<boolean>(false)
    // Example user options
    const userOptions = [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@example.com' }
    ]

    const fixUser = [
        { name: 'alice', email: 'alice@example.com' },
    ]

    const handleOpenAddSub = (user?: string | null, mode?: modeProp) => {

        console.log(user);
        console.log(mode);
        setAddSub(mode)
        if (mode === modeProp.newmain) {
            setIsDisable(false)
            setStrategyType('main')
            setUserSelect(userOptions)
        } else if (mode === modeProp.newsub && user) {
            setIsDisable(false)
            setStrategyType('sub')
            setUserSelect(fixUser)
        } else if (mode === modeProp.view) {
            setIsDisable(true)
        }

        setNewSub({
            userEmail: '',
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
            userEmail: '',
            title: '',
            apiKey: '',
            secretKey: '',
            passphrase: ''
        })
    }

    const handleView = (strategy: Strategy) => {
        setSelectedStrategy(strategy)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSelectedStrategy(null)
    }

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
                    {mockData.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <ListItem
                                secondaryAction={
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleView(item)}
                                        >
                                            view
                                        </Button>
                                    </Box>
                                }
                            >
                                <ListItemText
                                    primary={`Strategy Main: ${item.strategyName}`}
                                />

                            </ListItem>
                            {index < mockData.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>

            <Dialog open={open} maxWidth="md" fullWidth>
                <DialogTitle>Strategy Details</DialogTitle>
                <DialogContent dividers>
                    {selectedStrategy && (
                        <>
                            <Box >
                                <Typography>Name: {selectedStrategy.user.name}</Typography>
                                <Typography>Email: {selectedStrategy.user.email}</Typography>
                            </Box>
                            <Divider variant='fullWidth' />
                            <Box mt={2}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    {/* <Typography variant="subtitle1">Strategies Lists</Typography> */}
                                    <Box sx={{ display: 'flex', justifyContent: 'end', px: '16px' }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleOpenAddSub(selectedStrategy.user.email, modeProp.newsub)}
                                        >
                                            Add Sub
                                        </Button>
                                    </Box>


                                    <List dense >
                                        {selectedStrategy.items.map((item, idx) => (
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
                                                    primary={item.name}
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
                <DialogTitle>Add Sub Strategy</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            disabled={isDisable}
                            select
                            label="User"
                            value={newSub.userEmail}
                            onChange={(e) => setNewSub({ ...newSub, userEmail: e.target.value })}
                            fullWidth
                        >
                            {userSelect && userSelect.length > 0 && userSelect.map((user) => (
                                <MenuItem key={user.email} value={user.email}>
                                    {user.name} ({user.email})
                                </MenuItem>
                            ))}
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
                        onClick={() => {
                            console.log('Submitted new sub:', newSub)
                            handleCloseAddSub()
                            // Optional: add to selectedStrategy.items here
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    )
}

export default OkxPage
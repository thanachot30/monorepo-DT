import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';
import React from 'react'
import ErrorIcon from '@mui/icons-material/Error';
interface ErrorModalProps {
    open: boolean;
    onClose: () => void;
    message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ open, onClose, message }) => {
    return (
        <Dialog open={open} onClose={onClose}
            PaperProps={{
                sx: {
                    width: 350, // ✅ width in px or '80%' etc.
                    height: 200, // ✅ height in px or 'auto'
                },
            }}
        >
            {/* <DialogTitle color='error'>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ErrorIcon color='error' fontSize='large' sx={{ mr: 1 }} />
                    Error
                </Box>
            </DialogTitle> */}
            <DialogContent
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    height: '100%',
                    gap: 1,
                }}
            >
                <ErrorIcon color='error' sx={{ width: 80, height: 80 }} />
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button sx={{ flex: 1, gap: 1 }} onClick={onClose} variant="contained" color='error'>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ErrorModal
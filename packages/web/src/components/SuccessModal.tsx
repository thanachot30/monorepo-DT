import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Button,
    Box
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface SuccessModalProps {
    open: boolean;
    onClose: () => void;
    message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose, message }) => {
    return (
        <Dialog open={open} onClose={onClose}
            PaperProps={{
                sx: {
                    width: 350, // ✅ width in px or '80%' etc.
                    height: 200, // ✅ height in px or 'auto'
                },
            }}
        >
            {/* <DialogTitle color='success'>
                <Box sx={{ display: 'flex', }}>
                    Success
                </Box>
            </DialogTitle> */}
            <DialogContent sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                height: '100%',
                gap: 1,
            }}>
                <CheckCircleIcon color='success' sx={{ width: 80, height: 80 }} />
                <DialogContentText sx={{ width: '300' }}>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button sx={{ flex: 1, gap: 1 }} onClick={onClose} variant="contained" color="success">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SuccessModal;

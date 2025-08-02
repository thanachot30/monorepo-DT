import React, { createContext, useContext, useState, ReactNode } from 'react';
import SuccessModal from './SuccessModal';

interface SuccessModalContextType {
    showSuccess: (message: string) => void;
}

const SuccessModalContext = createContext<SuccessModalContextType | undefined>(undefined);

export const useSuccessModal = () => {
    const context = useContext(SuccessModalContext);
    if (!context) {
        throw new Error('useSuccessModal must be used within a SuccessModalProvider');
    }
    return context;
};

export const SuccessModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const showSuccess = (msg: string) => {
        setMessage(msg);
        setOpen(true);
    };

    return (
        <SuccessModalContext.Provider value={{ showSuccess }}>
            {children}
            <SuccessModal open={open} onClose={() => setOpen(false)} message={message} />
        </SuccessModalContext.Provider>
    );
};

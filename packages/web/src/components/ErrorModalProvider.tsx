import React, { createContext, useContext, useState, ReactNode } from 'react';
import ErrorModal from './ErrorModal';

interface ErrorModalContextType {
    showError: (message: string) => void;
}

const ErrorModalContext = createContext<ErrorModalContextType | undefined>(undefined);

export const useErrorModal = () => {
    const context = useContext(ErrorModalContext);
    if (!context) {
        throw new Error('useErrorModal must be used within an ErrorModalProvider');
    }
    return context;
};

export const ErrorModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const showError = (msg: string) => {
        setMessage(msg);
        setOpen(true);
    };

    return (
        <ErrorModalContext.Provider value={{ showError }}>
            {children}
            <ErrorModal open={open} onClose={() => setOpen(false)} message={message} />
        </ErrorModalContext.Provider>
    );
};

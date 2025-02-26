import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import { Box, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { useEffect } from "react";

interface ActionDialogProps {
    open: boolean;
    onClose?: () => void;
    action: Function;
    title: string;
    message: string;
    error: string;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
}

export function ActionDialog({ open, onClose, action, title, message, error, isLoading, isError, isSuccess }: ActionDialogProps) {
    useEffect(() => {
        if (open) {
            action();
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            disableEscapeKeyDown
            BackdropProps={{ invisible: isLoading }}
        >
            <DialogTitle className="centered" fontSize={24}>{title}</DialogTitle>
            <DialogContent>
                <Box className="centered" height={350} sx={{ flexDirection: 'column', gap: 5, overflowY: "auto" }} >
                    {isLoading ? <CircularProgress className="centered" size={64} /> :
                        isSuccess ? <CheckCircleOutline color="success" sx={{ fontSize: 64, color: 'success' }} /> :
                            isError ? <ErrorOutline color="error" sx={{ fontSize: 64, color: 'error' }} /> : null}

                    {isError ? (
                        <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto', p: 1 }}>
                            <Typography variant="body2" color="error" component="pre" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                <code>{error}</code>
                            </Typography>
                        </Box>
                    ) : <DialogContentText sx={{ maxHeight: 200, wordBreak: 'break-word', whiteSpace: 'pre-wrap', p: 1 }}>{message}</DialogContentText>}
                </Box>
            </DialogContent>
        </Dialog>
    );
}
import { Box, Button, Typography } from '@mui/material';
import { useAccount } from 'wagmi';
import { TomatoesBox } from '../components/TomatoesBox';
import { usePlantTomato } from '../chain/TomatoesManager';
import { useState } from 'react';
import { ActionDialog } from '../components/ActionDialog';

export const Home = () => {
    const { isConnected } = useAccount();
    const { plantTomato, isLoading, isError, isSuccess, status, error } = usePlantTomato();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleClose = () => {
        if (!isLoading) {
            setDialogOpen(false);

            if (isSuccess) {
                window.location.reload(); //TODO change to soft reload
            }
        }
    };

    return (
        <Box>
            <Box sx={{
                textAlign: 'center',
                mb: 6,
                background: 'linear-gradient(180deg, rgba(0, 255, 159, 0.1) 0%, rgba(0, 255, 159, 0) 100%)',
                py: 4,
                borderRadius: 2
            }}>
                <Typography variant="h1" sx={{ mb: 2 }}>
                    Dynamic Tomatoes NFT
                </Typography>
                <Typography variant="h2" sx={{ mb: 3, color: 'text.secondary' }}>
                    Grow your virtual tomato plants on the blockchain
                </Typography>
                {!isConnected && (
                    <Typography variant="body1" color="text.secondary">
                        Connect your wallet to start growing tomatoes
                    </Typography>
                )}
            </Box>

            {isConnected && (
                <>
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h3">Your Tomatoes</Typography>
                        <Button variant="contained" color="primary" size="large"
                            onClick={() => { setDialogOpen(true) }}>
                            Plant New Tomato 🌱
                        </Button>
                    </Box>
                    <TomatoesBox />
                    <ActionDialog
                        open={dialogOpen}
                        action={plantTomato}
                        title={`PLANTING NEW TOMATO`}
                        message={status!}
                        error={error!}
                        isError={isError}
                        isSuccess={isSuccess}
                        isLoading={isLoading}
                        onClose={handleClose}
                    />
                </>
            )}
        </Box>
    );
};

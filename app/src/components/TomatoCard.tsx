import { Card, CardContent, Typography, CircularProgress, Box, Button } from '@mui/material';
import { OwnedNft } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { CONTRACT_ADDRESS, useRequestGrow } from '../chain/TomatoesManager';
import { ActionDialog } from './ActionDialog';

interface TomatoCardProps {
    tomato: OwnedNft;
}

export const TomatoCard = ({ tomato }: TomatoCardProps) => {
    const id = tomato.tokenId;
    const imageUrl = tomato.image.originalUrl;
    const stage = tomato.raw.metadata.attributes.find((attr: any) => attr.trait_type === 'Stage').value;

    const [image, setImage] = useState<string | null>(null);
    const [downloading, setDownloading] = useState<boolean>(true);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (imageUrl) {
                    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
                    const response = await fetch(proxyUrl + imageUrl);
                    const imageBlob = await response.blob();
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    setImage(imageObjectURL);
                }
            } catch (error) {
                console.error('Error fetching tomato image:', error);
            }

            setDownloading(false);
        };

        fetchImage();
    }, [imageUrl]);

    const { requestGrow, isLoading: growLoading,
        isError, isSuccess, status: growStatus, error: growError } = useRequestGrow(Number(id));
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleClose = () => {
        if (!growLoading) {
            setDialogOpen(false);
        }
    };

    const viewOnOpenSea = () => {
        window.open(`https://testnets.opensea.io/assets/sepolia/${CONTRACT_ADDRESS}/${id}`, '_blank');
    };

    return (
        <>
            <Card>
                <CardContent>
                    <Box className="centered" sx={{ height: 200, mb: 2 }}>
                        {downloading ? (
                            <CircularProgress />
                        ) : (
                            image ? (
                                <img src={image} alt={`Tomato Image`} style={{ maxHeight: '100%', maxWidth: '100%' }} />
                            ) : (
                                <Typography variant="body2" color="error">
                                    Error fetching tomato image
                                </Typography>
                            )
                        )}
                    </Box>
                    <Typography variant="h5" gutterBottom>
                        Tomato #{id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Growth Stage: {stage}
                    </Typography>

                    <Box className="centered" sx={{ flexDirection: 'column' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={() => { setDialogOpen(true) }}>
                            REQUEST GROW
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ mt: 2 }}
                            onClick={viewOnOpenSea}>
                            VIEW ON OPENSEA
                        </Button>
                    </Box>

                    <ActionDialog
                        open={dialogOpen}
                        action={requestGrow}
                        title={`REQUESTING TOMATO #${id} GROW`}
                        message={growStatus!}
                        error={growError!}
                        isError={isError}
                        isSuccess={isSuccess}
                        isLoading={growLoading}
                        onClose={handleClose}
                    />
                </CardContent>
            </Card >
        </>
    );
};
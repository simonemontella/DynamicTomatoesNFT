import { Card, CardContent, Typography, CircularProgress, Box, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { OwnedNft } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { useWriteContract } from 'wagmi';
import { growTomato } from '../chain/TomatoesContract';

interface TomatoCardProps {
    tomato: OwnedNft;
}

export const TomatoCard = ({ tomato }: TomatoCardProps) => {
    const id = tomato.tokenId;
    const imageUrl = tomato.image.originalUrl;
    const stage = tomato.raw.metadata.attributes.find((attr: any) => attr.trait_type === 'Stage').value;

    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [dialogOpen, setDialogOpen] = useState(false);

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
            setLoading(false);
        };

        fetchImage();
    }, [imageUrl]);

    return (
        <>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, mb: 2 }}>
                        {loading ? (
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

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => { }}>
                        GROW
                    </Button>
                </CardContent>
            </Card >

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Growing Tomato #{id}</DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        {growthLoading ? (
                            <CircularProgress />
                        ) : growthError ? (
                            <Typography color="error">{growthError}</Typography>
                        ) : (
                            <Typography>Your tomato is growing! Check back soon to see its progress.</Typography>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};
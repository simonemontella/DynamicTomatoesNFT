import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { RequestGrowButton, ViewOnOpenSeaButton } from '../components/TomatoButtons';
import { refreshTomato } from '../chain/TomatoesManager';
import { useEffect, useState } from 'react';
import { Nft, OwnedNft } from 'alchemy-sdk';

export const TomatoPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [tomato, setTomato] = useState<OwnedNft | Nft | null>(null);
    const [loading, setLoading] = useState(false);
    const [tomatoImage, setTomatoImage] = useState<string | null>(null);

    const { tomato: navigationTomato, tomatoImage: navigationImage } = state;

    useEffect(() => {
        setLoading(true);
        if (navigationTomato && navigationImage) {
            setTomato(navigationTomato);
            setTomatoImage(navigationImage);
        }

        setLoading(false);
    }, []);

    const reloadTomato = async () => {
        if (!tomato) return;

        setLoading(true);
        const updatedTomato = await refreshTomato(Number(tomato.tokenId));
        if (updatedTomato) {
            setTomato(updatedTomato);
        }
        setLoading(false);
    };

    return (
        <Box minWidth={700} sx={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
            <Button size='large' onClick={() => navigate('/')} sx={{ mb: 2 }}>← Back to Your Tomatoes</Button>
            {loading ? <CircularProgress /> :
                <>
                    {tomato ? (
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                            <img src={tomatoImage!} alt={`Tomato Image`} style={{ maxHeight: 350, maxWidth: 350 }} />
                            <Box sx={{
                                display: 'flex', flexDirection: 'column',
                                justifyContent: 'center', gap: 5, px: 15
                            }}>
                                <Box>
                                    <Typography variant="h3">TOMATO #{tomato.tokenId}</Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Stage: {tomato.raw.metadata.attributes.find((attr: any) => attr.trait_type === 'Stage').value}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Planted on {formatTimestamp(tomato.mint!.timestamp!)}
                                    </Typography>
                                </Box>

                                <Box className="centered" sx={{ flexDirection: 'column' }}>
                                    <Button variant="outlined"
                                        onClick={reloadTomato}>
                                        REFRESH METADATA
                                    </Button>
                                    <Typography variant="body2" color="text.secondary"
                                        className="code">
                                        last update: {formatTimestamp(tomato.timeLastUpdated)}
                                    </Typography>
                                    <RequestGrowButton tomatoId={tomato.tokenId} />
                                    <ViewOnOpenSeaButton tomatoId={tomato.tokenId} />
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        <Typography variant="h3" color="text.secondary">
                            Cannot get tomato data
                        </Typography>
                    )
                    }
                </>
            }
        </Box >
    );
};

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    return date.toLocaleString();
};

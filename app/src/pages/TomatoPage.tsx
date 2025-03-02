import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { RequestGrowButton, ViewOnOpenSeaButton } from '../components/TomatoButtons';
import { getTomatoImage, refreshTomato } from '../chain/TomatoesManager';
import { useEffect, useState } from 'react';
import { Tomato } from '../chain/Tomato';
import { useGetHistory } from '../chain/EventsManager';
import { EventCard } from '../components/EventCard';

export const TomatoPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [tomato, setTomato] = useState<Tomato | null>(null);
    const [loading, setLoading] = useState(true);

    const [tomatoImage, setTomatoImage] = useState<string | null>(null);

    const { tomato: navigationTomato, tomatoImage: navigationImage } = state;

    useEffect(() => {
        const setupTomato = async () => {
            if (navigationTomato) {
                setTomato(new Tomato(navigationTomato.baseNft));

                if (navigationImage) {
                    setTomatoImage(navigationImage);
                } else {
                    setTomatoImage(await getTomatoImage(navigationTomato.imageUrl));
                }
            }


            setLoading(false);
        };

        setupTomato();
    }, []);

    const { getHistory, loading: logsLoading, events, error: historyError } = useGetHistory();
    const [reloadHistory, setReloadHistory] = useState(false);

    useEffect(() => {
        if (!tomato) return;

        const loadHistory = async () => {
            await getHistory(tomato!);
        }

        loadHistory();
    }, [tomato, reloadHistory]);

    const reloadTomato = async () => {
        if (!tomato) return;

        setLoading(true);

        const updatedTomato = await refreshTomato(tomato);
        if (updatedTomato) {
            setTomato(updatedTomato);
            setTomatoImage(await getTomatoImage(updatedTomato.imageUrl));
        }

        setLoading(false);
    };

    return (
        <Box minWidth={700} sx={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
            <Button size='large' onClick={() => navigate('/')} sx={{ mb: 2 }}>← Back to Your Tomatoes</Button>
            {loading ? <CircularProgress /> :
                <>
                    {tomato ? (
                        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column' }} >
                            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <img src={tomatoImage!} alt={`Tomato Image`} style={{ maxHeight: 350, maxWidth: 350 }} />
                                <Box sx={{
                                    display: 'flex', flexDirection: 'column',
                                    justifyContent: 'center', gap: 5, px: 15
                                }}>
                                    <Box>
                                        <Typography variant="h1">{tomato.displayName}</Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Stage&nbsp;
                                            <span className='code'>
                                                {tomato.stage}
                                            </span>
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Planted on&nbsp;
                                            <span className='code'>
                                                {tomato.mintDate}
                                            </span>
                                        </Typography>
                                    </Box>

                                    <Box className="centered" sx={{ flexDirection: 'column' }}>
                                        <Button variant="outlined"
                                            onClick={reloadTomato}>
                                            REFRESH METADATA
                                        </Button>
                                        <Typography variant="body1" color="text.secondary">
                                            last update:&nbsp;
                                            <span className='code' style={{ fontSize: '5px' }}>
                                                {tomato.lastRefreshDate}
                                            </span>
                                        </Typography>

                                        <RequestGrowButton tomato={tomato} />
                                        <ViewOnOpenSeaButton tomato={tomato} />
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h3" textAlign={'left'}>Tomato's History</Typography>
                                    <Button variant="outlined"
                                        onClick={() => setReloadHistory(!reloadHistory)}>
                                        REFRESH
                                    </Button>
                                </Box>
                                {logsLoading ?
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <CircularProgress />
                                    </Box> :
                                    <>
                                        {historyError ? (
                                            <Typography variant="h6" color="error">
                                                Cannot load tomato's history
                                            </Typography>
                                        ) : (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                {events.map((event, index) => (
                                                    <EventCard key={index} event={event} />
                                                ))}
                                            </Box>
                                        )}
                                    </>
                                }
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
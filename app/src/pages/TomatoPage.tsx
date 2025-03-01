import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { RequestGrowButton, ViewOnOpenSeaButton } from '../components/TomatoButtons';
import { getTomatoImage, refreshTomato } from '../chain/TomatoesManager';
import { useEffect, useState } from 'react';
import { Tomato, TomatoEvent } from '../chain/Tomato';
import { getTxLink } from '../Utils';
import { useGetHistory } from '../chain/EventsManager';

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

    const { getHistory, loading: logsLoading, logs, error: historyError } = useGetHistory();
    const [history, setHistory] = useState<TomatoEvent[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            await getHistory(tomato!);
        }

        loadHistory();
    }, [tomato]);

    const reloadTomato = async () => {
        if (!tomato) return;

        setLoading(true);
        const updatedTomato = await refreshTomato(tomato);
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
                                        <Typography variant="body1" color="text.secondary" >
                                            At tx &nbsp;
                                            <span className='code'>
                                                <a href={getTxLink(tomato.mintTx)} target="_blank" rel="noopener noreferrer">
                                                    #{tomato.mintTx.slice(0, 15)}...
                                                </a>
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
                                <Typography variant="h3" textAlign={'left'}>Tomato's History</Typography>
                                <Box className="tomato-history">
                                    <Typography variant="body1">Growth Stages</Typography>
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

function useGetTomatoHistory(): { getHistory: any; loading: any; logs: any; } {
    throw new Error('Function not implemented.');
}

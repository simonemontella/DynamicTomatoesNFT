import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestGrowButton, ViewOnOpenSeaButton } from './TomatoButtons';
import { getTomatoImage } from '../chain/TomatoesManager';
import { Tomato } from '../chain/Tomato';

interface TomatoCardProps {
    tomato: Tomato;
}

export const TomatoCard = ({ tomato }: TomatoCardProps) => {
    const navigate = useNavigate();

    const [image, setImage] = useState<string | null>(null);
    const [downloading, setDownloading] = useState<boolean>(false);

    useEffect(() => {
        const fetchImage = async () => {
            setDownloading(true);
            setImage(await getTomatoImage(tomato.imageUrl));
            setDownloading(false);
        };

        fetchImage();
    }, [tomato]);

    const handleCardClick = () => {
        navigate(`/tomato`, { state: { tomato, tomatoImage: image } });
    };

    return (
        <>
            <Card>
                <CardContent>
                    <Box sx={{ cursor: 'pointer' }} onClick={handleCardClick}>
                        <Box className="centered" sx={{ height: 200, mb: 2 }}>
                            {downloading ? <CircularProgress /> :
                                (image != null) ? <img src={image} alt={`Tomato Image`} style={{ maxHeight: '100%', maxWidth: '100%' }} /> : <Typography variant="body2">Error loading image</Typography>}
                        </Box>
                        <Typography variant="h5" gutterBottom>
                            {tomato.displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Growth Stage: {tomato.stage}
                        </Typography>
                    </Box>

                    <Box className="centered" sx={{ flexDirection: 'column' }}>
                        <RequestGrowButton tomato={tomato} />

                        <ViewOnOpenSeaButton tomato={tomato} />
                    </Box>
                </CardContent>
            </Card >
        </>
    );
};
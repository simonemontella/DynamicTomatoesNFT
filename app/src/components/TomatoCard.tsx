import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { OwnedNft } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestGrowButton, ViewOnOpenSeaButton } from './TomatoButtons';
import { IpfsImage } from 'react-ipfs-image';
import { getTomatoImage } from '../chain/TomatoesManager';

interface TomatoCardProps {
    tomato: OwnedNft;
}

export const TomatoCard = ({ tomato }: TomatoCardProps) => {
    const navigate = useNavigate();
    const id = tomato.tokenId;
    const imageUrl = tomato.raw.metadata.image;
    const stage = tomato.raw.metadata.attributes.find((attr: any) => attr.trait_type === 'Stage').value;

    const [image, setImage] = useState<string | null>(null);
    const [downloading, setDownloading] = useState<boolean>(true);

    useEffect(() => {
        const fetchImage = async () => {
            setImage(await getTomatoImage(imageUrl!));
            setDownloading(false);
        };

        fetchImage();
    }, [imageUrl]);

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
                            Tomato #{id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Growth Stage: {stage}
                        </Typography>
                    </Box>

                    <Box className="centered" sx={{ flexDirection: 'column' }}>
                        <RequestGrowButton tomatoId={id} />

                        <ViewOnOpenSeaButton tomatoId={id} />
                    </Box>
                </CardContent>
            </Card >
        </>
    );
};
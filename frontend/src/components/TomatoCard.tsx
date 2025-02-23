import { Card, CardContent, Typography } from '@mui/material';

export const TomatoCard = () => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Tomato Plant #1
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Growth Stage: s
                </Typography>
            </CardContent>
        </Card>
    );
}
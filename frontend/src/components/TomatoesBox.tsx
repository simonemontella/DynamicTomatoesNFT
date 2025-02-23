import { Box, Button, Grid, Typography } from "@mui/material";
import { TomatoCard } from "./TomatoCard";
import { getTomatoes } from "../chain/TomatoContract";

export const TomatoesBox = () => {
    const { loading, nfts } = getTomatoes();

    const nftsCount = nfts ? nfts.length : 0;

    return (
        loading ? (
            <Typography variant="h6">Loading...</Typography>
        ) : (
            <Typography variant="h6">You have {nftsCount} tomatoes</Typography>
            /*<Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <TomatoCard />
                </Grid>
            </Grid>*/
        )
    );
}
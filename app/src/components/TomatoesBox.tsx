import { CircularProgress, Grid } from "@mui/material";
import { TomatoCard } from "./TomatoCard";
import { getOwnedTomatoes } from "../chain/TomatoesManager";

export const TomatoesBox = () => {
    const { loading, nfts } = getOwnedTomatoes();

    //const nftsCount = nfts ? nfts.length : 0;

    return (
        loading || !nfts ? (
            <CircularProgress />
        ) : (
            <Grid container spacing={3}>
                {nfts.map((nft, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        {/* 12 cols / 12, 6, 4 = 1, 2, 3 elem max */}
                        <TomatoCard tomato={nft} />
                    </Grid>
                ))}
            </Grid>
        )
    );
}
import { CircularProgress, Grid, Typography } from "@mui/material";
import { TomatoCard } from "./TomatoCard";
import { useGetTomatoes } from "../chain/TomatoesManager";
import { useEffect } from "react";

interface TomatoesBoxProps {
    reload: boolean;
}

export const TomatoesBox = ({ reload }: TomatoesBoxProps) => {
    const { getTomatoes, loading, tomatoes } = useGetTomatoes();

    useEffect(() => {
        getTomatoes();
        console.log("reload changed:", reload);
    }, [reload]);

    return (
        loading ? (
            <CircularProgress />
        ) : (
            tomatoes.length === 0 ? (
                <Typography variant="h3" color="text.secondary">
                    You don't have any tomatoes yet. Plant a new one!
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {tomatoes.map((tomato, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            {/* 12 cols / 12, 6, 4 = 1, 2, 3 elem max */}
                            <TomatoCard tomato={tomato} />
                        </Grid>
                    ))}
                </Grid>
            )
        )
    );
}
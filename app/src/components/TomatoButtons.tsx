import { useState } from "react";
import { useRequestGrow } from "../chain/TomatoesManager";
import { Button } from "@mui/material";
import { ActionDialog } from "./ActionDialog";
import { Tomato } from "../chain/Tomato";
import { openLink } from "../Utils";

interface TomatoButtonsProps {
    tomato: Tomato;
}

export const RequestGrowButton = ({ tomato }: TomatoButtonsProps) => {
    const { requestGrow, isLoading: growLoading,
        isError, isSuccess, status: growStatus, error: growError } = useRequestGrow(tomato.id);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleClose = () => {
        if (!growLoading) {
            setDialogOpen(false);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => { setDialogOpen(true) }}>
                REQUEST GROW
            </Button>

            <ActionDialog
                open={dialogOpen}
                action={requestGrow}
                title={`REQUESTING TOMATO #${tomato.id} GROW`}
                message={growStatus!}
                error={growError!}
                isError={isError}
                isSuccess={isSuccess}
                isLoading={growLoading}
                onClose={handleClose}
            />
        </>
    )
}

export const ViewOnOpenSeaButton = ({ tomato }: TomatoButtonsProps) => {
    return (
        <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={() => openLink(tomato.openSeaUrl)}>
            VIEW ON OPENSEA
        </Button>
    )
}
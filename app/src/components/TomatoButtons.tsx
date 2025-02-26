import { useState } from "react";
import { useRequestGrow } from "../chain/TomatoesManager";
import { Button } from "@mui/material";
import { ActionDialog } from "./ActionDialog";
import { CONTRACT_ADDRESS } from "../chain/ContractInfos";

interface TomatoButtonsProps {
    tomatoId: string;
}

export const RequestGrowButton = ({ tomatoId }: TomatoButtonsProps) => {
    const { requestGrow, isLoading: growLoading,
        isError, isSuccess, status: growStatus, error: growError } = useRequestGrow(Number(tomatoId));
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
                title={`REQUESTING TOMATO #${tomatoId} GROW`}
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

export const ViewOnOpenSeaButton = ({ tomatoId }: TomatoButtonsProps) => {
    const viewOnOpenSea = () => {
        window.open(`https://testnets.opensea.io/assets/sepolia/${CONTRACT_ADDRESS}/${tomatoId}`, '_blank');
    };

    return (
        <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={viewOnOpenSea}>
            VIEW ON OPENSEA
        </Button>
    )
}
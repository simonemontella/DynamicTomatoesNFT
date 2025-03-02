import { Box, Chip } from "@mui/material";
import { TomatoEvent, TomatoEventType } from "../chain/Tomato";
import { formatHex, getTxLink, openLink } from "../Utils";

export const EventCard = ({ event }: { event: TomatoEvent }) => {
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9em',
            padding: '0.5em 1em', backgroundColor: getEventColor(event), borderRadius: '0.5em',
            cursor: 'pointer'
        }}
            onClick={() => openLink(getTxLink(event.txHash))}>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={event.type ?? "GENERIC"} /> {/* Display the event type */}
                {/* <Chip label={formatHex(event.txHash)} />  */}
            </Box>

            {event.args && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {Object.entries(event.args).map(([key, value]) => (
                        key !== "tomatoId" && <Chip key={key} label={`${key}: ${formatHex(value)}`} />
                    ))}
                </Box>
            )}
        </Box>
    )
}

function getEventColor(event: TomatoEvent) {
    switch (event.type) {
        case TomatoEventType.TomatoMinted:
        case TomatoEventType.TomatoGrown:
            return 'green';
        case TomatoEventType.TomatoGrowthFailed:
            return 'red';
        case TomatoEventType.TomatoGrowthRequest:
            return 'gray';
        default:
            return 'black';
    }
}
import { getBlockNumber, getLogs } from "viem/actions";
import { config } from "./ChainInteractions";
import { ABI, CONTRACT_ADDRESS, DEPLOY_BLOCK_NUMBER } from "./ContractInfos";
import { Tomato, TomatoEvent, TomatoEventType } from "./Tomato";
import { useState } from "react";
import { useClient, useWatchContractEvent } from "wagmi";
import { decodeEventLog, Log, parseAbiItem } from "viem";
import { formatHex, getTomatoEventType } from "../Utils";
import { useSnackbar } from "notistack";

const EVENTS_ABIs = [
    parseAbiItem("event TomatoMinted(uint8 tomatoId, address owner)"),
    parseAbiItem("event TomatoGrowthRequest(uint8 tomatoId, address requestBy, bytes32 requestId)"),
    parseAbiItem("event TomatoGrown(uint256 tomatoId, uint8 newStage)"),
    parseAbiItem("event TomatoGrowthFail(uint256 tomatoId, string reason, uint256 temperature, uint256 humidity)"),
    //parseAbiItem("event Debug(string msg)"),
    //TODO change from uint256 to uint8 (tomatoId)
]

export function subscribeToTomatoEvents() {
    const { enqueueSnackbar } = useSnackbar();

    useWatchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        onLogs(logs) {
            try {
                for (const log of logs) {
                    const event = getTomatoEventType(log.eventName);
                    if (!event)
                        continue;

                    let message = "";
                    let variant: 'success' | 'error' | 'info' | 'warning' = 'info';

                    switch (event) {
                        case TomatoEventType.TomatoMinted:
                            message = "🌱 New tomato planted!";
                            variant = 'success';
                            break;
                        case TomatoEventType.TomatoGrown:
                            message = "🍅 A tomato has grown!";
                            variant = 'success';
                            break;
                        case TomatoEventType.TomatoGrowthFailed:
                            message = "❌ Tomato growth failed";
                            variant = 'error';
                            break;
                        case TomatoEventType.TomatoGrowthRequest:
                            message = "⏳ Growing request sent";
                            variant = 'info';
                            break;
                    }

                    if (message && enqueueSnackbar) {
                        message += "\n" +
                            Object.entries(log.args)
                                .map(([key, value]) => `${key}: ${formatHex(value)}`).join("\n");

                        enqueueSnackbar(message, {
                            variant,
                            autoHideDuration: 4000,
                            preventDuplicate: true
                        });
                    }
                }
            } catch (error) {
                console.error('Error processing contract event:', error);
                enqueueSnackbar('Error processing contract event', {
                    variant: 'error',
                    autoHideDuration: 4000
                });
            }
        }
    });
}

export function useGetHistory() {
    const chainClient = useClient({ config });

    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<TomatoEvent[]>([]);
    const [error, setError] = useState<string | null>(null);

    const getHistory = async (tomato: Tomato) => {
        setLoading(true);
        setError(null);

        try {
            const fromBlock = !tomato.baseNft.mint || !tomato.baseNft.mint!.blockNumber ?
                DEPLOY_BLOCK_NUMBER : BigInt(tomato.baseNft.mint!.blockNumber!);
            console.log(tomato.baseNft);
            const latestBlock = await getBlockNumber(chainClient);
            let currentBlock = fromBlock;
            let allLogs: Log[] = [];

            while (currentBlock <= latestBlock) {
                const toBlock = currentBlock + BigInt(9999) > latestBlock ?
                    latestBlock :
                    currentBlock + BigInt(9999);

                const receivedLogs = await getLogs(chainClient, {
                    address: CONTRACT_ADDRESS,
                    fromBlock: currentBlock,
                    events: EVENTS_ABIs,
                    toBlock: toBlock,
                });

                allLogs = [...allLogs, ...receivedLogs];

                if (toBlock === latestBlock) break;
                currentBlock = toBlock + BigInt(1);
            }

            if (allLogs.length > 0) {
                setEvents(getTomatoEvents(allLogs, tomato));
            } else {
                setError("No events found");
            }
        } catch (error) {
            setError("Error while fetching tomato history: " + error);
            console.error('Error while fetching tomato history:', error);
        }

        setLoading(false);
    };

    return { getHistory, loading, events, error };
}

function getTomatoEvents(logs: Log[], tomato: Tomato) {
    logs.sort((a, b) => {
        if (a.blockNumber === b.blockNumber) {
            return (b.transactionIndex ?? 0) - (a.transactionIndex ?? 0);
        }

        return Number(b.blockNumber) - Number(a.blockNumber);
    });

    const decodedEvents = logs.map(log => decodeEventLog({ abi: ABI, topics: log.topics, data: log.data }));

    return decodedEvents
        .filter(event => 'tomatoId' in event.args && Number(event.args.tomatoId) === tomato.id)
        .map((event, index) =>
            new TomatoEvent(
                getTomatoEventType(event.eventName),
                logs[index].transactionHash!,
                undefined,
                event.args
            )
        );
}
import { getLogs } from "viem/actions";
import { config } from "./ChainInteractions";
import { abi, CONTRACT_ADDRESS } from "./ContractInfos";
import { Tomato, TomatoEvent, TomatoEventType } from "./Tomato";
import { useState } from "react";
import { useClient } from "wagmi";
import { decodeEventLog, Log } from "viem";
import { getTomatoEventType } from "../Utils";

export function useGetHistory() {
    const chainClient = useClient({ config });

    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<TomatoEvent[]>([]);
    const [error, setError] = useState<string | null>(null);

    const getHistory = async (tomato: Tomato) => {
        setLoading(true);
        setError(null);

        try {
            const receivedLogs = await getLogs(chainClient, {
                address: CONTRACT_ADDRESS,
                fromBlock: BigInt(tomato.baseNft.mint!.blockNumber!),
                toBlock: BigInt(tomato.baseNft.mint!.blockNumber! + 100),
            });

            //setLogs(getTomatoEvents(receivedLogs));
            console.log(getTomatoEvents(receivedLogs));
        } catch (error) {
            setError("Error while fetching tomato history: " + error);
            console.error('Error while fetching tomato history:', error);
        }

        setLoading(false);
    };

    return { getHistory, loading, logs, error };
}

function getTomatoEvents(logs: Log[]) {
    const decodedEvents = logs.map(log => decodeEventLog({ abi: abi, topics: log.topics, data: log.data }));
    console.log(decodedEvents);

    return decodedEvents.map((event, index) =>
        new TomatoEvent(
            getTomatoEventType(event.eventName),
            logs[index].transactionHash!,
            undefined,
            event.args
        )
    );
}

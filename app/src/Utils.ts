import { TomatoEventType } from "./chain/Tomato";

export function getTxLink(txHash: string) {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
}

export function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);

    return date.toLocaleString();
};

export function getTomatoEventType(eventType: string): TomatoEventType | undefined {
    return TomatoEventType[eventType as keyof typeof TomatoEventType];
}
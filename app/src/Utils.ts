import { TomatoEventType } from "./chain/Tomato";

export function getTxLink(txHash: string) {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
}

export function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp ?? Date.now);

    return date.toLocaleString();
};

export function getTomatoEventType(eventType: string): TomatoEventType | undefined {
    return TomatoEventType[eventType as keyof typeof TomatoEventType];
}

export function openLink(url: string) {
    window.open(url, '_blank');
}

export function formatHex(address: any) {
    if (typeof address !== 'string' || !address.startsWith('0x')) return address;

    return address.slice(0, 6) + '...' + address.slice(-4);
}
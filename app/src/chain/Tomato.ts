import { Nft, OwnedNft } from "alchemy-sdk";
import { CONTRACT_ADDRESS } from "./ContractInfos";
import { formatTimestamp } from "../Utils";

export class Tomato {
    baseNft: OwnedNft | Nft;
    id: number;
    stage: number;
    mintTx: string;
    mintTimestamp: string;
    imageUrl: string;

    eventsHistory: TomatoEvent[] = [];

    constructor(nft: OwnedNft | Nft) {
        this.baseNft = nft;
        this.id = Number(nft.tokenId);
        this.stage = nft.raw.metadata.attributes.find((attr: any) => attr.trait_type === 'Stage').value;
        this.mintTx = nft.mint!.transactionHash!;
        this.imageUrl = nft.raw.metadata.image;
        this.mintTimestamp = nft.mint!.timestamp!;
    }

    get displayName() {
        return `TOMATO #${this.id}`
    }

    get openSeaUrl() {
        return `https://testnets.opensea.io/assets/sepolia/${CONTRACT_ADDRESS}/${this.id}`;
    }

    get mintDate() {
        return formatTimestamp(this.mintTimestamp);
    }

    get lastRefreshDate() {
        return formatTimestamp(this.baseNft.timeLastUpdated);
    }

}

export class TomatoEvent {
    timestamp: string;
    type: TomatoEventType | undefined;
    args: Object | undefined;
    txHash: string;
    blockNumber!: bigint;
    txIndex!: string;

    constructor(type: TomatoEventType | undefined, txHash: string, timestamp?: string, args?: Object) {
        this.txHash = txHash;
        this.timestamp = timestamp!;
        this.type = type;
        this.args = args;
    }
}

export enum TomatoEventType {
    TomatoMinted = 'PLANT',
    TomatoGrowthRequest = 'GROW REQUEST',
    TomatoGrown = 'GROW SUCCESS',
    TomatoGrowthFailed = 'GROW FAIL',
    Debug = 'DEBUG',
}
import { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { Alchemy, Network, OwnedNft } from "alchemy-sdk";
import { abi } from './abi';
import hostSecrets from "./hostSecrets";

const CONTRACT_ADDRESS = '0x1d5f71a6c87827267079c6a6b93880f68172c338';
const alchemy = new Alchemy({
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY as string,
    network: Network.ETH_SEPOLIA,
});

export function getOwnedTomatoes() {
    const { address, isConnected } = useAccount();
    const [nfts, setNfts] = useState<OwnedNft[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!address || !isConnected) return;

        const fetchNfts = async () => {
            setLoading(true);
            try {
                const response = await alchemy.nft.getNftsForOwner(address, {
                    contractAddresses: [CONTRACT_ADDRESS],
                });
                setNfts(response.ownedNfts);
            } catch (error) {
                console.error("Errore nel recupero degli NFT:", error);
            }
            setLoading(false);
        };

        fetchNfts();
    }, [address, isConnected]);

    return { loading, nfts };
};

export async function growTomato(tomatoId: bigint, writeContractAsync: any) {
    const secretsData = await hostSecrets();
    console.log('Secrets data:', secretsData);

    return await writeContractAsync({
        abi: abi,
        address: CONTRACT_ADDRESS,
        functionName: 'grow',
        args: [tomatoId, secretsData.slotID, secretsData.version],
    });
}

export function plantTomato() {
    // mint
};

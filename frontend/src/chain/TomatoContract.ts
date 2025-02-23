import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Alchemy, Network } from "alchemy-sdk";

const CONTRACT_ADDRESS = '0x1d5f71a6c87827267079c6a6b93880f68172c338';
const alchemy = new Alchemy({
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY as string,
    network: Network.ETH_SEPOLIA,
});

export function getTomatoes() {
    const { address, isConnected } = useAccount();
    const [nfts, setNfts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!address || !isConnected) return;

        const fetchNfts = async () => {
            setLoading(true);
            try {
                const response = await alchemy.nft.getNftsForOwner(address, {
                    contractAddresses: [CONTRACT_ADDRESS],
                });
                console.log(response.ownedNfts);
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

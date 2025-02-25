import { useState, useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { Alchemy, Network, OwnedNft } from "alchemy-sdk";
import { abi } from './abi';
import hostSecrets from "./hostSecrets";
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect';

const CONTRACT_ADDRESS = '0x308675Dcd2aF0468c2771F3442eB2Fc3489BD49c';
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

export function growTomato(tomatoId: number) {
    const [isLoading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { data: tx, error: writeError, writeContractAsync } = useWriteContract();
    const { isLoading: isTxLoading, isSuccess: txSuccess, error: txError } = useWaitForTransactionReceipt({
        hash: tx,
    });

    useEffect(() => {
        setLoading(isTxLoading);

        if (tx) {
            setStatus('Requesting grow at transaction ' + tx);
        }

        if (txSuccess) {
            setStatus('Tomato growth requested successfully');
            setError(null);
        }

        if (txError) {
            setError('Growth request failed due to: ' + txError.message);
        }
    }, [tx, isTxLoading, txSuccess, txError]);

    const grow = async () => {
        setLoading(true);
        setStatus(null);
        setError(null);

        try {
            setStatus('Uploading secrets to get weather data...');
            const secretsData = await hostSecrets();

            setStatus('Secrets uploaded, calling grow function...');
            await writeContractAsync({
                abi: abi,
                address: CONTRACT_ADDRESS,
                functionName: 'grow',
                args: [tomatoId, secretsData.slotID, secretsData.version],
            });

            if (writeError) {
                setError(writeError.message);
                setLoading(false);
                return;
            }
        } catch (error) {
            setError('Error while requesting tomato\'s grow: ' + error);
            console.error('Error while growing tomato:', error);
        } finally {
            setLoading(isTxLoading);
        }
    }

    const isError = !!error;
    const isSuccess = !error && !isLoading;
    return { grow, isLoading, isError, isSuccess, status, error };
}

export function plantTomato() {
    // mint
};

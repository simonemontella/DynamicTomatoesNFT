import { useState, useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { ABI, CONTRACT_ADDRESS } from './ContractInfos';
import { alchemy } from './ChainInteractions';
import { Tomato } from './Tomato';

export function useGetTomatoes() {
    const { address } = useAccount();
    const [tomatoes, setTomatoes] = useState<Tomato[]>([]);
    const [loading, setLoading] = useState(false);

    const getTomatoes = async () => {
        setLoading(true);
        try {
            const response = await alchemy.nft.getNftsForOwner(address!, {
                contractAddresses: [CONTRACT_ADDRESS],
            });

            setTomatoes(response.ownedNfts.map(nft => new Tomato(nft)));
        } catch (error) {
            console.error("Error while fetching nfts:", error);
        }
        setLoading(false);
    };

    return { getTomatoes, loading, tomatoes };
};

export async function refreshTomato(tomato: Tomato) {
    try {
        if (await alchemy.nft.refreshNftMetadata(CONTRACT_ADDRESS, tomato.id)) {
            return new Tomato(await alchemy.nft.getNftMetadata(CONTRACT_ADDRESS, tomato.id));
        }
    } catch (error) {
        console.error('Error while refreshing metadata:', error);
    }

    return null;
}

export async function getTomatoImage(imageUrl: string) {
    const gateway = `https://${import.meta.env.VITE_IPFS_GATEWAY_URL}/ipfs/`;
    const cid = imageUrl.replace('ipfs://', '');

    try {
        const response = await fetch(gateway + cid);
        const imageBlob = await response.blob();
        return URL.createObjectURL(imageBlob);
    } catch (error) {
        console.error('Error fetching tomato image:', error);
        return null;
    }
}

export function useRequestGrow(tomatoId: number) {
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

        if (writeError) {
            setError(writeError.message);
            setLoading(false);
            return;
        }
    }, [tx, writeError, isTxLoading, txSuccess, txError]);

    const requestGrow = async () => {
        setLoading(true);
        setStatus(null);
        setError(null);

        try {
            setStatus('Uploading secrets to get weather data...');
            const secretsData = await hostSecrets();

            setStatus('Secrets uploaded, calling grow function...');
            await writeContractAsync({
                abi: ABI,
                address: CONTRACT_ADDRESS,
                functionName: 'requestGrow', //TODO change to requestGrow
                args: [tomatoId, secretsData.slotID, secretsData.version],
            });
        } catch (error) {
            setError('Error while requesting tomato\'s grow: ' + error);
            console.error('Error while growing tomato:', error);
        } finally {
            setLoading(isTxLoading);
        }
    }

    const isError = !!error;
    const isSuccess = !error && !isLoading;
    return { requestGrow, isLoading, isError, isSuccess, status, error };
}

export function usePlantTomato() {
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
            setStatus('Planting tomato at transaction ' + tx);
        }

        if (txSuccess) {
            setStatus('Tomato planted successfully');
            setError(null);
        }

        if (txError) {
            setError('Plant failed due to: ' + txError.message);
        }

        if (writeError) {
            setError(writeError.message);
            setLoading(false);
            return;
        }
    }, [tx, writeError, isTxLoading, txSuccess, txError]);

    const plantTomato = async () => {
        setLoading(true);
        setStatus(null);
        setError(null);

        try {
            setStatus('Planting tomato...');
            await writeContractAsync({
                abi: ABI,
                address: CONTRACT_ADDRESS,
                functionName: 'mint',
                args: [],
            });
        } catch (error) {
            setError('Error while planting tomato: ' + error);
            console.error('Error while planting tomato:', error);
        } finally {
            setLoading(isTxLoading);
        }
    }

    const isError = !!error;
    const isSuccess = !error && !isLoading;
    return { plantTomato, isLoading, isError, isSuccess, status, error };
};

async function hostSecrets(): Promise<{ slotID: number; version: bigint }> {
    try {
        const response = await fetch(`http://localhost:3000/get`);

        if (!response.ok) {
            throw new Error('Failed to upload secrets');
        }

        const data = await response.json();
        console.log('Secrets uploaded:', data);
        return {
            slotID: data.slotID,
            version: BigInt(data.version)
        };
    } catch (error) {
        console.error('Error uploading secrets:', error);
        throw error;
    }
}

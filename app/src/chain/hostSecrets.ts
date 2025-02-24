async function hostSecrets(): Promise<{ slotID: number; version: bigint }> {
    try {
        const response = await fetch(`http://localhost:3000/get`);

        if (!response.ok) {
            throw new Error('Failed to upload secrets');
        }

        const data = await response.json();
        return {
            slotID: data.slotID,
            version: BigInt(data.version)
        };
    } catch (error) {
        console.error('Error uploading secrets:', error);
        throw error;
    }
}

export default hostSecrets;
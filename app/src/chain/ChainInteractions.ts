import { Alchemy, Network } from 'alchemy-sdk';
import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

export const metaMaskConnector = metaMask({
  dappMetadata: {
    name: 'Dynamic Tomatoes',
  }
});

export const config = createConfig({
  chains: [sepolia],
  connectors: [metaMaskConnector],
  transports: {
    [sepolia.id]: http(),
  },
})

export const alchemy = new Alchemy({
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY as string,
  network: Network.ETH_SEPOLIA,
});
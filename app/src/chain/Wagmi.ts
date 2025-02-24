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
import { defineChain, type Chain } from 'viem'

export const tanssiDancebox: Chain = defineChain({
  id: 5678,
  name: 'dancebox-evm-container',
  network: 'tanssi',
  nativeCurrency: {
    name: 'TANGO',
    symbol: 'TANGO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network'],
    },
    public: {
      http: ['https://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network'],
    }
  },
  blockExplorers: {
    default: {
      name: 'Dancebox 3001 Explorer',
      url: 'https://3001-blockscout.a.dancebox.tanssi.network/',
    }
  },
  contracts: {
    multicall3: {
      address: '0x9df28b3B2b937E1429dE36575A2b3E303205ce0e',
      blockCreated: 1537488,
    }
  },
  testnet: true,
})

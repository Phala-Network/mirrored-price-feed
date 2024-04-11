import { createPublicClient, http, parseAbi, createWalletClient } from 'viem'
import type { Chain, Hex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import * as dotenv from 'dotenv'
import * as R from 'ramda'
import pino from 'pino'
import pretty from 'pino-pretty'
import arg from 'arg'

import { sources, relays } from './feeder/config'

dotenv.config()

const args = arg({})

const logger = pino(pretty())

//
//
//

type ContractAddresses = Readonly<Record<string, Hex>>

interface RoundData {
  pair: string
  roundId: bigint
  answer: bigint
  startedAt: bigint
  updatedAt: bigint
  answeredInRound: bigint
}

const roundDataKeys = ['pair', 'roundId', 'answer', 'startedAt', 'updatedAt', 'answeredInRound']

const abi = parseAbi([
  'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function transmit(uint80 _roundId, int192 _answer, uint64 _timestamp) external',
  'function getRoundData(uint80 _roundId) public view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
])

async function bulkReadLastRoundDataFromSource(chain: Chain, rpc: string | undefined, contracts: ContractAddresses): Promise<Record<string, RoundData>> {
  const pairs = R.toPairs(contracts)
  const client = createPublicClient({
    chain,
    transport: http(rpc)
  })
  const result = await client.multicall({
    contracts: R.map(
      ([, address]) => ({
        address,
        abi,
        functionName: 'latestRoundData',
      }),
      pairs
    )
  })
  const newPairs = R.map(
    ([pair, result]) => {
      const numbers = result.result!.map(BigInt)
      numbers[0] = BigInt(numbers[0] & BigInt('0xFFFFFFFFFFFFFFFF')) // Transform roundId
      return [pair[0], R.zipObj(roundDataKeys, [pair[0], ...numbers])]
    },
    R.zip(pairs, result)
  ) as [string, RoundData][]
  return R.fromPairs(newPairs)
}

async function bulkReadGetRoundDataFromDestination(chain: Chain, pairs: Readonly<[string, `0x${string}`, bigint]>[]): Promise<Record<string, RoundData>> {
  const client = createPublicClient({
    chain,
    transport: http()
  })
  const result = await client.multicall({
    contracts: R.map(
      ([_pair, address, roundId]) => ({
        address,
        abi,
        functionName: 'getRoundData',
        args: [roundId],
      }),
      pairs
    )
  })
  const newPairs = R.map(
    ([pair, result]) => {
      const numbers = result.result!.map(BigInt)
      numbers[0] = BigInt(numbers[0] & BigInt('0xFFFFFFFFFFFFFFFF')) // Transform roundId
      return [pair[0], R.zipObj(roundDataKeys, [pair[0], ...numbers])]
    },
    R.zip(pairs, result)
  ) as [string, RoundData][]
  return R.fromPairs(newPairs)
}

//
//
//

async function main() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error('missing process.env.PRIVATE_KEY')
  }
  if (!args._.length) {
    throw new Error(`Usage: ${process.argv[1]} <relayer>`)
  }
  const relayer = args._[0]
  const relay = relays[relayer]
  const totalPairs = R.sum(R.map(i => i.pairs.length, relay.sources))
  const start = Date.now()

  logger.info(`Run relay aggregator ${relayer}, chain ${relay.chain.name}, from ${relay.sources.length} sources and ${totalPairs} pairs.`)

  //
  // Getting last round data from sources and last synced round data from relayed chain.
  //
  let lastRoundData: Record<string, RoundData> = {}
  let lastRelayedRoundData: Record<string, RoundData> = {}
  for (const source of relay.sources) {
    const { chain, rpc, contracts } = sources[source.source]
    const result1 = await bulkReadLastRoundDataFromSource(chain, rpc, contracts)
    lastRoundData = R.mergeLeft(lastRoundData, result1)

    const queries = R.map(
      pair => [pair, relay.contracts[pair], lastRoundData[pair].roundId] as const,
      source.pairs
    )
    const result2 = await bulkReadGetRoundDataFromDestination(relay.chain, queries)
    lastRelayedRoundData = R.mergeLeft(lastRelayedRoundData, result2)
  }

  //
  // Check roundId and found out which one need to be update. 
  //
  let toUpdate: RoundData[] = []
  for (const pair of R.keys(relay.contracts)) {
    const lastRound = lastRoundData[pair]
    const lastRelayedRound = lastRelayedRoundData[pair]
    logger.info(`${pair} | ${lastRound.roundId} | ${lastRound.answer} => ${lastRelayedRound.answer}`)
    if (lastRound.roundId > lastRelayedRound.roundId || lastRound.answer !== lastRelayedRound.answer) {
      toUpdate.push(lastRound)
    }
  }

  logger.info(`Found ${toUpdate.length} pairs need to be updated.`)
  if (toUpdate.length > 0) {
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)
    const publicClient = createPublicClient({ chain: relay.chain, transport: http() })
    const walletClient = createWalletClient({ chain: relay.chain, transport: http(), account })

    const hashes: Hex[] = []
    for (const i of toUpdate) {
      try {
        const hash = await walletClient.writeContract({
          address: relay.contracts[i.pair],
          abi,
          functionName: 'transmit',
          args: [i.roundId, i.answer, i.startedAt]
        })
        hashes.push(hash)
      } catch (err) {
        logger.error(`Send contract transaction failed: ${relay.contracts[i.pair]} ${i.pair}`)
      }
    }
    await Promise.all(hashes.map(hash => publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 })))
  }
  logger.info(`Elapsed: ${Date.now() - start}ms`)
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err)
  process.exit(1)
})

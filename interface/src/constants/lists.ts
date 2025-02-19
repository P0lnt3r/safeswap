import { ChainId } from "@uniswap/sdk"

// the Uniswap Default token list lives here
export const DEFAULT_TOKEN_LIST_URL = 'tokens.uniswap.eth'

// export const DEFAULT_SELECT_TOKEN_LIST : { [chainId in ChainId] ? : string } = {
//   [ChainId.MAINNET]:"https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json",
//   [ChainId.BSC]:"https://raw.githubusercontent.com/pancakeswap/pancake-frontend/develop/src/config/constants/tokenLists/pancake-default.tokenlist.json",
// }

export const DEFAULT_SELECT_TOKEN_LIST : { [chainId in ChainId] ? : string } = {
  [ChainId.MAINNET]:"https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json",
  [ChainId.BSC]:"https://raw.githubusercontent.com/pancakeswap/token-list/main/lists/coingecko.json",
}

export const DEFAULT_LIST_OF_LISTS: string[] = [
  // DEFAULT_TOKEN_LIST_URL,
  // 't2crtokens.eth', // kleros
  // 'tokens.1inch.eth', // 1inch
  // 'synths.snx.eth',
  // 'tokenlist.dharma.eth',
  // 'defi.cmc.eth',
  // 'erc20.cmc.eth',
  // 'stablecoin.cmc.eth',
  // 'tokenlist.zerion.eth',
  /*'https://app.tryroll.com/tokens.json',*/
  // 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json',
  // 'ipfs://QmVNCFc3y1DMt8n4K42d8BYubUhQ7FgcNxzEHxSEHszUhL', // aave token list
  // 'https://defiprime.com/defiprime.tokenlist.json',
  // 'https://umaproject.org/uma.tokenlist.json',
  // 'https://tokens.coingecko.com/uniswap/all.json',


  'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json',
  'https://raw.githubusercontent.com/pancakeswap/token-list/main/lists/coingecko.json',


  // 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json',
  // 'https://raw.githubusercontent.com/pancakeswap/pancake-frontend/develop/src/config/constants/tokenLists/pancake-default.tokenlist.json',
]

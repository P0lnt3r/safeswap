import { ChainId, Currency, ETHER, Token } from '@uniswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import BNBLogo from '../../assets/images/bnb-logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import { SRC20_LOGOS } from '../../constants/src20tokens'
import { useActiveWeb3React } from '../../hooks/index'
import internal from 'stream'

const getTokenLogoURL = (address: string,chainId?:number) => {
  if ( chainId == 56  ){
    return `https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/${address}/logo.png`;
  }
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
}
  

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const { chainId } = useActiveWeb3React();
  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []
    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address,chainId)]
      }
      if ( SRC20_LOGOS[currency.symbol.toUpperCase()] ){
        return [SRC20_LOGOS[currency.symbol.toUpperCase()]]
      }
      return [getTokenLogoURL(currency.address,chainId)]
    }
    return []
  }, [currency, uriLocations,chainId])

  if (currency === ETHER) {
    if ( chainId === ChainId.BSC || chainId === ChainId.BSC_TEST ){
      return <StyledEthereumLogo src={BNBLogo} size={size} style={style} />
    }
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}

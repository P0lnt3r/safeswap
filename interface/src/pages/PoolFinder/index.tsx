import { Currency, ETHER, JSBI, TokenAmount, Token } from '@uniswap/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import { Text } from 'rebass'
import { ButtonDropdownLight } from '../../components/Button'
import { LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyLogo from '../../components/CurrencyLogo'
import { FindPoolTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row from '../../components/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { usePairAdder } from '../../state/user/hooks'
import { useDerivedSwapInfo } from '../../state/swap/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import AppBody from '../AppBody'
import { Dots } from '../Pool/styleds'
import { useTranslation } from 'react-i18next'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1
}

export default function PoolFinder() {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React()

  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | null>(null)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const { currencies } = useDerivedSwapInfo();
  const token0 = currencies.INPUT as Token ;
  const token1 = currencies.OUTPUT as Token;

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if ( token0 && !currency0 ){
      setCurrency0(token0)
    }
    if ( token1 && !currency1 ){
      setCurrency1(token1)
    }
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair,currencies])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const prerequisiteMessage = (
    <LightCard padding="45px 10px">
      <Text textAlign="center">
        {!account ? t('connectToAWalletToViewYourLiquidity') : t('selectTokenFindYourLiquidity')}
      </Text>
    </LightCard>
  )

  return (
    <AppBody>
      <FindPoolTabs />
      <AutoColumn gap="md">
        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true)
            setActiveField(Fields.TOKEN0)
          }}
        >
          {currency0 ? (
            <Row>
              <CurrencyLogo currency={currency0} />
              <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                {currency0.symbol}
              </Text>
            </Row>
          ) : (
            <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
              {t('selectToken')}
            </Text>
          )}
        </ButtonDropdownLight>

        <ColumnCenter>
          <Plus size="16" color="#888D9B" />
        </ColumnCenter>

        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true)
            setActiveField(Fields.TOKEN1)
          }}
        >
          {currency1 ? (
            <Row>
              <CurrencyLogo currency={currency1} />
              <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                {currency1.symbol}
              </Text>
            </Row>
          ) : (
            <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
              {t('selectToken')}
            </Text>
          )}
        </ButtonDropdownLight>

        {hasPosition && (
          <ColumnCenter
            style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px', borderRadius: '12px' }}
          >
            <Text textAlign="center" fontWeight={500}>
              {t('poolFound')}!
            </Text>
          </ColumnCenter>
        )}

        {currency0 && currency1 ? (
          pairState === PairState.EXISTS ? (
            hasPosition && pair ? (
              <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
            ) : (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">{t('youDontHaveLiquidityInThisPoolYet')}</Text>
                  <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                    <Text textAlign="center">{ t('addLiquidity') }</Text>
                  </StyledInternalLink>
                </AutoColumn>
              </LightCard>
            )
          ) : validPairNoLiquidity ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">{t('noPoolFound')}.</Text>
                <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                  {t('createPool')}.
                </StyledInternalLink>
              </AutoColumn>
            </LightCard>
          ) : pairState === PairState.INVALID ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center" fontWeight={500}>
                  {t('invalidPair')}.
                </Text>
              </AutoColumn>
            </LightCard>
          ) : pairState === PairState.LOADING ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">
                  {t('loading')}
                  <Dots />
                </Text>
              </AutoColumn>
            </LightCard>
          ) : null
        ) : (
          prerequisiteMessage
        )}
      </AutoColumn>

      <CurrencySearchModal
        isOpen={showSearch}
        onCurrencySelect={handleCurrencySelect}
        onDismiss={handleSearchDismiss}
        showCommonBases
        selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
      />
    </AppBody>
  )
}

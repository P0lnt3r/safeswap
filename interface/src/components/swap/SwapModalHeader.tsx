import { Trade, TradeType, CurrencyAmount } from '@uniswap/sdk'
import React, { useContext, useMemo } from 'react'
import { ArrowDown, AlertTriangle } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../Button'
import { isAddress, shortenAddress } from '../../utils'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'
import { useTranslation } from 'react-i18next'
import { useDerivedSwapInfo } from '../../state/swap/hooks'

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,

  parsedAmounts,
  outputTokenAmount,

}: {
  trade: Trade | undefined
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void,

  parsedAmounts: {[field in Field]?: CurrencyAmount},
  outputTokenAmount: CurrencyAmount,
  
}) {
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    trade,
    allowedSlippage
  ])
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)
  const {t} = useTranslation();
  const theme = useContext(ThemeContext)

  const {
    currencies
  } = useDerivedSwapInfo();

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          {
            trade ? <CurrencyLogo currency={trade?.inputAmount.currency} size={'24px'} style={{ marginRight: '12px' }} />
                  : <CurrencyLogo currency={currencies[Field.INPUT]} size={'24px'} style={{ marginRight: '12px' }} />
          }
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={showAcceptChanges && trade?.tradeType === TradeType.EXACT_OUTPUT ? theme.primary1 : ''}
          >
            {trade? trade.inputAmount.toSignificant(6) : parsedAmounts[Field.INPUT]?.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {
              trade?trade.inputAmount.currency.symbol:currencies[Field.INPUT]?.symbol
            }
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" color={theme.text2} style={{ marginLeft: '4px', minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          {
            trade ? <CurrencyLogo currency={trade?.outputAmount.currency} size={'24px'} style={{ marginRight: '12px' }} />
                  : <CurrencyLogo currency={currencies[Field.OUTPUT]} size={'24px'} style={{ marginRight: '12px' }} />
          }
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={
              priceImpactSeverity > 2
                ? theme.red1
                : showAcceptChanges && trade?.tradeType === TradeType.EXACT_INPUT
                ? theme.primary1
                : ''
            }
          >
            { outputTokenAmount ? outputTokenAmount.toSignificant(6) : trade?.outputAmount.toSignificant(6) }
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {trade ? trade.outputAmount.currency.symbol : currencies[Field.OUTPUT]?.symbol }
          </Text>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap={'0px'}>
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
              <TYPE.main color={theme.primary1}> Price Updated</TYPE.main>
            </RowFixed>
            <ButtonPrimary
              style={{ padding: '.5rem', width: 'fit-content', fontSize: '0.825rem', borderRadius: '12px' }}
              onClick={onAcceptChanges}
            >
              Accept
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
        { outputTokenAmount ? '' : trade?.tradeType === TradeType.EXACT_INPUT ? (
          <TYPE.italic textAlign="left" style={{ width: '100%' }}>
            {t('outputEstimated')}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
            </b>
            {t('orRevert')}
          </TYPE.italic>
        ) : (
          <TYPE.italic textAlign="left" style={{ width: '100%' }}>
            {t('inputEstimated')}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade?.inputAmount.currency.symbol}
            </b>
            {t('orRevert')}
          </TYPE.italic>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <TYPE.main>
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TYPE.main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}

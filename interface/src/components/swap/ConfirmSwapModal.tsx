import { currencyEquals, Trade , CurrencyAmount } from '@uniswap/sdk'
import React, { useCallback, useMemo } from 'react'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../TransactionConfirmationModal'
import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'
import { useTranslation } from 'react-i18next'
import { useDerivedSwapInfo } from '../../state/swap/hooks'
import { Field } from '../../state/swap/actions'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

export default function ConfirmSwapModal({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  recipient,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,

  /********/
  parsedAmounts ,           
  outputTokenAmount ,
  /********/

}: {
  isOpen: boolean
  trade: Trade | undefined
  originalTrade: Trade | undefined
  attemptingTxn: boolean
  txHash: string | undefined
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage: string | undefined
  onDismiss: () => void,

  /********/
  parsedAmounts: {[field in Field]?: CurrencyAmount},
  outputTokenAmount:CurrencyAmount,
  /********/

}) {
  const {t} = useTranslation();
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )

  const modalHeader = useCallback(() => {
    return (trade || outputTokenAmount) ? (
      <SwapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}

        /**************************** */
        parsedAmounts={parsedAmounts}
        outputTokenAmount={outputTokenAmount}
        /**************************** */

      />
    ) : null
  }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade])

  const modalBottom = useCallback(() => {
    return (trade || outputTokenAmount) ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
        allowedSlippage={allowedSlippage}

        /*********************************** */
        outputTokenAmount={outputTokenAmount}
        /*********************************** */
        
      />
    ) : null
  }, [allowedSlippage, onConfirm, showAcceptChanges, swapErrorMessage, trade])

  const { currencies } = useDerivedSwapInfo();
  // text to show while loading
  const pendingText = trade ?  
                              `${t('swapfor')} ${trade?.inputAmount?.toSignificant(6)} ${trade?.inputAmount?.currency?.symbol} 
                                ${t('swapfor2')} ${trade?.outputAmount?.toSignificant(6)} ${trade?.outputAmount?.currency?.symbol}`
                            : `${t('swapfor')} ${parsedAmounts[Field.INPUT]?.toSignificant(6)} ${currencies[Field.INPUT]?.symbol}
                                ${t('swapfor2')} ${outputTokenAmount?.toSignificant(6)} ${currencies[Field.OUTPUT]?.symbol}`
                            ;
 
  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title={t('confirmSwap')}
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}

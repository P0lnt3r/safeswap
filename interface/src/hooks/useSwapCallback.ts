import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { JSBI, Percent, Router, SwapParameters, Trade, TradeType , CurrencyAmount, Token, ChainId , ETHER } from '@uniswap/sdk'
import { useMemo } from 'react'
import { BIPS_BASE, DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE } from '../constants'
import { getTradeVersion, useV1TradeExchangeAddress } from '../data/V1'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, getRouterContract, isAddress, shortenAddress } from '../utils'
import isZero from '../utils/isZero'
import v1SwapArguments from '../utils/v1SwapArguments'
import { useActiveWeb3React } from './index'
import { useV1ExchangeContract } from './useContract'
import useENS from './useENS'
import { Version } from './useToggledVersion'

import useOneinch from './useOneinch'
import { Field } from '../state/swap/actions'
import { useTranslation } from 'react-i18next'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

interface SuccessfulCall {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall {
  call: SwapCall
  error: Error
}

type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param deadline the deadline for the trade
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW, // in seconds from now
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const v1Exchange = useV1ExchangeContract(useV1TradeExchangeAddress(trade), true)

  return useMemo(() => {
    const tradeVersion = getTradeVersion(trade)
    if (!trade || !recipient || !library || !account || !tradeVersion || !chainId) return []

    const contract: Contract | null =
      tradeVersion === Version.v2 ? getRouterContract(chainId, library, account) : v1Exchange
    if (!contract) {
      return []
    }

    const swapMethods = []

    switch (tradeVersion) {
      case Version.v2:
        swapMethods.push(
          Router.swapCallParameters(trade, {
            feeOnTransfer: false,
            allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
            recipient,
            ttl: deadline
          })
        )

        if (trade.tradeType === TradeType.EXACT_INPUT) {
          swapMethods.push(
            Router.swapCallParameters(trade, {
              feeOnTransfer: true,
              allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
              recipient,
              ttl: deadline
            })
          )
        }
        break
      case Version.v1:
        swapMethods.push(
          v1SwapArguments(trade, {
            allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
            recipient,
            ttl: deadline
          })
        )
        break
    }
    return swapMethods.map(parameters => ({ parameters, contract }))
  }, [account, allowedSlippage, chainId, deadline, library, recipient, trade, v1Exchange])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW, // in seconds from now
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender

  parsedAmounts           : {[field in Field]?: CurrencyAmount},
  outputTokenAmount       : CurrencyAmount       

  ): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()
  const { t } = useTranslation();
  const swapCalls = useSwapCallArguments(trade, allowedSlippage, deadline, recipientAddressOrName)
  console.log('# useSwapCallback # - swapCalls:',outputTokenAmount);
  console.log('# useSwapCallback # - swapCalls:',swapCalls);
  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const {
    IOneinch,
    oneinchContract
  } = useOneinch();
  const swapFragment = IOneinch.getFunction("swap");
  const unoswapFragment = IOneinch.getFunction("unoswap");

  return useMemo(() => {
    
    if (!trade || !library || !account || !chainId) {
      if ( !trade && !outputTokenAmount ){
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
      }
    }

    if ( outputTokenAmount ){
      return { state: SwapCallbackState.VALID, callback: async function onSwap():Promise<string>{
        const swapParams = {    
          fromTokenAddress  : ETHER == <Token>parsedAmounts[Field.INPUT]?.currency ? 
                              "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : (<Token>parsedAmounts[Field.INPUT]?.currency).address,
          toTokenAddress    : ETHER == <Token>outputTokenAmount.currency ? 
                              "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : (<Token>outputTokenAmount.currency).address,
          amount: parsedAmounts[Field.INPUT]?.raw,  
          fromAddress: account,      
          slippage: 5,    
          disableEstimate: false,    
          allowPartialFill: false,
        };

        const url = `https://api.1inch.io/v4.0/${chainId}/swap?fromTokenAddress=${swapParams.fromTokenAddress}&toTokenAddress=${swapParams.toTokenAddress}&amount=${swapParams.amount}&fromAddress=${swapParams.fromAddress}&slippage=${swapParams.slippage}`;
        // 请求 1inch 获取调用参数
        let rawTransaction;
        try {
          let response = await fetch(url, {
              method: 'GET',
              mode:'cors'
          })
          let json = await response.json();
          rawTransaction = json.tx;
          console.log(rawTransaction)
        } catch (error) {
          
        }
        let transactionResponse;
        if ( chainId === ChainId.BSC ){
          const response = IOneinch.decodeFunctionData( swapFragment , rawTransaction.data );
          console.log(response);
          let {
            caller,
            desc,
            data
          } = IOneinch.decodeFunctionData( swapFragment , rawTransaction.data );
          console.log('caller:',caller);
          console.log('desc:',desc);
          console.log('data:',data);
          console.log('gasLimit:',rawTransaction.gas);
          console.log('gasPrice:',rawTransaction.gasPrice);

          transactionResponse = await oneinchContract.swap( caller,desc,data,{
            gasLimit:rawTransaction.gas,
            gasPrice:rawTransaction.gasPrice / 3,
            value:rawTransaction.value
          }).catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error(t('transactionRejected'))
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, "swap", caller, desc,data)
              throw new Error(`${t('swapFailed')}: ${error.message}`)
            }
          })
        }else if (chainId === ChainId.MAINNET){
          console.log(IOneinch.decodeFunctionData( unoswapFragment , rawTransaction.data ));
          const {
            srcToken,
            amount,
            minReturn,
            pools
          } = IOneinch.decodeFunctionData( unoswapFragment , rawTransaction.data );
          console.log('srcToken:',srcToken);
          console.log('amount:',amount);
          console.log('minReturn:',minReturn);
          console.log('pools:',pools);
          console.log('gasLimit:',rawTransaction.gas);
          console.log('gasPrice:',rawTransaction.gasPrice);
          transactionResponse = await oneinchContract.unoswap( srcToken,amount,minReturn,pools, {
            gasLimit:rawTransaction.gas,
            gasPrice:rawTransaction.gasPrice,
            value:rawTransaction.value
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error(t('transactionRejected'))
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, "unoswap", srcToken, amount,minReturn,pools)
              throw new Error(`${t('swapFailed')}: ${error.message}`)
            }
          })
        }

        const hash = transactionResponse.hash;
        const withVersion = `${t('swapfor')} ${parsedAmounts[Field.INPUT]?.toSignificant(6)} ${parsedAmounts[Field.INPUT]?.currency.symbol} ${t('swapfor2')} ${outputTokenAmount.toSignificant(6)} ${outputTokenAmount.currency.symbol}`;
          const response : any = {
            hash:hash,
          };
        addTransaction(response, {
          summary: withVersion
        })
        return hash;
        /******************************************************** */

      } , error: null }
    }

    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      } else {
        return { state: SwapCallbackState.LOADING, callback: null, error: null }
      }
    }

    const tradeVersion = getTradeVersion(trade)

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
          swapCalls.map(call => {
            const {
              parameters: { methodName, args, value },
              contract
            } = call
            const options = !value || isZero(value) ? {} : { value }

            return contract.estimateGas[methodName](...args, options)
              .then(gasEstimate => {
                return {
                  call,
                  gasEstimate
                }
              })
              .catch(gasError => {
                console.debug('Gas estimate failed, trying eth_call to extract error', call)

                return contract.callStatic[methodName](...args, options)
                  .then(result => {
                    console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
                  })
                  .catch(callError => {
                    console.debug('Call threw error', call, callError)
                    let errorMessage: string
                    switch (callError.reason) {
                      case 'SafeswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
                      case 'SafeswapV2Router: EXCESSIVE_INPUT_AMOUNT':
                        errorMessage =
                          'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'
                        break
                      default:
                        errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens you are swapping.`
                    }
                    return { call, error: new Error(errorMessage) }
                  })
              })
          })
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        )

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          throw new Error('Unexpected error. Please contact support: none of the calls threw an error')
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value }
          },
          gasEstimate
        } = successfulEstimation

        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          ...(value && !isZero(value) ? { value, from: account } : { from: account })
        })
          .then((response: any) => {
            const inputSymbol = trade?.inputAmount.currency.symbol
            const outputSymbol = trade?.outputAmount.currency.symbol
            const inputAmount = trade?.inputAmount.toSignificant(3)
            const outputAmount = trade?.outputAmount.toSignificant(3)
            
            const base = `${t('swapfor')} ${inputAmount} ${inputSymbol} ${t('swapfor2')} ${outputAmount} ${outputSymbol}`
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? shortenAddress(recipientAddressOrName)
                      : recipientAddressOrName
                  }`

            const withVersion =
              tradeVersion === Version.v2 ? withRecipient : `${withRecipient} on ${(tradeVersion as any).toUpperCase()}`

            addTransaction(response, {
              summary: withVersion
            })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error(t('transactionRejected'))
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value)
              throw new Error(`${t('swapFailed')}: ${error.message}`)
            }
          })
      },
      error: null
    }
  }, [trade, library, account, chainId, recipient, recipientAddressOrName, swapCalls, addTransaction,parsedAmounts,outputTokenAmount])
}

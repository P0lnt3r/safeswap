import { Currency, Token, CurrencyAmount, ChainId, TokenAmount } from "@uniswap/sdk";
import { useEffect, useMemo, useState } from "react";
import { useActiveWeb3React } from "../hooks";
import { Field } from '../state/swap/actions'


export default function use1inchInterface(
    need1inch               : boolean ,
    currencies              : {[field in Field]?: Currency },
    parsedAmounts           : {[field in Field]?: CurrencyAmount }           
    ) :{
        outputTokenAmount? : TokenAmount
    } {
    const { chainId } = useActiveWeb3React();
    const maxReturnProtocols = useMemo(()=>{
        switch( chainId ){
            case ChainId.MAINNET:
                return "UNISWAP_V1,UNISWAP_V2,SUSHI,MOONISWAP,BALANCER,COMPOUND,CURVE,CURVE_V2_SPELL_2_ASSET,CURVE_V2_SGT_2_ASSET,CURVE_V2_THRESHOLDNETWORK_2_ASSET,CHAI,OASIS,KYBER,AAVE,IEARN,BANCOR,PMM1,CREAMSWAP,SWERVE,BLACKHOLESWAP,DODO,DODO_V2,VALUELIQUID,SHELL,DEFISWAP,SAKESWAP,LUASWAP,MINISWAP,MSTABLE,PMM2,SYNTHETIX,AAVE_V2,ST_ETH,ONE_INCH_LP,ONE_INCH_LP_1_1,LINKSWAP,S_FINANCE,PSM,POWERINDEX,PMM3,XSIGMA,CREAM_LENDING,SMOOTHY_FINANCE,SADDLE,PMM4,KYBER_DMM,BALANCER_V2,UNISWAP_V3,SETH_WRAPPER,CURVE_V2,CURVE_V2_EURS_2_ASSET,CURVE_V2_EURT_2_ASSET,CURVE_V2_XAUT_2_ASSET,CURVE_V2_ETH_CRV,CURVE_V2_ETH_CVX,CONVERGENCE_X,ONE_INCH_LIMIT_ORDER,ONE_INCH_LIMIT_ORDER_V2,DFX_FINANCE,FIXED_FEE_SWAP,DXSWAP,CLIPPER,SHIBASWAP,UNIFI,PMMX,PMM5,PSM_PAX,PMM2MM1,WSTETH,DEFI_PLAZA,FIXED_FEE_SWAP_V3,SYNTHETIX_WRAPPER,SYNAPSE,CURVE_V2_YFI_2_ASSET,CURVE_V2_ETH_PAL,POOLTOGETHER,ETH_BANCOR_V3,PMM6,ELASTICSWAP,BALANCER_V2_WRAPPER,SYNTHETIX_ATOMIC,FRAXSWAP,RADIOSHACK";
            case ChainId.BSC:
                return "BURGERSWAP,PANCAKESWAP,VENUS,JULSWAP,BAKERYSWAP,BSC_ONE_INCH_LP,ACRYPTOS,BSC_DODO,APESWAP,SPARTAN,SPARTAN_V2,VSWAP,VPEGSWAP,HYPERSWAP,BSC_DODO_V2,SWAPSWIPE,ELLIPSIS_FINANCE,BSC_NERVE,BSC_SMOOTHY_FINANCE,CHEESESWAP,BSC_PMM1,PANCAKESWAP_V2,MDEX,WARDEN,WAULTSWAP,BSC_ONE_INCH_LIMIT_ORDER,BSC_ONE_INCH_LIMIT_ORDER_V2,BSC_PMM3,BSC_PMM7,ACSI_FINANCE,GAMBIT_FINANCE,JETSWAP,BSC_UNIFI,BSC_PMMX,BSC_KYBER_DMM,BSC_BI_SWAP,BSC_DOPPLE,BABYSWAP,BSC_PMM2MM,WOOFI,BSC_ELK,BSC_SYNAPSE,BSC_AUTOSHARK,BSC_CAFE_SWAP,BSC_PMM5,PLANET_FINANCE,BSC_ANNEX_FINANCE,BSC_ANNEX_SWAP,BSC_RADIOSHACK,BSC_KYBERSWAP_ELASTIC,BSC_FSTSWAP";
            default:
                return "BURGERSWAP,PANCAKESWAP,VENUS,JULSWAP,BAKERYSWAP,BSC_ONE_INCH_LP,ACRYPTOS,BSC_DODO,APESWAP,SPARTAN,SPARTAN_V2,VSWAP,VPEGSWAP,HYPERSWAP,BSC_DODO_V2,SWAPSWIPE,ELLIPSIS_FINANCE,BSC_NERVE,BSC_SMOOTHY_FINANCE,CHEESESWAP,BSC_PMM1,PANCAKESWAP_V2,MDEX,WARDEN,WAULTSWAP,BSC_ONE_INCH_LIMIT_ORDER,BSC_ONE_INCH_LIMIT_ORDER_V2,BSC_PMM3,BSC_PMM7,ACSI_FINANCE,GAMBIT_FINANCE,JETSWAP,BSC_UNIFI,BSC_PMMX,BSC_KYBER_DMM,BSC_BI_SWAP,BSC_DOPPLE,BABYSWAP,BSC_PMM2MM,WOOFI,BSC_ELK,BSC_SYNAPSE,BSC_AUTOSHARK,BSC_CAFE_SWAP,BSC_PMM5,PLANET_FINANCE,BSC_ANNEX_FINANCE,BSC_ANNEX_SWAP,BSC_RADIOSHACK,BSC_KYBERSWAP_ELASTIC,BSC_FSTSWAP";
        }
    },[chainId]);
    const [outputTokenAmount,setOutputTokenAmount] = useState<TokenAmount>();

    const inputCurrencyAmount = parsedAmounts[Field.INPUT];
    const inputAmount = inputCurrencyAmount?.raw.toString();
    const formatInput = useMemo( ()=>{
        return inputCurrencyAmount?.toExact();
    } , [inputCurrencyAmount] );

    async function fetch1inch(){
        
        const inputToken:Token = <Token>currencies.INPUT;
        const outputToken:Token = <Token>currencies.OUTPUT;
        if ( !currencies.OUTPUT ){
            setOutputTokenAmount(null)
            return;
        }
        if ( !(inputToken && outputToken) ){
            return;
        }
        if ( !(chainId === ChainId.BSC || chainId === ChainId.MAINNET) ){
            console.warn("非以太坊主网或BSC主网，不可访问1inch进行聚合交易");
            return;
        }
        let fromTokenAddress  = inputToken.address;   
        let toTokenAddress    = outputToken.address;   
        let amount = inputAmount;

        const url = `https://pathfinder.1inch.io/v1.2/chain/${chainId}/router/v4/quotes-by-presets?chainId=${chainId}&fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&gasPrice=20000000000&amount=${amount}&walletAddress=&maxReturnProtocols=${maxReturnProtocols}`;
        if ( need1inch ){
            try {
                let response = await fetch(url, {
                    method: 'GET',
                    mode:'cors'
                })
                let json = await response.json();
                let outputTokenAmount = new TokenAmount(outputToken,json.uniResult.toTokenAmount);
                setOutputTokenAmount(outputTokenAmount);
            } catch (error) {
                
            }
        }else{
            setOutputTokenAmount(null)
        }
    }   
    useEffect( () => {
        fetch1inch();
    } , [formatInput,chainId] );    

    return {
        outputTokenAmount
    };
}
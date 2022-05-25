import { ChainId, Token } from '@uniswap/sdk'
import BSTZ_LOGO from '../../assets/logos/BSTZ.png'
import LCOIN_LOGO from '../../assets/logos/LCOIN.png'
import PXT_LOGO from '../../assets/logos/PXT.png'
import XSAFE_LOGO from '../../assets/logos/XSAFE.png'
import SAFE_LOGO from '../../assets/logos/SAFE.png'

type ChainTokenList = {
    readonly [chainId in ChainId]: Token[]
}

export const SRC20_LOGOS = {
    "XSAFE":XSAFE_LOGO,
    "PXT":PXT_LOGO,
    "LCOIN":LCOIN_LOGO,
    "BSTZ":BSTZ_LOGO,
    "SAFE":SAFE_LOGO
}

export const SRC20_TOKENS: ChainTokenList = {
    [ChainId.MAINNET]: [
        new Token(ChainId.MAINNET, '0xee9c1ea4dcf0aaf4ff2d78b6ff83aa69797b65eb', 18,'SAFE','SAFE'),
    ],
    [ChainId.ROPSTEN]: [
        new Token(ChainId.ROPSTEN, '0x32885f2faf83aeee39e2cfe7f302e3bb884869f4', 18,'SAFE','SAFE'),
    ],
    [ChainId.RINKEBY]: [

    ],
    [ChainId.GÖRLI]: [

    ],
    [ChainId.KOVAN]: [

    ],
    [ChainId.BSC]: [
        
    ],
    [ChainId.BSC_TEST]: [
        new Token(ChainId.ROPSTEN, '0x4D5E879434f6fA5E46bF7E194d4AF5e4bDD7B66F', 4, 'BSTZ', 'BSTZ'),
        new Token(ChainId.ROPSTEN, '0xD283F5D4331ECeF6900aA1Fc4c171FDC8DEE2e46', 4, 'XSAFE', 'XSAFE'),
    ],
}



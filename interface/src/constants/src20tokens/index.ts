import { ChainId, Token } from '@uniswap/sdk'
import BSTZ_LOGO from '../../assets/logos/BSTZ.png'
import LCOIN_LOGO from '../../assets/logos/LCOIN.png'
import PXT_LOGO from '../../assets/logos/PXT.png'
import XSAFE_LOGO from '../../assets/logos/XSAFE.png'

type ChainTokenList = {
    readonly [chainId in ChainId]: Token[]
}

export const SRC20_LOGOS = {
    "XSAFE":XSAFE_LOGO,
    "PXT":PXT_LOGO,
    "LCOIN":LCOIN_LOGO,
    "BSTZ":BSTZ_LOGO
}

export const SRC20_TOKENS: ChainTokenList = {
    [ChainId.MAINNET]: [
        
    ],
    [ChainId.ROPSTEN]: [
        new Token(ChainId.ROPSTEN, '0xACb6c8104eDBad3765DA16F420d75781C03322d3', 4, 'BSTZ', 'BSTZ'),
        new Token(ChainId.ROPSTEN, '0x7a9097a837521f1fe9219b0108b2967348eb064b', 4, 'XSAFE', 'XSAFE'),
        new Token(ChainId.ROPSTEN, '0x9364182712033586A2eDB8fE1Ffdf39E7f8f644b', 4, 'PXT', 'PXT'),
        new Token(ChainId.ROPSTEN, '0x0e661e32666F02eF2c85e7e51c7898429cd98c38', 4, 'LCOIN', 'LCOIN')
    ],
    [ChainId.RINKEBY]: [

    ],
    [ChainId.GÖRLI]: [

    ],
    [ChainId.KOVAN]: [

    ]
}



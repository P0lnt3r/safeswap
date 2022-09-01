import { ChainId, Token } from '@uniswap/sdk'
import BSTZ_LOGO from '../../assets/logos/BSTZ.png'
import LCOIN_LOGO from '../../assets/logos/LCOIN.png'
import PXT_LOGO from '../../assets/logos/PXT.png'
import XSAFE_LOGO from '../../assets/logos/XSAFE.png'
import SAFE_LOGO from '../../assets/logos/SAFE.png'
import LINK_LOGO from '../../assets/logos/BSTZ.png'

type ChainTokenList = {
    readonly [chainId in ChainId]: Token[]
}

export const SRC20_LOGOS = {
    "XSAFE":XSAFE_LOGO,
    "PXT":PXT_LOGO,
    "LCOIN":LCOIN_LOGO,
    "BSTZ":BSTZ_LOGO,
    "SAFE":SAFE_LOGO,
    "LINK":LINK_LOGO
}

export const SRC20_TOKENS: ChainTokenList = {
    [ChainId.MAINNET]: [
        new Token(ChainId.MAINNET, '0xee9c1ea4dcf0aaf4ff2d78b6ff83aa69797b65eb', 18,'SAFE','SAFE'),
    ],
    [ChainId.ROPSTEN]: [ 
        new Token(ChainId.ROPSTEN, '0x32885f2faf83aeee39e2cfe7f302e3bb884869f4', 18,'SAFE','SAFE'),
        new Token(ChainId.ROPSTEN, '0x9364182712033586A2eDB8fE1Ffdf39E7f8f644b', 4,'PXT','PXT'),
        new Token(ChainId.ROPSTEN, '0xACb6c8104eDBad3765DA16F420d75781C03322d3', 4,'BSTZ','BSTZ'),
        new Token(ChainId.ROPSTEN, '0x7a9097a837521f1fe9219b0108b2967348eb064b', 4,'XSAFE','XSAFE'),
    ],
    [ChainId.RINKEBY]: [

    ],
    [ChainId.GÖRLI]: [

    ],
    [ChainId.KOVAN]: [

    ],
    [ChainId.BSC]: [
        new Token(ChainId.BSC, '0x4d7fa587ec8e50bd0e9cd837cb4da796f47218a1', 18, 'SAFE', 'SAFE'),
        new Token(ChainId.BSC, '0x55d398326f99059ff775485246999027b3197955', 18, 'USDT', 'USDT'),
        new Token(ChainId.BSC, '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', 18, 'DAI', 'DAI'),
    ],
    [ChainId.BSC_TEST]: [
        new Token(ChainId.BSC_TEST, '0xa3D8077c3A447049164e60294C892e5E4C7f3aD2', 4, 'SAFE', 'SAFE'),
        new Token(ChainId.BSC_TEST, '0x4D5E879434f6fA5E46bF7E194d4AF5e4bDD7B66F', 4, 'BSTZ', 'BSTZ'),
        new Token(ChainId.BSC_TEST, '0xD283F5D4331ECeF6900aA1Fc4c171FDC8DEE2e46', 4, 'XSAFE', 'XSAFE'),
    ],
}



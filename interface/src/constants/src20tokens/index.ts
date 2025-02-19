import { ChainId, ETHER, Token } from '@uniswap/sdk'
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
    "SAFE":SAFE_LOGO,
}

export const TOKEN_SAFE : { [chainId in ChainId] : Token } = {
    [ChainId.MAINNET]   :new Token(ChainId.MAINNET, "0xee9c1ea4dcf0aaf4ff2d78b6ff83aa69797b65eb", 18,'SAFE','SAFE'),
    [ChainId.BSC]       :new Token(ChainId.BSC, '0x4d7fa587ec8e50bd0e9cd837cb4da796f47218a1', 18, 'SAFE', 'SAFE'),

    [ChainId.ROPSTEN]   :new Token(ChainId.ROPSTEN, '0x32885f2faf83aeee39e2cfe7f302e3bb884869f4', 18,'SAFE','SAFE'),
    [ChainId.BSC_TEST]  :new Token(ChainId.BSC_TEST, '0xa3D8077c3A447049164e60294C892e5E4C7f3aD2', 4, 'SAFE', 'SAFE'),

    // 占位,无意义 ****/
    [ChainId.RINKEBY]:new Token(ChainId.RINKEBY, '0xa3D8077c3A447049164e60294C892e5E4C7f3aD2', 18, 'SAFE', 'SAFE'),
    [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0xa3D8077c3A447049164e60294C892e5E4C7f3aD2', 18, 'SAFE', 'SAFE'),
    [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0xa3D8077c3A447049164e60294C892e5E4C7f3aD2', 18, 'SAFE', 'SAFE')
    /*************** */
}
export const TOKEN_USDT :  { [chainId in ChainId]: Token } = {
    [ChainId.MAINNET]:new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6,'USDT','USDT'),
    [ChainId.BSC]:new Token(ChainId.BSC, '0x55d398326f99059ff775485246999027b3197955', 18, 'USDT', 'USDT'),

    [ChainId.ROPSTEN]:new Token(ChainId.ROPSTEN, '0x7a9097a837521f1fe9219b0108b2967348eb064b', 4,'XSAFE','XSAFE'),
    [ChainId.BSC_TEST]:new Token(ChainId.BSC_TEST, '0xD283F5D4331ECeF6900aA1Fc4c171FDC8DEE2e46', 4, 'XSAFE', 'XSAFE'),

    // 占位,无意义 ****/
    [ChainId.RINKEBY]:new Token(ChainId.RINKEBY, '0xa3D8077c3A447049164e60294C892e5E4C7f3aD2', 18, 'SAFE', 'SAFE'),
    [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0xa3D8077c3A447049164e60294C892e5E4C7f3aD2', 18, 'SAFE', 'SAFE'),
    [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0xa3D8077c3A447049164e60294C892e5E4C7f3aD2', 18, 'SAFE', 'SAFE')
     /*************** */
}

export const SRC20_TOKENS: ChainTokenList = {
    [ChainId.MAINNET]: [
        new Token(ChainId.MAINNET, '0xee9c1ea4dcf0aaf4ff2d78b6ff83aa69797b65eb', 18,'SAFE','SAFE'),
    ],
    [ChainId.ROPSTEN]: [ 
        new Token(ChainId.ROPSTEN, '0x32885f2faf83aeee39e2cfe7f302e3bb884869f4', 18,'SAFE','SAFE'),
        // new Token(ChainId.ROPSTEN, '0x9364182712033586A2eDB8fE1Ffdf39E7f8f644b', 4,'PXT','PXT'),
        // new Token(ChainId.ROPSTEN, '0xACb6c8104eDBad3765DA16F420d75781C03322d3', 4,'BSTZ','BSTZ'),
        new Token(ChainId.ROPSTEN, '0x7a9097a837521f1fe9219b0108b2967348eb064b', 4,'XSAFE','XSAFE'),

        new Token(ChainId.ROPSTEN, '0x287e4f257a105d9fD6Aa423D261E5c340E079335', 8,'AAA','AAA'),
        new Token(ChainId.ROPSTEN, '0x069533878483A8eB20f16E1d905BE215773199Fc', 8,'BBB','BBB'),
        new Token(ChainId.ROPSTEN,"0xcD7Ff2D8C6bF188B10697b78cDf89718AC45704F",2,"GBN","GBN")
    ],
    [ChainId.RINKEBY]: [

    ],
    [ChainId.GÖRLI]: [

    ],
    [ChainId.KOVAN]: [

    ],
    [ChainId.BSC]: [
        TOKEN_SAFE[ChainId.BSC],
        TOKEN_USDT[ChainId.BSC],
    ],
    [ChainId.BSC_TEST]: [
        new Token(ChainId.BSC_TEST, '0xa3D8077c3A447049164e60294C892e5E4C7f3aD2', 4, 'SAFE', 'SAFE'),
        new Token(ChainId.BSC_TEST, '0xD283F5D4331ECeF6900aA1Fc4c171FDC8DEE2e46', 4, 'XSAFE', 'XSAFE'),
    ],
}



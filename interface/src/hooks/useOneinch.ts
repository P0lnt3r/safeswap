import { useActiveWeb3React } from ".";
import { Contract } from '@ethersproject/contracts'
import { Interface } from '@ethersproject/abi'
import ONEINCH_ABI from '../constants/abis/oneinch.json'
import { useMemo } from "react";
import { ONEINCH_ROUTER_ADDRESS } from '../constants'

export default function useOneinch(){
    const { library,chainId } = useActiveWeb3React();
    const IOneinch = new Interface(ONEINCH_ABI);
    const oneinchContract = useMemo( ()=>{
        return new Contract(ONEINCH_ROUTER_ADDRESS, ONEINCH_ABI, library?.getSigner());
    } , [library,chainId])
    return {
        IOneinch,
        oneinchContract
    }
}


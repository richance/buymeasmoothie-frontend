import web3 from 'web3';
import { ETH_NETWORK_ID } from '../consts/networkIds';

export const validateAddress = (address: string, chainId = ETH_NETWORK_ID): boolean => {
    try {
        web3.utils.toChecksumAddress(address, chainId);

        return true;
    } catch (e) {
        return false;
    }
}

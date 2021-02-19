import { BNB_NETWORK_ID, ETH_NETWORK_ID } from '@/consts/networkIds';

const scanLinks = {
    [ETH_NETWORK_ID]: 'https://etherscan.io/address/',
    [BNB_NETWORK_ID]: 'https://bscscan.com/address/',
};

export const getScanLink = (address: string, chainId: number): string => {
    return scanLinks[chainId] + address;
}

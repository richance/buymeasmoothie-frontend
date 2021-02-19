import { Decimal } from 'decimal.js';
import { BNB_NETWORK_ID, ETH_NETWORK_ID } from '@/consts/networkIds';

export const SMOOTHIE_USER_ID = '11';
export const SMOOTHIE_DONATE_ID = {
    [ETH_NETWORK_ID]: '1',
    [BNB_NETWORK_ID]: '2',
};
export const WEI_VALUE = new Decimal(10).pow(18);

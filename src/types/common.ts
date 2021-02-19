export interface IAsset {
    address: string;
    name: string;
    balance: string | number;
    symbol: string;
    logo_url: string;
    decimals: number;
}

export interface ISaveTransactionData {
    token_address: string;
    symbol: string;
    comment: string;
    value: string;
    user_id: string;
    donate_id: string;
    from_address: string;
}

export interface IGoal {
    name: string;
    sum: number;
    chain: number;
    address: string;
}

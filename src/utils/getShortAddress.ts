const getShortAddress = (address: string, onlyEnd = false): string => {
    if (onlyEnd) {
        return `${address.slice(-5, address.length)}`;
    } else {
        return `${address.slice(0, 5)}...${address.slice(-5, address.length)}`
    }
};

export default getShortAddress;

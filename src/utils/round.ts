const round = (num: number, decimals: number = 8): number => {
    const explicitNum = Number(num);

    if (!String(explicitNum).includes('e')) {
        return Number(
            `${Math.round(Number(`${explicitNum}e+${decimals}`))}e-${decimals}`,
        );
    }
    const numberAndFraction = String(explicitNum).split('e');

    let sign = '';
    if (+numberAndFraction[1] + decimals > 0) {
        sign = '+';
    }

    const resultNum = Math.round(
        Number(
            `${numberAndFraction[0]}e${sign}${+numberAndFraction[1] + decimals}`,
        ),
    );

    return Number(`${resultNum}e-${decimals}`);
};

export default round;

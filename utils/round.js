function roundToTwo(num) {
    const numberAfterDecimalPoint = num.toString().split('.')[1];
    if(numberAfterDecimalPoint) {
        // if(numberAfterDecimalPoint.length > 13) {
        //     // Check if number four decimal places.
        //     throw `Decimal places exceed 13`;
        // }
    }
    return +(Math.round(num + "e+2")  + "e-2");
}

function round(num) {
    const numberAfterDecimalPoint = num.toString().split('.')[1];
    if(numberAfterDecimalPoint) {
        // if(numberAfterDecimalPoint.length > 13) {
        //     // Check if number four decimal places.
        //     throw `Decimal places exceed 13`;
        // }
    }
    return +(Math.round(num + "e+0")  + "e-0");
}

module.exports = { roundToTwo, round };
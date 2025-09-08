function cType1NOTD001Map(CType1NO) {
    // convert CType1NO into TD001
    switch(CType1NO.slice(0,1)) {
        case '1':
            return '2201'
        case 'W':
            return '2202'
        case 'Y':
            return '2203'
        case 'H':
            return '2204'
        default:
            throw new Error(`Error in cType1NOTD001Map: CType1NO no matching, try again.`)
    }
}

module.exports = cType1NOTD001Map;
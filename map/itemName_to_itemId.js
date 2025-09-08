function itemNameIdConvertMap(item) {
    if (/^稅什費/.test(item)) {
        return {'itemId':'B000001', 'itemName': '稅什費'};
    } 
    if (/^道路改善工程費/.test(item)) {
        return {'itemId':'B000002', 'itemName': '道路改善工程費'};
    } 
    if (/^道路維護工程費/.test(item)) {
        return {'itemId':'B000003', 'itemName': '道路維護工程費'};
    } 
    if (/^道路附屬設施工程費/.test(item) || /^工程費/.test(item)) {
        return {'itemId':'B000004', 'itemName': '道路附屬設施工程費'};
    } 
    if (/^人手孔改善工程費/.test(item)) {
        return {'itemId':'B000005', 'itemName': '人手孔改善工程費'};
    } 
    if (/^安全設施及交通維持費/.test(item) || /^交通安全設施及交通維持費/.test(item)) {
        return {'itemId':'B000006', 'itemName': '安全設施及交通維持費'};
    } 
    if (/^雜項工程費/.test(item)) {
        return {'itemId':'B000007', 'itemName': '雜項工程費'};
    } 
    if (/^材料試驗費/.test(item)) {
        return {'itemId':'B000008', 'itemName': '材料試驗費'};
    } 
    if (/^職業安全衛生管理費/.test(item)) {
        return {'itemId':'B000009', 'itemName': '職業安全衛生管理費'};
    } 
    if (/^自主品管費/.test(item)) {
        return {'itemId':'B000010', 'itemName': '自主品管費'};
    } 
    if (/^道路巡查費/.test(item)) {
        return {'itemId':'B000011', 'itemName': '道路巡查費'};
    } 
    if (/^材料代購費/.test(item)) {
        return {'itemId':'B000012', 'itemName': '材料代購費'};
    } 
    if (/^義交/.test(item)) {
        return {'itemId':'B000013', 'itemName': '義交'};
    } 
    if (/^戶外型雲端管理型攝(錄)影/.test(item)) {
        return {'itemId':'B000014', 'itemName': '戶外型雲端管理型攝(錄)影'};
    }
    throw `Can't match any itemId with item name=${item}`;
}

module.exports = itemNameIdConvertMap;
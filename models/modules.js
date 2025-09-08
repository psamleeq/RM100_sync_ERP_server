const { roundToTwo, round } = require('../utils/round.js');

class CaseMap { // 20240130-ok
    // INVMB
    constructor(caseFromRm100) {
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseFromRm100.CREATE_DATE; 
        // date: 20231211
        // this.MODIFIER = ;
        // this.MODI_DATE = ;
        this.FLAG = '1';
        this.CREATE_TIME = caseFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        // this.CREATE_PRID = 'ERPsyncServer'; // 
        // this.MODI_TIME = ;				
        // this.MODI_AP = ;
        // this.MODI_PRID = ;
        // this.EF_ERPMA001 = ;
        // this.EF_ERPMA002 = ;
        this.MB001 = caseFromRm100.DTeam; // Dteam => 合約代號+流水號
        this.MB002 = caseFromRm100.CaseName;
        this.MB003 = caseFromRm100.CType1NO; // 派工單號
        this.MB004 = '式';
        this.MB005 = '107'; // 品號分類-會計
        this.MB006 = caseFromRm100.paperkind; // PAPERKIND
        this.MB009 = caseFromRm100.CaseNo;
        this.MB010 = caseFromRm100.DTeam; // 同MB001
        this.MB011 = '0001'; // 標準途程代號
        this.MB014 = '0.00000'; // 單位淨重
        this.MB015 = 'Kg'; // 重量單位
        this.MB017 = '2100'; // 主要庫別
        this.MB019 = 'N'; // 庫存管理
        this.MB020 = 'N'; // 保稅品
        this.MB022 = 'N'; // 批號管理
        this.MB023 = '0'; // 有效天數
        this.MB024 = '0'; // 複檢天數
        this.MB025 = 'P'; // 品號屬性
        this.MB026 = '99'; // 低階碼
        this.MB033 = '1'; // 應稅否
        this.MB034 = 'R'; // 補貨政策
        this.MB035 = '2'; // 補貨週期
        this.MB036 = '0'; // 固定前置天數
        this.MB037 = '0'; // 變動前置天數
        this.MB038 = '0.000'; // 批量
        this.MB039 = '0.000'; // 最低補量
        this.MB040 = '0.000'; // 補貨倍量
        this.MB041 = '0.000'; // 領用倍量
        this.MB042 = '1'; // 領料碼
        this.MB043 = '0'; // 檢驗方式
        this.MB044 = 'N'; // 超收管理
        this.MB045 = '0.0000'; // 超收率
        this.MB046 = '0.000000'; // 標準進價
        this.MB047 = '0.000000'; // 標準售價
        this.MB049 = '0.000000'; // 最近進價-原幣單價
        this.MB050 = '0.000000'; // 最近進價-本幣單價
        this.MB051 = '0.000000'; // 零售價
        this.MB052 = 'N'; // 零售價含稅
        this.MB053 = '0.000000'; // 售價定價一
        this.MB054 = '0.000000'; // 售價定價二
        this.MB055 = '0.000000'; // 售價定價三
        this.MB056 = '0.000000'; // 售價定價四
        this.MB057 = '0.000000'; // 單位標準材料成本
        this.MB058 = '0.000000'; // 單位標準人工成本
        this.MB059 = '0.000000'; // 單位標準製造費用
        this.MB060 = '0.000000'; // 單位標準加工費用
        this.MB061 = '0.000000'; // 本階人工
        this.MB062 = '0.000000'; // 本階製費
        this.MB063 = '0.000000'; // 本階加工
        this.MB064 = '0.000'; // 庫存數量
        this.MB065 = '0.000000'; // 庫存金額
        this.MB066 = 'N'; // 修改品名/規格
        this.MB069 = '0.000000'; // 售價定價五
        this.MB070 = '0.000000'; // 售價定價六
        this.MB071 = '0.0000'; // 外包裝材積
        this.MB073 = '0.000'; // 外包裝含商品數
        this.MB074 = '0.000'; // 外包裝淨重
        this.MB075 = '0.000'; // 外包裝毛重
        this.MB076 = '0'; // 檢驗天數
        this.MB078 = '0'; // MRP生產允許交期提前天數
        this.MB079 = '0'; // MRP採購允許交期提前天數
        this.MB080 = caseFromRm100.DTeam; // 貨號，同MB001
        this.MB082 = '0.0000'; // 關稅率
        this.MB083 = 'N'; // 產品序號管理
        this.MB084 = '0.000000'; // 貨物稅率
        this.MB085 = '0'; // 預留欄位
        this.MB086 = '0'; // 預留欄位
        this.MB087 = '0.0'; // 長(CM)
        this.MB088 = '0.0'; // 寬(CM)
        this.MB089 = '0.0'; // 高(CM)
        this.MB091 = 'N'; // 定重
        this.MB092 = '0.000'; // 庫存包裝數量
        this.MB093 = 'Year'; // 屬性代碼一
        this.MB094 = 'Firm'; // 屬性代碼二
        this.MB095 = 'Title'; // 屬性代碼三
        this.MB096 = 'T-No'; // 屬性代碼四
        this.MB103 = 'Contract'; // 屬性組代碼
        this.MB104 = caseFromRm100.DTeam.slice(0, 3); // 屬性內容一、接案年度
        this.MB105 = caseFromRm100.DTeam.slice(3, 5); // 屬性內容二、接案單位
        this.MB106 = caseFromRm100.DTeam.slice(5, 7); // 屬性內容三、工程類別名稱
        this.MB107 = caseFromRm100.DTeam.slice(7, 9); // 屬性內容四、第幾標
        this.MB121 = 'N'; // 是否為HandlingCharge
        this.MB122 = '0'; // 產品控制碼
        this.MB123 = '0'; // 禮券序號流水號
        this.MB124 = 'N'; // 是否為健康捐商品
        this.MB125 = '0.000000'; // 健康捐金額
        this.MB131 = '0.000000'; // 預留欄位
        this.MB132 = '0.00'; // 預留欄位
        this.MB133 = '0.000000'; // 業務底價
        this.MB144 = 'N'; // 磅秤品
        this.MB148 = '0.000'; // 超收量
        this.MB149 = '0.000'; // 超收包裝量
        this.MB150 = 'N'; // 進價管制
        this.MB151 = '0.0000'; // 單價上限率
        this.MB152 = 'N'; // 售價管制
        this.MB153 = '0.0000'; // 單價下限率
        this.MB154 = 'N'; // 控制編碼原則
        this.MB156 = '0' // 序號流水號碼數
        this.MB165 = '0000'; // 版次
        this.MB166 = 'N'; // 電子發票須上傳產品追朔串接碼
        this.MB168 = '1'; // 品號稅別
    };
}

class COPTC { // 20240201-ok
    constructor(caseFromRm100) {
        this.transaction = caseFromRm100.transaction;
        this.dbConn = caseFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.TC001 = caseFromRm100.TD001; // 訂單單別
        this.TC002 = caseFromRm100.TD002; // 訂單單號：是日期+當日流水號 1121214+001
        this.TC003 = this.CREATE_DATE; // 訂單日期
        this.TC004 = 'A'+caseFromRm100.DTeam.slice(0, 9); // 客戶代號
        this.TC005 = ''; // 部門代號 訂單先不填
        this.TC007 = '001'; // 出貨廠別
        this.TC008 = 'NTD'; 
        this.TC009 = '1.000000000';  // 匯率
        this.TC014 = '現金電匯-付現'; // 付款條件全名
        this.TC015 = ''+round(caseFromRm100.orderEstimateIncome); // 備註 = 總金額
        this.TC016 = '1'; // 課稅別 1
        this.TC019 = '1'; 
        this.TC026 = '0.00000';
        this.TC027 = 'Y'; // 確認碼
        this.TC028 = '0';
        this.TC029 = ''+round(this.TC015/1.05); // 訂單金額 = 金額加總/1.05
        this.TC030 = Number(this.TC015) - Number(this.TC029)+''; // 訂單稅額 = TC015 - TC029
        this.TC031 = '1.000'; // 總數量
        this.TC032 = this.TC004; // 收貨人
        this.TC039 = this.CREATE_DATE; // 單據日期
        this.TC040 = 'ERPsyncServer'; // 確認者 
        this.TC041 = '0.0500'; // 營業稅率
        this.TC042 = 'N'; // 簽核狀態碼
        this.TC043 = caseFromRm100.clientName; // 客戶全名
        this.TC046 = caseFromRm100.clientName; // 送貨客戶全名
        this.TC049 = '0.000000'; // 預留欄位
        this.TC050 = '1'; // 材積單位
        this.TC051 = '0.000'; // 總毛重
        this.TC052 = '0.000'; // 總材積
        this.TC055 = '1'; // 交易條件
        this.TC056 = '0.000'; // 總包裝數量
        this.TC057 = '0'; // 傳送次數
        this.TC058 = '0.00000'; // 訂金比率
        this.TC059 = '2T01'; // 付款條件代號
        this.TC064 = '4'; // 配送時段
        this.TC066 = '0.000000'; // 代收貨款
        this.TC067 = '0.000000'; // 運費
        this.TC074 = 'N'; // 訂金分批
        this.TC075 = '0.000000'; // 收入遞延天數
        this.TC091 = '0.000000'; // 原幣應稅銷售額
        this.TC092 = '0.000000'; // 原幣免稅銷售額
    };
}

class FirstCOPTD { // 20240201-ok
    constructor(caseFromRm100) {
        this.transaction = caseFromRm100.transaction;
        this.dbConn = caseFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.TD001 = caseFromRm100.TD001; // 訂單單別
        this.TD002 = caseFromRm100.TD002; // 訂單單號：是日期+當日流水號 1121214+001
        this.TD003 = '0001'; // 案件於該訂單的序號(流水號): 0001~...
        this.TD004 = caseFromRm100.DTeam; // 案件品號MB001
        this.TD005 = caseFromRm100.CaseName; // 案件品名
        this.TD006 = caseFromRm100.CType1NO; // 案件規格
        this.TD007 = '2100'; // 案件庫別
        this.TD008 = '1.000'; // 訂單數量
        this.TD009 = '0.000'; // 已交數量
        this.TD010 = '式'; // 單位
        this.TD011 = ''+caseFromRm100.orderEstimateIncome; // 單價
        this.TD012 = ''+round(caseFromRm100.orderEstimateIncome); // 金額
        this.TD013 = this.CREATE_DATE; // 預交日 隨便、不重要
        this.TD016 = 'N'; // 結案碼
        this.TD020 = caseFromRm100.CaseNo; // 備註
        this.TD021 = 'Y'; // 確認碼
        this.TD022 = '0.000'; // 庫存數量
        this.TD024 = '0.000'; // 贈品量
        this.TD025 = '0.000'; // 贈品已交量
        this.TD026 = '1.0000'; // 折扣率
        this.TD027 = caseFromRm100.DTeam.slice(0, 9); // 專案代號=屬性組
        this.TD030 = '0.000'; // 毛重
        this.TD031 = '0.000'; // 材積
        this.TD032 = '1'; // 訂單包裝數量
        this.TD033 = '0.000'; // 已交包裝數量
        this.TD034 = '0.000'; // 贈品包裝量
        this.TD035 = '0.000'; // 贈品已交包裝量
        this.TD036 = '0.000'; // 包裝單位
        this.TD099 = '1'; // 品號稅別
        this.TD040 = '0.000000'; // 排放源數量
    };
}

class NoninitialCOPTD { // 20240201-ok
    constructor(caseFromRm100) {
        this.transaction = caseFromRm100.transaction;
        this.dbConn = caseFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        // this.CREATE_PRID = 'ERPsyncServer'; 
        // this.MODI_TIME = ;				
        // this.MODI_AP = ;
        // this.MODI_PRID = ;
        // this.EF_ERPMA001 = ;
        // this.EF_ERPMA002 = ;
        this.TD001 = caseFromRm100.TD001; // 訂單單別
        this.TD002 = caseFromRm100.TD002; // 訂單單號：是日期+當日流水號 1121214+001
        this.TD003 = caseFromRm100.TD003; // 案件於該訂單的序號(流水號): 0001~...
        this.TD004 = caseFromRm100.DTeam; // 案件品號MB001
        this.TD005 = caseFromRm100.CaseName; // 案件品名
        this.TD006 = caseFromRm100.CType1NO; // 案件規格 = 派工單單號
        this.TD007 = '2100'; // 案件庫別
        this.TD008 = '1.000'; // 訂單數量
        this.TD009 = '0.000'; // 已交數量
        this.TD010 = '式'; // 單位
        this.TD011 = ''+caseFromRm100.orderEstimateIncome; // 單價
        this.TD012 = ''+round(caseFromRm100.orderEstimateIncome); // 金額
        this.TD013 = this.CREATE_DATE; // 預交日
        this.TD016 = 'N'; // 自動結案
        this.TD020 = caseFromRm100.CaseNo;
        this.TD021 = 'Y'; // 確認碼
        this.TD022 = '0.000'; // 庫存數量
        this.TD024 = '0.000'; // 贈品量
        this.TD025 = '0.000'; // 贈品已交量
        this.TD026 = '1.0000'; // 折扣率
        this.TD027 = caseFromRm100.DTeam.slice(0, 9); // 專案代號=屬性組
        this.TD030 = '0.000'; // 毛重
        this.TD031 = '0.000'; // 材積
        this.TD032 = '1'; // 訂單包裝數量
        this.TD033 = '0.000'; // 已交包裝數量
        this.TD034 = '0.000'; // 贈品包裝量
        this.TD035 = '0.000'; // 贈品已交包裝量
        this.TD036 = '0.000'; // 包裝單位
        this.TD099 = '1'; 
        this.TD040 = '0.000000';
    };
}

class COPTG { // 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE; 
        this.FLAG = '1';
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.TG001 = caseDoneFromRm100.TG001; // 銷貨單單別
        this.TG002 = caseDoneFromRm100.TG002; // 銷貨單單號：是銷貨單日期+當日流水號 1121214+001
        this.TG003 = caseDoneFromRm100.relClosedateReplaceAll;// 單據日期:完工日期
        this.TG004 = caseDoneFromRm100.clientNumber; // 客戶代號
        this.TG005 = caseDoneFromRm100.department;// 部門代號
        this.TG007 = caseDoneFromRm100.clientName; // 客戶全名
        this.TG010 = '001'; // 出貨廠別
        this.TG011 = 'NTD'; // 
        this.TG012 = '1.000000000'; // 匯率
        this.TG013 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05); // 原幣銷貨金額 = 單身原幣未稅金額加總
        this.TG015 = '03775007'; // 客戶統編: 03775007
        this.TG016 = '2'; // 發票聯數
        this.TG017 = '1'; // 課稅別
        this.TG020 = caseDoneFromRm100.dTeam_succ; // 備註 = dteam + succ
        this.TG022 = '0'; // 列印次數
        this.TG023 = 'Y'; // 確認碼
        this.TG024 = 'N'; // 更新碼
        this.TG025 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome*0.05/1.05); // 原幣銷貨稅額 = 原幣稅額加總
        this.TG030 = 'N'; // 發票作廢
        this.TG031 = '1'; // 通關方式
        this.TG032 = '0'; // 件數
        this.TG033 = '1.000'; // 總數量
        this.TG034 = 'N'; // 現銷
        this.TG036 = 'Y'; // 產生分錄碼(收入)
        this.TG037 = 'N'; // 產生分錄碼(成本)
        this.TG038 = this.TG003.slice(0, 6); // 申報年月 年+月 = 完工日期
        this.TG041 = '0'; // 發票列印次數
        this.TG042 = this.TG003; // 單據日期
        this.TG043 = 'Server'; // 確認者 max_length = 10
        this.TG044 = '0.0500'; // 營業稅額
        this.TG045 = this.TG013; // 本幣銷貨金額
        this.TG046 = this.TG025; // 本幣銷貨稅額
        this.TG047 = 'N'; // 簽核狀態碼
        this.TG049 = caseDoneFromRm100.clientName; // 工程名稱(送貨客戶全名)
        this.TG055 = '0.000000'; // 預留欄位
        this.TG056 = '1'; // 交易條件
        this.TG057 = '0.000'; // 總包裝數量
        this.TG058 = '0'; // 傳送次數
        this.TG063 = '0.000000'; // 沖抵金額
        this.TG064 = '0.000000'; // 衝抵稅額
        this.TG065 = '2T01'; // 付款條件代號
        this.TG068 = '4'; // 配送時段
        this.TG070 = '0.000000'; // 代收貨款
        this.TG071 = '0.000000'; // 運費
        this.TG072 = 'N'; // 產生貨運文字檔
        this.TG132 = '0'; // 買受人適用零稅率註記
        this.TG091 = '0.000000'; // 原幣應稅銷售額
        this.TG092 = '0.000000'; // 原幣免稅銷售額
        this.TG093 = '0.000000'; // 本幣應稅銷售額
        this.TG094 = '0.000000'; // 本幣免稅銷售額
    }
}

class FirstCOPTH { // 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.TH001 = caseDoneFromRm100.TG001; // 銷貨單單別
        this.TH002 = caseDoneFromRm100.TG002; // 銷貨單單號：是日期+當日流水號 1121214+001
        this.TH003 = '0001';// 案件於該銷貨單的序號(流水號): 0001~...
        this.TH004 = caseDoneFromRm100.DTeam; // 品號
        this.TH005 = caseDoneFromRm100.CaseName; // 品名
        this.TH006 = caseDoneFromRm100.CType1NO; // 規格
        this.TH007 = '2100'; // 庫別
        this.TH008 = '1.000'; // 數量
        this.TH009 = '式'; //
        this.TH010 = '0.000'; // 庫存數量
        this.TH012 = ''+caseDoneFromRm100.salesSlipActualIncome; // 單價
        this.TH013 = ''+caseDoneFromRm100.roundSalesSlipActualIncome; // 金額
        this.TH014 = caseDoneFromRm100.orderType; // 訂單單別
        this.TH015 = caseDoneFromRm100.orderHeadNo; // 訂單單號
        this.TH016 = caseDoneFromRm100.orderBodyNo; // 訂單序號
        this.TH018 = caseDoneFromRm100.dTeam_succ;// 備註 = dteam + succ
        this.TH020 = 'Y'; // 確認碼
        this.TH021 = 'N'; // 更新碼
        this.TH024 = '0.000'; // 贈/備品量
        this.TH025 = '1.0000'; // 折扣率
        this.TH026 = 'N'; // 結帳碼
        this.TH027 = ''; // 結帳單別
        this.TH028 = ''; // 結帳單號
        this.TH029 = ''; // 結帳序號
        this.TH030 = caseDoneFromRm100.DTeam.slice(0, 9); // 專案代號
        this.TH031 = '1'; // 類型
        this.TH035 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05); // 原幣未稅金額
        this.TH036 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome*0.05/1.05); // 原幣稅額
        this.TH037 = this.TH035; // 本幣未稅金額
        this.TH038 = this.TH036; // 本幣稅額
        this.TH042 = '0.000'; // 包裝數量
        this.TH043 = '0.000'; // 贈/備品包裝量
        this.TH057 = '0'; // 產品序號數量
        this.TH078 = caseDoneFromRm100['廠商名稱']; // 排放源 2024-04-18 增加拆帳廠商於銷貨單中
        this.TH079 = ''+caseDoneFromRm100['管理費拆帳比例']; // 排放源數量 2024-04-18 增加拆帳廠商於銷貨單中
        this.TH080 = ''+caseDoneFromRm100['保留款拆帳比例']; // 排放源單位 2024-04-18 增加拆帳廠商於銷貨單中
        this.TH099 = '1'; // 品號稅別
    }
}

class NoninitialCOPTH { // 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.TH001 = caseDoneFromRm100.TH001; // 銷貨單單別
        this.TH002 = caseDoneFromRm100.TH002; // 銷貨單單號：是日期+當日流水號 1121214+001
        this.TH003 = caseDoneFromRm100.TH003; // 案件於該訂單的序號(流水號): 0001~...
        this.TH004 = caseDoneFromRm100.DTeam; // 品號
        this.TH005 = caseDoneFromRm100.CaseName; // 品名
        this.TH006 = caseDoneFromRm100.CType1NO; // 規格
        this.TH007 = '2100'; // 庫別
        this.TH008 = '1.000'; // 數量
        this.TH009 = '式'; //
        this.TH010 = '0.000'; // 庫存數量
        this.TH012 = ''+caseDoneFromRm100.salesSlipActualIncome; // 單價
        this.TH013 = ''+caseDoneFromRm100.roundSalesSlipActualIncome; // 金額
        this.TH014 = caseDoneFromRm100.orderType; // 訂單單別 
        this.TH015 = caseDoneFromRm100.orderHeadNo; // 訂單單號
        this.TH016 = caseDoneFromRm100.orderBodyNo; // 訂單序號
        this.TH018 = caseDoneFromRm100.dTeam_succ;// 備註 = dteam + succ
        this.TH020 = 'Y'; // 確認碼
        this.TH021 = 'N'; // 更新碼
        this.TH024 = '0.000'; // 贈/備品量
        this.TH025 = '1.0000'; // 折扣率
        this.TH026 = 'N'; // 結帳碼
        this.TH027 = ''; // 結帳單別
        this.TH028 = ''; // 結帳單號
        this.TH029 = ''; // 結帳序號
        this.TH030 = caseDoneFromRm100.DTeam.slice(0, 9); // 專案代號
        this.TH031 = '1'; // 類型 (贈品)
        this.TH035 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05); // 原幣未稅金額
        this.TH036 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome*0.05/1.05); // 原幣稅額
        this.TH037 = this.TH035; // 本幣未稅金額
        this.TH038 = this.TH036; // 本幣稅額
        this.TH042 = '0.000'; // 包裝數量
        this.TH043 = '0.000'; // 贈/備品包裝量
        this.TH057 = '0'; // 產品序號數量
        this.TH099 = '1'; // 品號稅別
        this.TH078 = caseDoneFromRm100['廠商名稱']; // 排放源 2024-04-18 增加拆帳廠商於銷貨單中
        this.TH079 = ''+caseDoneFromRm100['管理費拆帳比例']; // 排放源數量 2024-04-18 增加拆帳廠商於銷貨單中
        this.TH080 = ''+caseDoneFromRm100['保留款拆帳比例']; // 排放源單位 2024-04-18 增加拆帳廠商於銷貨單中
    }
}

class miscellaneousCostToCOPTH { // price-ok
    constructor(miscellaneousCost, miscellaneousCosts) {
        this.transaction = miscellaneousCosts.transaction;
        this.dbConn = miscellaneousCosts.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = miscellaneousCosts.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = miscellaneousCosts.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.TH001 = miscellaneousCosts.TH001; // 銷貨單單別
        this.TH002 = miscellaneousCosts.TH002; // 銷貨單單號：是日期+當日流水號 1121214+001
        this.TH003 = miscellaneousCosts.TH003 < 10 ? '000' + miscellaneousCosts.TH003 : miscellaneousCosts.TH003 < 100 ? '00' + miscellaneousCosts.TH003 : miscellaneousCosts.TH003 < 1000 ? '0' + 
        miscellaneousCosts.TH003 : miscellaneousCosts.TH003 < 10000 ? miscellaneousCosts.TH003.toString() : undefined; // 案件於該訂單的序號(流水號): 0001~...
        this.TH004 = miscellaneousCost.itemId; // 品號
        this.TH005 = miscellaneousCost.itemName; // 品名
        this.TH007 = '2100'; // 庫別
        this.TH008 = '1.000'; // 數量
        this.TH009 = '式'; //
        this.TH010 = '0.000'; // 庫存數量
        this.TH012 = ''+miscellaneousCost.cost; // 單價
        this.TH013 = ''+round(miscellaneousCost.cost); // 金額
        this.TH018 = miscellaneousCosts.dTeam_succ;// 備註 = dteam + succ
        this.TH020 = 'Y'; // 確認碼
        this.TH021 = 'N'; // 更新碼
        this.TH024 = '0.000'; // 贈/備品量
        this.TH025 = '1.0000'; // 折扣率
        this.TH026 = 'N'; // 結帳碼
        this.TH030 = miscellaneousCosts.TH030; // 專案代號
        this.TH031 = '1'; // 類型 (贈品)
        this.TH035 = ''+round(round(miscellaneousCost.cost)/1.05); // 原幣未稅金額
        this.TH036 = ''+round(round(miscellaneousCost.cost)*0.05/1.05); // 原幣稅額
        this.TH037 = this.TH035; // 本幣未稅金額
        this.TH038 = this.TH036; // 本幣稅額
        this.TH042 = '0.000'; // 包裝數量
        this.TH043 = '0.000'; // 贈/備品包裝量
        this.TH057 = '0'; // 產品序號數量
        this.TH099 = '1'; // 品號稅別
        this.TH079 = '0.000000'; // 排放源數量
    }
}

class SalesSlipToINVLD { // 20240201-ok
    // 有專案代號且確認銷貨單後才會產生
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.LD001 = caseDoneFromRm100.DTeam.slice(0, 9); // 專案代號
        this.LD002 = caseDoneFromRm100.DTeam; // 品號
        this.LD003 = caseDoneFromRm100.relClosedateReplaceAll; // 單據日期(銷貨單)
        this.LD004 = '-1'; // 入出別
        this.LD005 = caseDoneFromRm100.TH001; // 單據單別(銷貨單)
        this.LD006 = caseDoneFromRm100.TH002; // 單據單號(銷貨單)
        this.LD007 = caseDoneFromRm100.TH003; // 單據序號
        this.LD008 = '2100'; // 庫別
        this.LD009 = '2'; // 異動別 
        this.LD010 = '1.000'; // 數量
        this.LD011 = '0.000000'; // 單位成本
        this.LD012 = ''+caseDoneFromRm100.roundSalesSlipActualIncome; // 金額 = 銷貨單金額
        this.LD013 = caseDoneFromRm100.dTeam_succ; // 備註
        this.LD014 = '0.000'; // 包裝數量
    }
}

class MiscellaneousCostToINVLD { // price-ok
    // 有專案代號且確認銷貨單後才會產生
    constructor(miscellaneousCost, miscellaneousCosts) {
        this.transaction = miscellaneousCosts.transaction;
        this.dbConn = miscellaneousCosts.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = miscellaneousCosts.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = miscellaneousCosts.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.LD001 = miscellaneousCosts.TH030; // 專案代號
        this.LD002 = miscellaneousCost.itemId; // 品號
        this.LD003 = miscellaneousCosts.salesSlipDate; // 單據日期=銷貨單日期
        this.LD004 = '-1'; // 入出別
        this.LD005 = miscellaneousCosts.TH001; // 單據單別(銷貨單)
        this.LD006 = miscellaneousCosts.TH002; // 單據單號(銷貨單)
        this.LD007 = miscellaneousCosts.TH003 < 10 ? '000' + miscellaneousCosts.TH003 : miscellaneousCosts.TH003 < 100 ? '00' + miscellaneousCosts.TH003 : miscellaneousCosts.TH003 < 1000 ? '0' + 
        miscellaneousCosts.TH003 : miscellaneousCosts.TH003 < 10000 ? miscellaneousCosts.TH003.toString() : undefined; // 單據序號
        this.LD008 = '2100'; // 庫別
        this.LD009 = '2'; // 異動別 
        this.LD010 = '1.000'; // 數量
        this.LD011 = '0.000000'; // 單位成本
        this.LD012 = ''+round(miscellaneousCost.cost); // 金額 // 銷貨單金額!=銷貨單單價
        this.LD013 = ''; // 備註
        this.LD014 = '0.000'; // 包裝數量
    }
}

class OrderBodyToCOPMB { // 20240201-ok
    constructor(caseFromRm100) {
        this.transaction = caseFromRm100.transaction;
        this.dbConn = caseFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.MB001 = 'A'+caseFromRm100.DTeam.slice(0, 9); // 訂單單頭客戶代號
        this.MB002 = caseFromRm100.DTeam; // 品號
        this.MB003 = '式'; // 計價單位
        this.MB004 = 'NTD'; // 幣別
        this.MB007 = 'N'; // 分量計價
        this.MB008 = ''+caseFromRm100.orderEstimateIncome; // 訂單單價=>(銷貨單單價/1.05)取小數後兩位
        this.MB009 = this.CREATE_DATE; // 核價日
        this.MB010 = '';
        this.MB012 = caseFromRm100.CaseNo; // 備註
        this.MB013 = 'Y'; // 含稅
        this.MB014 = '';
        this.MB015 = '0.000000'; //  佣金單價
        this.MB016 = '0.0000'; // 佣金百分比
        this.MB017 = this.CREATE_DATE; // 生效日
        this.MB019 = '1'; // 交易條件
    }
}

class MiscellaneousCostToCOPMB { // 20240201-ok
    constructor(miscellaneousCost, miscellaneousCosts) {
        this.transaction = miscellaneousCosts.transaction;
        this.dbConn = miscellaneousCosts.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = miscellaneousCosts.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = miscellaneousCosts.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.MB001 = 'A'+miscellaneousCosts.TH030; // 訂單單頭客戶代號
        this.MB002 = miscellaneousCost.itemId; // 品號
        this.MB003 = '式'; // 計價單位
        this.MB004 = 'NTD'; // 幣別
        this.MB007 = 'N'; // 分量計價
        this.MB008 = ''+roundToTwo(miscellaneousCost.cost/1.05); // 單價 = 銷貨單單價/1.05取小數後兩位
        this.MB009 = miscellaneousCosts.salesSlipDate; // 核價日 = 銷貨單/回報單日期
        this.MB010 = miscellaneousCosts.salesSlipDate; // 銷貨單 = 回報單日期
        this.MB012 = ''; // 備註dteam_succ
        this.MB013 = 'Y'; // 含稅
        this.MB014 = miscellaneousCosts.salesSlipDate; // 銷貨單 = 回報單日期
        this.MB015 = '0.000000'; //  佣金單價
        this.MB016 = '0.0000'; // 佣金百分比
        this.MB017 = miscellaneousCosts.salesSlipDate; // 生效日 = 銷貨單/回報單日期
        this.MB019 = '1'; // 交易條件
    }
}

class salesSlipHeadToAJSLA { // 來源單據記錄檔 20240130-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; 
        this.LA001 = caseDoneFromRm100.LA001;// 底稿批號=PCB serialNo
        this.LA002 = '0001';// 底稿序號
        this.LA003 = caseDoneFromRm100.TG001;// 銷貨單單別
        this.LA004 = caseDoneFromRm100.TG002;// 銷貨單單號
        this.LA005 = caseDoneFromRm100.relClosedateReplaceAll;// 銷貨單單據日期
        this.LA006 = '****';// 序號
        this.LA007 = '********************';// 票號
    }
}

class salesSlipHeadToAJSTA { // 分錄底稿單頭檔 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.TA001 = caseDoneFromRm100.LA001;// 底稿批號
        this.TA002 = '0001';// 底稿序號
        this.TA003 = this.CREATE_TIME.slice(0, 5);// 產生時間
        this.TA004 = '9101'// 傳票單別
        this.TA005 = caseDoneFromRm100.AJSTA005;// 會計傳票單號
        this.TA006 = caseDoneFromRm100.relClosedateReplaceAll;// 會計傳票日期=銷貨單日期
        this.TA007 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);// 傳票金額 = 原幣銷貨金額
        this.TA008 = this.TA007;// 本幣借方總金額
        this.TA009 = this.TA007;// 本幣貸方總金額
        this.TA010 = caseDoneFromRm100.dTeam_succ; // 備註 = dteam + succ
        this.TA011 = 'ERPsyncServer'// 拋轉人員
        this.TA012 = this.CREATE_DATE;// 拋轉日期
        this.TA013 = this.TA003;// 拋轉時間
        this.TA014 = 'Y'// 拋轉碼
        this.TA015 = '23'// 單據性質
        this.TA016 = '1'// 分錄類別
    }
}

class salesSlipHeadToAJSTBincome { // 分錄底稿單身檔(TB004=借) 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.TB001 = caseDoneFromRm100.LA001;// 底稿批號
        this.TB002 = '0001'// 底稿序號
        this.TB003 = '0010'// 序號
        this.TB004 = '1'// 借貸別
        this.TB005 = '1199'// 科目編號
        this.TB006 = '';// 部門
        this.TB007 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);// 本幣金額
        this.TB008 = caseDoneFromRm100.clientNumber;// 立沖帳目(一)
        this.TB010 = caseDoneFromRm100.dTeam_succ;// 摘要 = dteam + succ
        this.TB011 = caseDoneFromRm100.DTeam.slice(0, 9);// 專案代號
        this.TB013 = caseDoneFromRm100.TG001;// 銷貨單單別
        this.TB014 = caseDoneFromRm100.TG002;// 單號
        this.TB015 = 'NTD'// 幣別
        this.TB016 = '1.000000000'// 匯率
        this.TB017 = this.TB007;// 原幣金額
        this.TB019 = caseDoneFromRm100.AJSTB019;// 立沖帳一名稱 
        this.TB020 = '0.000000'// 預留欄位
        this.TB027 = '0010'// 傳票序號
    }
}

class salesSlipHeadToAJSTBexpenditure { // 分錄底稿單身檔(TB004=貸) 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.TB001 = caseDoneFromRm100.LA001;// 底稿批號
        this.TB002 = '0001'// 底稿序號
        this.TB003 = '0020'// 序號
        this.TB004 = '-1'// 借貸別
        this.TB005 = '4111'// 科目編號
        this.TB006 = caseDoneFromRm100.department;// 部門
        this.TB007 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);// 本幣金額
        this.TB008 = '';// 立沖帳目(一)
        this.TB010 = caseDoneFromRm100.dTeam_succ;// 摘要
        this.TB011 = caseDoneFromRm100.DTeam.slice(0, 9);// 專案代號
        this.TB013 = caseDoneFromRm100.TG001;// 單別
        this.TB014 = caseDoneFromRm100.TG002;// 單號
        this.TB015 = 'NTD'// 幣別
        this.TB016 = '1.000000000'// 匯率
        this.TB017 = this.TB007;// 原幣金額
        this.TB019 = '';// 立沖帳一名稱
        this.TB020 = '0.000000'// 預留欄位
        this.TB027 = '0020'// 傳票序號
    }
}

class salesSlipHeadToACTTA { // 會計傳票單頭檔 20240201-ok 
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostcaseDoneFromRm100name/username of server
        this.TA001 = '9101'// 傳票單別
        this.TA002 = caseDoneFromRm100.AJSTA005;// 傳票單號
        this.TA003 = caseDoneFromRm100.relClosedateReplaceAll;// 傳票日期
        this.TA006 = 'F'// 來源碼
        this.TA007 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);// 本幣借方總金額
        this.TA008 = this.TA007;// 本幣貸方總金額
        this.TA009 = caseDoneFromRm100.dTeam_succ;// 備註 = dteam + succ
        this.TA010 = 'Y'// 確認碼
        this.TA011 = 'Y'// 過帳碼
        this.TA012 = '0'// 列印次數
        this.TA014 = this.CREATE_DATE;// 確認日
        this.TA015 = 'ERPsyncServer'// 確認者
        this.TA016 = 'N'// 簽核狀態碼
        this.TA017 = '0'// 傳送次數
    }
}

class salesSlipHeadToACTTBincome { // 會計傳票單身檔(TB004=借) 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.TB001 = '9101'// 傳票單別
        this.TB002 = caseDoneFromRm100.AJSTA005;// 傳票單號
        this.TB003 = '0010'// 序號
        this.TB004 = '1'// 借貸別
        this.TB005 = '1199'// 科目編號
        this.TB006 = ''// 部門代號
        this.TB007 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);// 本幣金額
        this.TB008 = caseDoneFromRm100.clientNumber;// 立沖帳目(一)
        this.TB010 = caseDoneFromRm100.dTeam_succ;// 摘要 = dteam + succ
        this.TB011 = caseDoneFromRm100.DTeam.slice(0, 9);// 專案代號
        this.TB013 = 'NTD'// 幣別
        this.TB014 = '1.000000000'// 匯率
        this.TB015 = this.TB007;// 原幣金額
        this.TB016 = caseDoneFromRm100.AJSTB019;// 立沖帳一名稱
        this.TB019 = '0.000'// 預留欄位
        this.TB020 = '0.000000'// 預留欄位
    }
}

class salesSlipHeadToACTTBexpenditure { // 會計傳票單身檔(TB004=貸) 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.TB001 = '9101'// 傳票單別
        this.TB002 = caseDoneFromRm100.AJSTA005;// 傳票單號
        this.TB003 = '0020'// 序號
        this.TB004 = '-1'// 借貸別
        this.TB005 = '4111'// 科目編號
        this.TB006 = caseDoneFromRm100.department;// 部門代號
        this.TB007 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);// 本幣金額
        this.TB008 = ''// 立沖帳目(一)
        this.TB010 = caseDoneFromRm100.dTeam_succ;// 摘要 = dteam + succ
        this.TB011 = caseDoneFromRm100.DTeam.slice(0, 9);// 專案代號
        this.TB013 = 'NTD'// 幣別
        this.TB014 = '1.000000000'// 匯率
        this.TB015 = this.TB007;// 原幣金額
        this.TB016 = ''// 立沖帳一名稱
        this.TB019 = '0.000'// 預留欄位
        this.TB020 = '0.000000'// 預留欄位
    }
}

class salesSlipHeadToACTMLincome { // 分類帳檔(ML007=借) 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.ML001 = '1199'// 統制科目編號
        this.ML002 = caseDoneFromRm100.relClosedateReplaceAll;// 傳票日期
        this.ML003 = '9101'// 會計傳票單別
        this.ML004 = caseDoneFromRm100.AJSTA005;// 會計傳票單號
        this.ML005 = '0010'// 序號
        this.ML006 = '1199'// 明細科目編號
        this.ML007 = '1'// 借貸別
        this.ML008 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);// 本幣金額
        this.ML009 = caseDoneFromRm100.dTeam_succ;// 摘要 = dteam + succ
        this.ML010 = ''// 部門
        this.ML011 = caseDoneFromRm100.DTeam.slice(0, 9);// 專案代號
        this.ML012 = 'NTD'// 幣別
        this.ML013 = '1.000000000'// 匯率
        this.ML014 = this.ML008;// 原幣金額
    }
}

class salesSlipHeadToACTMLexpenditure { // 分類帳檔(ML007=貸) 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.ML001 = '4111'// 統制科目編號
        this.ML002 = caseDoneFromRm100.relClosedateReplaceAll;// 傳票日期
        this.ML003 = '9101'// 傳票單別
        this.ML004 = caseDoneFromRm100.AJSTA005;// 傳票單號
        this.ML005 = '0020'// 序號
        this.ML006 = '4111'// 明細科目編號
        this.ML007 = '-1'// 借貸別: 貸
        this.ML008 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);// 本幣金額
        this.ML009 = caseDoneFromRm100.dTeam_succ;// 摘要
        this.ML010 = caseDoneFromRm100.department// 部門
        this.ML011 = caseDoneFromRm100.DTeam.slice(0, 9);// 專案代號
        this.ML012 = 'NTD'// 幣別
        this.ML013 = '1.000000000'// 匯率
        this.ML014 = this.ML008;// 原幣金額
    }
}

class salesSlipHeadToACTMN { // 立沖帳目分類帳檔 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; 
        this.MN001 = '1199'; // 科目編號
        this.MN002 = '1'// 立沖帳目順序
        this.MN003 = caseDoneFromRm100.clientNumber;// 立沖帳目代號
        this.MN004 = caseDoneFromRm100.relClosedateReplaceAll;// 傳票日期 = 銷貨單日期
        this.MN005 = '9101'// 傳票單別
        this.MN006 = caseDoneFromRm100.AJSTA005;// 傳票單號
        this.MN007 = '0010'// 序號
        this.MN008 = '1'// 借貸別
        this.MN009 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);// 本幣金額
        this.MN010 = caseDoneFromRm100.dTeam_succ// 摘要 = dteam + succ
        this.MN011 = ''// 部門
        this.MN012 = 'NTD'// 幣別
        this.MN013 = '1.000000000'// 匯率
        this.MN014 = this.MN009// 原幣金額
        this.MN015 = caseDoneFromRm100.AJSTB019;// 立沖帳目名稱
        this.MN016 = '0.000'// 預留欄位
        this.MN017 = '0.000000'// 預留欄位
        this.MN018 = '0.000000'// 已沖本幣金額
        this.MN019 = '0.000000'// 已沖原幣金額
        this.MN020 = 'N'// 結案碼
    }
}

class salesSlipHeadToACTMM { // 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.MM001 = '1199'// 科目編號
        this.MM002 = '1'// 立沖帳目順序
        this.MM003 = caseDoneFromRm100.clientNumber;// 立沖帳目代號
        this.MM004 = caseDoneFromRm100.incomeYear;// 會計年度
        this.MM005 = caseDoneFromRm100.incomeMonth;// 期別
        this.MM006 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);// 借方金額
        this.MM007 = '0.000000'// 貸方金額
        this.MM008 = '1'// 借方筆數
        this.MM009 = '0'// 貸方筆數
    }
}

class salesSlipHeadToACTMB1199 { // 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.MB001 = '1199'// 科目編號
        this.MB002 = caseDoneFromRm100.incomeYear;// 會計年度
        this.MB003 = caseDoneFromRm100.incomeMonth;// 期別
        this.MB004 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);// 本幣借方金額
        this.MB005 = '0.000000'// 本幣貸方金額
        this.MB006 = '1'// 借方筆數
        this.MB007 = '0'// 貸方筆數
        this.MB008 = 'NTD'// 幣別
        this.MB009 = this.MB004;// 原幣借方金額
        this.MB010 = '0.000000';// 原幣貸方金額
    }
}

class salesSlipHeadToACTMB4111 { // 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.MB001 = '4111'// 科目編號
        this.MB002 = caseDoneFromRm100.incomeYear;// 會計年度
        this.MB003 = caseDoneFromRm100.incomeMonth;// 期別
        this.MB004 = '0.000000';// 本幣借方金額
        this.MB005 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);// 本幣貸方金額
        this.MB006 = '0';// 借方筆數
        this.MB007 = '1'// 貸方筆數
        this.MB008 = 'NTD'// 幣別
        this.MB009 = '0.000000'// 原幣借方金額
        this.MB010 = this.MB005// 原幣貸方金額
    }
}

class salesSlipHeadACTMD { // 20240201-ok
    constructor(caseDoneFromRm100) {
        this.transaction = caseDoneFromRm100.transaction;
        this.dbConn = caseDoneFromRm100.dbConn;
        this.COMPANY = 'SDG';
        this.CREATOR = 'ERPsyncServer';
        this.USR_GROUP = 'MIS';
        this.CREATE_DATE = caseDoneFromRm100.CREATE_DATE;
        this.FLAG = '1'; // 修改次數
        this.CREATE_TIME = caseDoneFromRm100.CREATE_TIME;
        this.CREATE_AP = 'DS223j'; // hostname/username of server
        this.MD001 = '4111'// 科目編號
        this.MD002 = caseDoneFromRm100.department;// 部門代號
        this.MD003 = caseDoneFromRm100.incomeYear;// 會計年度
        this.MD004 = caseDoneFromRm100.incomeMonth;// 期別
        this.MD005 = '0.000000';// 本幣借方金額
        this.MD006 = ''+round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);// 本幣貸方金額
        this.MD007 = 'NTD';// 幣別
        this.MD008 = '0.000000';// 原幣借方金額
        this.MD009 = this.MD006;// 原幣貸方金額
    }
}

module.exports = { CaseMap, COPTC, FirstCOPTD, NoninitialCOPTD, COPTG, FirstCOPTH, NoninitialCOPTH, SalesSlipToINVLD, OrderBodyToCOPMB, miscellaneousCostToCOPTH, 
    MiscellaneousCostToCOPMB, MiscellaneousCostToINVLD, salesSlipHeadToAJSLA, salesSlipHeadToAJSTA, salesSlipHeadToAJSTBexpenditure, salesSlipHeadToAJSTBincome, 
    salesSlipHeadToACTTA, salesSlipHeadToACTTBincome, salesSlipHeadToACTTBexpenditure, salesSlipHeadToACTMLincome, salesSlipHeadToACTMLexpenditure, salesSlipHeadToACTMN, 
    salesSlipHeadToACTMB1199, salesSlipHeadToACTMB4111, salesSlipHeadToACTMM, salesSlipHeadACTMD };
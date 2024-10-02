const Spoke = require("../Models/Spoke");
const utils = require("../controllers/utils");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const service_account = require("../linnk-366101-e44baeb100f9.json")
const {JWT} = require("google-auth-library")
const Bluebird = require("bluebird");
const Component = require("../Models/Components")
exports.createPOFromGoogleSheet = async (req, res) => {
    try {
      // const sheet = new GoogleSpreadsheet(process.env.ALUMINIUMCONFIGSHEETID);
      // await sheet.useServiceAccountAuth(service_account);
   
  
//       import { GoogleSpreadsheet } from 'google-spreadsheet';
// import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
    email: service_account.client_email,
    key: service_account.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});
const sheet = new GoogleSpreadsheet(process.env.ALUMINIUMCONFIGSHEETID, serviceAccountAuth);
const sheetinfo = await sheet.loadInfo();
      const worksheet = sheet.sheetsByIndex[0];
      const rows = await worksheet.getRows();
      // console.log(rows.toObject())
      // const _rowIndex = 1;
  data=[]
     await Bluebird.each(rows, async (rowData, _rowIndex) => {
        _rowData = rowData.toObject()
        // console.log(_rowData)
        data.push({"componentName":_rowData.Reference,"compShortName":_rowData.Reference,"compPartNo":_rowData.Reference,"compDescription":_rowData.Description,"isCritical":_rowData['Core / Non core']=='Non-Core'?false:true})
      })  
      console.log(data)    
      await Component.insertMany(data[0])
      utils.commonResponse(res,200,"success",{})
    } catch (error) {
      console.log(error)
      utils.commonResponse(res, 500, "server error", error.toString());
    }
  };
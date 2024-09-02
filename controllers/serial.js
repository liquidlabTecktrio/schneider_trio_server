const componentSerialNo = require("../Models/componentSerialNo")
const utils = require("../controllers/utils")

exports.generateComponentSerialNo = async(req,res)=>{
    try{
const {hubID, componentID, qnty} = req.body;

await componentSerialNo.findOneAndUpdate({
    componentID:componentID,
    hubSerialNo:{
        $elemMatch:{
            hubID:hubID
        }
    }
},{
"hubSerialNo.$.serialNo":{$inc:{serialNo:qnty}}
}

)


    } catch (error) {
        utils.commonResponse(res,500,"Unexpected server error",error.toString())
    }
}
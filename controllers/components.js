const Components = require("../Models/Components")
const componentSerialNo = require("../Models/componentSerialNo")
const utils = require("../controllers/utils")
exports.createComponent = async(req,res)=>{

    try {
        const { componentName, compShortName, compPartNo, compDescription } =
      req.body;

    //   console.log(req.body)
      itemCheck = await Components.findOne({compPartNo:compPartNo});

      if(itemCheck)
      {
          utils.commonResponse(res, 201, "Item with same part number available available in the system",itemCheck );
      }
    
    Components.create({componentName,compShortName,compPartNo,compDescription}).then(async (component)=>{
        await componentSerialNo.create({componentID:component._id,hubSerialNo:[]})
        utils.commonResponse(res,200,"component created successfully",component)
    }).catch((error)=>{
        utils.commonResponse(res,500,"Unexpected server error",error.toString())
    })




      


    } catch (error) {
        utils.commonResponse(res,500,"Unexpected server error",error.toString())
    }

}

exports.getAllComponents = async(req,res)=>{
    try {
        const allComponents = await Components.find();
        utils.commonResponse(res, 200, "All hubs fetched successfully",allComponents);

    } catch (error) {
        utils.commonResponse(res,500,"Unexpected server error",error.toString())
    }
}
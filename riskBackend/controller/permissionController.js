const {  getList,getRolepermission,updateRolepermission,deleterolepermission,
    getpermissionbyID,getModule,addRolepermission} = require('../models/permission');
const Joi = require('joi');
exports.addRolepermission = (async (req, res) => {
    try {
        const { id,user_id, add} = req.body;
        const delete1 = req.body.delete;
        const schema = Joi.alternatives(
            Joi.object({
                id: Joi.number().empty().required().messages({
                    "string.empty": "id can't be empty",
                    "string.required": "id is required",
                }),
                user_id: Joi.number().empty().required().messages({
                    "string.empty": "user_id can't be empty",
                    "string.required": "user_id is required",
                }),
                add: Joi.number().empty().required().messages({
                    "string.empty": "add can't be empty",
                    "string.required": "add is required",
                }),
                delete: Joi.number().empty().required().messages({
                    "string.empty": "delete can't be empty",
                    "string.required": "delete is required",
                }),
              
            })
        );
        const result = schema.validate(req.body);

        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 400,

                success: false,
            });
        }
        else {
           
            const result = await updateRolepermission(add,delete1,id,user_id);
            if (result.affectedRows > 0) {
                const roleperm = await getRolepermission(user_id);
                if(roleperm.length !== 0){              
                      const newresult = roleperm.map((item) => {
                          let newresult = {};                        
                          newresult["id"] = item.id;
                          newresult["module_id"] = item.module_id;
                          newresult["permission_id"] = item.permission_id;
                          newresult["type"] = item.type;
                          newresult["view_edit_assign_item"] = item.view_edit_assign_item;
                          newresult["admin_settings"] = item.admin_settings;
                          newresult["delete"] = item.delete;
                          newresult["add"] = item.add;
                          newresult["view"] = item.view;
                          newresult["comments"] = item.comments;
                          newresult["upload"] = item.upload;
                          newresult["user_id"] = item.user_id;            
                          newresult["change_status"] = false;
                          return newresult;
                         
                      })
                      return res.json({
                        message: "Role Permission Added Successfully",
                        status: 200,
                        success: true,
                        data : newresult
    
                    });
                    }else{
                        return res.json({
                            message: "Something went wrong!",
                            status: 400,
                            success: false,
                            data : []
                        });
                    }
               
            }
            else {
                return res.json({
                    message: "Something went wrong!",
                    status: 400,
                    success: false,
                    data : []
                });
            }

        }
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500
        })
    }
});

exports.getRolepermission = (async (req, res) => {
    try {
        const { user_id } = req.body;
      const result = await getRolepermission(user_id);
    //   console.log(result, 'result');
      if(result.length !== 0){
        
            const newresult = result.map((item) => {
                let newresult = {};                        
                newresult["id"] = item.id;
                newresult["module_id"] = item.module_id;
                newresult["permission_id"] = item.permission_id;
                newresult["type"] = item.type;
                newresult["view_edit_assign_item"] = item.view_edit_assign_item;
                newresult["admin_settings"] = item.admin_settings;
                newresult["delete"] = item.delete;
                newresult["add"] = item.add;
                newresult["view"] = item.view;
                newresult["comments"] = item.comments;
                newresult["upload"] = item.upload;
                newresult["user_id"] = item.user_id;            
                newresult["change_status"] = false;
                return newresult;
               
            })
            return res.json({
                message:"Fetch User Permssions",
                status: 200,
                success:true,
                data: newresult
            })

       
      }else {
        return res.json({
            message:"fetch failed",
            status: 400,
            success:false,
            
        })
      }
      
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500
        }) 
    }
})

exports.fetchPermission = (async (req, res) => {
    try {
      const result = await getList();
      if(result.length !== 0){
        return res.json({
            message:"fetch permission list success",
            status: 200,
            success:true,
            data: result
        })
      }
      else {
        return res.json({
            message:"fetch failed",
            status: 400,
            success:false,
            
        })
      }
      
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500
        }) 
    }
})

exports.resetPermission = (async (req, res) => {
    try {
        const { user_id,usertype} = req.body;
        
        const schema = Joi.alternatives(
            Joi.object({
                user_id: Joi.string().empty().required().messages({
                    "string.empty": "user_id can't be empty",
                    "string.required": "user_id is required",
                }),
                usertype: Joi.string().empty().required().messages({
                    "string.empty": "usertype can't be empty",
                    "string.required": "usertype is required",
                }),              
              
            })
        );
        const result = schema.validate(req.body);

        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 400,

                success: false,
            });
        }
        else {

        var curdate = new Date().toISOString().slice(0, 10);

            if(usertype != 0){
                const deletperm = await deleterolepermission(user_id);

                    const module = await getModule();          
                    const getpermission = await getpermissionbyID(usertype); 
                    const permission = getpermission[0]; 
                    if(module.length !=0 && getpermission.length !=0 ){          
                        (async function moduleloop () {                   
                            for (let i = 0; i < module.length; i++) {
                            
                                var module_id = module[i].id;
                                const permission1 = await addRolepermission({
                                    module_id:module_id,
                                    permission_id : permission.id,
                                    view_edit_assign_item :permission.view_edit_assign_item,                
                                    admin_settings:permission.admin_settings,   
                                    delete: permission.delete,
                                    add:permission.add,
                                    view:permission.view,   
                                    comments:permission.comments,   
                                    upload:permission.upload,
                                    user_id:user_id,
                                    created_at:curdate  
                                });
                                console.log(permission1.insertId);
                            }
                        })();    

                          return res.json({
                            message: "Role Permission Added Successfully",
                            status: 200,
                            success: true
                           
                          });                       
                      }                  

                    }else{
                        return res.json({
                            message: "Something went wrong!",
                            status: 400,
                            success: false
                           
                        });
                    }
               
            
          

        }
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500
        })
    }
});
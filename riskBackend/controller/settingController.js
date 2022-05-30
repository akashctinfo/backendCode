const {
    fetchSettingList,
    fetchSettingById,
    updateSettingById,
    addSetting,
    deleteSetting,
    addOptionsSetting,
} = require('../models/setting');
const Joi = require('joi');
const { getData, deleteData } = require('../models/common');

exports.getSettingList = (async (req, res) => {
    try {
        const {user_id, org_id} = req.body;
        const schmea = Joi.alternatives(
            Joi.object({
                user_id: [Joi.number().empty(),Joi.string().empty()],
                org_id: [Joi.number().empty(),Joi.string().empty()],       
            })
        );

        const result = schmea.validate(req.body);
        if(result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 400,
                success: false,
            });
        } else {
            const result = await fetchSettingList(user_id, org_id);
            if(result.length !== 0) {
                return res.json({
                    message: "fetch setting details success",
                    status: 200,
                    success: true,
                    data: result
                })
            } else {
                return res.json({
                    message: "fetch details failed",
                    status: 400,
                    success: false
                })
            }
        }
    } catch {
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500
        })
    }
});


exports.editSetting = (async (req, res) => {
	try {
        const { field_visibility, field_name, custom_label, required_status, id, range_info} = req.body;

        const schema= Joi.alternatives(
            Joi.object({
                field_visibility: [Joi.number().empty(),Joi.string().empty()],
                field_name: [Joi.number().empty(),Joi.string().empty()],
                custom_label: [Joi.number().empty(),Joi.string().empty()],
                required_status: [Joi.number().empty(),Joi.string().empty()],
                id: [Joi.number().empty(),Joi.string().empty()],
                range_info: [Joi.number().optional().allow(''),Joi.string().optional().allow('')]
            })
        );

        const result = schema.validate(req.body);
        if(result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 400,
                success: false
            })
        } else {
            const resultSetting = await fetchSettingById(id);
            if(resultSetting.length !== 0) {
            	let data = {
                    field_visibility: field_visibility? field_visibility: resultSetting[0].field_visibility,
                    field_name: field_name? field_name: resultSetting[0].field_name,
                    custom_label: custom_label? custom_label: resultSetting[0].custom_label,
                    required_status: required_status? required_status: resultSetting[0].required_status,
                    range_info: range_info? range_info: resultSetting[0].range_info
                }

                const result = await updateSettingById(data, id);
                if(result.affectedRows) {
                    return res.json({
                        message:  "update setting success",
                        status: 200,
                        success: true
                    });
                } else {
                    return res.json({
                        message:  "update setting failed",
                        status: 400,
                        success: false
                    });
                }
            } else {
                return res.json({
                    message:  "data not found",
                    status: 400,
                    success: false
                });
            }
        }
    } catch {
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500
        })
    }
});


exports.addSetting = (async (req, res) => {

        const {user_id, org_id} = req.body;

        const schmea = Joi.alternatives(
            Joi.object({
                user_id: [Joi.number().empty(),Joi.string().empty()],
                org_id: [Joi.number().empty(),Joi.string().empty()],       
            })
        );

        const result = schmea.validate(req.body);
        if(result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 400,
                success: false,
            });
        } else {
            await deleteSetting(user_id, org_id);
            const result = await addSetting([
                [1,'Summary',  'Summary', 1, user_id, org_id, 1, ''],
                [1,'Risk Type',  'Risk Type', 1, user_id, org_id, 2, ''],
                [2,'Description',  'Description', 2, user_id, org_id, 1, ''],
                [2,'Risk Stage',  'Risk Stage', 2, user_id, org_id, 2, ''],
                [1,'Risk Assigned to',  'Risk Assigned to', 1, user_id, org_id, 2, ''],
                [2,'Risk Approver',  'Risk Approver', 2, user_id, org_id, 2, ''],
                [1,'Visible to',  'Visible to', 1, user_id, org_id, 2, ''],
                [2,'Caused by',  'Caused by', 2, user_id, org_id, 2, ''],
                [1,'Impact on',  'Impact on', 1, user_id, org_id, 2, ''],
                [2,'Cost Impact ($)',  'Cost Impact ($)', 2, user_id, org_id, 1, ''],
                [1,'Strategy',  'Strategy', 1, user_id, org_id, 4, ''],
                [2,'Justification',  'Justification', 2, user_id, org_id, 1, ''],
                [1,'Status',  'Status', 1, user_id, org_id, 2, ''],
                [2,'Inherent Risk Rating',  'Inherent Risk Rating', 2, user_id, org_id, 3, ''],
                [1,'Risk Rating',  'Risk Rating', 1, user_id, org_id, 3, ''],
                [2,'Inherent Likelihood',  'Inherent Likelihood', 2, user_id, org_id, 3, ''],
                [1,'Likelihood',  'Likelihood', 1, user_id, org_id, 3, ''],
                [1,'Impact',  'Impact', 1, user_id, org_id, 3, ''],
                [2,'Inherent impact',  'Inherent impact', 2, user_id, org_id, 3, ''],
                [2,'Control Effectiveness',  'Control Effectiveness', 2, user_id, org_id, 3, ''],
                [1,'Mitigation action',  'Mitigation action', 1, user_id, org_id, 1, ''],
                [1,'Insurance acquired',  'Insurance acquired', 1, user_id, org_id, 4, ''],
                [1,'Change since last review',  'Change since last review', 1, user_id, org_id, 4, ''],
                [2,'Next Action Date',  'Next Action Date', 2, user_id, org_id, 2, ''],
                [2,'Expected Close Date',  'Expected Close Date', 2, user_id, org_id, 2, ''],
                [1,'Next Review Date',  'Next Review Date', 1, user_id, org_id, 2, '']
            ]);

            if(result.affectedRows) {
                return res.json({
                    message:  "Add setting success",
                    status: 200,
                    success: true
                });
            } else {
                return res.json({
                    message:  "Add setting failed",
                    status: 400,
                    success: false
                });
            }
        }

});


function addOptionFunc(table, user_id, org_id) {
    return new Promise(async (resolve, reject) => {
        let where = `where user_id = '-1' and org_id = '-1'`;
        let info = await getData(table, where);
        const dataArr = [];
        for (let i = 0; i < info.length; i++) {
            dataArr[i] = [
                user_id,
                org_id,
                info[i]['name']
            ]
        }

         // delete old setting data
         let whereDelete = `where user_id = ${user_id} and org_id = ${org_id}`;
         await deleteData(table, whereDelete);

         // add new data
         console.log(dataArr, 'dataArr');
         await addOptionsSetting(table, dataArr);
        resolve(true);
    })
}

function addSettingFunc(user_id, org_id) {
    return new Promise(async (resolve, reject) => {
         // fetch default info
         const dInfo = await fetchSettingList(-1, -1);  
         const dataArr = [];
         for(let i = 0; i < dInfo.length; i++) {
             dataArr[i] = [
                 dInfo[i]['field_visibility'],
                 dInfo[i]['field_name'],
                 dInfo[i]['custom_label'],
                 dInfo[i]['required_status'],
                 user_id,
                 org_id,
                 dInfo[i]['field_type'],
                 dInfo[i]['range_info']
             ]
         }
 
        // delete old setting data
        await deleteSetting(user_id, org_id);
 
        // add new data
        const resultData = await addSetting(dataArr);
        resolve(true);
    });
}




exports.addSettingUser = (async (req, res) => {
    const {user_id, org_id} = req.body;

    const schmea = Joi.alternatives(
        Joi.object({
            user_id: [Joi.number().empty(),Joi.string().empty()],
            org_id: [Joi.number().empty(),Joi.string().empty()],       
        })
    );

    const result = schmea.validate(req.body);
    if(result.error) {
        const message = result.error.details.map((i) => i.message).join(",");
        return res.json({
            message: result.error.details[0].message,
            error: message,
            missingParams: result.error.details[0].message,
            status: 400,
            success: false,
        });
    } else {
        await addSettingFunc(user_id, org_id);
        await addOptionFunc('tbl_setting_risk_caused_by', user_id, org_id);
        await addOptionFunc('tbl_setting_risk_impact_on', user_id, org_id);
        await addOptionFunc('tbl_setting_risk_stage', user_id, org_id);
        await addOptionFunc('tbl_setting_risk_status', user_id, org_id);
        await addOptionFunc('tbl_setting_risk_type', user_id, org_id);
        await addOptionFunc('tbl_setting_risk_visible_to', user_id, org_id);
        return res.json({
            message:  "Add User Setiing Defaut value successfully",
            status: 200,
            success: true
        });
    }

});





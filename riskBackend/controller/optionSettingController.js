const {
    insertData,
    updateData,
    getData
} = require('../models/common');
const Joi = require('joi');


exports.addRiskSettingOption = (async (req, res) => {
        const { name, user_id, org_id, table } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                name: [Joi.number().empty(),Joi.string().empty()],
                user_id: [Joi.number().empty(),Joi.string().empty()],
                org_id: [Joi.number().empty(),Joi.string().empty()],
                table: [Joi.number().empty(),Joi.string().empty()],
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
        } else {
            let where = `where status = 1 and name = '${name}' and org_id='${org_id}' and user_id='${user_id}'`;
            const result = await getData(table, where);
           
            if (result.length === 0) {              
                        let data = {
                            name: name,
                            user_id: user_id,
                            org_id: org_id,
                            created_at: new Date().toISOString().slice(0, 10),
                        }
                        const result = await insertData(table, '', data);
                        if (result.affectedRows > 0) {
                            return res.json({
                                success: true,
                                message: "setting Added Successfully",
                                risk_type: result,    
                                status: 200
                            });
                        } else {
                            return res.json({
                                message: "Some error occured. Please try again",
                                status:  400,
                                risk_type: [],
                                success: false
                            })
                        }
                  
            } else {
                return res.json({
                    success: false,
                    message: "This setting is aready Exists",
                    status: 400,
                    risk_type: result
                });
            }

        }
});

exports.updateRiskSettingOption = (async (req, res) => {
    try {
        const { name, id, table } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                name: [Joi.number().empty(),Joi.string().empty()],
                id: [Joi.number().empty(),Joi.string().empty()],
                table: [Joi.number().empty(),Joi.string().empty()],
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
        } else {
                let where = `where id = '${id}'`;
                let data = {
                    name: name
                }
                const result = await updateData(table, where, data);
                if (result) {
                    let where = `where id = '${id}'`;
                    const result1 = await getData(table, where); 
                    return res.json({
                        risk_type:result1,
                        success: true,
                        message: "Risk Type updated Successfully"
                    })
                } else {
                    return res.json({
                        success: false,
                        message: "Some error occured. Please try again"
                    })
                }
        }
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500

        })
    }
});


exports.riskSettingOptionList = (async (req, res) => {
        const { org_id, user_id } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                user_id: [Joi.number().empty(),Joi.string().empty()],
                org_id: [Joi.number().empty(),Joi.string().empty()]
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
        } else {
            let where = `where user_id = '${user_id}' and org_id = '${org_id}'`;
            const risk_approver = await getData('tbl_setting_risk_approver', where);
            const risk_assigned_to = await getData('tbl_setting_risk_assigned_to', where);
            const risk_caused_by = await getData('tbl_setting_risk_caused_by', where);
            const expected_close_date = await getData('tbl_setting_risk_expected_close_date', where);
            const risk_impact_on = await getData('tbl_setting_risk_impact_on', where);
            const risk_next_action_date = await getData('tbl_setting_risk_next_action_date', where);
            const risk_next_review_date = await getData('tbl_setting_risk_next_review_date', where);
            const risk_register_name = await getData('tbl_setting_risk_register_name', where);
            const risk_stage = await getData('tbl_setting_risk_stage', where);
            const risk_status = await getData('tbl_setting_risk_status', where);
            const risk_type = await getData('tbl_setting_risk_type', where);
            const risk_visible_to = await getData('tbl_setting_risk_visible_to', where);

            let risk_approver_list  = [];
            let risk_assigned_to_list  = [];
            let risk_caused_by_list  = [];
            let expected_close_date_list  = [];
            let risk_impact_on_list  = [];
            let risk_next_action_date_list  = [];
            let risk_next_review_date_list  = [];
            let risk_register_name_list  = [];
            let risk_stage_list  = [];
            let risk_status_list  = [];
            let risk_type_list  = [];
            let risk_visible_to_list  = [];


            if (risk_approver.length !=0){
                risk_approver_list = risk_approver;     
            }

            if (risk_assigned_to.length !=0){
                risk_assigned_to_list = risk_assigned_to;     
            }

            if (risk_caused_by.length !=0){
                risk_caused_by_list = risk_caused_by;     
            }

            if (expected_close_date.length !=0){
                expected_close_date_list = expected_close_date;     
            }

            if (risk_impact_on.length !=0){
                risk_impact_on_list = risk_impact_on;     
            }


            if (risk_next_action_date.length !=0){
                risk_next_action_date_list = risk_next_action_date;     
            }


            if (risk_next_review_date.length !=0){
                risk_next_review_date_list = risk_next_review_date;     
            }

            if (risk_register_name.length !=0){
                risk_register_name_list = risk_register_name;     
            }


            if (risk_stage.length !=0){
                risk_stage_list = risk_stage;     
            }


            if (risk_status.length !=0){
                risk_status_list = risk_status;     
            }


            if (risk_type.length !=0){
                risk_type_list = risk_type;     
            }

            if (risk_visible_to.length !=0){
                risk_visible_to_list = risk_visible_to;     
            }

            return res.json({
                success: true,
                message: "list of risk fields list",
                risk_approver_list: risk_approver_list,
                risk_assigned_to_list:risk_assigned_to_list,
                risk_caused_by_list:risk_caused_by_list,
                expected_close_date_list:expected_close_date_list,
                risk_impact_on_list:risk_impact_on_list,
                risk_next_action_date_list:risk_next_action_date_list,
                risk_next_review_date_list:risk_next_review_date_list,
                risk_register_name_list:risk_register_name_list,
                risk_stage_list:risk_stage_list,
                risk_status_list:risk_status_list,
                risk_type_list:risk_type_list,
                risk_visible_to_list:risk_visible_to_list
            })
        } 
});



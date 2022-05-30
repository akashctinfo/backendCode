const { fetchrisk_count, fetchRiskList, getVisibleToUser } = require('../models/risk');
const Joi = require('joi');
const { insertData, getData, updateData, fetchCount } = require('../models/common');
const User = require("../models/userList");
const excelJS = require("exceljs");
const { fetchRiskCommentList } = require('../models/comment');


exports.addRisk = (async(req, res) => {
    const { user_id, org_id, type, description, stage, raised_by, assigned_to, approver, visible_to, team_visible_to, action_id, document_id, visible_all_status, caused_by,
        impact_on, cost_impact, strategy, summary, justification, status, inherent_risk_rating, risk_rating,
        inherent_likelihood, likelihood, impact, inherent_impact, control_effectiveness, mitigation_action,
        insurance_acquired, change_since_last_review, next_action_date, expected_close_date, next_review_date} = req.body;
    const schema = Joi.alternatives(
            Joi.object({
                user_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                org_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                type: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                description: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                stage: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                raised_by: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                assigned_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                approver: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                visible_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                team_visible_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                action_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                document_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                visible_all_status: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                caused_by: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                impact_on: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                cost_impact: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                strategy: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                summary: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                justification: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                status: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                inherent_risk_rating: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                risk_rating: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                inherent_likelihood: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                likelihood: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                impact: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                inherent_impact: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                control_effectiveness: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                mitigation_action: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                insurance_acquired: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                change_since_last_review: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                next_action_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                expected_close_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                next_review_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
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
                success: false,
            });
        }

        const resultInsert = await insertData('tbl_risk', '', {
            user_id: user_id,
            org_id: org_id,
            type: type,
            description: description,
            stage: stage,
            raised_by: raised_by,
            assigned_to: assigned_to,
            approver: approver,
            visible_to: visible_to,
            team_visible_to: team_visible_to,
            action_id: action_id,
            document_id: document_id,
            visible_all_status: visible_all_status,
            caused_by: caused_by,
            impact_on: impact_on,
            cost_impact: cost_impact,
            strategy: strategy,
            summary: summary,
            justification: justification,
            status: status,
            inherent_risk_rating: inherent_risk_rating,
            risk_rating: risk_rating,
            inherent_likelihood: inherent_likelihood,
            likelihood: likelihood,
            impact: impact,
            inherent_impact: inherent_impact,
            control_effectiveness: control_effectiveness,
            mitigation_action: mitigation_action,
            insurance_acquired: insurance_acquired,
            change_since_last_review: change_since_last_review,
            next_action_date: next_action_date,
            expected_close_date: expected_close_date,
            next_review_date: next_review_date,
            identified: new Date().toISOString().slice(0, 10),
            last_updated_date: new Date().toISOString().slice(0, 10)
        })

        if(resultInsert.affectedRows > 0) {
            return res.json({
                message: "risk added successfully",
                status: 200,
                success: true
            });
        } else {
            return res.json({   
                message: "risk add failed",
                status: 400,
                success: false
            });
        }
});


exports.editRisk = (async (req, res) => {
    const { id, type, description, stage, raised_by, assigned_to, approver, visible_to, team_visible_to, action_id, document_id, visible_all_status, caused_by,
        impact_on, cost_impact, strategy, summary, justification, status, inherent_risk_rating, risk_rating,
        inherent_likelihood, likelihood, impact, inherent_impact, control_effectiveness, mitigation_action,
        insurance_acquired, change_since_last_review, next_action_date, expected_close_date, next_review_date} = req.body;

    const schema = Joi.alternatives(
        Joi.object({
            type: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            description: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            stage: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            raised_by: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            assigned_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            approver: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            visible_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            team_visible_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            action_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            document_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            visible_all_status: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            caused_by: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            impact_on: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            cost_impact: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            strategy: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            summary: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            justification: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            status: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            inherent_risk_rating: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            risk_rating: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            inherent_likelihood: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            likelihood: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            impact: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            inherent_impact: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            control_effectiveness: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            mitigation_action: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            insurance_acquired: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            change_since_last_review: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            next_action_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            expected_close_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            next_review_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
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
            success: false,
        });
    }

    let where = `where id = ${id}`;
    const resultInfo = await getData('tbl_risk', where);
    if(resultInfo.length !== 0) {
        let data = {
            type: type? type: resultInfo[0].type,
            description: description? description: resultInfo[0].description,
            stage: stage? stage: resultInfo[0].stage,
            raised_by: raised_by? raised_by: resultInfo[0].raised_by,
            assigned_to: assigned_to? assigned_to: resultInfo[0].assigned_to,
            approver: approver? approver: resultInfo[0].approver,
            visible_to: visible_to,
            team_visible_to: team_visible_to,
            action_id: action_id,
            document_id: document_id,
            visible_all_status: visible_all_status,
            caused_by: caused_by? caused_by: resultInfo[0].caused_by,
            impact_on: impact_on? impact_on: resultInfo[0].impact_on,
            cost_impact: cost_impact? cost_impact: resultInfo[0].cost_impact,
            strategy: strategy? strategy: resultInfo[0].strategy,
            summary: summary? summary: resultInfo[0].summary,
            justification: justification? justification: resultInfo[0].justification,
            status: status? status: resultInfo[0].status,
            inherent_risk_rating: inherent_risk_rating? inherent_risk_rating: resultInfo[0].inherent_risk_rating,
            risk_rating: risk_rating? risk_rating: resultInfo[0].risk_rating,
            inherent_likelihood: inherent_likelihood? inherent_likelihood: resultInfo[0].inherent_likelihood,
            likelihood: likelihood? likelihood: resultInfo[0].likelihood,
            impact: impact? impact: resultInfo[0].impact,
            inherent_impact: inherent_impact? inherent_impact: resultInfo[0].inherent_impact,
            control_effectiveness: control_effectiveness? control_effectiveness: resultInfo[0].control_effectiveness,
            mitigation_action: mitigation_action? mitigation_action: resultInfo[0].mitigation_action,
            insurance_acquired: insurance_acquired? insurance_acquired: resultInfo[0].insurance_acquired,
            change_since_last_review: change_since_last_review? change_since_last_review: resultInfo[0].change_since_last_review,
            next_action_date: next_action_date? next_action_date: resultInfo[0].next_action_date,
            expected_close_date: expected_close_date? expected_close_date: resultInfo[0].expected_close_date,
            next_review_date: next_review_date? next_review_date: resultInfo[0].next_review_date
        }

        let whereUpdate = `where id = ${id}`;
        const result = await updateData('tbl_risk', whereUpdate, data);
        if(result.affectedRows) {
            return res.json({
                message:  "update team success",
                status: 200,
                success: true
            });
        } else {
            return res.json({
                message:  "update team failed",
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
});

exports.riskList = (async (req, res) => {
    const {start, user_id, org_id, search_keyword, sort_by, impact_on, type, likelihood} = req.body;
    const {limit, offset} = getPagination(start, 10);

    const schema = Joi.alternatives(
        Joi.object({
            start: [Joi.number().empty(),Joi.string().empty()],
            user_id: [Joi.number().empty(),Joi.string().empty()],
            org_id: [Joi.number().empty(),Joi.string().empty()],
            search_keyword: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            sort_by: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            impact_on: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            type: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            likelihood: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
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

    const data = await fetchRiskList('', sort_by,limit, offset,user_id, org_id, search_keyword, impact_on, type, likelihood);
    console.log(data.length, 'data');
    let whereCount = `where org_id = '${org_id}'`;
    let totalRiskCount = await fetchCount('tbl_risk', whereCount);

    let whereOperationalCount = `where  type IN (SELECT id FROM tbl_setting_risk_type WHERE name = 'Operational' and org_id = '${org_id}');`;
    let totalOperationalRiskCount = await fetchCount('tbl_risk', whereOperationalCount);
    if(data.length !== 0) {
        return res.json({
            message: "fetch risk list success",
            status: 200,
            success: true,
            data: data,
            totalRiskCount: totalRiskCount[0].total,
            totalOperationalRiskCount: totalOperationalRiskCount[0].total
        })
    } else {
        return res.json({
            message: "fetch risk list failed",
            status: 400,
            success: false
        })
    }

});


const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};


exports.riskDetail = (async (req, res) => {
    console.log(S3_URL, 'S3_URL');
    const {id, user_id} = req.body;
    const schema = Joi.alternatives(
        Joi.object({
            id: [Joi.number().empty(),Joi.string().empty()],
            user_id: [Joi.number().empty(),Joi.string().empty()],
        })
    )

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
    
    let where = `where R.id='${id}'`;
    const riskInfo = await fetchRiskList(where, '', '', '', user_id, '', '', '', '', '');
    console.log(typeof riskInfo, 'riskInfo');
    if(riskInfo.length !== 0) {
         

        

        let visibleToInfo = [];
        if(riskInfo[0].visible_to) {
            let whereInfo = `where id IN (${riskInfo[0].visible_to})`;
            visibleToInfo = await getVisibleToUser('users', whereInfo);
        }

        let teamInfo = [];
        if(riskInfo[0].team_visible_to) {
            let whereTeam = `where id IN (${riskInfo[0].team_visible_to})`;
            teamInfo = await getData('tbl_team', whereTeam);
        }


        let documentInfo = [];
        if(riskInfo[0].document_id) {
            let whereDocument = `where id IN (${riskInfo[0].document_id})`;
            documentInfo = await getData('tbl_document', whereDocument);
        }

        let actionInfo = [];
        if(riskInfo[0].action_id) {
            let whereAction = `where id IN (${riskInfo[0].action_id})`;
            actionInfo = await getData('tbl_action', whereAction);
        }

        return res.json({
            message: "fetch risk details success",
            status: 200,
            success: true,
            data: riskInfo[0],
            visibleToInfo: visibleToInfo,
            teamInfo: teamInfo,
            documentInfo: documentInfo,
            actionInfo: actionInfo
        })
    } else {
        return res.json({
            message: "fetch details failed",
            status: 400,
            success: false
        })
    }
});



exports.riskExcelGenerate = (async (req, res) => {
    const {start, user_id, org_id, search_keyword, sort_by} = req.body;
    const {limit, offset} = getPagination(start, 10);

    const schema = Joi.alternatives(
        Joi.object({
            start: [Joi.number().empty(),Joi.string().empty()],
            user_id: [Joi.number().empty(),Joi.string().empty()],
            org_id: [Joi.number().empty(),Joi.string().empty()],
            search_keyword: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            sort_by: [Joi.number().optional().allow(''),Joi.string().optional().allow('')]
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

    const data = await fetchRiskList('', sort_by,limit, offset,user_id, org_id, search_keyword);
    if(result.length !== 0) {
        const workbook = new excelJS.Workbook(); 
        const worksheet = workbook.addWorksheet("My Users");
        const path = "upload";
        worksheet.columns = [
            { header: "S no.", key: "s_no", width: 10 }, 
            { header: "First Name", key: "fname", width: 10 },
            { header: "Last Name", key: "lname", width: 10 },
            { header: "Email Id", key: "email", width: 10 },
            { header: "Gender", key: "gender", width: 10 },
        ];

        // Looping through User data
        let counter = 1;
        User.forEach((user) => {
        user.s_no = counter;
        worksheet.addRow(user); // Add data in worksheet
        counter++;
        });
        // Making first line in excel bold
        worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        });

        try {
            const data = await workbook.xlsx.writeFile(`${path}/users.xlsx`)
             .then(() => {
                return res.json({
                    message: "success",
                    status: 200,
                    success: true,
                    path: `${path}/users.xlsx`
                })
             });
          } catch (err) {
              console.log(err, 'err');
            return res.json({
                message: "Something went wrong",
                status: 400,
                success: false
            })
          }
    } else {
        return res.json({
            message: "fetch risk list failed",
            status: 400,
            success: false
        })
    }

});
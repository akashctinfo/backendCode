const { insertData, getData, updateData }  = require('../models/common');
const Joi = require('joi');
const { fetchActionList } = require('../models/action');

exports.addAction = (async(req, res) => {
    const { 
        user_id, 
        org_id, 
        action_title, 
        assigned_to, 
        description, 
        action_status, 
        priority, 
        expected_closure_date, 
        next_action_date,
        status,
        recurrence,
        due_date,
        next_review_date,
        visible_to   
    } = req.body;

    const schema = Joi.alternatives(
        Joi.object({
            user_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            org_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            action_title: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            assigned_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            description: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            assigned_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            action_status: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            priority: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            expected_closure_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            next_action_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            status: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            recurrence: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            due_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            next_review_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            visible_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')]
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

    const resultInsert = await insertData('tbl_action', '', {
        user_id: user_id,
        org_id: org_id,
        action_title: action_title,
        date_assigned: new Date().toISOString().slice(0, 10),
        assigned_to: assigned_to,
        description: description,
        action_status: action_status,
        priority: priority,
        expected_closure_date: expected_closure_date,
        next_action_date: next_action_date,
        created_date: new Date().toISOString().slice(0, 10),
        updated_date: new Date().toISOString().slice(0, 10),
        status: status,
        recurrence: recurrence,
        due_date: due_date,
        next_review_date: next_review_date,
        visible_to: visible_to
    });

    if(resultInsert.affectedRows > 0) {
        return res.json({
            message: "action added successfully",
            status: 200,
            success: true,
            insertId: resultInsert.insertId
        });
    } else {
        return res.json({   
            message: "action add failed",
            status: 400,
            success: false
        });
    }
});



exports.editAction = (async (req, res) => {
    const {
        action_title, 
        date_assigned, 
        assigned_to, 
        description, 
        action_status, 
        priority, 
        expected_closure_date, 
        next_action_date,
        changeStatus,
        recurrence,
        due_date,
        next_review_date,
        visible_to,   
        id
    } = req.body;
    const schema = Joi.alternatives(
        Joi.object({
            action_title: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            date_assigned: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            assigned_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            description: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            assigned_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            action_status: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            priority: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            expected_closure_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            next_action_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            changeStatus: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            id:  [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            recurrence: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            due_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            next_review_date: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            visible_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')]
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
    }

    let where = `where id = '${id}'`;
    const actionInfo = await getData('tbl_action', where) 

    if(actionInfo.length !== 0) {
        let data = {
            action_title: action_title? action_title: actionInfo[0].action_title,
            date_assigned: date_assigned? date_assigned: actionInfo[0].date_assigned,
            assigned_to: assigned_to? assigned_to: actionInfo[0].assigned_to,
            description: description? description: actionInfo[0].description,
            action_status: action_status? action_status: actionInfo[0].action_status,
            priority: priority? priority: actionInfo[0].priority,
            expected_closure_date: expected_closure_date? expected_closure_date: actionInfo[0].expected_closure_date,
            next_action_date: next_action_date? next_action_date: actionInfo[0].next_action_date,
            status: changeStatus,
            recurrence: recurrence? recurrence: actionInfo[0].recurrence,
            due_date: due_date? due_date: actionInfo[0].due_date,
            next_review_date: next_review_date? next_review_date: actionInfo[0].next_review_date,
            visible_to: visible_to,
            updated_date: new Date().toISOString().slice(0, 10)
        }

        const resultUpdate = await updateData('tbl_action', where, data);

        if(resultUpdate.affectedRows) {
            return res.json({
                message:  "update action success",
                status: 200,
                success: true
            });
        } else {
            return res.json({
                message:  "update action failed",
                status: 400,
                success: false
            });
        }
    } else {
        res.json({
            message: "Data not found",
            status: 400,
            success: false
        });
    }
});


exports.actionList = (async (req, res) => {
    const {start, user_id, org_id, search_keyword, status, sort_by} = req.body;
    const {limit, offset} = getPagination(start, 10);

    const schema = Joi.alternatives(
        Joi.object({
            start: [Joi.number().empty(),Joi.string().empty()],
            user_id: [Joi.number().empty(),Joi.string().empty()],
            org_id: [Joi.number().empty(),Joi.string().empty()],
            search_keyword: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            status: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
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

    const data = await fetchActionList('', sort_by,limit, offset,user_id, org_id, search_keyword, status);
    // console.log(data, 'data');
    if(result.length !== 0) {
        return res.json({
            message: "fetch risk list success",
            status: 200,
            success: true,
            data: data
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



exports.actionDetail = (async (req, res) => {
    const {id} = req.body;
    const schema = Joi.alternatives(
        Joi.object({
            id: [Joi.number().empty(),Joi.string().empty()],
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
    
    let where = `where A.id='${id}'`;
    const actionInfo = await fetchActionList(where, '', '', '', '', '', '');
    console.log(actionInfo, 'actionInfo');
    if(actionInfo.length !== 0) {

        return res.json({
            message: "fetch action details success",
            status: 200,
            success: true,
            data: actionInfo[0]
        })
    } else {
        return res.json({
            message: "fetch details failed",
            status: 400,
            success: false
        })
    }
});
const {insertData, updateData, getData}  = require('../models/common');
const {fetchRiskCommentList, fetchActionCommentList}  = require('../models/comment');
const {getPagination, sendOTP} = require('../helper/common');
const Joi = require('joi');

exports.addRiskComment = (async (req, res) => {
    const {
        user_id, 
        org_id, 
        risk_id,
        message
    } = req.body;

    const schema = Joi.alternatives(
        Joi.object({
            user_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            org_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            risk_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            message: [Joi.number().optional().allow(''),Joi.string().optional().allow('')]
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


    const resultInsert = await insertData('tbl_risk_comments', '', {
        user_id: user_id,
        org_id: org_id,
        risk_id: risk_id,
        message: message,
        created_at: new Date().toISOString().slice(0, 10),
    });

    if(resultInsert.affectedRows > 0) {
        return res.json({
            message: "comment added successfully",
            status: 200,
            success: true
        });
    } else {
        return res.json({   
            message: "comment add failed",
            status: 400,
            success: false
        });
    }
});



exports.editRiskComment = (async (req, res) => {
    const {
        message,
        id
    } = req.body;
    const schema = Joi.alternatives(
        Joi.object({
            message: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            id:  [Joi.number().optional().allow(''),Joi.string().optional().allow('')]
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
    const commentInfo = await getData('tbl_risk_comments', where) 

    if(commentInfo.length !== 0) {
        let data = {
            message: message? message: commentInfo[0].message
        }

        const resultUpdate = await updateData('tbl_risk_comments', where, data);

        if(resultUpdate.affectedRows) {
            return res.json({
                message:  "update comment success",
                status: 200,
                success: true
            });
        } else {
            return res.json({
                message:  "update comment failed",
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





exports.riskCommentList = (async (req, res) => {
    const {start, user_id, org_id, risk_id} = req.body;
    const {limit, offset} = getPagination(start, 10);

    const schema = Joi.alternatives(
        Joi.object({
            start: [Joi.number().empty(),Joi.string().empty()],
            user_id: [Joi.number().empty(),Joi.string().empty()],
            org_id: [Joi.number().empty(),Joi.string().empty()],
            risk_id: [Joi.number().empty(),Joi.string().empty()]
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

    const data = await fetchRiskCommentList('',limit, offset, risk_id);
    if(data.length !== 0) {
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


exports.addFavCommentRisk = (async(req, res) => {
        const {user_id, comment_id, type} = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                user_id: [Joi.number().empty(),Joi.string().empty()],
                comment_id: [Joi.number().empty(),Joi.string().empty()],
                type: [Joi.number().empty(),Joi.string().empty()]
            })
        )
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
        } else {

            let where = `where user_id='${user_id}' and comment_id='${comment_id}'`; 
            const favInfo = await getData('tbl_risk_favorite', where) 
            if(favInfo.length !== 0) {
                let whereUpdate = `where id = '${favInfo[0].id}'`;
                await updateData('tbl_risk_favorite', whereUpdate, {
                    type: type
                });

                return res.json({
                    message: "fav updated successfully",
                    status: 200,
                    success: true
                });
            } else {
                await insertData('tbl_risk_favorite', '', {
                    user_id: user_id,
                    comment_id: comment_id,
                    type: type
                });
    
                return res.json({
                    message: "fav added successfully",
                    status: 200,
                    success: true
                });
            }
        }
});




exports.addActionComment = (async (req, res) => {
    const {
        user_id, 
        org_id, 
        action_id,
        message
    } = req.body;

    const schema = Joi.alternatives(
        Joi.object({
            user_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            org_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            action_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            message: [Joi.number().optional().allow(''),Joi.string().optional().allow('')]
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


    const resultInsert = await insertData('tbl_action_comments', '', {
        user_id: user_id,
        org_id: org_id,
        action_id: action_id,
        message: message,
        created_at: new Date().toISOString().slice(0, 10),
    });

    if(resultInsert.affectedRows > 0) {
        return res.json({
            message: "comment added successfully",
            status: 200,
            success: true
        });
    } else {
        return res.json({   
            message: "comment add failed",
            status: 400,
            success: false
        });
    }
});



exports.editActionComment = (async (req, res) => {
    const {
        message,
        id
    } = req.body;
    const schema = Joi.alternatives(
        Joi.object({
            message: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            id:  [Joi.number().optional().allow(''),Joi.string().optional().allow('')]
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
    const commentInfo = await getData('tbl_action_comments', where) 

    if(commentInfo.length !== 0) {
        let data = {
            message: message? message: commentInfo[0].message
        }

        const resultUpdate = await updateData('tbl_action_comments', where, data);

        if(resultUpdate.affectedRows) {
            return res.json({
                message:  "update comment success",
                status: 200,
                success: true
            });
        } else {
            return res.json({
                message:  "update comment failed",
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





exports.actionCommentList = (async (req, res) => {
    const {start, user_id, org_id, action_id} = req.body;
    const {limit, offset} = getPagination(start, 10);

    const schema = Joi.alternatives(
        Joi.object({
            start: [Joi.number().empty(),Joi.string().empty()],
            user_id: [Joi.number().empty(),Joi.string().empty()],
            org_id: [Joi.number().empty(),Joi.string().empty()],
            action_id: [Joi.number().empty(),Joi.string().empty()]
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

    const data = await fetchActionCommentList('',limit, offset, action_id);
    if(data.length !== 0) {
        return res.json({
            message: "fetch action list success",
            status: 200,
            success: true,
            data: data
        })
    } else {
        return res.json({
            message: "fetch action list failed",
            status: 400,
            success: false
        })
    }
});


exports.addFavCommentAction = (async(req, res) => {
        const {user_id, comment_id, type} = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                user_id: [Joi.number().empty(),Joi.string().empty()],
                comment_id: [Joi.number().empty(),Joi.string().empty()],
                type: [Joi.number().empty(),Joi.string().empty()]
            })
        )
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
        } else {

            let where = `where user_id='${user_id}' and comment_id='${comment_id}'`; 
            const favInfo = await getData('tbl_action_favorite', where) 
            if(favInfo.length !== 0) {
                let whereUpdate = `where id = '${favInfo[0].id}'`;
                await updateData('tbl_action_favorite', whereUpdate, {
                    type: type
                });

                return res.json({
                    message: "fav updated successfully",
                    status: 200,
                    success: true
                });
            } else {
                await insertData('tbl_action_favorite', '', {
                    user_id: user_id,
                    comment_id: comment_id,
                    type: type
                });
    
                return res.json({
                    message: "fav added successfully",
                    status: 200,
                    success: true
                });
            }
        }
});

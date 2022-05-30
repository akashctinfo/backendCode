const {addTeam, fetchTeamById, updateTeamById, fetchTeamList, deleteTeam}  = require('../models/team');
const Joi = require('joi');


exports.addTeam = (async(req, res) => {
    try {
        const {team_name, address, country, state, other_detail, visibility, user_id, org_id} = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                user_id: [Joi.number().empty(),Joi.string().empty()],
                org_id: [Joi.number().empty(),Joi.string().empty()],
                team_name: [Joi.number().empty(),Joi.string().empty()],
                address: [Joi.number().empty(),Joi.string().empty()],
                country: [Joi.number().empty(),Joi.string().empty()],
                state: [Joi.number().empty(),Joi.string().empty()],
                other_detail: [Joi.number().empty(),Joi.string().empty()],
                visibility: [Joi.number().empty(),Joi.string().empty()]
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
            const result = await addTeam({
                user_id: user_id,
                org_id: org_id,
                team_name: team_name,
                address: address,
                country: country,
                state: state,
                other_detail: other_detail,
                visibility: visibility
            });

            if(result.affectedRows > 0) {
                return res.json({
                    message: "team added successfully",
                    status: 200,
                    success: true
                });
            } else {
                return res.json({
                    message: "team add failed",
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


exports.editTeam = (async (req, res) => {
    try {
        const {team_name, address, country, state, other_detail, visibility, id} = req.body;
        const schema= Joi.alternatives(
            Joi.object({
                team_name: [Joi.number().empty(),Joi.string().empty()],
                address: [Joi.number().empty(),Joi.string().empty()],
                country: [Joi.number().empty(),Joi.string().empty()],
                state: [Joi.number().empty(),Joi.string().empty()],
                other_detail: [Joi.number().empty(),Joi.string().empty()],
                visibility: [Joi.number().empty(),Joi.string().empty()],
                id: [Joi.number().empty(),Joi.string().empty()]
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
            const resultInfo = await fetchTeamById(id);
            
            if(resultInfo.length !== 0) {
                console.log(resultInfo, 'resultInfo');
                
                let data = {
                    team_name: team_name? team_name: resultInfo[0].team_name,
                    address: address? address: resultInfo[0].address,
                    country: country? country: resultInfo[0].country,
                    state: state? state: resultInfo[0].state,
                    other_detail: other_detail? other_detail: resultInfo[0].other_detail,
                    visibility: visibility? visibility: resultInfo[0].visibility
                }

                const result = await updateTeamById(data, id);
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
        }
    } catch {
        return res.json({
            success: false,
            message: `Internal server error`,
            status: 500
        })
    }
});


exports.getTeamDetail = (async (req, res) => {
    try {
        const {id} = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                id: [Joi.number().empty(),Joi.string().empty()],              
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
            const result = await fetchTeamById(id);
            if(result.length !== 0) {
                return res.json({
                    message: "fetch team details success",
                    status: 200,
                    success: true,
                    data: result[0]
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
})


exports.getTeamList = (async (req, res) => {
        const {user_id, org_id} = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                user_id: [Joi.number().empty(),Joi.string().empty()],
                org_id: [Joi.number().empty(),Joi.string().empty()],              
            })
        );
        
        console.log(user_id, 'user_id');
        console.log(org_id, 'org_id');
        const result = schema.validate({user_id,org_id});

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
            let search_keyword = '';
            let visibility = '';

            if(req.body.search_keyword){
                search_keyword = req.body.search_keyword
            }

            if(req.body.visibility){
                visibility = req.body.visibility
            }

            const result = await fetchTeamList(user_id, org_id, visibility, search_keyword);
            if(result.length !== 0) {
                return res.json({
                    message: "fetch team details success",
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
});


exports.deleteTeam = (async (req, res) => {
    const {id} = req.body;
    
    const schema = Joi.alternatives(
        Joi.object({
            id: [Joi.number().empty(),Joi.string().empty()]
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
        const result = await deleteTeam(id);
        if(result) {
            return res.json({
                risk_type:result,
                success: true,
                message: "Team deleted Successfully"
            })
        } else {
            return res.json({
                success: false,
                message: "Some error occured. Please try again"
            })
        }
    }
});
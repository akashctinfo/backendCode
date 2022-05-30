
const {addOrg, updateOrgByid, fetchOrgbyid} = require('../models/org');
const Joi = require('joi');

exports.editOrg = ( async (req, res) => {
    try{
        const {org_name, address, state, country, abn, contact, website, id} = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                org_name: [Joi.number().empty(),Joi.string().empty()],              
                address:  [Joi.number().empty(),Joi.string().empty()],
                state:  [Joi.number().empty(),Joi.string().empty()],
                country:  [Joi.number().empty(),Joi.string().empty()],
                abn:  [Joi.number().empty(),Joi.string().empty()],
                contact:  [Joi.number().empty(),Joi.string().empty()],
                website:  [Joi.number().empty(),Joi.string().empty()],
                id:  [Joi.number().empty(),Joi.string().empty()]
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
            const result = await fetchOrgbyid(id);
            if(result.length !== 0) {
                let data = {
                    org_name: org_name? org_name : result[0].org_name,
                    address: org_name? address : result[0].address,
                    state: org_name? state : result[0].state,
                    country: org_name? country : result[0].country,
                    abn: org_name? abn : result[0].abn,
                    contact: org_name? contact : result[0].contact,
                    website: org_name? website : result[0].website,
                }

                const result = await updateOrgByid(data, id);
                if(result.affectedRows) {
                    return res.json({
                        message:  "update orginazation success",
                        status: 200,
                        success: true
                    });
                } else {
                    return res.json({
                        message:  "update orginazation failed",
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
    } catch (error) {
        return res.json({
            success: false,
            message: `Internal server error`,
            status: 500
        })
    }
})



exports.getOrgDetails = (async (req, res) => {
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
            const result = await fetchOrgbyid(id);
            if(result.length !== 0) {
                return res.json({
                    message: "fetch user details success",
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
});
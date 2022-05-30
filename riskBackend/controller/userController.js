const { addUser, fetchUserByEmail,
    fetchUser, updateUser, fetchUserbytoken, updateUserbytoken,
    fetchUserbyid, fetchUserbysocial, updateUsersocail, fetchUserList,
    fetchUserById, updateUserById,
    updateUserType,addUserlink, fetchUserToken, updateVerifyUser } = require('../models/users');
const {addOrg}  = require('../models/org'); 
const {  getList,getRolepermission,updateRolepermission,deleterolepermission,getpermissionbyID,
    getModule,addRolepermission} = require('../models/permission');
const {fetchJob} = require('../models/job');
const { sendOTP } = require('../helper/common');

const Joi = require('joi');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { getData } = require('../models/common');
const saltRounds = 10;
function betweenRandomNumber(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}
var transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    // secure: true,
    auth: {
        user: 'chandni.ctinfotech@gmail.com',
        pass: 'yrfdzdwatiawccka'
    }
});

exports.signUp = (async (req, res) => {
    try {
        const { email, firstname, lastname, password } = req.body;
        const actToken = betweenRandomNumber(10000000, 99999999);
        const schema = Joi.alternatives(
            Joi.object({
                email: Joi.string()
                    .min(5)
                    .max(255)
                    .email({tlds: { allow: false } })
                    .lowercase()
                    .required(),
                password: Joi.string().min(5).max(10).required().messages({
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 5 value required",
                    "string.max": "maximum 10 values allowed",
                }),
                firstname: Joi.string().empty().required().messages({
                    "string.empty": "can't be empty",
                    "string.required": "firstname is required",
                }),
                lastname: Joi.string().empty().required().messages({
                    "string.empty": "lastname can't be empty",
                    "string.required": "lastname is required",
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
            const result = await fetchUserByEmail(email);
            if (result.length === 0) {
                bcrypt.genSalt(saltRounds, async function (err, salt) {
                    bcrypt.hash(password, salt, async function (err, hash) {
                        if (err) throw err;

                        let org = {
                            email: email,                        
                            org_name:firstname,
                            business_name:firstname,
                        }

                        const result2 = await addOrg(org);
                         let user = {
                            email: email,
                            password: hash,
                            firstname:firstname,
                            lastname:lastname,
                            user_type:true,
                            owner_type:true,
                            org_id:result2.insertId,
                            act_token: actToken
                        }
                        const result = await addUser(user);
                        
                     

                       // console.log("add user", result)
                        if (result.affectedRows > 0  && result2.affectedRows > 0) {
                            let userlink = {                                                                          
                                user_id:result.insertId,
                                org_id:result2.insertId,
                            }
                           const result3 = await addUserlink(userlink);


                           let mailOptions = {
                                from: 'chandni.ctinfotech@gmail.com',
                                to: email,
                                subject: 'Activate Account',
                                html: `<table width="100%" border=false cellspacing=false cellpadding=false>
                                <tr>
                                   <td class="bodycopy" style="text-align:left;">
                                      <center>
                                         <div align="center"></div>
                                         <p></p>
                                         <h2 style="text-align: center;margin-top:15px;"><strong>Your account has been created successfully and is ready to use </strong></h2>
                                         <p style="color:#333"> Please <a href="http://3.19.146.104/verifyUser/${actToken}/${result.insertId}">click here</a>  to activate your account.</p>
                                      </center>
                                   </td>
                                </tr>
                             </table>`
                            };

                           transporter.sendMail(mailOptions, async function (error, info) {
                                if (error) {
                                    return res.json({
                                        success: false,
                                        message: 'Mail Not delivered'
                                    })
                                } else {
                                    return res.json({
                                        success: true,
                                        message: "Thank you, You will receive an e-mail in the next 5 minutes with instructions for resetting your password. If you Don't receive this e-mail, please check your junk mail folder or contact us for further assistance."
                                    })
                                }
                            })
                                                       
                            return res.json({
                                "success": true, "message": "Your account has been successfully created. An email has been sent to you with detailed instructions on how to activate it.", "userinfo": result,
                                status: 200
                            });
                        } else {
                            return res.json({
                                message: "user failed to register",
                                status: 400,
                                success: false
                            })
                        }
                    });
                });

            } else {
                return res.json({
                    "success": false,
                    "message": "Already Exists",
                    "status": 400,
                    "userInfo": result
                });
            }

        }
    } catch (error) {
        return res.json({
            message: ""
        })
    }
});

exports.login = (async (req, res) => {
    try {
        const { email, password } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                email: Joi.string()
                    .min(5)
                    .max(255)
                    .email({tlds: { allow: false} })
                    .lowercase()
                    .required(),
                password: Joi.string().min(5).max(20).required().messages({
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 5 value required",
                    "string.max": "maximum 10 values allowed",
                })


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
            const result = await fetchUserByEmail(email);
            if (result.length !== 0) {
                const match = bcrypt.compareSync(password, result[0].password);
                if (match) {
                    if(result[0].act_token != '') {
                        console.log(result[0].act_token, result[0].act_token)
                        return res.json({
                            message: "Please verify your account first",
                            success: false,
                            status: 400
                        })
                    }
                    console.log(result[0].id, "<===id")
                    const token = jwt.sign(
                        {
                            data: {
                                id: result[0].id,
                            },
                        },
                        'SecretKey'
                    );
                    return res.json({
                        "success": true,
                        "message": "Successfully Login",
                        "status": 200,
                        "token": token,
                        "userinfo": result
                    })
                } else {
                    return res.json({
                        message: "wrong password",
                        success: false,
                        status: 400
                    })
                }
            } else {
                return res.json({
                    message: "User not found",
                    status: 400,
                    success: false
                })
            }
        }
    } catch (error) {
        console.log(error, "<==error")
        return res.json({
            message: "Internal server error",
            status: 500,
            success: false
        });
    }
});


exports.login = (async (req, res) => {
    try {
        const { email, password } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                email: Joi.string()
                    .min(5)
                    .max(255)
                    .email({tlds: { allow: false} })
                    .lowercase()
                    .required(),
                password: Joi.string().min(5).max(20).required().messages({
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 5 value required",
                    "string.max": "maximum 10 values allowed",
                })


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
            const result = await fetchUserByEmail(email);
            if (result.length !== 0) {
                const match = bcrypt.compareSync(password, result[0].password);
                if (match) {
                    if(result[0].act_token != '') {
                        console.log(result[0].act_token, result[0].act_token)
                        return res.json({
                            message: "Please verify your account first",
                            success: false,
                            status: 400
                        })
                    }
                    console.log(result[0].id, "<===id")
                    const token = jwt.sign(
                        {
                            data: {
                                id: result[0].id,
                            },
                        },
                        'SecretKey'
                    );
                    return res.json({
                        "success": true,
                        "message": "Successfully Login",
                        "status": 200,
                        "token": token,
                        "userinfo": result
                    })
                } else {
                    return res.json({
                        message: "wrong password",
                        success: false,
                        status: 400
                    })
                }
            } else {
                return res.json({
                    message: "User not found",
                    status: 400,
                    success: false
                })
            }
        }
    } catch (error) {
        console.log(error, "<==error")
        return res.json({
            message: "Internal server error",
            status: 500,
            success: false
        });
    }
});



exports.loginByUserId = (async (req, res) => {
        const { userId } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                userId: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
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
            let where = `where id='${userId}'`;
            const result = await getData('users', where);
            if (result.length !== 0) {
                    if(result[0].act_token != '') {
                        console.log(result[0].act_token, result[0].act_token)
                        return res.json({
                            message: "Please verify your account first",
                            success: false,
                            status: 400
                        })
                    }
                    const token = jwt.sign(
                        {
                            data: {
                                id: result[0].id,
                            },
                        },
                        'SecretKey'
                    );
                    return res.json({
                        "success": true,
                        "message": "Successfully Login",
                        "status": 200,
                        "token": token,
                        "userinfo": result
                    })
            } else {
                return res.json({
                    message: "User not found",
                    status: 400,
                    success: false
                })
            }
        }

});


exports.forgetpassword = (async (req, res) => {
    try {
        const { email } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                email: Joi.string()
                    .min(5)
                    .max(255)
                    .email({ minDomainSegments: 1, tlds: { allow: ["com"] } })
                    .lowercase()
                    .required(),


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
            var token = betweenRandomNumber(10000000, 99999999);
            var mailOptions = {
                from: 'chandni.ctinfotech@gmail.com',
                to: req.body.email,
                subject: 'Forget Password',
                html: '<table width="100%" border=false cellspacing=false cellpadding=false><tr><td class="bodycopy" style="text-align:left;"><center><div align="center"></div> <p></p><h2 style="text-align: center;margin-top:15px;"><strong> Your are one click away to reset your password </strong></h2><p style="color:#333"> Please <a href="http://localhost:3000/resetPassword/' + token + '">click here</a> to reset your password.</p></center></td></tr></table>'
            };
            const result = await fetchUser(email);

            if (result.length != 0) {
                transporter.sendMail(mailOptions, async function (error, info) {
                    if (error) {
                        return res.json({
                            success: false,
                            message: error

                        })
                    } else {

                        const result = await updateUser(token, req.body.email);
                        return res.json({
                            success: true,
                            message: "Thank you, You will receive an e-mail in the next 5 minutes with instructions for resetting your password. If you Don't receive this e-mail, please check your junk mail folder or contact us for further assistance."

                        })
                    }
                })
            } else {
                return res.json({
                    success: false,
                    message: "Email is invalid1!"
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

exports.changepassword = (async (req, res) => {
    const { token, password } = req.body;
    try {
        const schema = Joi.alternatives(
            Joi.object({
                password: Joi.string().min(5).max(10).required().messages({
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 5 value required",
                    "string.max": "maximum 10 values allowed",
                }),
                token: Joi.string().empty().required().messages({
                    "string.empty": "token can't be empty",
                    "string.required": "token is required",
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

            const result = await fetchUserbytoken(token);
            if (result.length != 0) {
                const hash = await bcrypt.hash(password, saltRounds);
                const result2 = await updateUserbytoken(hash, token);

                if (result2) {
                    return res.json({
                        success: true,
                        message: "Password Changed Successfully"
                    })
                } else {
                    return res.json({
                        success: false,
                        message: "Some error occured. Please try again"
                    })
                }

            } else {

                return res.json({
                    success: false,
                    message: "Link expired. Please reset password again"
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
})

exports.sociallogin = (async (req, res) => {
    try {
        const { email, full_name, social } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                email: [Joi.number().empty(),Joi.string().empty()],
                social: [Joi.number().empty(),Joi.string().empty()],
                firstname: [Joi.number().empty(),Joi.string().empty()],
                lastname: [Joi.number().empty(),Joi.string().empty()]
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
            const result = await fetchUserbysocial(email, social);
            const usersemail = await fetchUser(email);

            if (result.length != 0) {
                const token = jwt.sign(
                    {
                        data: {
                            id: result[0].id
                        },
                    },
                    'SecretKey'
                );
                return res.json({
                    success: true,
                    message: "Successfully social Login",
                    userinfo: result,
                    token: token
                })
            } else if (usersemail.length != 0) {
                const updateUser = await updateUsersocail(social, email);
                const token = jwt.sign(
                    {
                        data: {
                            id: usersemail[0].id
                        },
                    },
                    'SecretKey'
                );
                return res.json({
                    success: true,
                    message: "Successfully social Login",
                    userinfo: usersemail,
                    token: token
                })

            } else {

                const result2 = await addUser(req.body);

                if (result2 && result2.insertId != 0) {
                    const result3 = await fetchUserbyId(result2.insertId);

                    const token = jwt.sign(
                        {
                            data: {
                                id: result2.insertId
                            },
                        },
                        'SecretKey'
                    );

                    return res.json({
                        success: true,
                        message: "Successfully social Login",
                        userinfo: result3,
                        token: token
                    })
                } else {
                    return res.json({
                        success: false,
                        message: "Some error occured. Please try again",
                        userinfo: result2
                    })
                }

            }

        }
    } catch (error) {

        return res.json({
            success: false,
            message: "Internal server error",
            userinfo: [],
            status: 500


        })
    }

});

exports.addUser = (async (req, res) => {
    try {
          var curdate = new Date().toISOString().slice(0, 10);
        const { email, firstname, lastname, phone, user_type, job_title,org_id,user_id, job_id, team } = req.body;
        const password = betweenRandomNumber(10000000, 99999999).toString();
        const actToken = betweenRandomNumber(10000000, 99999999);
        const schema = Joi.alternatives(
            Joi.object({
                email: [Joi.number().empty(),Joi.string().empty()],
                firstname: [Joi.number().empty(),Joi.string().empty()],
                lastname: [Joi.number().empty(),Joi.string().empty()],
                phone: [Joi.number().empty(),Joi.string().empty()],
                user_type: [Joi.number().empty(),Joi.string().empty()],
                job_title: [Joi.number().empty(),Joi.string().empty()],
                org_id: [Joi.number().empty(),Joi.string().empty()],
                user_id: [Joi.number().empty(),Joi.string().empty()],
                job_id: [Joi.number().empty(),Joi.string().empty()]
            })
        );
        const result = schema.validate({ email, firstname, lastname, phone, user_type, job_title,org_id,user_id, job_id });

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
            console.log(req.body.team, 'team');
            const data = await fetchUserByEmail(email);
            if (data.length === 0) {
                bcrypt.genSalt(saltRounds, async function (err, salt) {
                    bcrypt.hash(password, salt, async function (err, hash) {
                        if (err) throw err;
                        const result = await addUser({
                            firstname: firstname,
                            lastname: lastname, 
                            email: email,
                            phone: phone,
                            user_type: user_type,
                            job_title: job_title,
                            owner_type:2,
                            org_id:org_id,
                            user_id:user_id,
                            job_id: job_id,
                            act_token: actToken,
                            team: team,
                            password: hash
                        });
                        if (result.affectedRows > 0) {

                             if(user_type != 0){
                                const module = await getModule();          
                                const getpermission = await getpermissionbyID(user_type); 
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
                                                user_id:result.insertId,
                                                created_at:curdate  
                                            });
                                            //console.log(permission1.insertId);
                                        }
                                    })();                       
                                }
                            }



                            let mailOptions = {
                                from: 'chandni.ctinfotech@gmail.com',
                                to: email,
                                subject: 'Activate Account',
                                html: `<table width="100%" border=false cellspacing=false cellpadding=false>
                                <tr>
                                   <td class="bodycopy" style="text-align:left;">
                                      <center>
                                         <div align="center"></div>
                                         <h2 style="text-align: center;margin-top:15px;"><strong>User Credentials </strong></h2>
                                         <h3>Email:  ${email}</h3>
                                         <h3>Password:  ${password}</h3>
                                         <h2 style="text-align: center;margin-top:15px;"><strong>Your account has been created successfully and is ready to use </strong></h2>
                                         <p style="color:#333"> Please <a href="http://3.19.146.104/verifyUser/${actToken}/${result.insertId}">click here</a>  to activate your account.</p>
                                      </center>
                                   </td>
                                </tr>
                             </table>`
                            };

                           transporter.sendMail(mailOptions, async function (error, info) {
                                if (error) {
                                    return res.json({
                                        success: false,
                                        status: 400,
                                        message: 'Mail Not delivered'
                                    })
                                } else {
                                    return res.json({
                                        success: true,
                                        message: "user add success",
                                        status: 200
                                    })
                                }
                            })
                        }
                        else {
                            return res.json({
                                message: "user add failed",
                                status: 400,
                                success: false

                            });
                        }
                    });
                });
            }
            else {
                return res.json({
                    message: "user already exist",
                    status: 400,
                    success: false
                })
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
exports.fetchUserList = (async (req, res) => {
    try {
        let { start,usertype, guest } = req.body;
        let sort_by = 0;
        if(req.body.sort_by){
           sort_by = req.body.sort_by;
        } else {
            sort_by =2;
        }

        let user_id = 0;
        let org_id = 0;
        if(req.body.user_id){
            user_id =req.body.user_id;
        } else {
            user_id=0;
        } 

        if(req.body.org_id){
            org_id = req.body.org_id
        }else{
            org_id=0;
        }
        
        if(req.body.search_keyword){
            search_keyword = req.body.search_keyword
        }else{
            search_keyword='';
        }

        if(req.body.team_id){
            team_id = req.body.team_id
        }else{
            team_id='';
        }
        
        const { limit, offset } = getPagination(start, 10);
        const schema = Joi.alternatives(
            Joi.object({
                start: Joi.number().required().messages({
                    "number.required": "start is required!!",
                    "number.empty": "end can't be empty!!",                    
                }),
                usertype:Joi.number().required().messages({
                    "number.required": "usertype is required!!",
                    "number.empty": "usertype can't be empty!!",                    
                }),
                guest:Joi.number().required().messages({
                    "number.required": "guest is required!!",
                    "number.empty": "guest can't be empty!!",                    
                })
            })
        );
        const result = schema.validate({start,usertype,guest});

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
          
            const data = await fetchUserList(usertype,guest,sort_by,user_id,org_id,limit, offset, search_keyword, team_id);
            //console.log(usertype,data );
            if (data.length != 0) {
                const result = data.map((item) => {
                    let result = {};
                    result["id"] = item.id;
                    result["firstname"] = item.firstname;
                    result["lastname"] = item.lastname;
                    result["team"] = item.team;
                    result["job_name"] = item.job_name;
                    result["email"] = item.email;
                    result["phone"] = item.phone;
                    result["user_type"] = item.user_type;
                    result["job_title"] = item.job_title;
                    result["user_type_name"] = item.name;
                    result["created_at"] = item.created_at;
                    return result;
                });
               // console.log(result, 'resultttttttttttttttttttt');
                return res.json({
                    message: "user_list fetch succes",
                    status: 200,
                    success: true,
                    data: result,
                });
            } else {
                return res.json({
                    message: "failed to fetch",
                    status: 400,
                    success: false,
                    data: [],
                })
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
exports.editUser = (async (req, res) => {
 try{
        const { email, firstname, lastname, phone, user_type, job_title, id, job_id, team, link_users } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                email: [Joi.number().empty(),Joi.string().empty()],
                firstname: [Joi.number().empty(),Joi.string().empty()],
                lastname: [Joi.number().empty(),Joi.string().empty()],
                phone: [Joi.number().empty(),Joi.string().empty()],
                user_type: [Joi.number().empty(),Joi.string().empty()],
                job_title: [Joi.number().empty(),Joi.string().empty()],
                job_id: [Joi.number().empty(),Joi.string().empty()],
                id: [Joi.number().empty(),Joi.string().empty()],
                link_users: [Joi.number().optional().allow(''),Joi.string().optional().allow('')]
            })
        );
        const result = schema.validate({ email, firstname, lastname, phone, user_type, job_title, id, job_id});

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
            const userInfo = await fetchUserById(id);
            if (userInfo.length !== 0) {
                let user = {
                    email: email ? email : userInfo[0].email,
                    firstname: firstname ? firstname : userInfo[0].firstname,
                    lastname: lastname ? lastname : userInfo[0].lastname,
                    phone: phone ? phone : userInfo[0].phone,
                    user_type: user_type ? user_type : userInfo[0].user_type,
                    job_title: job_title ? job_title : userInfo[0].job_title,
                    job_id:  job_id ? job_id : userInfo[0].job_id,
                    link_users: link_users?link_users: userInfo[0].link_users,
                    team: team
                };
                const result = await updateUserById(user, id);
                if (result.affectedRows) {
                    return res.json({
                        message: "update user success",
                        status: 200,
                        success: true
                    })
                }
                else {
                    return res.json({
                        message: "update user failed ",
                        status: 400,
                        success: false
                    })
                }
            }
            else {
                return res.json({
                    messgae: "data not found",
                    status: 400,
                    success: false
                })
            }
        }
    } catch(err) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500
        })
    }

});

exports.verifyUser = (async (req, res) => {
    try {
        const {token} = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                token: [Joi.number().empty(),Joi.string().empty()],              
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
            });
        } else {
           const result = await fetchUserToken(token);
           if(result.length != 0) {
            let data = {
                act_token: ''
               };
    
                const resultUpdate = await updateVerifyUser(data, result[0].id);
                if (resultUpdate.affectedRows) {
                    return res.json({
                        message: "verify user successfully",
                        status: 200,
                        success: true
                    })
                } else {
                    return res.json({
                        message: "update user failed ",
                        status: 400,
                        success: false
                    })
                }

           } else {
            return res.json({
                message: 'Token not found',
                status: 400,
                success: false
            })
           }
        }
    } catch(err) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500
        })
    }
});

exports.getUserDetails = (async (req, res) => {
    try {
        const { id } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                id: Joi.number().empty().required().messages({
                    "number.empty": "id can't be empty",
                    "number.required": "id  is required",
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
            const results = await fetchUserById(id);
            if (results.length !== 0) {
                let userInfo = {};
                userInfo["id"] = results[0].id;
                userInfo["email"] = results[0].email;
                userInfo["firstname"] = results[0].firstname;
                userInfo["lastname"] = results[0].lastname;
                userInfo["phone"] = results[0].phone;
                userInfo["user_type"] = results[0].user_type;
                userInfo["job_title"] = results[0].job_title;
                userInfo["job_id"] = results[0].job_id;
                userInfo["user_type_name"] = results[0].name;
                userInfo["created_at"] = results[0].created_at;
                userInfo["team"] = results[0].team;
                console.log(userInfo, 'team');
                return res.json({
                    message: "fetch user details success",
                    status: 200,
                    success: true,
                    data: userInfo
                })
            }
            else {
                return res.json({
                    message: "fetch details failed",
                    status: 400,
                    success: false
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
exports.userTypeUpdate = (async (req, res) => {
    try {
        const { id, user_type } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                id: Joi.number().empty().required().messages({
                    "number.empty": "id can't be empty",
                    "number.required": "id  is required",
                }),
                user_type: Joi.number().empty().required().messages({
                    "number.empty": "user_type can't be empty",
                    "number.required": "user_type  is required",
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
            const result = await updateUserType(user_type, id);
            if (result.affectedRows > 0) {
                if(user_type != 0) {
                    const deletperm = await deleterolepermission(id);
                    const module = await getModule();          
                    const getpermission = await getpermissionbyID(user_type); 
                    const permission = getpermission[0]; 
                    console.log(permission, 'permission');
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
                                    user_id:id,
                                    created_at:new Date().toISOString().slice(0, 10)  
                                });
                            }
                        })();                       
                    }
                }

                return res.json({
                    message: "type updated successfully",
                    status: 200,
                    success: true
                })
            }
            else {
                return res.json({
                    message: "type updated failed",
                    status: 400,
                    success: false
                })
            }
        }
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500
        })
    }
})
exports.dummy= (async (req, res) => {
    try {
        return res.json({
            message: "fetch success",
            status: 200,
            success: true,
            data:[{
                id:true,
                type:"Risk",
                add:1,
                delete:2,
                change_status:false
            },{
                id:"2",
                type:"Actions",
                add:2,
                delete:1,
                change_status:false
            },{
                id:"3",
                type:"Documents",
                add:1,
                delete:2,
                change_status:false
            }]
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500
        })  
    }
})
exports.rolePermission = (async (req, res) => {
    try {
        
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500
        })  
    }
})

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};


exports.jobList = (async (req, res) => {
    try{
        const result = await fetchJob();
        if(result.length !== 0) {
            return res.json({
                message:"fetch permission list success",
                status: 200,
                success:true,
                data: result
            })
        } else {
            return res.json({
                message:"fetch failed",
                status: 400,
                success:false
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500
        }) 
    }
});



exports.sendMobileOTP = (async (req, res) => {

        const {mobileNumber} = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                mobileNumber: [Joi.number().empty(),Joi.string().empty()],              
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

        sendOTP(mobileNumber);
        return res.json({
            message: "OTP Send Successfully",
            status: 200,
            success: true,
        })
    });


    exports.getUserPermission = (async (req, res) => {
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
                let whereUser = `where id = '${id}'`;
                const result = await getData('users', whereUser);
                const permissionInfo = await getRolepermission(id);
                if(result.length !== 0) {
                    return res.json({
                        message: "fetch user permission details success",
                        status: 200,
                        success: true,
                        userInfo: result[0],
                        permissionInfo: permissionInfo
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


     exports.linkUsers = (async (req, res) => {
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
                let whereUser = `where id = '${id}'`;
                const result = await getData('users', whereUser);
                if(result.length !== 0) {
                	   let userLinkInfo = [];
				        if(result[0].link_users) {
				            let whereInfo = `where id IN (${result[0].link_users})`;
				            userLinkInfo = await getData('users', whereInfo);
				        }
                    return res.json({
                        message: "fetch team details success",
                        status: 200,
                        success: true,
                        userInfo: result[0],
                        userLinkInfo: userLinkInfo
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



    exports.addGuestUser = (async (req, res) => {
        try {
            const { email } = req.body;
            const schema = Joi.alternatives(
                Joi.object({
                    email: [Joi.number().optional().allow(''),Joi.string().optional().allow('')]
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
                const result = await fetchUserByEmail(email);
                if (result.length === 0) {
                    let mailOptions = {
                        from: 'chandni.ctinfotech@gmail.com',
                        to: email,
                        subject: 'Guest User',
                        html: `<table width="100%" border=false cellspacing=false cellpadding=false>
                        <tr>
                            <td class="bodycopy" style="text-align:left;">
                                <center>
                                    <div align="center"></div>
                                    <p></p>
                                    <h2 style="text-align: center;margin-top:15px;"><strong>Your can created your user by below link </strong></h2>
                                    <p style="color:#333"> Please <a href="http://3.19.146.104/sign-up">click here</a>  to activate your account.</p>
                                </center>
                            </td>
                        </tr>
                        </table>`
                    };

                    transporter.sendMail(mailOptions, async function (error, info) {
                        if (error) {
                            return res.json({
                                success: false,
                                message: 'Mail Not delivered'
                            })
                        } else {
                            return res.json({
                                success: true,
                                message: "Thank you, You will receive an e-mail in the next 5 minutes with instructions for resetting your password. If you Don't receive this e-mail, please check your junk mail folder or contact us for further assistance."
                            })
                        }
                    });
                } else {
                    return res.json({
                        "success": false,
                        "message": "Already Exists",
                        "status": 400,
                        "userInfo": result
                    });
                }
    
            }
        } catch (error) {
            return res.json({
                message: ""
            })
        }
    });

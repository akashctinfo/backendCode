const { insertData, getData, updateData, deleteData }  = require('../models/common');
const Joi = require('joi');

const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream } = require('../middleware/s3');
const { fetchDocumentList } = require('../models/content');
const { getPagination } = require('../helper/common');


exports.uploadDocument = (async (req, res) => {
    console.log(__basedir + "/public/upload/" + req.file.filename, 'fileeeeeeeeeeeee');
    console.log(req.file.mimetype);
    console.log("/upload/" + req.file.filename);
    const file = req.file
    const result = await uploadFile(file)
    await unlinkFile(file.path)
    console.log(result)
    const description = req.body.description
    return res.json({
        success: false,
        message: `/images/${result.Key}`
    });
});


exports.addDocument = (async (req, res) => {
    const { 
        user_id,
        org_id,
        section_id,
        category_id, 
        document_name, 
        current_version, 
        next_review, 
        document_type, 
        document_attributes,
        visible_to
    } = req.body;

        const schema = Joi.alternatives(
            Joi.object({
                user_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                org_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                section_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                category_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                document_name: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                current_version: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                next_review: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                document_type: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                document_attributes: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
                visible_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
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

        console.log(req.file, 'req.file');

        let filename = '';
        let filesize = '';
        if(req.file) {
            const file = req.file
            filesize = file.size
            const resultUpload = await uploadFile(file);
            await unlinkFile(file.path);
            filename = resultUpload.Key;
        }
        

        const resultInsert = await insertData('tbl_document', '', {
            user_id: user_id,
            org_id: org_id,
            section_id: section_id,
            category_id: category_id,
            document_name: document_name,
            current_version: current_version,
            next_review: next_review,
            document_type: document_type,
            document_attributes: document_attributes,
            document_file: filename,
            document_size: filesize,
            updated_date: new Date().toISOString().slice(0, 10),
            created_at: new Date().toISOString().slice(0, 10),
            visible_to: visible_to
        });


        if(resultInsert.affectedRows > 0) {
            return res.json({
                message: "document added successfully",
                status: 200,
                success: true,
                insertId: resultInsert.insertId
            });
        } else {
            return res.json({   
                message: "document add failed",
                status: 400,
                success: false
            });
        }
});


exports.editDocument = (async(req, res) => {
    const {
        id,
        section_id,
        category_id,  
        document_name, 
        current_version, 
        next_review, 
        document_type, 
        document_attributes,
        visible_to
    } = req.body;
    const schema = Joi.alternatives(
        Joi.object({
            id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            document_name: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            current_version: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            next_review: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            document_type: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            document_attributes: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            section_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            category_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            visible_to: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
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
    const documentInfo = await getData('tbl_document', where) 

    if(documentInfo.length !== 0) {
        let filename = '';
        let filesize = '';
        if(req.file) {
            console.log(req.file, 'req.file');
            const file = req.file
            filesize = file.size
            const resultUpload = await uploadFile(file);
            await unlinkFile(file.path);
            filename = resultUpload.Key;
        }


        let data = {
            document_name: document_name? document_name: documentInfo[0].document_name,
            current_version: current_version? current_version: documentInfo[0].current_version,
            next_review: next_review? next_review: documentInfo[0].next_review,
            document_type: document_type? document_type: documentInfo[0].document_type,
            document_attributes: document_attributes? document_attributes: documentInfo[0].document_attributes,
            document_file: filename? filename: documentInfo[0].document_file,
            document_size: filesize? filesize: documentInfo[0].document_size,
            section_id: section_id? section_id: documentInfo[0].section_id,
            category_id: category_id? category_id: documentInfo[0].category_id,
            visible_to: visible_to,
            updated_date: new Date().toISOString().slice(0, 10)
        }

        const resultUpdate = await updateData('tbl_document', where, data);

        if(resultUpdate.affectedRows) {
            return res.json({
                message:  "update document success",
                status: 200,
                success: true
            });
        } else {
            return res.json({
                message:  "update document failed",
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


exports.documentList = (async (req, res) => {
    const {start, user_id, org_id, search_keyword, sort_by, section_id, category_id} = req.body;
    const {limit, offset} = getPagination(start, 10);

    const schema = Joi.alternatives(
        Joi.object({
            start: [Joi.number().empty(),Joi.string().empty()],
            user_id: [Joi.number().empty(),Joi.string().empty()],
            org_id: [Joi.number().empty(),Joi.string().empty()],
            search_keyword: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            sort_by: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            section_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],
            category_id: [Joi.number().optional().allow(''),Joi.string().optional().allow('')]
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

    const data = await fetchDocumentList('', sort_by,limit, offset,user_id, org_id, search_keyword, section_id, category_id);
    if(data.length !== 0) {
        data.forEach((data) => {
            if(data.document_file) {
                data.document_file = S3_URL+data.document_file;
            } 
        });

        return res.json({
            message: "fetch document list success",
            status: 200,
            success: true,
            data: data
        })
    } else {
        return res.json({
            message: "fetch document list failed",
            status: 400,
            success: false
        })
    }

});


exports.documentDetail = (async (req, res) => {
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
    
    let where = `where D.id='${id}'`;
    const documentInfo = await fetchDocumentList(where, '', '', '', '', '', '');
    console.log(documentInfo, 'documentInfo');
    if(documentInfo.length !== 0) {
        if(documentInfo[0].document_file) {
            documentInfo[0].document_file = S3_URL+documentInfo[0].document_file;
        } 

        return res.json({
            message: "fetch document details success",
            status: 200,
            success: true,
            data: documentInfo[0]
        })
    } else {
        return res.json({
            message: "fetch details failed",
            status: 400,
            success: false
        })
    }
});


exports.documentCategoryList = (async(req, res) => {
    const documentInfo = await getData('tbl_document_category', '') 
    if(documentInfo.length !== 0) {
        return res.json({
            message: "fetch document category details success",
            status: 200,
            success: true,
            data: documentInfo
        })
    } else {
        return res.json({
            message: "fetch details failed",
            status: 400,
            success: false
        })
    }
});


exports.addDocumentSection = (async (req, res) => {
    const { user_id, org_id, section_name, category_id} = req.body;

    const schema = Joi.alternatives(
        Joi.object({
            user_id: [Joi.number().empty(),Joi.string().empty()],
            org_id: [Joi.number().empty(),Joi.string().empty()],
            category_id: [Joi.number().empty(),Joi.string().empty()],
            section_name: [Joi.number().empty(),Joi.string().empty()]
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
    }
    
    
    const resultInsert = await insertData('tbl_document_section', '', {
        user_id: user_id,
        org_id: org_id,
        category_id: category_id,
        section_name: section_name
    });

    if(resultInsert.affectedRows > 0) {
        return res.json({
            message: "section added successfully",
            status: 200,
            success: true
        });
    } else {
        return res.json({
            message: "section add failed",
            status: 400,
            success: false
        });
    }
});



exports.editDocumentSection = (async (req, res) => {
        const { id, section_name, category_id} = req.body;

        const schema = Joi.alternatives(
            Joi.object({
                id: [Joi.number().empty(),Joi.string().empty()],
                section_name: [Joi.number().empty(),Joi.string().empty()],
                category_id: [Joi.number().empty(),Joi.string().empty()],
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
                success: false
            })
        }

        let where = `where id = '${id}'`;
        const documentInfo = await getData('tbl_document_section', where) 

        if(documentInfo.length !== 0) {
            let data = {
                section_name: section_name? section_name: documentInfo[0].section_name,
                category_id: category_id? category_id: documentInfo[0].category_id,
            }

            const resultUpdate = await updateData('tbl_document_section', where, data);

            if(resultUpdate.affectedRows) {
                return res.json({
                    message:  "update document success",
                    status: 200,
                    success: true
                });
            } else {
                return res.json({
                    message:  "update document failed",
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


exports.documentSectionList = (async(req, res) => {
    const {org_id} = req.body;

        const schema = Joi.alternatives(
            Joi.object({
                org_id: [Joi.number().empty(),Joi.string().empty()]
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
                success: false
            })
        }

        let where = `where org_id = '${org_id}'`;
        const documentInfo = await getData('tbl_document_section', where) 
        if(documentInfo.length !== 0) {
            return res.json({
                message: "fetch document section details success",
                status: 200,
                success: true,
                data: documentInfo
            })
        } else {
            return res.json({
                message: "fetch details failed",
                status: 400,
                success: false
            })
        }
});



exports.documentSectionDetail  = (async(req, res) => {
    const {id} = req.body;

        const schema = Joi.alternatives(
            Joi.object({
                id: [Joi.number().empty(),Joi.string().empty()]
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
                success: false
            })
        }

        let where = `where id = '${id}'`;
        const documentInfo = await getData('tbl_document_section', where) 
        if(documentInfo.length !== 0) {
            return res.json({
                message: "fetch document section details success",
                status: 200,
                success: true,
                data: documentInfo[0]
            })
        } else {
            return res.json({
                message: "fetch details failed",
                status: 400,
                success: false
            })
        }
});



exports.deleteDocumentSection = (async (req, res) => {
    const {id} = req.body;    
    const schema = Joi.alternatives(
        Joi.object({
            id: [Joi.number().empty(),Joi.string().empty()]
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
            success: false
        })
    }

    let where = `where id='${id}'`;
    await deleteData('tbl_document_section', where);

    let whereUpdate = `where section_id='${id}'`;
    await updateData('tbl_document', whereUpdate, {
        section_id: '0'
    });

    return res.json({
        message: "document section deleted successfully",
        status: 200,
        success: true
    })
});


exports.contentAttributeList = (async(req, res) => {
    const documentInfo = await getData('tbl_content_attribute', '') 
    if(documentInfo.length !== 0) {
        return res.json({
            message: "fetch content attribute list success",
            status: 200,
            success: true,
            data: documentInfo
        })
    } else {
        return res.json({
            message: "fetch details failed",
            status: 400,
            success: false
        })
    }
});

exports.updatedocumentBysection = (async (req, res) => {
    const { document_id, section_id, category_id} = req.body;
    const schema = Joi.alternatives(
        Joi.object({
            document_id: [Joi.number().empty(),Joi.string().empty()],
            section_id: [Joi.number().empty(),Joi.string().empty()],
            category_id: [Joi.number().empty(),Joi.string().empty()],
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
            success: false
        })
    }
    let array = document_id.split(",");
       // console.log('array',array);
        let where = `where id IN(${array})`;
        let data = {
            category_id: category_id? category_id: category_id,
            section_id:section_id? section_id: section_id,              
        }
        const resultUpdate = await updateData('tbl_document', where, data);
    if(resultUpdate.affectedRows) {
        return res.json({
            message:  "update document success",
            status: 200,
            success: true
        });
    } else {
        return res.json({
            message:  "update document failed",
            status: 400,
            success: false
        });
    }  
    
});

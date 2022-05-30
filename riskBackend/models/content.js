const db = require('../utils/database');
module.exports = {
    fetchDocumentList: (async(whereData, sort_by, start, end, user_id, org_id, search_keyword, section_id, category_id) => {
        let where = '';
        let sort = 'order by D.id DESC';
        let limit = '';

        if(whereData) {
            where = whereData;
        } else {
            where = `where D.org_id='${org_id}'`;
        }


        if(start || end) {
            limit = `LIMIT ${start} OFFSET ${end}`;
        }
        
        if(section_id){
            where+=`and D.section_id='${section_id}'`;
        }

        if(category_id){
            where+=`and D.category_id='${category_id}'`;
        }
        
        if(search_keyword){
            where+=`and (D.document_name LIKE '%${search_keyword}%' OR D.current_version LIKE '%${search_keyword}%')`;
        }

        // if(sort_by == 1){
        //     sort = " order by users.firstname ASC ";
        // }

        return db.query(
        `select D.*, IFNULL(U.firstname, '') as user_firstname, IFNULL(U.lastname, '') as user_lastname, IFNULL(U.email, '') as user_email`+
        ` from tbl_document as D left join users as U on U.id = D.user_id`+
        // ` left join tbl_setting_risk_type as SRT on SRT.id = R.type`+
        ` ${where} ${sort} ${limit}`);  
    }),
}
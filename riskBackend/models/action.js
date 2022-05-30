const db = require('../utils/database');
module.exports = {
    fetchActionList: (async(whereData, sort_by, start, end, user_id, org_id, search_keyword, status) => {
        let where = '';
        let sort = 'order by A.id DESC';
        let limit = '';

        if(whereData) {
            where = whereData;
        } else {
            where = `where A.org_id='${org_id}'`;
        }


        if(start || end) {
            limit = `LIMIT ${start} OFFSET ${end}`;
        }
        
        

        
        if(search_keyword){
            where+=`and (A.action_title LIKE '%${search_keyword}%' OR A.description LIKE '%${search_keyword}%')`;
        }

        if(status) {
            console.log(typeof status, 'status');
            where+=`and A.status='${status}'`;
        }

        // if(sort_by == 1){
        //     sort = " order by users.firstname ASC ";
        // }

        return db.query(
        `select A.*, IFNULL(U.firstname, '') as user_firstname_asign_to, IFNULL(U.lastname, '') as user_lastname_asign_to, IFNULL(U.email, '') as user_email_asign_to`+
        ` from tbl_action as A left join users as U on U.id = A.assigned_to`+
        // ` left join tbl_setting_risk_type as SRT on SRT.id = R.type`+
        ` ${where} ${sort} ${limit}`);  
    }),
}
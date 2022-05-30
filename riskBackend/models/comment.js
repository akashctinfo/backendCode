const db = require('../utils/database');


module.exports = {
    fetchRiskCommentList: (async(whereData, start, end, risk_id) => {
        let where = '';
        let sort = 'order by RC.id DESC';
        let limit = '';

        if(whereData) {
            where = whereData;
        } else {
            where = `where RC.risk_id='${risk_id}'`;
        }

        if(start || end) {
            limit = `LIMIT ${start} OFFSET ${end}`;
        }


        return db.query(
        `select RC.*, U.firstname as user_firstname, U.lastname as user_lastname, U.email as user_email,`+
        `(SELECT COUNT(*) as count FROM tbl_risk_favorite WHERE comment_id=RC.id and type='1') as like_count,`+
        `(SELECT COUNT(*) as count FROM tbl_risk_favorite WHERE comment_id=RC.id and type='2') as love_count,`+
        `(SELECT COUNT(*) as count FROM tbl_risk_favorite WHERE comment_id=RC.id and type='3') as thanks_count,`+
        `(SELECT COUNT(*) as count FROM tbl_risk_favorite WHERE comment_id=RC.id and type='4') as thinking_count,`+
        `(SELECT COUNT(*) as count FROM tbl_risk_favorite WHERE comment_id=RC.id and type='5') as support_count`+
        ` from tbl_risk_comments as RC join users as U on U.id = RC.user_id`+
        ` ${where} ${sort} ${limit}`);  
    }),
    fetchActionCommentList: (async(whereData, start, end, action_id) => {
        let where = '';
        let sort = 'order by AC.id DESC';
        let limit = '';

        if(whereData) {
            where = whereData;
        } else {
            where = `where AC.action_id='${action_id}'`;
        }

        if(start || end) {
            limit = `LIMIT ${start} OFFSET ${end}`;
        }


        return db.query(
        `select AC.*, U.firstname as user_firstname, U.lastname as user_lastname, U.email as user_email,`+
        `(SELECT COUNT(*) as count FROM tbl_action_favorite WHERE comment_id=AC.id and type='1') as like_count,`+
        `(SELECT COUNT(*) as count FROM tbl_action_favorite WHERE comment_id=AC.id and type='2') as love_count,`+
        `(SELECT COUNT(*) as count FROM tbl_action_favorite WHERE comment_id=AC.id and type='3') as thanks_count,`+
        `(SELECT COUNT(*) as count FROM tbl_action_favorite WHERE comment_id=AC.id and type='4') as thinking_count,`+
        `(SELECT COUNT(*) as count FROM tbl_action_favorite WHERE comment_id=AC.id and type='5') as support_count`+
        ` from tbl_action_comments as AC join users as U on U.id = AC.user_id`+
        ` ${where} ${sort} ${limit}`);  
    }),
}
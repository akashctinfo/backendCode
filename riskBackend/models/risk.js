const db = require('../utils/database');
module.exports={
    fetchrisk_count : (async () => {
        return db.query('select  count(id) as total from  tbl_risk');
    }),
    fetchRiskList: (async(whereData, sort_by, start, end, user_id, org_id, search_keyword, impact_on, type, likelihood) => {
        let where = '';
        let sort = 'order by R.id DESC';
        let limit = '';

        if(whereData) {
            where = whereData;
        } else {
            where = `where R.org_id='${org_id}'`;
        }


        if(start || end) {
            limit = `LIMIT ${start} OFFSET ${end}`;
        }

        if(impact_on) {
            where+=`and R.impact_on='${impact_on}'`;
        }

        if(type) {
            where+=`and R.type='${type}'`;
        }

        if(likelihood) {
            where+=`and R.likelihood='${likelihood}'`;
        }

        where+=`and ( FIND_IN_SET('${user_id}', R.visible_to) OR FIND_IN_SET_X(R.team_visible_to, U.team) OR raised_by='${user_id}'  OR R.visible_all_status='1')`;
        
        if(search_keyword){
            where+=`
            and (R.summary LIKE '%${search_keyword}%' OR `+
            `R.description LIKE '%${search_keyword}%' OR `+
            `R.mitigation_action LIKE '%${search_keyword}%' OR `+
            `U.email LIKE '%${search_keyword}%'  OR `+
            `U.firstname LIKE '%${search_keyword}%' OR `+
            `U.lastname LIKE '%${search_keyword}%' OR `+
            `SRS.name LIKE '%${search_keyword}%' OR `+
            `SRI.name LIKE '%${search_keyword}%' OR `+
            `SRC.name LIKE '%${search_keyword}%' OR `+
            `SRST.name LIKE '%${search_keyword}%' OR `+
            `concat(U.firstname , ' ' , U.lastname) LIKE '%${search_keyword}%'  OR `+
            `SRT.name LIKE '%${search_keyword}%')`;
        }

        if(sort_by == 1){
            sort = " order by users.firstname ASC ";
        }

        return db.query(
        `select R.*, U.firstname as user_firstname, U.lastname as user_lastname, U.email as user_email,`+
        `IFNULL(SRT.name, '') as risk_type,`+
        `IFNULL(SRS.name, '') as risk_stage,`+
        `IFNULL(SRC.name, '') as risk_caused_by,`+
        `IFNULL(SRI.name, '') as risk_impact_on,`+
        `IFNULL(SRST.name, '') as risk_status,`+
        `IFNULL(UR.firstname, '') as raised_by_firstname, IFNULL(UR.lastname, '') as raised_by_lastname,`+
        `IFNULL(URA.firstname, '') as assigned_to_by_firstname, IFNULL(URA.lastname, '') as assigned_to_lastname,`+
        `IFNULL(R.expected_close_date, '') as expected_close_date,`+
        `IFNULL(R.next_action_date, '') as next_action_date`+
        ` from tbl_risk as R join users as U on U.id = R.user_id`+
        ` left join users as UR on UR.id = R.raised_by`+
        ` left join users as URA on URA.id = R.assigned_to`+
        ` left join tbl_setting_risk_type as SRT on SRT.id = R.type`+
        ` left join tbl_setting_risk_stage as SRS on SRS.id = R.stage`+
        ` left join tbl_setting_risk_caused_by as SRC on SRC.id = R.caused_by`+
        ` left join tbl_setting_risk_impact_on as SRI on SRI.id = R.impact_on`+
        ` left join tbl_setting_risk_status as SRST on SRST.id = R.status`+
        ` ${where} ${sort} ${limit}`);  
    }),
    getVisibleToUser: (async(table, where) => {
        return db.query(`select id, firstname, lastname from ${table} ${where}`);  
    }),
}


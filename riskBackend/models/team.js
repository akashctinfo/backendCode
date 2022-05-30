const db = require('../utils/database');

module.exports = {
    fetchTeamById: (async(id) => {
        return db.query('select * from tbl_team where id = ?',[id])  
    }),
    addTeam: (async (teamDetail) => {
        return db.query('insert into tbl_team set ?', [teamDetail]);
    }),
    updateTeamById: (async (data, id) => {
        return db.query('update tbl_team SET ? where id = ?', [data, id]);
    }),
    fetchTeamList: (async(user_id, org_id, visibility = '', search_keyword = '') => {
        let whereVisibility = '';
        let whereSearchKeyword = '';
        if(visibility) {
            whereVisibility =   ` and  visibility = ${visibility}`;
        }

        if(search_keyword){
            whereSearchKeyword = `and (team_name LIKE '%${search_keyword}%' OR address LIKE '%${search_keyword}%' OR country LIKE '%${search_keyword}%'  OR state LIKE '%${search_keyword}%')`;
        } else {
            whereSearchKeyword = '';
        }
        return db.query(`select *, IFNULL((SELECT COUNT(id)
        FROM users where FIND_IN_SET(tbl_team.id,team)), 0) as user_count from tbl_team where user_id = ? and org_id = ? ${whereVisibility} ${whereSearchKeyword}`, [user_id, org_id]);
    }),
    deleteTeam :(async (id) => {
        return db.query('Delete from tbl_team where id = ?', [id]);
    })
}
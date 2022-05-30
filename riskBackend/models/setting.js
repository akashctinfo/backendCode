const db = require('../utils/database');
module.exports={
    fetchSettingList :(async (user_id, org_id) => {
        return db.query('select * from tbl_setting where org_id = ?', [org_id]);
    }),
    fetchSettingById: (async(id) => {
        return db.query('select * from tbl_setting where id = ?',[id])  
    }),
    updateSettingById: (async (data, id) => {
        return db.query('update tbl_setting SET ? where id = ?', [data, id]);
    }),
    addSetting: (async (data) => {
        return db.query('insert into tbl_setting (field_visibility, field_name, custom_label, required_status, user_id, org_id, field_type, range_info) VALUES ?', [data]);
    }),
    deleteSetting :(async (user_id,org_id) => {
        return db.query('Delete from tbl_setting where user_id = ? and  org_id = ?', [user_id,org_id]);
    }),
    addOptionsSetting: (async (table, data) => {
        return db.query(`insert into ${table} (user_id, org_id, name) VALUES ?`, [data]);
    }),
}
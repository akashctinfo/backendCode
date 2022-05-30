const db = require('../utils/database');
module.exports={
   
    fetchOrgbyid :(async (id) => {
        return db.query('select *  from tbl_org where id = ?',[id])
    }),
    addOrg :(async (orgdetail) => {
        return db.query('insert into tbl_org set ?' ,[orgdetail]);
    }),
    updateOrgByid :(async (data, id) => {
        return db.query('update tbl_org SET ? where id = ?', [data, id]);
    })

}
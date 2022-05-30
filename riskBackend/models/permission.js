const db = require('../utils/database');
module.exports={
    addType :(async (user) => {
        return db.query('insert into Permission  set ?' ,[user]);
    }),
   getList :(async () => {
   return db.query('select * from Permission')
   }),

   getpermissionbyID :(async (id) => {
    return db.query('select * from Permission where id = ?',[id]);
    }),
   
    addRolepermission :(async (permission) => {
        return db.query('insert into tbl_role_permission set ?' ,[permission]);
    }),

    getModule :(async () => {
        return db.query('select * from tbl_sidebar_module');
    }),

    getRolepermission :(async (id) => {
        return db.query('select P.*,M.name as type from tbl_role_permission P  join tbl_sidebar_module M on P.module_id = M.id where P.user_id = ?',[id]);
        
    }),

    updateRolepermission:(async (add,delete1,id,user_id) => {
        return db.query('update tbl_role_permission  set  `add` =?,`delete`=? where  `id` =? and `user_id` =?',[add,delete1,id,user_id]);
    }),
    
    deleterolepermission :(async (user_id) => {
        return db.query('delete  from  tbl_role_permission where user_id =?',[user_id]);
    }),
    
}
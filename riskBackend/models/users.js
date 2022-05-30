const db = require('../utils/database');
module.exports={
    addUser :(async (user) => {
        return db.query('insert into users set ?' ,[user]);
    }),
    fetchUserByEmail :(async (email) => {
        return db.query('select * from users where  email = ?',[email])
    }),
    fetchUser:(async (email) => {
        return db.query('select * from users where email=?',[email]);
    }),
    fetchUserToken:(async (token) => {
        return db.query('select * from users where act_token=?',[token]);
    }),
    updateUser:(async (token,email) => {
        return db.query('Update users set token=? where email=?' ,[token,email]);
    }),
    fetchUserbytoken:(async (token) => {
        return db.query('select * from users where token=?',[token]);
    }),
    updateUserbytoken:(async (password,token) => {
        return db.query('Update users set token="",password=? where  token =?',[password,token]);
    }),
    fetchUserbysocial:(async (email,social) => {
        return db.query('select * from users where email=? and social=?',[email,social]);
    }),
    fetchUserbyid:(async (id) => {
        return db.query('select * from users where id=?',[id]);
    }),
    updateUsersocail:(async (social,email) => {
        return db.query('Update users set social=? where email=?' ,[social,email]);
    }), 
    fetchUserList :(async (usertype,guest,sort_by,user_id,org_id,start,end, search_keyword, team_id) => {
        var type  = '';
        var  guest1 = '';
        var sort ='';
        if(sort_by == 1){
            sort = " order by users.firstname ASC ";
        }else{
            sort = " order by users.id DESC ";
        }

        if(usertype == 0 && guest ==0 ){
             type  = '';
             guest1 = '';
        }else if(usertype != 0 && guest !=0 ){
             type =   " and  users.user_type ="+usertype;
             guest1 =   " and users.owner_type = 3";         
        }else if(usertype == 0 && guest !=0 ) {
            type =   "";
            guest1 =   " and users.owner_type = 3";   
        }else{
            type =   " and  users.user_type = "+usertype;
            guest1 =   '';  
        }

        
        if(search_keyword){
            search_keyword = `and (users.firstname LIKE '%${search_keyword}%' OR users.lastname LIKE '%${search_keyword}%' OR users.email LIKE '%${search_keyword}%' OR concat(users.firstname , ' ' , users.lastname) LIKE '%${search_keyword}%')`;
        }else{
            search_keyword = '';
        }



        if(team_id){
            team_id = `and FIND_IN_SET(${team_id},team)`;
        }else{
            team_id = '';
        }

        //onsole.log('select users.id,users.firstname,users.lastname,users.phone,users.email,users.user_type,users.owner_type,users.created_at , users.job_title,Permission.name, users.user_id, users.org_id from users left  join Permission on users.user_type = Permission.id  where  users.user_id =? and users.org_id =?   '+type + guest1 + sort + ' LIMIT ? OFFSET ?  ')
        return db.query(`select users.id,users.firstname,users.lastname,users.team,job.name as job_name,users.phone,users.email,users.user_type,users.owner_type,users.created_at , users.job_title,Permission.name, users.user_id, users.org_id from users join Permission on users.user_type = Permission.id left join job on users.job_id = job.id  where  users.user_id =? and users.org_id =? ${type} ${guest1} ${team_id} ${search_keyword} ${sort} LIMIT ? OFFSET ?`,[user_id,org_id,start,end]);  

    }),
    fetchUserById :(async (id) => {
        return db.query('select users.id,users.firstname,users.lastname,users.team,users.phone,users.email,users.user_type,users.created_at , users.job_title, users.job_id,Permission.name from users inner join Permission on users.user_type = Permission.id where users.id = ?',[id])
    }),
    updateUserById :(async (user,id) => {
    return db.query('update users set ? where id = ?',[user,id]);
    }),
    updateUserType:(async (user_type,id) => {
        return db.query('update  users SET user_type = ?  where id = ?',[user_type,id]);
    }),
    updateVerifyUser :(async (user,id) => {
        return db.query('update users set ? where id = ?',[user,id]);
    }),
    addUserlink :(async (user) => {
        return db.query('insert into tbl_user_link set ?' ,[user]);
    }),

}
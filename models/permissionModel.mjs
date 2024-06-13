import pool from '../dbconfig.mjs';

const PermissionModel = {
    getRoles: async () => {
       try{
        const sql = 'SELECT * FROM role_permission'; // Adjust the table name as per your database schema
        const [row, fields] = await pool.query(sql, []);
        if(row.length > 0 )
        return row
       }
        catch(error)
        {
            throw error.message;
        }
      },
    
      addPermission : async (req) => {
        // const obj = req.body
        const role_permi = {}
        role_permi.role_id = req.body.role_id
        role_permi.perm_id = req.body.perm_id
        role_permi.p_create = req.body.create
        role_permi.p_read = req.body.read
        role_permi.p_update = req.body.update
        role_permi.p_delete = req.body.delete
        // role_permi.publish = req.body.publish
       
        try{
        const checkPerm = 'SELECT * FROM role_permission WHERE role_id = ? AND perm_id = ?';
        const [result] = await pool.query(checkPerm, [ role_permi.role_id,  role_permi.perm_id]);
         if (result.length > 0)throw new Error('permission already exist ')
         const sql ='INSERT INTO role_permission SET ?' 
         const [row, fields] = await pool.query(sql, [role_permi]);
         return row
        }
         catch(error)
         {
            throw error.message;
         }
       },

       editPermission : async (req) => {
        const role_id = req.params.id
        const perm_id = req.params.id
        const values = req.body
        try{  
            const sql = ' UPDATE role_permission SET ? WHERE role_id = ? AND perm_id = ? ' ;
            const [row, fields] = await pool.query(sql, [values,role_id, perm_id],(err) => {
             
                if (err) {
                  console.error(err);
                }
            return res.status(500).json({ error: 'Internal Server Error' });
        });
        
        return row
        }
        catch(error)
         {
            throw error.message;
         }
       },


       getRolewisePermission: async (req) => {
        const role_id = req.params.id
        console.log(role_id);
        try{
         const sql = 'SELECT * FROM roles_perm_view WHERE role_id = ?'; // Adjust the table name as per your database schema
         const [row, fields] = await pool.query(sql, [role_id]);
         if(row.length > 0 )
        //  return ({success: true, message: "success ", result :row})
        return row
        }
         catch(error)
         {
             throw error.message;
         }
       },
      getPermissionList: async () => {
        try{
         const sql = 'SELECT * FROM permissions'; // Adjust the table name as per your database schema
         const [row, fields] = await pool.query(sql, []);
         if(row.length > 0 )
         return row
        }
         catch(error)
         {
             throw error.message;
         }
       },

       updateRolePerm : async (rolePermData)=>{
        console.log('in model '+ rolePermData);
        // return rolePermData



        try {
          for (const row of rolePermData) {
            console.log(row.role_id, row.perm_id);
            const idQuery = 'SELECT id FROM role_permission WHERE role_id = ? AND perm_id = ?';
            const [existingData] = await pool.query(idQuery, [row.role_id, row.perm_id]);
      
            if (existingData.length > 0) {
              console.log("update query");
              console.log(row.create, row.read, row.update, row.delete, existingData[0].id);
              const updateQuery = 'UPDATE role_permission SET p_create = ?, p_read = ?, p_update = ?, p_delete = ? WHERE id = ?';
              await pool.query(updateQuery, [row.create, row.read, row.update, row.delete, existingData[0].id]);
            } else {
              console.log("insert query");
              console.log(row.role_id, row.perm_id, row.create, row.read, row.update, row.delete);
              const insertQuery = 'INSERT INTO role_permission (role_id, perm_id, p_create, p_read, p_update, p_delete) VALUES (?, ?, ?, ?, ?, ?)';
              await pool.query(insertQuery, [row.role_id, row.perm_id, row.create, row.read, row.update, row.delete]);
            }
          }
      
          console.log('Data updated or inserted successfully');
          return 'Data updated or inserted successfully';
        } catch (error) {
          console.error('Error:', error.message);
        }






        // let values;
        // if (Array.isArray(rolePermData)) {
        //   console.log('Array');
        //   values = rolePermData;
        // } else if (typeof rolePermData === 'object') {
        //   console.log('object');
        //   values = Object.values(rolePermData);
        // } else {
        //   // Handle other cases if necessary
        //   throw new Error('rolePermData should be an array or object');
        // }
        
        // // Now use map to create an array of arrays
        // values = values.map(perm_roles => [
        //   perm_roles.role_id,
        //   perm_roles.perm_id,
        //   perm_roles.create,
        //   perm_roles.read,
        //   perm_roles.update,
        //   perm_roles.delete,
        // ]);



        // try{
        //   values.forEach(row => {
        //     console.log(row[0].perm_id);
        //     const idQuery = `select id from role_permission where role_id = ? and perm_id =? `
        //     const [data,fields] = pool.query(idQuery, [row[0],row[1]]);
        //       console.log(data);
        //       console.log(fields);
        //   });


        //   return rolePermData;
        // }catch(error){
        //   throw error.message;
        // }
       },
       
    }
    export default PermissionModel
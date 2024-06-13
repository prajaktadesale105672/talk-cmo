import pool from '../dbconfig.mjs';

const RoleModel = {
  getRoles: async (req) => {
    // const role_id = req.params.role_id
    try {
      // const sql = 'SELECT * FROM roles';
      // const sql = 'SELECT r.id,r.role, r.rolename, r.created_at,r.updated_at, COUNT(ur.user_id) AS total_users FROM roles r LEFT JOIN user_roles ur ON r.id = ur.role_id GROUP BY r.id, r.rolename; '
      const sql = "SELECT r.id ,r.role,r.rolename, r.created_at, r.updated_at, COUNT(ur.user_id) AS total_users ,GROUP_CONCAT(CONCAT('ID: ', u.user_id, ', Name: ', u.user_name, ', Email: ', u.user_email) ORDER BY u.user_name SEPARATOR ', ') AS user_details FROM roles r LEFT JOIN user_roles ur ON r.id = ur.role_id LEFT JOIN users u ON ur.user_id = u.user_id GROUP BY r.id, r.rolename;"
      const [row, fields] = await pool.query(sql, []);
      if (row.length > 0)
        return ({ success: true, message: "success ", result: row })
    }
    catch (error) {
      throw error.message;
    }
  },
  roleInfo: async (roleId) => {
    // const role_id = req.params.role_id
    try {
      // const sql = 'SELECT * FROM roles';
      // const sql = 'SELECT r.id,r.role, r.rolename, r.created_at,r.updated_at, COUNT(ur.user_id) AS total_users FROM roles r LEFT JOIN user_roles ur ON r.id = ur.role_id GROUP BY r.id, r.rolename; '
      const sql = "SELECT id ,role,rolename, created_at, updated_at FROM roles where id = ?"
      const [row, fields] = await pool.query(sql, [roleId]);
      if (row.length > 0){
        return row[0];
      }
      else {
        throw new Error(`Role information not found`)
    }
    }
    catch (error) {
      throw error.message;
    }
  },

  addRoles: async (req) => {
    const obj = req.body
    try {
      const checkRole = 'SELECT * FROM roles WHERE role = ?';
      const [getRole] = await pool.query(checkRole, [req.body.role]);
      if (getRole.length > 0) throw new Error('given role already exist')
      const sql = 'INSERT INTO roles SET ?'
      const [row, fields] = await pool.query(sql, [obj]);
      return ({ success: true, message: "Role added successfully ", result: row })
    }
    catch (error) {
      throw error.message;
    }
  },
  editRole: async (req) => {
    const rolename = req.body.role_name
    const id = req.params.id
    // console.log('', rolename, id)
    try {
      const sql = ' UPDATE roles SET rolename = ? WHERE id = ?';
      const [row, fields] = await pool.query(sql, [rolename, id], (err) => {
        if (err) {
          console.error(err);
        }
        return res.status(500).json({ error: 'Internal Server Error' });
      });
      return ({ success: true, message: "Role updated successfully ", result: row })
    }
    catch (error) {
      throw error.message;
    }
  },
}
export default RoleModel;
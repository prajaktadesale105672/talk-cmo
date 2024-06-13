import pool from '../dbconfig.mjs';

const RoleModel = {
	get: async () => {
		try {
			const sql = 'SELECT * FROM handover ';
			const [row, fields] = await pool.query(sql, []);
			if (row.length > 0){return  row}
			else {
                throw new Error('error while fetching');
            }
		} catch (error) {
			throw error.message;
		}
	},
    getByRoleId: async (req) => {
        const  role = req.params.role
    	try {
			const sql = 'SELECT * FROM user_handover_view WHERE user_role = ? ';
			const [row, fields] = await pool.query(sql, [role]);
            // console.log(row);
            if (row.length > 0){return  row}
			else {
                throw new Error('error while fetching');
            }
		} catch (error) {
			throw error.message;
		}
	},

	add: async (req) => {
        const role_id = req.body.role_id
        const handover_id = req.body.handover_id
        try {
            const MappingExist = 'SELECT * FROM handover WHERE role_id = ? AND handover_id = ?';
            const [row, fields] = await pool.query(MappingExist, [
                role_id,
                handover_id
            ]);
            if (row.length > 0) throw new Error('mapping already exist')
            const sql = 'INSERT INTO handover SET ?'
            const result = await pool.query(sql, [{ role_id, handover_id }]);
            return result[0].insertId
            // if (result.affectedRows > 0) {
            //     return result
            // } else {
            //      return new Error('faild to add')
            // }
        } catch (error) {
            throw error.message;
        }
	},
	update: async (req) => {
        const id = req.params.id
        const values = {}
        values.role_id = req.body.role_id
        values.handover_id = req.body.handover_id
        try {
            const sql = ' UPDATE handover SET ? WHERE id = ?';
            const [result, fields] = await pool.query(sql, [values, id])
            if (result.affectedRows > 0) {
                return result
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            throw error.message;
        }
	},
}
export default RoleModel;
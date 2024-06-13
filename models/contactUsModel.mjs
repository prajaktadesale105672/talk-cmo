import pool from '../dbconfig.mjs';

const ContactModel = {
  getContactList: async (req) => {
    try { 
      var draw = req.query.draw;
      var start = req.query.start;
      var length = req.query.length;
      var order_data = req.query.order;
      const limit = (req.query.length == "-1") ? "" :` LIMIT ${start}, ${length} `;
      if (typeof order_data == 'undefined') {
          var column_name = 'contact_us.id';
          var column_sort_order = 'desc';
      }
      else {
          var column_index = req.query.order[0]['column'];
          var column_name = req.query.columns[column_index]['data'];
          var column_sort_order = req.query.order[0]['dir'];
      }
      var search_value = req.query.search['value'];
      var search_query = ` AND (first_name LIKE '%${search_value}%' OR last_name LIKE '%${search_value}%' OR email LIKE '%${search_value}%' OR phone LIKE '%${search_value}%' or id LIKE '%${search_value}%') `;
    
      const totalCountQuery = await pool.query(`SELECT COUNT(*) AS total FROM contact_us`);
    
      const total_records = totalCountQuery[0][0].total;
      const totalrec = await pool.query(`SELECT COUNT(*) AS total FROM contact_us WHERE 1 ${search_query}`)
      const total_records_with_filter = totalrec[0][0].total;

      const query = `
                SELECT contact_us.*,users.display_name FROM contact_us LEFT JOIN users ON users.user_id = contact_us.comment_by 
                WHERE 1 ${search_query} 
                ORDER BY ${column_name} ${column_sort_order} 
                ${limit}
                `;

    //  console.log({query});

      const data = await pool.query(query);
      var data_arr = [];

      data[0].forEach((row) => {
        let created_at = new Date(row.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        let name = row.first_name +' '+ row.last_name
        data_arr.push({
          'id': row.id,
          'first_name': row.first_name,
          'last_name': row.last_name,
          // 'name': name,
          'email': row.email,
          'phone': row.phone,
          'message': row.message,
          'comment': row.comment,
          'display_name': row.display_name,
          'status': row.status,
          'created_at': created_at,
          'updated_at': row.updated_at

        })
      });
     
     
      var output = {
        'draw': draw,
        'iTotalRecords': total_records,
        'iTotalDisplayRecords': total_records_with_filter,
        'aaData': data_arr
    };

    return (output);
    }
    catch (error) {
      throw error.message;
    }
  },
  getById: async (req) => {
    const id = req.params.id
    try {
      const sql = 'SELECT * FROM contact_us  where id = ?';
      const [row, fields] = await pool.query(sql, [id]);
      if (row.length > 0)
        return row
    }
    catch (error) {
      throw error.message;
    }
  },
  add: async (req) => {
    const obj = req.body
    try {
      const sql = 'INSERT INTO contact_us SET ?'
      const [row, fields] = await pool.query(sql, [obj]);
      if (row.insertId === 0) throw new Error('error while creating')
      return row
    }
    catch (error) {
      throw error.message;
    }
  },
  update: async (req) => {
    const id = req.params.id
    const values = req.body

    try {
      const sql = ' UPDATE contact_us SET ? WHERE id = ? ';
      const [row, fields] = await pool.query(sql, [values, id], (err) => {
        if (err) {
          console.error(err);
        }
        return res.status(500).json({ error: 'Internal Server Error' });
      });

      return row
    }
    catch (error) {
      throw error.message;
    }
  },
}
export default ContactModel
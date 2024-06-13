import pool from '../dbconfig.mjs';

const subscriptionModel = {
 
  getAll: async (req) => {
    try {
      var draw = req.query.draw;
      var start = req.query.start;
      var length = req.query.length ;
      
      const limit = (req.query.length == "-1") ? "" :` LIMIT ${start}, ${length} `;
      
      console.log({length});
      var order_data = req.query.order;
      if (typeof order_data == 'undefined') {
          var column_name = 'subscribe.id';
          var column_sort_order = 'desc';
      }
      else {
          var column_index = req.query.order[0]['column'];
          var column_name = req.query.columns[column_index]['data'];
          var column_sort_order = req.query.order[0]['dir'];
      }

      var search_value = req.query.search['value'];
      var search_query = ` AND ( email LIKE '%${search_value}%' OR id LIKE '%${search_value}%') `;
    
      const totalCountQuery = await pool.query(`SELECT COUNT(*) AS total FROM subscribe`);
    
      const total_records = totalCountQuery[0][0].total;
      const totalrec = await pool.query(`SELECT COUNT(*) AS total FROM subscribe WHERE 1 ${search_query}`)
      const total_records_with_filter = totalrec[0][0].total;
     
      const query = `
                SELECT * FROM subscribe 
                WHERE 1 ${search_query} 
                ORDER BY ${column_name} ${column_sort_order} 
                ${limit}
                `;

    //  console.log({query});

      const data = await pool.query(query);
      var data_arr = [];

      data[0].forEach((row) => {
        let created_at = new Date(row.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        data_arr.push({
          'id': row.id,
          'email': row.email,
          "optin":row.optin,
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
      const sql = 'SELECT * FROM subscribe where id = ?';
      const [row, fields] = await pool.query(sql, [id]);
      if (row.length > 0)
        return row
    }
    catch (error) {
      throw error.message;
    }
  },

  // subscribe newsletter  
  add: async (req) => {
    const obj = req.body

    try {
      const checkUserQuery = 'SELECT * FROM subscribe WHERE email = ? and status = 1 ';
      const [userExistOrNot] = await pool.query(checkUserQuery, [req.body.email]);
      if (userExistOrNot.length > 0) throw new Error('you have already subscribed')
      const sql = 'INSERT INTO subscribe SET ?'
      const [row, fields] = await pool.query(sql, [obj]);
      if (row.insertId === 0) throw new Error('error while creating')
      return row
    }
    catch (error) {
      throw error.message;
    }
  },
  update: async (req) => {
    const values = req.body
    try {
      const checkUserQuery = 'SELECT * FROM subscribe WHERE email = ?';
      const [userExistOrNot] = await pool.query(checkUserQuery, [req.body.email]);
      if (userExistOrNot.length === 0) throw new Error('User not found please subscribe first ')
      const sql = ' UPDATE subscribe SET ? WHERE email = ? ';
      const [row, fields] = await pool.query(sql, [values, req.body.email], (err) => {
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
  // unsubscribe newsletter
  unsubscribeUser: async (req) => {
    // const id = req.params.email
    const userEmail = req.body.email
    try {
      const checkSql = 'SELECT * FROM subscribe WHERE email = ? AND status = 1';
      const [checkRows] = await pool.query(checkSql, [userEmail]);
  
      if (checkRows.length === 0) {
        // User is not subscribed, throw an error
        throw new Error('User not found or not subscribed please subscribe !');
      }
      const sql = ' UPDATE subscribe SET status = 0 WHERE email = ? ';
      const [row, fields] = await pool.query(sql, [userEmail], (err) => {
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

// get subscribers from-date to to-date
getSubscribersByDate: async (req) => {
    const from = req.body.from_date
    const to = req.body.to_date
    try {
      const sqlQuery =  `SELECT * FROM subscribe WHERE created_at >= '${from}' AND created_at <= '${to}';`;
      const [results] = await pool.query(sqlQuery, [from, to]);
      if (results.length === 0) throw new Error('not found ')
      return results
    }
    catch (error) {
      throw error.message;
    }
  },
}
export default subscriptionModel
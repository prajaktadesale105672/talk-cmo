// models/UserModel.js
// import db from '../dbconfig.mjs';
import bcrypt from 'bcrypt';
import createDatabasePool from '../db.mjs';
import initializeApp from '../dbconfig.mjs';
import pool from '../dbconfig.mjs';
import crypto from 'crypto';



const UserModel = {
  createUser: async (req) => {
    let user_id, role_id, user = {}
    try {
      let user_id, role_id, user = {};
      user.user_email = req.body.user_email;
      user.user_password = req.body.user_password;
      user.user_name = req.body.user_name;
      user.display_name = req.body.display_name;
  
      const checkUserQuery = 'SELECT * FROM users WHERE user_email = ?';
      const [userExistOrNot] = await pool.query(checkUserQuery, [req.body.user_email]);
  
      if (userExistOrNot.length > 0) {
        throw { message: 'duplicate' };
      }
  
      const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
      user.user_password = hashedPassword;
  
      const sql = 'INSERT INTO users SET ?';
      const [result] = await pool.query(sql, [user]);
      user_id = result.insertId;
      role_id = req.body.role_id;
  
      const userRole = 'INSERT INTO user_roles SET ?';
      const [row] = await pool.query(userRole, [{ role_id, user_id }]);
  
      return row;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error.message;
    }
  },
  // createUser: async (req, res) => {
  //   let user_id,role_id, user = {};
  //   return new Promise((resolve, reject) => {
  //       upload.single('user_profile')(req, null, async (err) => {
  //           if (err) {
  //               console.error('Error during file upload:', err.message);
  //               reject(err);
  //           } else if (req.file) {
  //               user.user_profile = req.file.filename
  //               // user.user_photo = req.file.path
  //               user.user_name = req.body.user_name;
  //               user.display_name = req.body.display_name;
  //               user.user_email= req.body.user_email;
  //               const checkUserQuery = 'SELECT * FROM users WHERE user_email = ?';
  //               const [userExistOrNot] = await pool.query(checkUserQuery, [user.user_email]);
  //               if (userExistOrNot.length > 0) {
  //                   reject(new Error('user already exists'));
  //               } else {
  //                 const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
  //                  user.user_password = hashedPassword
  //                  console.log('user model---------->', user)
  //                   const sql = 'INSERT INTO users SET ?';
  //                   const [rows, fields] = await pool.query(sql, [user]);
  //                   user_id = rows.insertId;
  //                   role_id = req.body.role;
  //                   console.log(user_id,role_id);
  //                   const userRole ='INSERT INTO user_roles SET ?'
  //                   const [row]= await pool.query(userRole, [{role_id, user_id}])
  //                   resolve(row);
  //               }
  //           } else {
  //               reject(new Error('No file provided'));
  //           }
  //       });
  //   })
  // },

  // updateUserInfo: async (req) => {
  //   let user = {};
  //   return new Promise((resolve, reject) => {
  //       upload.single('user_profile')(req, null, async (err) => {
  //           if (err) {
  //               console.error('Error while uploading file:', err.message);
  //               reject(err);
  //           } else {
  //               try {
  //                   // Check if a file was provided in the request
  //                   const fileProvided = req.file !== undefined;

  //                   // If a file was provided, update author_photo in the author object
  //                   if (fileProvided) {
  //                       user.user_profile = req.file.filename;
  //                   }

  //                   // Update other user properties based on the request
  //                   user.user_profile = req.file.filename
  //                   // user.user_photo = req.file.path
  //                   user.user_name = req.body.user_name;
  //                   user.display_name = req.body.display_name;
  //                   user.user_email= req.body.user_email;
  //                   const user_id = req.params.id;
  //                   // console.log('model-----------------------------> ', user)
  //                   if ('status' in req.body) {
  //                       user.user_status = req.body.status;
  //                   }

  //                   const checkUser = 'SELECT * FROM users WHERE user_id = ?';
  //                   const [userExistOrNot] = await pool.query(checkUser, [user_id]);

  //                   if (userExistOrNot.length === 0) {
  //                       reject(new Error('user id not found'));
  //                   } else {
  //                       const sql = 'UPDATE users SET ? WHERE user_id = ?';
  //                       const [row, fields] = await pool.query(sql, [user, user_id]);
  //                       resolve(row);
  //                   }
  //               } catch (error) {

  //                   reject (error);
  //               }

  //           }
  //       });
  //   });
  // },


  updateUserInfo: async (req) => {
    const id = req.params.id
    let role_id, user = {}
    try {
      user.user_email = req.body.user_email
      user.user_name = req.body.user_name
      user.display_name = req.body.display_name
      role_id = req.body.role_id
      const checkUserQuery = 'SELECT * FROM users WHERE user_id	= ?';
      const [userExistOrNot] = await pool.query(checkUserQuery, [id]);
      const [getEmails] = await pool.query(`select user_email from users where user_email = ? and user_id <> ?`,[user.user_email,id]);
      if(getEmails.length > 0) throw new Error('Email id already assigned to another user')
      if (userExistOrNot.length == 0) throw new Error('User id not found')
      if ('user_status' in req.body) {
        user.user_status = req.body.user_status;
      }
      const sql = 'UPDATE users SET ? WHERE user_id =  ?'
      const [result] = await pool.query(sql, [user, id])
      const userRole = 'UPDATE user_roles SET role_id = ? WHERE user_id = ?'
      const [row] = await pool.query(userRole, [role_id, id])
      return row
    }
    catch (error) {
      // console.error('An error occurred:', error);
      
      throw error
    }
  },

  getAllUsers: async () => {
    const checkUserExist = 'SELECT * FROM user_roles_view ';
    const [user] = await pool.query(checkUserExist, []);
    return user
  },

  getUserByid: async (user_id) => {
    const checkUserExist = 'SELECT * FROM user_roles_view WHERE user_id = ? ';
    const [user] = await pool.query(checkUserExist, [user_id]);
    return user
  },
  userFilter: async (page, pageSize, search) => {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * pageSize;
      let query = `SELECT * FROM user WHERE 1 `;
      if (search != undefined || search != null) {
        query += ` and (user_fname LIKE '%${search}%' or user_lname LIKE '%${search}%' or user_email LIKE '%${search}%' or user_city LIKE '%${search}%' or user_mobile LIKE '%${search}%' ) `;
      }
      query += ` ORDER BY user_id DESC LIMIT ?, ? `;


      console.log(query);
      db.query(query, [parseInt(offset), parseInt(pageSize)], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },


  userLogin: async (user_email, user_password) => {
    try {
      console.log(user_email, user_password);
      const checkUserExist = 'SELECT * FROM user_roles_view WHERE user_email = ? and user_status = 1';
      const [user] = await pool.query(checkUserExist, [user_email]);
      if (user.length === 0) throw new Error('user not found or not active')
      const verifyPass = await bcrypt.compare(user_password, user[0].password)
      if (verifyPass === true) {
        const user_id = user[0].user_id
        const sql = 'SELECT * FROM user_roles_view WHERE user_id = ?'
        const [checkUserRole] = await pool.query(sql, [user_id]);
        return ({ success: true, message: "login success ", result: checkUserRole[0] })
      }
      else {
        return ({ success: false, message: "invalid login or password", })
      }

    } catch (error) {
      console.error('Database query error:', error);
      throw error.message;
    }

  },


  userAdd: async (userEmail, userPass) => {
    return new Promise((resolve, reject) => {
      console.log(process.env.JWT_SECRET_KEY);

      const userQuery = 'SELECT emp_mail, emp_pass FROM employee WHERE emp_mail = ?';

      db.query(userQuery, [userEmail], (err, results) => {
        if (err) {
          reject({ message: 'Database error' });
        } else if (results.length === 0) {
          reject({ message: 'Invalid email or password' });
        } else {
          if (results[0].emp_pass === userPass) {
            resolve({ succeess: true, message: 'Login Success', user: results[0].emp_mail });
          }
          else {
            reject({ succeess: false, message: 'Invalid email or password' });
          }
        }
      });

    });
  },

  userFilter1: async (req, res) => {
    return new Promise((resolve, reject) => {

      var draw = req.query.draw;
      var start = req.query.start;
      var length = req.query.length;
      var order_data = req.query.order;
      if (typeof order_data == 'undefined') {
        var column_name = 'user.user_id';
        var column_sort_order = 'desc';
      }
      else {
        var column_index = req.query.order[0]['column'];
        var column_name = req.query.columns[column_index]['data'];
        var column_sort_order = req.query.order[0]['dir'];
      }
      //search data
      var search_value = req.query.search['value'];
      var search_query = `
       AND (user_fname LIKE '%${search_value}%' 
        OR user_lname LIKE '%${search_value}%' 
        OR user_email LIKE '%${search_value}%' 
        OR user_city LIKE '%${search_value}%'
       )
      `;
      //Total number of records without filtering
      db.query("SELECT COUNT(*) AS Total FROM user", function (error, data) {
        console.log("total " + data);
        var total_records = data[0].Total;
        //Total number of records with filtering
        db.query(`SELECT COUNT(*) AS Total FROM user WHERE 1 ${search_query}`, function (error, data) {
          console.log("where total " + data);
          var total_records_with_filter = data[0].Total;
          var query = `
              SELECT * FROM user 
              WHERE 1 ${search_query} 
              ORDER BY ${column_name} ${column_sort_order} 
              LIMIT ${start}, ${length}
              `;
          var data_arr = [];
          db.query(query, function (error, data) {
            data.forEach(function (row) {
              data_arr.push({
                'user_id': row.user_id,
                'user_fname': row.user_fname,
                'user_lname': row.user_lname,
                'user_email': row.user_email,
                'user_city': row.user_city,
                'user_mobile': row.user_mobile,
                'user_created_at': row.user_created_at,
                // 'action': `<button type="button" class="btn btn-warning btn-sm updateEmpBtn" id="${row.emp_id}">Update</button> <button type="button" class="btn btn-danger btn-sm deleteEmpBtn" id="${row.emp_id}">Delete</button>`
              });
            });
            var output = {
              'draw': draw,
              'iTotalRecords': total_records,
              'iTotalDisplayRecords': total_records_with_filter,
              'aaData': data_arr
            };
            resolve(output);
          });
        });
      });


    })
  },
  forgetPassword: async (req) => {
    const { user_email } = req.body;
    // console.log('user email ------------->', user_email)
    try {
      const checkUserExist = 'SELECT * FROM users WHERE user_email = ? ';
      const [user] = await pool.query(checkUserExist, [user_email]);
      if (user.length === 0) throw new Error(' user not found ')
      const reset_token = crypto.randomBytes(16).toString("hex");
      const exp_time = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const user_id = user[0].user_id
      const sql = 'INSERT INTO reset_password SET ?'
      const [row] = await pool.query(sql, [{ user_id, reset_token, exp_time }])
      return reset_token
    }
    catch (error) {
      console.log('error', error.message)
      throw error.message
    }
  },
  resetUserPassword: async (req) => {
    const reset_token = req.query.token
    const new_password = req.body.new_password
    // const display_name = req.body.display_name
    try {
      const checkUserExist = 'SELECT * FROM reset_password WHERE reset_token = ?';
      const [user] = await pool.query(checkUserExist, [reset_token]);
      if (user.length === 0 || new Date(user[0].expirationTime) < new Date()) throw new Error('Invalid or expired reset token')
      const hashedPassword = await bcrypt.hash(new_password, 10);
      const user_password = hashedPassword
      const user_id = user[0].user_id
      const sql = 'UPDATE users SET user_password = ? WHERE user_id = ?';
      const [updatePass] = await pool.query(sql, [user_password, user_id]);
      return updatePass
    }
    catch (error) {
      throw error.message
    }
  },

  logout: async(req) =>{

  }, 
}

export default UserModel;
import pool from '../dbconfig.mjs';

const urlRedirectModel = {
    getUrlList: async(req) =>{
        try {
            var draw = req.query.draw;
            var start = req.query.start;
            var length = req.query.length;
            var order_data = req.query.order;
            if (typeof order_data == 'undefined') {
                var column_name = 'url_redirect.id';
                var column_sort_order = 'desc';
            }
            else {
                var column_index = req.query.order[0]['column'];
                var column_name = req.query.columns[column_index]['data'];
                var column_sort_order = req.query.order[0]['dir'];
            }
            var search_value = req.query.search['value'];
             const search_query = search_value ? ` and (current_url LIKE '%${search_value}%' or redirect_url LIKE '%${search_value}%' or user_name LIKE '%${search_value}%')  ` : '';
           
       
            let query, totalCountQuery, total_records, totalrec, total_records_with_filter ;
            totalCountQuery = await pool.query(`SELECT COUNT(*) AS total FROM url_redirect`);
            total_records = totalCountQuery[0][0].total;

        
             totalrec = await pool.query(`SELECT COUNT(*) AS total FROM url_redirect WHERE 1 ${search_query}`)
             total_records_with_filter = totalrec[0][0].total;
             query = `SELECT * FROM url_redirect  WHERE 1 ${search_query} ORDER BY ${column_name} ${column_sort_order} LIMIT ${start}, ${length} `;
           
            const data = await pool.query(query);
            var data_arr = [];
            data[0].forEach((row) => {
                data_arr.push({
                    'id': row.id,
                    'current_url': row.current_url,
                    'redirect_url': row.redirect_url,
                    'user_name': row.user_name,
                    'created_at': row.created_at,
                    'updated_at': row.updated_at,
                })
            });

            var output = {
                'draw': draw,
                'iTotalRecords': total_records,
                'iTotalDisplayRecords': total_records_with_filter,
                'aaData': data_arr
            };
            return (output);
        } catch (error) {
            throw error.message;
        }
    },

    createUrlRedirect: async(req)=>{
        try {
            const urlDetails = {
                current_url : req.body.current_url,
                redirect_url : req.body.redirect_url,
                user_id : req.body.user_id,
                user_name : req.body.user_name
            }
            const insertQuery = `insert into url_redirect set ?`;
            const [insertData] = await pool.query(insertQuery,[urlDetails]);
            return insertData;
        } catch (error) {
            throw error.message;;
        }
    },

    getUrlRedirect: async(req)=>{
        try {
            const current_url = req.body.current_url;
            const getUrlQuery = `select current_url,redirect_url from url_redirect where current_url = ?`;
            const [urlData] = await pool.query(getUrlQuery,[current_url]);
            if(urlData.length){
                return urlData;
            }
            else{
                return false;
            }
        } catch (error) {
            throw error.message;;
        }
    },

    getUrlInfo: async(req)=>{
        try {
            const urlId = req.params.id;
            const getUrlQuery = `select * from url_redirect where id = ?`;
            const [urlData] = await pool.query(getUrlQuery,[urlId]);
            if(urlData.length){
                return urlData;
            }
            else{
                return false;
            }
        } catch (error) {
            throw error.message;;
        }
    },

    deleteUrlRedirect: async(req)=>{
        try {
            console.log('delete model');
            const deleteId = req.params.id;
            console.log({deleteId});
            const getUrlQuery = `delete from url_redirect where id = ?`;
            const [urlData] = await pool.query(getUrlQuery,[deleteId]);
            if (urlData.affectedRows == 0) {
                throw new Error(`No URL Redirection information found with id ${deletId}`);
            }
            return urlData; 

        } catch (error) {
            throw error.message;;
        }
    },

    editUrlRedirect: async (req) => {

        const urlId = req.body.url_id;
        const current_url = req.body.current_url;
        const redirect_url = req.body.redirect_url;
        const user_id = req.body.user_id;
        const user_name = req.body.user_name;
        try {
            const sql = ' UPDATE url_redirect SET current_url = ? ,redirect_url = ?,user_id =? , user_name = ?  WHERE id = ?';
            const [updateResult, fields] = await pool.query(sql, [current_url, redirect_url, user_id, user_name, urlId]);
            if (updateResult.affectedRows == 0) {
                throw new Error(`URL Redirection information Udpate Error `);
            }
            return updateResult;
        }
        catch (error) {
            throw error.message;
        }
    },


}

export default urlRedirectModel;
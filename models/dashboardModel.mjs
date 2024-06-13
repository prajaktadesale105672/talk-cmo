import e from 'cors';
import pool from '../dbconfig.mjs';
import upload from '../middleware/uploadImgae.mjs';
const dashboard = {
    getAll: async (req, res) => {

        try {

            // const checkUserExist = ` SELECT cat_name, post_status,COUNT(*) AS total_postsFROM post_admin WHERE cat_name = '${category}' GROUP BY cat_name, post_status UNIONSELECT NULL AS cat_name,NULL AS post_status,COUNT(*) AS total_postsFROM post_admin;`;
            const sqlQuery = `SELECT cat_name, COUNT(*) as total_count,  
                                SUM(CASE WHEN post_status = 'publish' THEN 1 ELSE 0 END) as published_count,
                                SUM(CASE WHEN post_status <> 'publish' THEN 1 ELSE 0 END) as unpublished_count
                                FROM post_Admin GROUP BY cat_name ;`
            const [row] = await pool.query(sqlQuery, []);
            if (row.length == 0) throw new Error('not found ')
            return row
        } catch (error) {
            throw error.message;
        }
    },
    // get post list having post_status is published
    getPulishedPostsList: async (req) => {
        try {
            var draw = req.query.draw;
            var start = req.query.start;
            var length = req.query.length;
            var order_data = req.query.order;
            // console.log('model --------->', start,length, order_data)

            const limit = (req.query.length == "-1") ? "" : ` LIMIT ${start}, ${length} `;
            if (typeof order_data == 'undefined') {
                var column_name = 'post_admin.id';
                var column_sort_order = 'desc';
            }
            else {
                var column_index = req.query.order[0]['column'];
                var column_name = req.query.columns[column_index]['data'];
                var column_sort_order = req.query.order[0]['dir'];
            }
            var search_value = req.query.search['value'];
         
            var search_query = ` AND (post_title LIKE '%${search_value}%' OR post_name LIKE '%${search_value}%') `;
            // var search_query = ``;

            const totalCountQuery = await pool.query(`SELECT COUNT(*) AS total FROM post_admin where post_status = 'publish'`);
            const total_records = totalCountQuery[0][0].total;
            const totalrec = await pool.query(`SELECT COUNT(*) AS total FROM post_admin WHERE 1 ${search_query} and post_status = 'publish'`)
            const total_records_with_filter = totalrec[0][0].total;
            const query = `
                SELECT id,post_title,post_name,cat_name,cat_slug,subcat_name,post_date,post_status,comments FROM post_admin
                WHERE 1 ${search_query} and post_status = "publish"
                ORDER BY ${column_name} ${column_sort_order} 
                ${limit}
                
                `;
            const data = await pool.query(query);

            var data_arr = [];

            data[0].forEach((row) => {
                let created_at = new Date(row.post_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                data_arr.push({
                    'id': row.id,
                    'post_title': row.post_title,
                    'post_name': row.post_name,
                    'cat_name': row.cat_name,
                    'cat_slug': row.cat_slug,
                    'subcat_name': row.subcat_name,
                    'comments': row.comments,
                    'status': row.post_status,
                    'post_date': created_at,
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
            console.log('error', error)
            throw error.message
        }
    }
    ,
    totalPosts: async (req, res) => {

        try {
            const subscribeQuery = `SELECT COUNT(*) as leades_count FROM subscribe `;
            const contactQuery = `SELECT COUNT(*) as contact_leads_count FROM contact_us `;
            const sqlQuery = `SELECT
                            (SELECT COUNT(*) FROM post_admin) as total_posts,
                            (SELECT COUNT(*) FROM post_admin WHERE post_status = 'publish') AS published_posts,
                            (SELECT COUNT(*) FROM post_admin WHERE post_status <> 'publish') AS unpublished_posts,
                            (SELECT COUNT(*) FROM post_admin WHERE post_status <> 'publish' AND (handover_to IS NULL OR handover_to = 0)) AS draft_posts,
                            (${subscribeQuery}) AS subscribe_leads,
                            (${contactQuery}) AS contact_leads`;
            const [result] = await pool.query(sqlQuery, []);
            // if (result.length == 0) throw new Error('not found ')
            return result
        }

        catch (error) {
            console.log('error', error)
            throw error.message
        }
    },
    totalSubscribers: async (req, res) => {
        const post_status = req.query.status
        try {
            const sqlQuery = 'SELECT count(*) as  leades_count FROM subscribe WHERE status = 1'
            const [result] = await pool.query(sqlQuery, [post_status]);
            if (result.length == 0) throw new Error('not found ')
            return result
        }

        catch (error) {
            console.log('error', error)
            throw error.message
        }
    },
    totalContactLeads: async (req, res) => {
        const post_status = req.query.status
        try {
            const sqlQuery = 'SELECT count(*) as contact_leads_count FROM contact_us WHERE status = 1'
            const [result] = await pool.query(sqlQuery, [post_status]);
            if (result.length == 0) throw new Error('not found ')
            return result
        }

        catch (error) {
            console.log('error', error)
            throw error.message
        }
    },
    getPostsCountByUser: async (req, res) => {
        try {
            const sqlQuery = `SELECT * from pending_post;`
            const [result] = await pool.query(sqlQuery, []);
            // if (result.length == 0) throw new Error('not found ')
            return result
        }

        catch (error) {
            console.log('error', error)
            throw error.message
        }

    },
    // get post list having status is unpublished and draft
    // getPostsList: async (req) => {
    //     let query
    //     const post_status = req.params.status
    //     try {
    //         if (post_status === 'unpublish') {
    //             query = `SELECT post_admin.id,post_title,post_date,post_status,comments,session_user,session_user_name,handover_to,handover_to_name, MIN(work_session.assigned_time) AS start_time FROM post_admin LEFT JOIN work_session ON post_admin.id = work_session.post_id WHERE post_status <> 'publish' GROUP BY post_admin.id`;
    //         } else if (post_status === 'draft') {
    //             query = `SELECT post_admin.id, post_title,post_date, post_status, comments, SESSION_USER, session_user_name, handover_to, handover_to_name, MIN(work_session.assigned_time) AS start_time FROM post_admin LEFT JOIN work_session ON post_admin.id = work_session.post_id WHERE post_status <> 'publish' AND (handover_to IS NULL OR handover_to = 0) GROUP BY post_admin.id`;
    //         } else {
    //             throw new Error('Invalid post status');
    //         }
    //         // console.log('model--------->', query)
    //         const [result] = await pool.query(query, [post_status]);

    //         let displayStatus = result[0].post_status === 'draft' ? 'unpublish' : result.post_status;
    //         console.log('model ----->',displayStatus)
    //         if (result.length == 0) throw new Error('not found ')

    //         return result
    //     }

    //     catch (error) {
    //         console.log('error', error)
    //         throw error.message
    //     }
    // },
    getPostsList: async (req) => {
        let query;
        const post_status = req.params.status;
        try {
            if (post_status === 'unpublish') {
                query = `SELECT post_admin.id,post_title,post_name,cat_name,cat_slug,post_date,'Unpublish' AS post_status,comments,session_user,session_user_name,handover_to,handover_to_name, MIN(work_session.assigned_time) AS start_time FROM post_admin LEFT JOIN work_session ON post_admin.id = work_session.post_id WHERE post_status <> 'publish' GROUP BY post_admin.id`;
            } else if (post_status === 'draft') {
                query = `SELECT post_admin.id, post_title,post_name,cat_name,cat_slug,post_date, 'Draft' AS post_status, comments, SESSION_USER, session_user_name, handover_to, handover_to_name, MIN(work_session.assigned_time) AS start_time FROM post_admin LEFT JOIN work_session ON post_admin.id = work_session.post_id WHERE post_status <> 'publish' AND (handover_to IS NULL OR handover_to = 0) GROUP BY post_admin.id`;
            } else {
                throw new Error('Invalid post status');
            }

            const [result] = await pool.query(query, [post_status]);

            // if (result.length === 0) {
            //     throw new Error('not found');
            // }
            return result;
        } catch (error) {
            console.log('error', error);
            throw error.message;
        }
    },

    getTotalPostsByTeam: async () => {

        try {
            // const [result] = await pool.query(`SELECT team_name AS team, SUM(draft_posts) AS draft, SUM(assigned_posts) AS assigned FROM ( SELECT CASE WHEN role IN ('Content Manager', 'Content Writer') THEN 'Content Team' WHEN role IN ('SEO Manager', 'SEO Team') THEN 'SEO Team' WHEN role IN ('SMO Manager', 'Graphics Team') THEN 'SMO Team' WHEN role IN ('Publishing Team') THEN 'Publishing Team' WHEN role IN ('Admin') THEN 'Admin' END AS team_name, draft_posts, assigned_posts FROM pending_post WHERE role IN ('Content Manager', 'Content Writer', 'SEO Manager', 'SEO Team', 'SMO Manager', 'Graphics Team', 'Publishing Team', 'Admin') ) AS subquery GROUP BY team_name;`)
            // const [result] = await pool.query(`SELECT team_name AS team, SUM(draft_posts) AS draft, SUM(assigned_posts) AS assigned, CASE WHEN team_name = 'Content Team' THEN 2 WHEN team_name = 'SEO Team' THEN 3 WHEN team_name = 'SMO Team' THEN 4 WHEN team_name = 'Publishing Team' THEN 10 WHEN team_name = 'Admin' THEN 1 END AS role_id FROM ( SELECT CASE WHEN role IN ('Content Manager', 'Content Writer') THEN 'Content Team' WHEN role IN ('SEO Manager', 'SEO Team') THEN 'SEO Team' WHEN role IN ('SMO Manager', 'Graphics Team') THEN 'SMO Team' WHEN role IN ('Publishing Team') THEN 'Publishing Team' WHEN role IN ('Admin') THEN 'Admin' END AS team_name, draft_posts, assigned_posts FROM pending_post WHERE role IN ('Content Manager', 'Content Writer', 'SEO Manager', 'SEO Team', 'SMO Manager', 'Graphics Team', 'Publishing Team', 'Admin') ) AS subquery GROUP BY team_name;`)
            const [result] = await pool.query(`SELECT team_name AS team, SUM(draft_posts) AS draft, SUM(assigned_posts) AS assigned, CASE WHEN team_name = 'Content Team' THEN 2 WHEN team_name = 'SEO Team' THEN 3 WHEN team_name = 'SMO Team' THEN 4 WHEN team_name = 'Publishing Team' THEN 10 WHEN team_name = 'Admin' THEN 1 END AS role_id FROM ( SELECT CASE WHEN role IN ('Content Head','Content Manager', 'Content Writer') THEN 'Content Team' WHEN role IN ('Marketing Head','SEO Manager', 'SEO Team') THEN 'SEO Team' WHEN role IN ('Marketing Head','SMO Manager', 'Graphics Team') THEN 'SMO Team' WHEN role IN ('Publisher') THEN 'Publishing Team' END AS team_name, draft_posts, assigned_posts FROM pending_post WHERE role IN ('Content Manager', 'Content Writer', 'SEO Manager', 'SEO Team', 'SMO Manager', 'Graphics Team', 'Publishing Team') ) AS subquery GROUP BY team_name;`)
            return result
        }

        catch (error) {
            console.log('error', error)
            throw error.message
        }
    },

// get total post assigned ,handover, draft for the session user .
//  getPostTotalForSessionUser: async (session_user) => {
//     try {
//         const sqlQuery = `SELECT
//         (SELECT COUNT(*) FROM post_admin WHERE session_user = ? AND handover_to <> 0 AND post_status <> 'publish') AS handover_count,
//         (SELECT COUNT(*) FROM post_admin WHERE handover_to = 1 AND post_status <> 'publish') AS assigned_count,
//         (SELECT COUNT(*) FROM post_admin WHERE session_user = ? AND handover_to = 0 AND post_status <> 'publish') AS draft_count`;
      
//         const [result] = await pool.query(sqlQuery, [session_user]);
//         if (result.length == 0) throw new Error('not found ')
//         return result
//     }

//     catch (error) {
//         console.log('error', error)
//         throw error.message
//     }

getPostTotalForSessionUser: async (session_user) => {
    try {
        // Set session_user variable
        await pool.query('SET @session_user = ?', [session_user]);

        // Execute the main query
        const [result] = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM post_admin WHERE session_user = @session_user AND handover_to <> 0 AND post_status <> 'publish') AS handover_count,
                (SELECT COUNT(*) FROM post_admin WHERE handover_to = @session_user AND post_status <> 'publish') AS assigned_count,
                (SELECT COUNT(*) FROM post_admin WHERE session_user = @session_user AND handover_to = 0 AND post_status <> 'publish') AS draft_count
        `);

        // if (result.length === 0) {
        //     throw new Error('not found');
        // }
        // console.log(result[0]);

        return result[0]; // Assuming you want to return a single object with counts
    } catch (error) {
        console.error('Error:', error);
        throw error.message;
    }
},



}


export default dashboard;
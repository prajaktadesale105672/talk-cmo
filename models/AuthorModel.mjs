import e from 'cors';
import pool from '../dbconfig.mjs';
import upload from '../middleware/uploadImgae.mjs';
const AuthorModel = {
    getAll: async (req, res) => {
        try {
            const checkUserExist = 'SELECT * FROM author ';
            const [row] = await pool.query(checkUserExist, []);
            // if (row.length == 0) throw new Error('can not get')
            
            return row
        } catch (error) {
            throw error.message;
        }
    },

    getActiveAll: async (req, res) => {
        try {
            const checkUserExist = 'SELECT * FROM author where status = 1';
            const [row] = await pool.query(checkUserExist, []);
            // if (row.length == 0) throw new Error('can not get')
            
            return row
        } catch (error) {
            throw error.message;
        }
    },

    getAuthorById: async (id) => {
        console.log('in module'+ id);
        try{
            const author_id = id;
            const checkUserExist = 'SELECT * FROM author WHERE author_id = ? ';
            const [row] = await pool.query(checkUserExist, [author_id]);
            return row
        }catch (error) {
            throw error.message;
        }
       
      },

    // createAuthorProfile: async (req, res) => {
    //     let author = {};
    //     return new Promise((resolve, reject) => {
    //         upload.single('profile_img')(req, null, async (err) => {
    //             if (err) {
    //                 console.error('Error during file upload:', err.message);
    //                 reject(err);
    //             } else if (req.file) {
    //                 author.author_photo = req.file.filename
    //                 // author.author_photo = req.file.path
    //                 author.author_name = req.body.author_name;
    //                 author.author_display_name = req.body.author_display_name;
    //                 author.author_designation = req.body.author_designation;
    //                 author.author_description = req.body.author_description;
    //                 const checkUserQuery = 'SELECT * FROM author WHERE author_name = ? and author_display_name = ?';
    //                 const [userExistOrNot] = await pool.query(checkUserQuery, [author.author_name,author.author_display_name]);
    //                 if (userExistOrNot.length > 0) {
    //                     reject(new Error('Author already exists'));
    //                 } else {
    //                     const sql = 'INSERT INTO author SET ?';
    //                     const [row, fields] = await pool.query(sql, [author]);
    //                     resolve(row);
    //                 }
    //             } else {
    //                 reject(new Error('No file provided'));
    //             }
    //         });
    //     })
    // },
    createAuthorProfile: async (req, res) => {
        let author = {};
        return new Promise((resolve, reject) => {
            upload.single('profile_img')(req, null, async (err) => {
                if (err) {
                    console.error('Error during file upload:', err.message);
                    reject(err);
                } else {
                    // Check if req.file is present (profile image is selected)
                    if (req.file) {
                        author.author_photo = '/uploads/author-profiles/'+ req.file.filename;
                    }
                    
                    // Populate other author fields
                    author.author_name = req.body.author_name;
                    author.author_display_name = req.body.author_display_name;
                    author.author_designation = req.body.author_designation;
                    author.author_description = req.body.author_description;
    
                    const checkUserQuery = 'SELECT * FROM author WHERE author_name = ? OR author_display_name = ?';
                    const [userExistOrNot] = await pool.query(checkUserQuery, [author.author_name, author.author_display_name]);
    
                    if (userExistOrNot.length > 0) {
                        reject(new Error('Author already exists with given name or display-name'));
                    } else {
                        const sql = 'INSERT INTO author SET ?';
                        const [row, fields] = await pool.query(sql, [author]);
                        resolve(row);
                    }
                }
            });
        });
    },
    
    editAuthorProfile: async (req) => {
        let author = {};
        return new Promise((resolve, reject) => {
            upload.single('profile_img')(req, null, async (err) => {
                if (err) {
                    console.error('Error while uploading file:', err.message);
                    reject(err);
                } else {
                    try {
                        // Check if a file was provided in the request
                        const fileProvided = req.file !== undefined;

                        // If a file was provided, update author_photo in the author object
                        if (fileProvided) {
                            author.author_photo = '/uploads/author-profiles/' + req.file.filename;
                        }

                        // Update other author properties based on the request
                        author.author_name = req.body.author_name;
                        author.author_display_name = req.body.author_display_name;
                        author.author_designation = req.body.author_designation;
                        author.author_description = req.body.author_description;

                        const author_id = req.params.id;

                        if ('status' in req.body) {
                            author.status = req.body.status;
                        }

                        const checkAuthor = 'SELECT * FROM author WHERE author_id = ?';
                        const [AuthorExistOrNot] = await pool.query(checkAuthor, [author_id]);

                        const [getAuthor] = await pool.query(`select author_name from author where author_name = ? and (author_id <> ?)`,[author.author_name,author_id]);
                        if(getAuthor.length > 0) throw new Error('Author Name already used')
                        

                        if (AuthorExistOrNot.length === 0) {
                            reject(new Error('Author id not found'));
                        } else {
                         
                            const sql = 'UPDATE author SET ? WHERE author_id = ?';
                            const [row, fields] = await pool.query(sql, [author, author_id]);
                            resolve(row);
                        }
                    } catch (error) {
                            console.log('in catch '+ error);
                        reject (error);
                    }
                    
                }
            });
        });
    },

    postsByAuthor: async (searchAuthor) => {

        const authorId = searchAuthor.authorId;
        const page = parseInt(searchAuthor.page) || 1;
        const limit = parseInt(searchAuthor.limit) || 10;
        const offset = (page - 1) * limit;

        console.log(authorId, page, limit, offset);
        try {
            let dataCountQuery = `select count(id) FROM p_data_view WHERE post_author_id = ? and post_status ="publish"`
            let dataQuery = `select id,post_author,post_date,banner_img,banner_alt,post_title,post_name,cat_slug,cat_name,subcat_name,meta_keywords from p_data_view WHERE post_author_id = ? and post_status ='publish' `;
            dataQuery += ` ORDER BY id DESC LIMIT ? OFFSET ? `;
            console.log({dataCountQuery});
            console.log({dataQuery});

            const [totalResult] = await pool.query(dataCountQuery, [authorId]);
            const totalItems = totalResult[0].total;
            const [postData] = await pool.query(dataQuery, [authorId, limit, offset]);

            const totalPages = Math.ceil(totalItems / limit);

            const responseData = {
                postData,
                pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages,
                },
            };

            return (responseData);
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },
    
}
export default AuthorModel;
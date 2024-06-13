import { resolveInclude } from 'ejs'
// import db from '../dbconfig.mjs'
import pool from '../dbconfig.mjs';
import fs from 'fs';
import path from 'path';
// const pool = await initializeApp();
import uploadImage from "../middleware/uploadPostImage.mjs"

const rootPath = `https://staging.enterprisetalk.com`;


const __dirname = new URL('.', import.meta.url).pathname;

// Now you can use __dirname as you would in a CommonJS module
global.__basedir = __dirname;

const generateDestination = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // GetMonth is zero-based
    return `/uploads/${year}/${month}`; // Removed the leading forward slash before 'uploads'
};


const PostModel = {
    getAllPosts: async () => {
        console.log('inside getallposts');
        try {
            const sql = `select * from post_admin`;
            const [postData] = await pool.query(sql);

            console.log(sql);
            return postData;
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }

    },

    getPost: async (id) => {
        // console.log(' post model '+id);
        try {
            const dataQuery = `select * from p_data_view WHERE id = ? `;
            const [postData] = await pool.query(dataQuery, [id]);
            if (postData.length == 0) {
                throw new Error(`No Post found with id ${id}`)
            }
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    createPost: async (req,res) => {
        return new Promise((resolve, reject) => {
            uploadImage.single('banner_img')(req, null, async (err) => {
                if (err) {
                    reject(err);
                } else {
                    const newPost = {
                        post_title: req.body.post_title,
                        post_name: req.body.post_name,
                        post_content: req.body.post_content,
                        post_author: req.body.post_author,
                        post_date: req.body.post_date,
                        cat_id: req.body.cat_id,
                        subcat_id: req.body.subcat_id,
                        meta_title: req.body.meta_title,
                        meta_description: req.body.meta_description,
                        meta_keywords: req.body.meta_keywords,
                        reading_time: req.body.reading_time,
                        session_user: req.body.session_user,
                        comments: req.body.comments,
                        handover_to: req.body.handover_to,
                        auto_publish: req.body.auto_publish,
                        banner_show: req.body.banner_show,
                        podcast_link: req.body.podcast_link,
                    };

                    if (req.file) {
                        const { filename, originalname, mimetype, size } = req.file;
                        const fullPath =  generateDestination() + '/' + filename; // Construct full path
                        console.log({fullPath});
                        newPost.banner_img = fullPath;
                    }
                   
                    console.log({newPost});

                    try {
                        const postQuery = `insert into post_data set ? `;
                        const [result] = await pool.query(postQuery, [newPost]);

                        if (result.affectedRows > 0) {
                            resolve(result);
                        } else {
                            reject(new Error('Post create error'));

                        }
                    } catch (error) {
                        reject(new Error(error.message));
                    }

                }
            });
        })
    },

    updatePost: async (req,res) => {
       
        return new Promise((resolve, reject) => {
            uploadImage.single('banner_img')(req, null, async (err) => {
                if (err) {
                    console.error('Error during file upload:', err.message);
                    reject(err);
                } else {
                    const newPost = {
                        post_title: req.body.post_title,
                        post_name: req.body.post_name,
                        post_content: req.body.post_content,
                        post_author: req.body.post_author,
                        post_date: req.body.post_date,
                        cat_id: req.body.cat_id,
                        subcat_id: req.body.subcat_id,
                        meta_title: req.body.meta_title,
                        meta_description: req.body.meta_description,
                        meta_keywords: req.body.meta_keywords,
                        reading_time: req.body.reading_time,
                        session_user: req.body.session_user,
                        comments: req.body.comments,
                        handover_to: req.body.handover_to,
                        auto_publish: req.body.auto_publish,
                        banner_show: req.body.banner_show,
                        podcast_link: req.body.podcast_link,
                    };

                    if (req.file) {
                        const { filename, originalname, mimetype, size } = req.file;
                        const fullPath =  generateDestination() + '/' + filename; // Construct full path
                        newPost.banner_img = fullPath;


                        const postBannerQuery = `select id,banner_img from post_data WHERE  id =? `;
                        const [bannerResult] = await pool.query(postBannerQuery,[req.body.post_id]);
                        if (bannerResult[0].banner_img) {
                            const currentImagePath = '..' + bannerResult[0].banner_img;
                            fs.unlink(currentImagePath, (err) => {
                              if (err) {
                                console.log("error: ", err);
                                reject(new Error('Banner image unlink error '+ err));
                              }
                            });
                          }
                        
                      
                    }

                     console.log({newPost});

                    try {
                        const postQuery = `update post_data set ? where id =? `;
                        const [result] = await pool.query(postQuery, [newPost,req.body.post_id]);
                  
                        if (result.affectedRows > 0) {
                            const pattern = /cts-1|cts-2/;
                            // const post_desc1 = tinymce.get("p_desc").getContent();
                            // Test if the text contains the pattern
                            if (pattern.test(newPost.post_content) && (req.body.descChange !=0)) {
                                // console.log("The text contains either cts-1 or cts-2");
                                const postDescQuery = `insert into post_desc (post_id,post_content,user_id) values(?,?,?) `;
                                const [PostDescResult] = await pool.query(postDescQuery, [req.body.post_id,newPost.post_content,newPost.session_user]);
                                
                            }
                            resolve(result);

                           
                        } else {
                            reject(new Error('Post update error'));
                           
                        }
                    } catch (error) {
                        reject(new Error(error.message));
                    }
                   
                }
            });
        })
    },


    changePostStatus: async (req) => {
        const user = req.user;
        const postId =  req.params.postId;
        const timeStamp = new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      
        try {
            const dataQuery = `select id,post_content,post_status,comments from p_data_view WHERE id = ? `;
            const [postData] = await pool.query(dataQuery, [postId]);
            if (postData.length == 0) {
                throw new Error(`No Post found with id ${postId}`)
            }else{
                const updatePostData = postData[0];
                const updatedStatus = updatePostData.post_status == "publish" ? "draft" : "publish";

                if(updatedStatus == 'publish')
                {
                    const pattern = /cts-1|cts-2/;
                    if (pattern.test(updatePostData.post_content)) {
                        console.log("The text contains either cts-1 or cts-2");
                        throw new Error(`Post description changes are not accepted.`)
                    }
                    
                   
                }

                const updatedComment = updatePostData.comments + `<b>By ${user.user_name} ${timeStamp}</b> : post status changed to ${updatedStatus} <br>`;
                // return (postData)
                const postQuery = `update post_data set post_status = ?,comments = ? , session_user = ?, handover_to = 0 where id =? `;
                const [result] = await pool.query(postQuery, [updatedStatus,updatedComment,user.userid,postId]);
        
                if (result.affectedRows > 0) {
                    return(`Post id ${postId} status changed to ${updatedStatus}`);
                } else {
                    throw new Error(`Post id ${postId} status change error `)
                
                }
                
            }
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },


    publish_post: async (req) => {
        const user = req.user;
        const postId =  req.params.postId;
        const timeStamp = new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        try {
            const dataQuery = `select id,post_content,post_status,comments from p_data_view WHERE id = ? `;
            const [postData] = await pool.query(dataQuery, [postId]);
            if (postData.length == 0) {
                throw new Error(`No Post found with id ${postId}`)
            }else{
                const updatePostData = postData[0];
                const updatedComment = updatePostData.comments + `<b>By ${user.user_name} ${timeStamp}</b> : post status changed to publish <br>`;
                // return (postData)
                const postQuery = `update post_data set post_status = ?,comments = ? , session_user = ?, handover_to = 0 where id =? `;
                const [result] = await pool.query(postQuery, ['publish',updatedComment,user.userid,postId]);
        
                if (result.affectedRows > 0) {
                    return(`Post id ${postId} status changed to Publish`);
                } else {
                    throw new Error(`Post id ${postId} status change error `)
                
                }
                
            }
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    userPostData: async (userId) => {
        try {
            const dataQuery = `SELECT DISTINCT post_admin.* FROM post_admin LEFT JOIN team_view tvs ON post_admin.session_user = tvs.s_user_id LEFT JOIN team_view tvh ON post_admin.handover_to = tvh.s_user_id WHERE tvs.tl_user_id = ? OR tvh.tl_user_id = ? OR post_admin.session_user = ? OR post_admin.handover_to = ? ORDER BY post_admin.id DESC; `;
            const [postData] = await pool.query(dataQuery, [userId,userId,userId,userId]);
            if (postData.length == 0) {
                throw new Error(`No Post found for user id ${userId}`)
            }
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },


    getPostDetails:async(postInfo)=>{
        
        try {
            const {cat_slug,post_slug} = postInfo;
            // console.log({cat_slug,post_slug});
            const postQuery = `select id,post_title,post_name,post_content,post_author,post_author_id,banner_show,banner_img,podcast_link,post_date,cat_name,cat_slug,subcat_name,meta_title,meta_description,meta_keywords,reading_time from p_data_view WHERE cat_slug = ? and post_name = ? and post_status ='publish' `;
            const [result] = await pool.query(postQuery,[cat_slug,post_slug]);
            // console.log(result);
            if(result.length > 0){
                return (result);
            }
            else{
                throw new Error('Post not Found!');
            }
        } catch (error) {
            throw error.message
        }
    },

    previewPost:async(postInfo)=>{
        
        try {
            const {cat_slug,post_slug} = postInfo;
            // console.log({cat_slug,post_slug});
            const postQuery = `select id,post_title,post_name,post_content,post_author,post_author_id,banner_show,banner_img,podcast_link,post_date,cat_name,cat_slug,subcat_name,meta_title,meta_description,meta_keywords,reading_time from p_data_view WHERE cat_slug = ? and post_name = ? `;
            const [result] = await pool.query(postQuery,[cat_slug,post_slug]);
            // console.log(result);
            if(result.length > 0){
                return (result);
            }
            else{
                throw new Error('Post not Found!');
            }
        } catch (error) {
            throw error.message
        }
    },

    getPostMeta: async (id) => {
        try {
            const metaQuery = `select meta_title,meta_description,meta_keywords from post_meta WHERE post_id =?`
            const [postMeta] = await pool.query(metaQuery, [id]);
            if (postMeta.length == 0) {
                throw new Error(`No Post Meta Found with id ${id}`)
            }
            return (postMeta)

        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    navSearchPost:async(searchParam) =>{
        try{
            const paramSearch = ` and (post_title like '%${searchParam}%') `;
            const searchQuery = `select id,post_author,post_date,banner_img,post_title,post_name,cat_slug,cat_name,subcat_name,meta_keywords from p_data_view WHERE  post_status ='publish' ${paramSearch}  ORDER BY id DESC LIMIT 10 `
            const [result] = await pool.query(searchQuery);
            if(result.length > 0){
                return result;
            }
            else{
                throw new Error("No result Found");
            }
            
        }catch(error){
            throw error.message
        }
    },


    searchPost: async (searchParam,reqBody) => {
        // let catQuery = '';
        // if( searchParam.category != 'all'){
        //     catQuery = ` and (cat_slug = '${searchParam.category}') `
        // }
      
        const catQuery =  searchParam.category != 'all' ? ` and (cat_slug = '${searchParam.category}') ` : '';
        // const category = searchParam.category == 'all';
        const keyword = searchParam.keyword;
        // const keyword = searchParam;
        const page = parseInt(searchParam.page) || 1;
        const limit = parseInt(searchParam.limit) || 10;
        const offset = (page - 1) * limit;

        console.log( keyword,searchParam.category, page, limit, offset);
        // console.log(category, keyword, page, limit, offset);
        try {
            const paramSearch = ` and (post_title like '%${keyword}%' or meta_keywords like '%${keyword}%' ) `
            const dataCountQuery = `select count(id) as total from p_data_view where post_status ='publish' ${paramSearch} ${catQuery} `
            const [totalResult] = await pool.query(dataCountQuery);
            const totalItems = totalResult[0].total;
            const dataQuery = `select id,post_author,post_date,banner_img,post_title,post_name,cat_name,subcat_name,meta_keywords,cat_slug from p_data_view WHERE  post_status ='publish' ${paramSearch} ${catQuery} ORDER BY id DESC LIMIT ? OFFSET ?`;
            const [postData] = await pool.query(dataQuery, [ limit, offset]);

            const totalPages = Math.ceil(totalItems / limit);

            const responseData = {
                category : searchParam.category,
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

    searchCategory: async (catData) => {

        const category = catData.category;
        const subcategory = catData.subcategory;
        const page = parseInt(catData.page) || 1;
        const limit = parseInt(catData.limit) || 10;
        const offset = (page - 1) * limit;

        console.log(category, subcategory, page, limit, offset);
        try {
            let dataCountQuery = `select count(id) as total from p_data_view where cat_slug = ? and post_status ='publish'`
            let dataQuery = `select id,post_author,post_date,banner_img,post_title,post_name,cat_slug,cat_name,subcat_name,meta_keywords from p_data_view WHERE cat_slug = ? and post_status ='publish' `;
            if (subcategory != undefined || subcategory != null) {
                dataCountQuery += ` and (subcat_slug = '${subcategory}' or meta_keywords like '%${subcategory}%') `
                dataQuery += ` and (subcat_slug = '${subcategory}' or meta_keywords like '%${subcategory}%') `
            }
            dataQuery += ` ORDER BY id DESC LIMIT ? OFFSET ? `;
            // console.log({dataCountQuery});
            // console.log({dataQuery});

            const [totalResult] = await pool.query(dataCountQuery, [category]);
            const totalItems = totalResult[0].total;
            const [postData] = await pool.query(dataQuery, [category, limit, offset]);

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

    searchSubCategory: async (subCat) => {

        try {
            const metaWord = subCat.replace(/-/g, ' ');
            const [catData] = await pool.query(`select subcat_name from p_sub_cat where subcat_slug = ?`, [subCat]);
            const scQuery = `select id ,post_title ,post_name ,SUBSTRING_INDEX(REGEXP_REPLACE(REPLACE(REPLACE(post_content, '\\r|\\n', ''), '\\t', ''), '<[^>]+>', ''), ' ', 30) AS p_content,post_author ,banner_img,post_date ,cat_slug,meta_keywords from p_data_view where cat_slug = ? and (subcat_slug = ? or meta_keywords like ? ) and post_status ='publish' ORDER BY id DESC LIMIT 7`;
            const [news] = await pool.query(scQuery, [`news`, subCat, `%${metaWord}%`]);
            const [featured] = await pool.query(scQuery, [`featured`, subCat, `%${metaWord}%`]);
            const [quickbytes] = await pool.query(scQuery, [`quick-bytes`, subCat, `%${metaWord}%`]);
            const [podcasts] = await pool.query(scQuery, [`podcasts`, subCat, `%${metaWord}%`]);
            const [interview] = await pool.query(scQuery, [`interview`, subCat, `%${metaWord}%`]);
           
            
            const [futureready] = await pool.query(scQuery, [`future-ready`, subCat, `%${metaWord}%`]);
            const [guestauthor] = await pool.query(scQuery, [`guest-author`, subCat, `%${metaWord}%`]);
            console.log(guestauthor.length);
            // if(!guestauthor.length){
            //    console.log(  'inside if');
            //     const scQuery = `select id ,post_title ,post_name ,SUBSTRING_INDEX(REGEXP_REPLACE(REPLACE(REPLACE(post_content, '\\r|\\n', ''), '\\t', ''), '<[^>]+>', ''), ' ', 30) AS p_content,post_author ,banner_img,post_date ,cat_slug,meta_keywords from p_data_view where cat_slug = ? and post_status ='publish' ORDER BY id DESC LIMIT 1`;
            //     const [guestauthor] = await pool.query(scQuery, [`guestauthor`]);
            //     console.log({guestauthor});
            // }
            const [learningcenter] = await pool.query(scQuery, [`learning-center`, subCat, `%${metaWord}%`]);

            


            // console.log(catData[0].subcat_name);
            const subCatPost = {
                subCatName : catData[0].subcat_name,
                news: news,
                featured: featured,
                quickbytes: quickbytes,
                podcasts: podcasts,
                interview: interview,   
                futureready: futureready,
                guestauthor: guestauthor,
                learningcenter: learningcenter,
            }
            return (subCatPost);

        }
        catch (error) {
            console.log(error.message);
            throw error.message
        }


        // const category = subCatData.category;
        // const subCategory = subCatData.subcategory;
        // const page = parseInt(subCatData.page) || 1;
        // const limit = parseInt(subCatData.limit) || 10;
        // const offset = (page - 1) * limit;

        // console.log(subCategory, page, limit, offset);
        // try {

        //     const dataCountQuery = `select count(id) as total from p_data_view where cat_slug = ? and (subcat_slug = ? or meta_keywords like ? ) and post_status ='publish' `
        //     const [totalResult] = await pool.query(dataCountQuery, [category,subCategory,`%${subCategory}%`]);
        //     const totalItems = totalResult[0].total;
        //     const dataQuery = `select id,post_author,post_date,post_title,post_name,cat_name,subcat_name,meta_keywords from p_data_view WHERE cat_slug = ? and (subcat_slug = ? or meta_keywords like ? ) and post_status ='publish' ORDER BY id DESC LIMIT ? OFFSET ?`;
        //     const [postData] = await pool.query(dataQuery, [category,subCategory,`%${subCategory}%`, limit, offset]);

        //     const totalPages = Math.ceil(totalItems / limit);

        //     const responseData = {
        //         postData,
        //         pagination: {
        //             page,
        //             limit,
        //             totalItems,
        //             totalPages,
        //         },
        //     };

        //     return (responseData);
        // }
        // catch (error) {
        //     // console.log(error);
        //     throw error.message
        // }
    },

    searchTopic: async (reqData) => {
        console.log(reqData);
        return (reqData)

        // try {
        //     const dataQuery = `select id,post_author,post_date,post_title,post_name from p_data_view WHERE id = ?`;
        //     const [postData] = await pool.query(dataQuery, [id]);
        //     return (postData)
        // }
        // catch (error) {
        //     // console.log(error);
        //     throw error.message
        // }
    },

    deletePost: async (id) => {
        // console.log(' post model '+id);
        try {
            const dataQuery = `DELETE from post_data WHERE id = ? `;
            const [postData] = await pool.query(dataQuery, [id]);
            if (postData.affectedRows == 0) {
                throw new Error(`No Post found with id ${id}`)
            }
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    asideCategory: async (category) => {
        console.log(category);
        try {
            const asideQuery = `select id ,post_title ,post_name ,SUBSTRING_INDEX(post_content, ' ', 50) as post_content ,post_author ,banner_img,post_date,cat_slug from p_data_view where cat_slug = ? and post_status ='publish' ORDER BY id DESC LIMIT 5`
            const [result] = await pool.query(asideQuery, [category]);
            if(result.length>0){
                return result
            }
            else{
                throw new Error(`Post Not found for ${category} category`);
            }
        } catch (error) {
            throw error.message
        }
       

        // try {
        //     const dataQuery = `select id,post_author,post_date,post_title,post_name from p_data_view WHERE id = ?`;
        //     const [postData] = await pool.query(dataQuery, [id]);
        //     return (postData)
        // }
        // catch (error) {
        //     // console.log(error);
        //     throw error.message
        // }
    },

    // createPost: async (postData) => {
    //     try {
    //         const postQuery = `insert into post_data set ?`;
    //         const [result] = await pool.query(postQuery, [postData]);
    //         if (result.affectedRows > 0) {
    //             return result
    //         }
    //         else {
    //             throw new Error(`Unable to Add New Post`)
    //         }
    //         // return "ok";
            
    //     } catch (error) {
    //         throw new Error (error.message);
    //     }
    // },

   

    createTimeLine: async(timeData)=>{
        return new Promise(async (resolve, reject) => {
            try {
                const postQuery = `insert into work_session set ? `;
                const [result] = await pool.query(postQuery, [timeData]);

                if (result.affectedRows > 0) {
                    resolve(result);
                } else {
                    reject(new Error('Post timeline create error'));

                }
            } catch (error) {
                reject(new Error(error.message));
            }
        })
        
    },

    updatePublishTime: async (postTime) => {

        console.log('inside model');
        const { post_id, user_id, start_time, end_time } = postTime;
        console.log(post_id, user_id, start_time, end_time);
        return new Promise(async (resolve, reject) => {
            try {
                // check if handover value is passed
              
                    console.log('in handover');
                    // check if start time null i.e user not worked on this post yet
                    const postSelect1 = `select id from work_session where post_id = ? and user_id = ? and start_time is null order by post_id desc limit 1`;
                    const [result] = await pool.query(postSelect1, [post_id, user_id]);
                    console.log({ result });
                    if (result.length > 0) {
                        console.log('start time null');
                        // if user never worked on post then update both start and end time
                        // get wordsession id
                        const workSessionId = result[0].id;
                        const postUpdate = `update work_session set start_time =?, end_time = ? where id = ? `;
                        const [updateResult] = await pool.query(postUpdate, [start_time, end_time, workSessionId]);
                        if (updateResult.affectedRows > 0) {
                            resolve(result);
                        }
                        else {
                            console.log('update start time and end time success');
                            reject(new Error('Post timeline update error'));
                        }

                        // resolve(result);

                    } else {
                        // if user already worked on post
                        // then check if end time is set or not
                        console.log('start time not null bt end time is null');
                        const postSelect2 = `select id from work_session where post_id = ? and user_id = ? and start_time is not null and end_time is null order by post_id desc limit 1`;
                        const [result] = await pool.query(postSelect2, [post_id, user_id]);
                        if (result.length > 0) {
                            // if end time is not set
                            // get wordsession id
                            console.log('record found');
                            const workSessionId = result[0].id;
                            // udpate end time for session user
                            const postUpdate = `update work_session set  end_time = ? where id = ? `;
                            const [updateResult] = await pool.query(postUpdate, [end_time, workSessionId]);
                            if (updateResult.affectedRows > 0) {
                                // then create new record for handover user
                                console.log('update end time success');
                                resolve('Post time-line Updated for handover');

                            }
                            else {
                                console.log('update end time error');
                                reject(new Error('Post timeline update error'));
                            }

                            // resolve(result);

                        } else {
                            console.log('no reocrd found for user and post');
                            const postinsert = `insert into work_session (user_id,post_id,start_time, end_time,assigned_time) values(?,?,?,?,?) `;
                            const [insertResult] = await pool.query(postinsert, [user_id, post_id, start_time, end_time, start_time]);
                            if (insertResult.affectedRows > 0) {
                                // if all records are updated 
                                console.log('insert new record for user and post success');
                                resolve('Post time-line Updated for handover');
                                

                            } else {
                                console.log('insert new record for user and post error');
                                // console.log('insert new record error');
                                reject(new Error('Post timeline insert error'));

                            }
                            // console.log('end time udpate error');
                            // reject(new Error('Post timeline create error'));

                        }


                    }
                

            } catch (error) {
                reject(new Error(error.message));
            }
        })


    },

    updateTimeLine: async (postTime) => {
        console.log('inside model');
        const { post_id, user_id, start_time, end_time, handover } = postTime;
        console.log(post_id,user_id,start_time,end_time,handover);
        return new Promise(async (resolve, reject) => {
            try {
                // check if handover value is passed
                if (handover !=0) {
                    console.log('in handover');
                    // check if start time null i.e user not worked on this post yet
                    const postSelect1 = `select id from work_session where post_id = ? and user_id = ? and start_time is null order by post_id desc limit 1`;
                    const [result] = await pool.query(postSelect1, [post_id, user_id]);
                    console.log({ result });
                    if (result.length > 0) {
                        console.log('start time null');
                        // if user never worked on post then update both start and end time
                        // get wordsession id
                        const workSessionId = result[0].id;
                        const postUpdate = `update work_session set start_time =?, end_time = ? where id = ? `;
                        const [updateResult] = await pool.query(postUpdate, [start_time, end_time, workSessionId]);
                        if (updateResult.affectedRows > 0) {
                            console.log('update start time and end time success');
                            // if session user details updated then create new record for handover user
                            const postinsert = `insert into work_session (user_id,post_id,assigned_time) values(?,?,?) `;
                            const [insertResult] = await pool.query(postinsert, [handover, post_id, end_time]);
                            if (insertResult.affectedRows > 0) {
                                console.log('insert new record success');
                                // if handover user record is created
                                resolve(result);
                            } else {
                                console.log('insert new record error');
                                reject(new Error('Post timeline insert error'));

                            }
                        }
                        else {
                           console.log('update start time and end time success');
                            reject(new Error('Post timeline update error'));
                        }

                        // resolve(result);

                    } else {
                        // if user already worked on post
                        // then check if end time is set or not
                        console.log('start time not null bt end time is null');
                        const postSelect2 = `select id from work_session where post_id = ? and user_id = ? and start_time is not null and end_time is null order by post_id desc limit 1`;
                        const [result] = await pool.query(postSelect2, [post_id, user_id]);
                        if (result.length > 0) {
                            // if end time is not set
                            // get wordsession id
                            console.log('record found');
                            const workSessionId = result[0].id;
                            // udpate end time for session user
                            const postUpdate = `update work_session set  end_time = ? where id = ? `;
                            const [updateResult] = await pool.query(postUpdate, [end_time, workSessionId]);
                            if (updateResult.affectedRows > 0) {
                                // then create new record for handover user
                               console.log( 'update end time success');
                                const postinsert = `insert into work_session (user_id,post_id,assigned_time) values(?,?,?) `;
                                const [insertResult] = await pool.query(postinsert, [handover, post_id, end_time]);
                                if (insertResult.affectedRows > 0) {
                                    // if all records are updated 
                                    // console.log('insert new record');
                                    console.log( 'insert new record success');
                                    resolve('Post time-line Updated for handover');
                                } else {
                                    console.log( 'insert new record error');
                                    // console.log('insert new record error');
                                    reject(new Error('Post timeline insert error'));

                                }
                            }
                            else {
                                console.log( 'update end time error');
                                reject(new Error('Post timeline update error'));
                            }

                            // resolve(result);

                        } else {
                            console.log('no reocrd found for user and post');
                            const postinsert = `insert into work_session (user_id,post_id,start_time, end_time,assigned_time) values(?,?,?,?,?) `;
                            const [insertResult] = await pool.query(postinsert, [user_id, post_id, start_time, end_time, start_time]);
                            if (insertResult.affectedRows > 0) {
                                // if all records are updated 
                                console.log('insert new record for user and post success');
                                const postinsert = `insert into work_session (user_id,post_id,assigned_time) values(?,?,?) `;
                                const [insertResult] = await pool.query(postinsert, [handover, post_id, end_time]);
                                if (insertResult.affectedRows > 0) {
                                    // if all records are updated 
                                    console.log('insert new handover success');
                                    resolve('Post time-line Updated for handover');
                                } else {
                                    console.log('insert new handover record error');
                                    // console.log('insert new record error');
                                    reject(new Error('Post timeline insert error'));

                                }

                            } else {
                                console.log('insert new record for user and post error');
                                // console.log('insert new record error');
                                reject(new Error('Post timeline insert error'));

                            }
                            // console.log('end time udpate error');
                            // reject(new Error('Post timeline create error'));

                        }
                      

                    }
                } else {
                    // if save to draft
                    // check if start time is not set
                    const postSelect1 = `select id from work_session where post_id = ? and user_id = ? and start_time is null order by post_id desc limit 1`;
                    const [result] = await pool.query(postSelect1, [post_id, user_id]);
                    if (result.length > 0) {
                        // if not set then update the start time 
                        const workSessionId = result[0].id;
                        const postUpdate = `update work_session set  start_time = ? where id = ? `;
                        const [updateResult] = await pool.query(postUpdate, [start_time, workSessionId]);
                        if (updateResult.affectedRows > 0) {
                            resolve('Post Time-Line Updated');
                        }
                        else {
                            reject(new Error('Post timeline update error'));
                        }
                    } else {
                        // if start time already set then no need to set start time
                        // console.log( 'record no need to update');
                        resolve('No Need to Update Post Time-Line');
                    }
                }

            } catch (error) {
                reject(new Error(error.message));
            }
        })

    },
    

    // updatePost: async (postData,updateId) => {
    //     try {
    //         console.log('update model');
    //         // console.log(postData,updateId);
            
    //         const postQuery = `update post_data set ? where id =? `;
    //         const [result] = await pool.query(postQuery, [postData,updateId]);
    //         // console.log({result});
    //         if (result.affectedRows > 0) {
    //             console.log('success update');
    //             return result;
    //         }
    //         else {
    //             console.log( 'else error');
    //             throw new Error(`Unable to udpate Post`)
    //         }
    //         // return "ok";
            
    //     } catch (error) {
    //         throw new Error (error.message);
    //     }
    // },

    autoSavePost: async (postData,updateId) => {
        try {
            console.log('update model');
            // console.log(postData,updateId);
            
            const postQuery = `update post_data set ? where id =? `;
            const [result] = await pool.query(postQuery, [postData,updateId]);
            // console.log({result});
            if (result.affectedRows > 0) {
                console.log('success update');
                return result;
            }
            else {
                console.log( 'else error');
                throw new Error(`Unable to udpate Post`)
            }
            // return "ok";
            
        } catch (error) {
            throw new Error (error.message);
        }
    },

    uploadImage: async (imageInfo) => {
        return new Promise((resolve, reject) => {
            const { title, content, image } = imageInfo;
            console.log('model ');
            console.log(title, content, image);
            resolve("done")
        })
    },


    latestNewsPost: async () => {
        try {
            const latestNewsQuery = `select id,post_author,post_date,banner_img,post_title,SUBSTRING_INDEX(post_content, ' ', 50) AS post_content,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='news' ORDER BY id DESC limit 3;`;
            const [postData] = await pool.query(latestNewsQuery);
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    latestPost: async () => {
        try {
            const latestQuery = `select id,post_author,post_date,banner_img,post_title,SUBSTRING_INDEX(post_content, ' ', 50) AS post_content,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_name NOT IN ('news','podcasts') ORDER BY id DESC limit 4;`;
            const [postData] = await pool.query(latestQuery);
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    popularPost: async () => {
        try {
            const latestQuery = `SELECT p_data_view.id, COUNT(post_view_count.id) as post_count,post_author,post_date,banner_img,post_title,SUBSTRING_INDEX(post_content, ' ', 50) AS post_content,cat_slug,post_name FROM post_view_count LEFT JOIN p_data_view ON p_data_view.id = post_view_count.post_id WHERE p_data_view.post_status = "publish" GROUP BY post_id ORDER BY post_count DESC LIMIT 4`;
            const [postData] = await pool.query(latestQuery);
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    quickBytePost: async () => {
        try {
            const quickByteQuery = `select id,post_author,post_date,banner_img,post_title,SUBSTRING_INDEX(post_content, ' ', 50) AS post_content ,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='quick-bytes' ORDER BY id DESC limit 6;`;
            const [postData] = await pool.query(quickByteQuery);
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    articlePost: async () => {
        try {
            const articleQuery = `select id,post_author,post_date,banner_img,post_title,SUBSTRING_INDEX(post_content, ' ', 50) AS post_content ,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='featured' ORDER BY id DESC limit 6;`;
            const [postData] = await pool.query(articleQuery);
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    interviewPost: async () => {
        try {
            const articleQuery = `select id,post_author,post_date,banner_img,post_title,SUBSTRING_INDEX(post_content, ' ', 50) AS post_content,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='interview' ORDER BY id DESC limit 10;`;
            const [postData] = await pool.query(articleQuery);
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    podcastPost: async () => {
        try {
            const podcastQuery = `select id,post_author,post_date,banner_img,post_title,SUBSTRING_INDEX(post_content, ' ', 50) AS post_content ,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='podcasts' ORDER BY id DESC limit 1;`;
            const [postData] = await pool.query(podcastQuery);
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message;
        }
    },

    latestMenuPost: async () => {
        try {
            const newsQuery = `select id,post_author,post_date,banner_img,post_title,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='news' ORDER BY id DESC limit 3;`;
            const articleQuery = `select id,post_author,post_date,banner_img,post_title,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='featured' ORDER BY id DESC limit 3;`;
            const quickByteQuery = `select id,post_author,post_date,banner_img,post_title,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='quick-bytes' ORDER BY id DESC limit 3;`;
            const [newsData] = await pool.query(newsQuery);
            const [articleData] = await pool.query(articleQuery);
            const [quickByteData] = await pool.query(quickByteQuery);
            return ({ newsData, articleData,quickByteData })
        }
        catch (error) {
            // console.log(error);
            throw error.message;
        }
    },

    leadershipPost: async () => {
        // try {
        //     const newsQuery = `select id,post_author,post_date,banner_img,post_title,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='news' ORDER BY id DESC limit 2;`;
        //     const articleQuery = `select id,post_author,post_date,banner_img,post_title,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='featured' ORDER BY id DESC limit 2;`;
        //     const [newsData] = await pool.query(newsQuery);
        //     const [artilceData] = await pool.query(articleQuery);
        //     return ({ newsData, artilceData })
        // }
        // catch (error) {
        //     // console.log(error);
        //     throw error.message;
        // }
        try {
            const podcastQuery = `select id,post_author,post_date,banner_img,post_title,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='podcasts' ORDER BY id DESC limit 3;`;
            const inteviewQuery = `select id,post_author,post_date,banner_img,post_title,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='interview' ORDER BY id DESC limit 3;`;
            const guestPostQuery = `select id,post_author,post_date,banner_img,post_title,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='guest-author' ORDER BY id DESC limit 3;`;
            const [podcastData] = await pool.query(podcastQuery);
            const [inteviewData] = await pool.query(inteviewQuery);
            const [guestPostData] = await pool.query(guestPostQuery);
            return ({ podcastData, inteviewData, guestPostData })
        }
        catch (error) {
            // console.log(error);
            throw error.message;
        }
    },

    featuredPost: async () => {
        try {
            const articleQuery = `select id,post_author,post_date,banner_img,post_title,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='featured' ORDER BY id DESC limit 3;`;
            const futureReadyQuery = `select id,post_author,post_date,banner_img,post_title,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='future-ready' ORDER BY id DESC limit 3;`;
            const learningQuery = `select id,post_author,post_date,banner_img,post_title,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug ='learning-center' ORDER BY id DESC limit 3;`;
            const [articleData] = await pool.query(articleQuery);
            const [futureReadyData] = await pool.query(futureReadyQuery);
            const [learningData] = await pool.query(learningQuery);
            return ({ articleData, futureReadyData, learningData })
        }
        catch (error) {
            // console.log(error);
            throw error.message;
        }
    },


    postData: async (req, res) => {
        const userRole = req.user.role_id;
        const userid = req.user.userid;
       

        try {
            var draw = req.query.draw;
            var start = req.query.start;
            var length = req.query.length;
            var order_data = req.query.order;
            var authorId = req.query.authorId;
            var catId = req.query.catId;
            var subCatId = req.query.subCatId;
            var postStatus = req.query.postStatus;
            var searchStartDate = req.query.searchStartDate;
            var searchEndDate = req.query.searchEndDate;

            console.log(req.query.filterName);


            if (typeof order_data == 'undefined') {
                var column_name = 'post_admin.post_date';
                var column_sort_order = 'desc';
            }
            else {
                var column_index = req.query.order[0]['column'];
                var column_name = req.query.columns[column_index]['data'];
                var column_sort_order = req.query.order[0]['dir'];
            }
            var search_value = req.query.search['value'];
             let search_query = search_value ? ` and CONCAT(post_title, post_name, post_status, id) LIKE '%${search_value}%' ` : '';
              search_query += authorId ? ` and post_author_id = ${authorId} ` : '';
              search_query += catId ? ` and cat_id = ${catId} ` : '';
              search_query += subCatId ? ` and subcat_id = ${subCatId} ` : '';
              search_query += postStatus ? ` and post_status = '${postStatus}' ` : '';
              search_query += (searchStartDate && searchEndDate) ? ` and (post_date between '${searchStartDate}' and '${searchEndDate}') ` : '';
           
              
            let query, totalCountQuery, total_records, totalrec, total_records_with_filter ;
            totalCountQuery = await pool.query(`SELECT COUNT(*) AS total FROM post_admin`);
            total_records = totalCountQuery[0][0].total;

        
             totalrec = await pool.query(`SELECT COUNT(*) AS total FROM post_admin WHERE 1 ${search_query}`)
             total_records_with_filter = totalrec[0][0].total;
             query = `SELECT distinct(id),post_title,post_name,post_date,cat_name,cat_slug,subcat_name,post_author,comments,session_user_name,handover_to_name,post_status FROM post_admin  WHERE 1 ${search_query}  ORDER BY ${column_name} ${column_sort_order}  LIMIT ${start}, ${length} `;
           
            
            const data = await pool.query(query);
            var data_arr = [];
            data[0].forEach((row) => {
                data_arr.push({
                    'id': row.id,
                    'post_title': row.post_title,
                    'post_name': row.post_name,
                    'post_date': row.post_date,
                    'cat_name': row.cat_name,
                    'cat_slug': row.cat_slug,
                    'subcat_name': row.subcat_name,
                    'comments': row.comments,
                    'session_user_name': row.session_user_name,
                    'handover_to_name': row.handover_to_name,
                    'post_status': row.post_status,
                    'post_author': row.post_author,

                    
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

    teamPostData: async (req, res) => {
        const userRole = req.user.role_id;
        const userid = req.user.userid;
       

        try {
            var draw = req.query.draw;
            var start = req.query.start;
            var length = req.query.length;
            var order_data = req.query.order;
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
             const search_query = search_value ? ` and CONCAT(post_title, post_name, post_status, id) LIKE '%${search_value}%' ` : '';
           
       
            let query, totalCountQuery, total_records, totalrec, total_records_with_filter ;
            // totalCountQuery = await pool.query(`SELECT COUNT(*) AS total FROM post_admin`);
            // total_records = totalCountQuery[0][0].total;

         
            totalrec = await pool.query(`SELECT COUNT(DISTINCT post_admin.id) as total FROM post_admin WHERE (post_admin.session_user IN ( SELECT s_user_id FROM team_view WHERE team_view.tl_user_id = ${userid} ) OR post_admin.handover_to IN ( SELECT s_user_id FROM team_view WHERE team_view.tl_user_id = ${userid} )) OR ${userid} IN (post_admin.session_user, post_admin.handover_to);`)
            total_records_with_filter = totalrec[0][0].total;
          
            query = `SELECT distinct(id),post_title,post_name,post_date,cat_name,cat_slug,subcat_name,comments,session_user_name,handover_to_name,post_status FROM post_admin WHERE ((post_admin.session_user IN ( SELECT s_user_id FROM team_view WHERE team_view.tl_user_id = ${userid} ) OR post_admin.handover_to IN ( SELECT s_user_id FROM team_view WHERE team_view.tl_user_id = ${userid} )) OR ${userid} IN (post_admin.session_user, post_admin.handover_to)) ${search_query} ORDER BY ${column_name} ${column_sort_order} LIMIT ${start}, ${length}`;
         
           
            const data = await pool.query(query);
            var data_arr = [];
            data[0].forEach((row) => {
                data_arr.push({
                    'id': row.id,
                    'post_title': row.post_title,
                    'post_name': row.post_name,
                    'post_date': row.post_date,
                    'cat_name': row.cat_name,
                    'cat_slug': row.cat_slug,
                    'subcat_name': row.subcat_name,
                    'comments': row.comments,
                    'session_user_name': row.session_user_name,
                    'handover_to_name': row.handover_to_name,
                    'post_status': row.post_status,
                    
                })
            });

            var output = {
                'draw': draw,
                // 'iTotalRecords': total_records,
                'iTotalDisplayRecords': total_records_with_filter,
                'aaData': data_arr
            };
            return (output);
        } catch (error) {
            throw error.message;
        }
    },

    // postData: async (req, res) => {
    //     const userRole = req.user.role_id;
    //     const userid = req.user.userid;
       

    //     try {
    //         var draw = req.query.draw;
    //         var start = req.query.start;
    //         var length = req.query.length;
    //         var order_data = req.query.order;
    //         if (typeof order_data == 'undefined') {
    //             var column_name = 'post_admin.id';
    //             var column_sort_order = 'desc';
    //         }
    //         else {
    //             var column_index = req.query.order[0]['column'];
    //             var column_name = req.query.columns[column_index]['data'];
    //             var column_sort_order = req.query.order[0]['dir'];
    //         }
    //         //search data
    //         var search_value = req.query.search['value'];
    //          const search_query = search_value ? ` and CONCAT(post_title, post_name, post_status, id) LIKE '%${search_value}%' ` : '';
           
    //     //     const totalCountQuery = await pool.query(`SELECT COUNT(*) AS total FROM post_admin`);
    //     //     const total_records = totalCountQuery[0][0].total;
    //     //     const totalrec = await pool.query(`SELECT COUNT(*) AS total FROM post_admin WHERE 1 ${search_query}`)
    //     //     const total_records_with_filter = totalrec[0][0].total;

    //     //    const  query = `
    //     //     SELECT * FROM post_admin LEFT JOIN team_view tv ON post_admin.session_user = tv.s_user_id LEFT JOIN team_view ptv ON post_admin.handover_to = ptv.s_user_id
    //     //     WHERE 1 ${search_query} and tv.tl_user_id = ${userid} OR ptv.tl_user_id = ${userid} OR post_admin.session_user = ${userid} or post_admin.handover_to = ${userid}
    //     //     ORDER BY ${column_name} ${column_sort_order} 
    //     //     LIMIT ${start}, ${length}
    //     //     `;
    //         let query;
    //         let totalCountQuery;
    //         let total_records;
    //         let totalrec;
    //         let total_records_with_filter;
            

    //        if(userRole == 1 || userRole == 5 || userRole == 6 || userRole == 10){
    //         //  totalCountQuery = await pool.query(`SELECT COUNT(*) AS total FROM post_admin`);
    //         //  total_records = totalCountQuery[0][0].total;
    //          totalrec = await pool.query(`SELECT COUNT(*) AS total FROM post_admin WHERE 1 ${search_query}`)
    //          total_records_with_filter = totalrec[0][0].total;
    //          query = `
    //                   SELECT distinct(id),post_title,post_date,cat_name,subcat_name,comments,session_user_name,post_status FROM post_admin 
    //                   WHERE 1 ${search_query} 
    //                   ORDER BY ${column_name} ${column_sort_order} 
    //                   LIMIT ${start}, ${length}
    //                   `;
    //        }else if(userRole == 2 || userRole == 3 || userRole == 8 || userRole == 4){
    //         console.log('role check');
    //         //  totalCountQuery = await pool.query(`SELECT COUNT(*) AS total FROM post_admin `);
    //         //  total_records = totalCountQuery[0][0].total;
    //         // const totQueyr = `SELECT COUNT(DISTINCT post_admin.id) AS total 
    //         // FROM post_admin
    //         // LEFT JOIN team_view tv ON post_admin.session_user = tv.s_user_id
    //         // LEFT JOIN team_view ptv ON post_admin.handover_to = ptv.s_user_id
    //         // WHERE ${userid} IN (tv.tl_user_id, ptv.tl_user_id, post_admin.session_user, post_admin.handover_to);
    //         // `;
    //         // const [totalrecq] = await pool.query(totQueyr);
    //         // console.log(totalrecq.length);
    //         //  totalrec = await pool.query(`SELECT COUNT(DISTINCT post_admin.id) AS total FROM post_admin LEFT JOIN team_view tv ON post_admin.session_user = tv.s_user_id LEFT JOIN team_view ptv ON post_admin.handover_to = ptv.s_user_id WHERE 1 ${search_query} and (tv.tl_user_id = ${userid} OR ptv.tl_user_id = ${userid} OR post_admin.session_user = ${userid} or post_admin.handover_to = ${userid})`)
    //         //  total_records_with_filter = totalrec[0][0].total;
    //         //  total_records_with_filter = totalrecq.length;
          
    //         const startTime = new Date();
    //         console.log({startTime});
    //         totalrec = await pool.query(`SELECT COUNT(DISTINCT post_admin.id) as total FROM post_admin WHERE (post_admin.session_user IN ( SELECT s_user_id FROM team_view WHERE team_view.tl_user_id = ${userid} ) OR post_admin.handover_to IN ( SELECT s_user_id FROM team_view WHERE team_view.tl_user_id = ${userid} )) OR ${userid} IN (post_admin.session_user, post_admin.handover_to);`)
    //         total_records_with_filter = totalrec[0][0].total;
    //         const endTime = new Date();
    //         console.log({endTime});

    //         const qstartTime = new Date();
    //         console.log({qstartTime});
    //         //  query = `
    //         // SELECT distinct(id),post_title,post_date,cat_name,subcat_name,comments,session_user_name,post_status FROM post_admin LEFT JOIN team_view tv ON post_admin.session_user = tv.s_user_id LEFT JOIN team_view ptv ON post_admin.handover_to = ptv.s_user_id
    //         // WHERE 1 ${search_query} and (tv.tl_user_id = ${userid} OR ptv.tl_user_id = ${userid} OR post_admin.session_user = ${userid} or post_admin.handover_to = ${userid} )
    //         // ORDER BY ${column_name} ${column_sort_order} 
    //         // LIMIT ${start}, ${length}
    //         // `;

    //         query = `SELECT distinct(id),post_title,post_date,cat_name,subcat_name,comments,session_user_name,post_status FROM post_admin WHERE ((post_admin.session_user IN ( SELECT s_user_id FROM team_view WHERE team_view.tl_user_id = ${userid} ) OR post_admin.handover_to IN ( SELECT s_user_id FROM team_view WHERE team_view.tl_user_id = ${userid} )) OR ${userid} IN (post_admin.session_user, post_admin.handover_to)) ${search_query} ORDER BY ${column_name} ${column_sort_order} LIMIT ${start}, ${length}`;
    //        }
    //        console.log({query});
    //         const data = await pool.query(query);
    //         const qendTime = new Date();
    //        console.log({qendTime});
    //         // console.log(data);
    //         var data_arr = [];
    //         data[0].forEach((row) => {
    //             data_arr.push({
    //                 'id': row.id,
    //                 'post_title': row.post_title,
    //                 'post_date': row.post_date,
    //                 'cat_name': row.cat_name,
    //                 'subcat_name': row.subcat_name,
    //                 'comments': row.comments,
    //                 'session_user_name': row.session_user_name,
    //                 'post_status': row.post_status,
                    
    //             })
    //         });

    //         var output = {
    //             'draw': draw,
    //             // 'iTotalRecords': total_records,
    //             'iTotalDisplayRecords': total_records_with_filter,
    //             'aaData': data_arr
    //         };
    //         return (output);
    //     } catch (error) {
    //         throw error.message;
    //     }
    // },


    getAllPostsTeam: async (req, res) => {
        console.log('inside getallposts');
        const userRole = req.user.role_id;
        const userid = req.user.userid;
        console.log( userid);
        try {
            const sql = `SELECT distinct(id),post_title,post_date,cat_name,subcat_name,comments,session_user_name,post_status FROM post_admin LEFT JOIN team_view tv ON post_admin.session_user = tv.s_user_id LEFT JOIN team_view ptv ON post_admin.handover_to = ptv.s_user_id WHERE 1  and (tv.tl_user_id = ${userid} OR ptv.tl_user_id = ${userid} OR post_admin.session_user = ${userid} or post_admin.handover_to = ${userid} )  ORDER BY post_admin.id desc `;
            const [postData] = await pool.query(sql);

            console.log(sql);
            return postData;
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }

    },

    latestPage : async(req,res)=>{
        try {


            const latestQuery = `select id,post_author,post_date,banner_img,post_title,SUBSTRING_INDEX(post_content, ' ', 50) AS post_content ,cat_slug,post_name from p_data_view WHERE post_status = 'publish' and cat_slug = ? ORDER BY id DESC limit ?;`;
            const [news] = await pool.query(latestQuery, [`news`, 5]);
            const [featured] = await pool.query(latestQuery, [`featured`, 8]);
            const [quickbytes] = await pool.query(latestQuery, [`quick-bytes`, 4]);
            const [podcasts] = await pool.query(latestQuery, [`podcasts`, 1]);
            const [interview] = await pool.query(latestQuery, [`interview`, 4]);
            const [futureready] = await pool.query(latestQuery, [`future-ready`, 2]);
            const [guestauthor] = await pool.query(latestQuery, [`guest-author`, 1]);
            const [learningcenter] = await pool.query(latestQuery, [`learning-center`, 3]);
            return ({
                news,featured,quickbytes,podcasts,interview,futureready,guestauthor,learningcenter
            })
        } catch (error) {
            throw error.message;
        }
    },

    assignedPost: async(userId)=>{
        try {
            const userPostQuery = `select * from post_admin where handover_to =? and post_status <> 'publish'`;
            const [result] = await pool.query(userPostQuery,userId);
            return result;
        } catch (error) {
            throw error.message;
        }
    },

    handoverPost: async(userId)=>{
        try {
            const userPostQuery = `select * from post_admin where session_user = ? and handover_to <> 0 and post_status <> 'publish'`;
            const [result] = await pool.query(userPostQuery,userId);
            return result;
        } catch (error) {
            throw error.message;
        }
    },

    draftPost: async(userId)=>{
        try {
            const userPostQuery = `select * from post_admin where session_user =? and handover_to = 0 and post_status <> 'publish'`;
            const [result] = await pool.query(userPostQuery,userId);
            return result;
        } catch (error) {
            throw error.message;
        }
    },


    getUserPendingPosts: async (userId) => {
        // console.log(' post model '+id);
        try {
            // const dataQuery = `SELECT post_admin.id,post_title,post_date,comments,session_user,session_user_name,handover_to,handover_to_name,handover_to_name,user_post_time.work_time,user_post_time.buffer_time FROM post_admin LEFT JOIN user_post_time as user_post_time ON post_admin.id = user_post_time.post_id WHERE ? in (session_user,handover_to) and post_admin.post_status <> "publish" ORDER BY post_admin.id DESC `;
            const dataQuery = `SELECT post_admin.id, post_title, post_date, comments, session_user, session_user_name, handover_to, handover_to_name, handover_to_name,post_modified,post_created, MAX(user_post_time.work_time) AS work_time, MAX(user_post_time.buffer_time) AS buffer_time FROM post_admin LEFT JOIN user_post_time ON post_admin.id = user_post_time.post_id WHERE ((session_user = ? and handover_to = 0) OR handover_to = ?) AND post_admin.post_status <> "publish" GROUP BY post_admin.id ORDER BY post_admin.id DESC; `;
            const [postData] = await pool.query(dataQuery, [userId , userId]);
            // if (postData.length == 0) {
            //     throw new Error(`No pendings posts found for user id ${userId}`)
            // }
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    getTeamPendingPosts: async (roleId) => {
        // console.log(' post model '+id);
        try {
            // const dataQuery = `SELECT post_admin.id,post_title,post_date,comments,session_user,session_user_name,handover_to,handover_to_name,handover_to_name,user_post_time.work_time,user_post_time.buffer_time FROM post_admin LEFT JOIN user_post_time as user_post_time ON post_admin.id = user_post_time.post_id WHERE ? in (session_user,handover_to) and post_admin.post_status <> "publish" ORDER BY post_admin.id DESC `;
            // const dataQuery = `SELECT DISTINCT id, post_title, post_date, comments, session_user, session_user_name, handover_to, handover_to_name, handover_to_name, post_modified FROM post_admin WHERE ( ( post_admin.session_user IN ( SELECT s_user_id FROM team_view WHERE team_view.tl_role_id = ? ) OR post_admin.handover_to IN ( SELECT s_user_id FROM team_view WHERE team_view.tl_role_id = ? ) ) OR ? IN (post_admin.session_user, post_admin.handover_to) ) AND post_status <> "publish" ORDER BY post_admin.id DESC `;
            // const dataQuery = `SELECT DISTINCT id, post_title, post_date, comments, SESSION_USER, session_user_name, handover_to, handover_to_name, handover_to_name, post_modified FROM post_admin WHERE ( ( post_admin.session_user IN( SELECT s_user_id FROM team_view WHERE team_view.tl_role_id = ${roleId} ) OR post_admin.handover_to IN( SELECT s_user_id FROM team_view WHERE team_view.tl_role_id = ${roleId} ) ) OR (post_admin.session_user in (SELECT tl_user_id FROM team_view WHERE team_view.tl_role_id = ${roleId}) or post_admin.handover_to in (SELECT tl_user_id FROM team_view WHERE team_view.tl_role_id = ${roleId}) ) ) AND post_status <> "publish" ORDER BY post_admin.id DESC`;
            const dataQuery = `SELECT DISTINCT id, post_title, post_date, comments, SESSION_USER, session_user_name, handover_to, handover_to_name, handover_to_name, post_modified,post_created FROM post_admin WHERE ( ( post_admin.session_user IN( SELECT s_user_id FROM team_view WHERE team_view.tl_role_id = ${roleId} AND post_admin.handover_to = 0 ) OR post_admin.handover_to IN( SELECT s_user_id FROM team_view WHERE team_view.tl_role_id = ${roleId} ) ) OR ((post_admin.session_user in (SELECT tl_user_id FROM team_view WHERE team_view.tl_role_id = ${roleId}) AND post_admin.handover_to = 0) or post_admin.handover_to in (SELECT tl_user_id FROM team_view WHERE team_view.tl_role_id = ${roleId}) ) ) AND post_status <> "publish" ORDER BY post_admin.id DESC;`;
            const [postData] = await pool.query(dataQuery, [roleId , roleId,roleId]);
            if (postData.length == 0) {
                throw new Error(`No pendings posts for team`)
            }
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    getSeoTeamPending: async (roleId) => {
        // console.log(' post model '+id);
        try {
            // const dataQuery = `SELECT post_admin.id,post_title,post_date,comments,session_user,session_user_name,handover_to,handover_to_name,handover_to_name,user_post_time.work_time,user_post_time.buffer_time FROM post_admin LEFT JOIN user_post_time as user_post_time ON post_admin.id = user_post_time.post_id WHERE ? in (session_user,handover_to) and post_admin.post_status <> "publish" ORDER BY post_admin.id DESC `;
            // const dataQuery = `SELECT DISTINCT id, post_title, post_date, comments, session_user, session_user_name, handover_to, handover_to_name, handover_to_name, post_modified FROM post_admin WHERE ( ( post_admin.session_user IN ( SELECT s_user_id FROM team_view WHERE team_view.tl_role_id = ? ) OR post_admin.handover_to IN ( SELECT s_user_id FROM team_view WHERE team_view.tl_role_id = ? ) ) OR ? IN (post_admin.session_user, post_admin.handover_to) ) AND post_status <> "publish" ORDER BY post_admin.id DESC `;
            // const dataQuery = `SELECT DISTINCT id, post_title, post_date, comments, SESSION_USER, session_user_name, handover_to, handover_to_name, handover_to_name, post_modified FROM post_admin WHERE ( ( post_admin.session_user IN( SELECT s_user_id FROM team_view WHERE team_view.tl_role_id = ${roleId} ) OR post_admin.handover_to IN( SELECT s_user_id FROM team_view WHERE team_view.tl_role_id = ${roleId} ) ) OR (post_admin.session_user in (SELECT tl_user_id FROM team_view WHERE team_view.tl_role_id = ${roleId}) or post_admin.handover_to in (SELECT tl_user_id FROM team_view WHERE team_view.tl_role_id = ${roleId}) ) ) AND post_status <> "publish" ORDER BY post_admin.id DESC`;
            const dataQuery = `SELECT DISTINCT pa.id, pa.post_title,pa.post_name, pa.post_date, pa.cat_name,pa.cat_slug,pa.subcat_name, pa.comments, pa.session_user , pa.session_user_name, pa.handover_to, pa.handover_to_name, hu.user_name , pa.post_modified, pa.post_created FROM post_admin AS pa LEFT JOIN user_roles_view AS su ON pa.session_user = su.user_id LEFT JOIN user_roles_view AS hu ON pa.handover_to = hu.user_id WHERE( ( pa.session_user IN ( SELECT user_id FROM user_roles_view WHERE role_id IN (3, 9)) AND pa.handover_to = 0 ) OR pa.handover_to IN ( SELECT user_id FROM user_roles_view WHERE role_id IN (3, 9) ) ) AND pa.post_status <> 'publish' ORDER BY pa.id DESC;`;
            const [postData] = await pool.query(dataQuery, [roleId , roleId,roleId]);
            if (postData.length == 0) {
                throw new Error(`No pendings posts for team`)
            }
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    postViewCount: async (req) => {
          const  post_id = req.params.post_id;
           const  ip_addr = req.body.ip_addr;
        try {
            const existPost = `select * from post_view_count WHERE post_id = ? AND ip_addr = ? `;
            // const existPost = `select id,count from post_view_count WHERE post_id = ? `;
            const [postData] = await pool.query(existPost, [post_id, ip_addr]);
            if (postData.length == 0) {
                const insertQuery = `insert into post_view_count (post_id,ip_addr,count) values (?,?,?) `;
                const [result] = await pool.query(insertQuery, [post_id, ip_addr, 1]);
                if (result.affectedRows > 0) {
                    return (`Post view count updated`);
                } else {
                    throw new Error(`Post view count update error `)
                }
            } else {
                return (`existing post with ip`);
            }
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    getPostDescHistoryList: async (id) => {
        // console.log(' post model '+id);
        try {
            const dataQuery = `SELECT post_desc.id,users.display_name,post_desc.created_at FROM post_desc LEFT JOIN users ON users.user_id = post_desc.user_id WHERE post_id = ? ORDER BY post_desc.id DESC; `;
            const [postData] = await pool.query(dataQuery, [id]);
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    getPostDescHistory: async (id) => {
        console.log(' post model '+id);
        try {
            const dataQuery = `SELECT * FROM post_desc WHERE id = ?; `;
            const [postData] = await pool.query(dataQuery, [id]);
            if (postData.length == 0) {
                throw new Error(`No Post found with id ${id}`)
            }
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    uploadPostImage: async (req,res) => {
        return new Promise((resolve, reject) => {
            uploadImage.single('post_img')(req, null, async (err) => {
                if (err) {
                    reject(err);
                } else {
                    const newPostImage = {
                        user_id: req.body.session_user,
                        user_name: req.body.session_user_name,
                        post_id: req.body.postid,
                    };

                    if (req.file) {
                        const { filename, originalname, mimetype, size } = req.file;
                        newPostImage.post_image = generateDestination() + '/' + filename; // Construct full path
                    }else{
                        reject(new Error('Post Image not Provided'));
                    }
                    try {
                        const advAddQuery = `insert into post_image set ? `;
                        const [result] = await pool.query(advAddQuery, [newPostImage]);

                        if (result.affectedRows > 0) {
                            resolve(result);
                        } else {
                            reject(new Error('Adv Banner creating error'));

                        }
                    } catch (error) {
                        reject(new Error(error.message));
                    }

                }
            });
        })
    },

    allPostImage: async (req, res) => {
        try {
            var draw = req.query.draw;
            var start = req.query.start;
            var length = req.query.length;
            var order_data = req.query.order;
            if (typeof order_data == 'undefined') {
                var column_name = 'post_image_view.id';
                var column_sort_order = 'desc';
            }
            else {
                var column_index = req.query.order[0]['column'];
                var column_name = req.query.columns[column_index]['data'];
                var column_sort_order = req.query.order[0]['dir'];
            }
            var search_value = req.query.search['value'];
             const search_query = search_value ? ` and (post_image LIKE '%${search_value}%' or post_title LIKE '%${search_value}%' or post_id LIKE '%${search_value}%')  ` : '';
           
       
            let query, totalCountQuery, total_records, totalrec, total_records_with_filter ;
            totalCountQuery = await pool.query(`SELECT COUNT(*) AS total FROM post_image_view`);
            total_records = totalCountQuery[0][0].total;

        
             totalrec = await pool.query(`SELECT COUNT(*) AS total FROM post_image_view WHERE 1 ${search_query}`)
             total_records_with_filter = totalrec[0][0].total;
             query = `SELECT * FROM post_image_view  WHERE 1 ${search_query} ORDER BY ${column_name} ${column_sort_order} LIMIT ${start}, ${length} `;
           
           
            const data = await pool.query(query);
            var data_arr = [];
            data[0].forEach((row) => {
                data_arr.push({
                    'id': row.id,
                    'post_id': row.post_id,
                    'post_title': row.post_title,
                    'post_image': row.post_image,
                    'user_name': row.user_name,
                    'created_at': row.created_at,
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

    searchPostList: async (searchParam) => {
        try{
            const paramSearch = ` post_title like '%${searchParam}%' or id like '%${searchParam}%' `;
            const searchQuery = `SELECT id,post_title FROM post_data WHERE   ${paramSearch} ORDER BY id DESC LIMIT 10 `;
            console.log({searchQuery});
            const [result] = await pool.query(searchQuery);
            if(result.length > 0){
                return result;
            }
            else{
                throw new Error("No result Found");
            }
            
        }catch(error){
            throw error.message
        }
    },

    getPostImageByID: async (imageId) => {
        try{
            const searchQuery = `SELECT * from post_image WHERE id = ${imageId} `
            const [result] = await pool.query(searchQuery);
            if(result.length > 0){
                return result;
            }
            else{
                throw new Error("No result Found");
            }
            
        }catch(error){
            throw error.message
        }
    },

    deletePostImage: async (deletId) => {
        console.log(' post model '+deletId);
        try {
            const postImageQuery = `SELECT id, post_image FROM post_image WHERE id = ?`;
            const [bannerResult] = await pool.query(postImageQuery, [deletId]);
            
            if (bannerResult.length > 0 && bannerResult[0].post_image) {
                const currentImagePath = '..'+ bannerResult[0].post_image;
                // Use await to wait for the unlink operation to complete
                await new Promise((resolve, reject) => {
                    fs.unlink(currentImagePath, (err) => {
                        if (err) {
                            console.log("error: ", err);
                            reject(new Error('Banner image unlink error ' + err));
                        } else {
                            resolve();
                        }
                    });
                });
        
                const dataQuery = `DELETE FROM post_image WHERE id = ?`;
                const [postData] = await pool.query(dataQuery, [deletId]);
        
                if (postData.affectedRows == 0) {
                    throw new Error(`No Post image found with id ${deletId}`);
                }
                
                return postData;
            } else {
                throw new Error(`No post image found with id ${deletId}`);
            }
        } catch (error) {
            console.error("Error:", error.message);
            throw error; // Rethrow the error to propagate it further if needed
        }
        
    },

    updatePostImage: async (req, res) => {

        return new Promise((resolve, reject) => {
            uploadImage.single('post_img')(req, null, async (err) => {
                if (err) {
                    console.error('Error during file upload:', err.message);
                    reject(err);
                } else {
                    const newPost = {
                        update_imageId: req.body.update_imageId,
                       
                    };

                    
                    if (req.file) {
                        const { filename, originalname, mimetype, size } = req.file;
                        newPost.banner_img = generateDestination() + '/' + filename; // Construct full path

                         const postBannerQuery = `SELECT id, post_image FROM post_image WHERE id = ? `;
                        const [bannerResult] = await pool.query(postBannerQuery,[req.body.update_imageId]);
                        if (bannerResult[0].post_image) {
                            const currentImagePath = '..'+ bannerResult[0].post_image;
                            fs.unlink(currentImagePath, (err) => {
                              if (err) {
                                console.log("error: ", err);
                                reject(new Error('Banner image unlink error '+ err));
                              }
                            });
                          }



                    }

                    try {
                        const postQuery = `UPDATE post_image SET post_image = ? WHERE id = ?`;
                        const [result] = await pool.query(postQuery, [newPost.banner_img,req.body.update_imageId]);
                  
                        if (result.affectedRows > 0) {
                            resolve(result);

                        } else {
                            reject(new Error('Post update error'));
                           
                        }
                    } catch (error) {
                        reject(new Error(error.message));
                    }
                   
                }
            });
        })

      },

      sitemapPosts: async () => {
        console.log('inside getallposts');
        try {
            const sql = `SELECT post_name,cat_slug FROM post_admin where post_status = 'publish'`;
            const [postData] = await pool.query(sql);

            console.log(sql);
            return postData;
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }

    },
    

}


export default PostModel;
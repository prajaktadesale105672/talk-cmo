import multer from 'multer';
import path from 'path';

var getDateTime = function () {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    var day = ('0' + currentDate.getDate()).slice(-2);
    var hours = ('0' + currentDate.getHours()).slice(-2);
    var minutes = ('0' + currentDate.getMinutes()).slice(-2);
    var seconds = ('0' + currentDate.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


import PostModel from '../models/PostModel.mjs'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

export default {
    async getAllPosts(req, res) {
        try {
            const allPosts = await PostModel.getAllPosts();

            res.json(allPosts);
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'error getting posts data' })
        }
    },

    async getPost(req, res) {
        console.log(req.params.id);
        try {
            const postData = await PostModel.getPost(req.params.id);

            res.json({ success: true, postData });

        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: error })
        }
    },

    async changePostStatus(req, res) {
        try {
            const postData = await PostModel.changePostStatus(req);
            const postTime = {
                post_id: req.params.postId,
                user_id: req.user.userid,
                start_time: getDateTime(),
                end_time: getDateTime(),

            }
            console.log({ postTime });
            const timeResponce = await PostModel.updatePublishTime(postTime);
            console.log({ timeResponce });
            res.status(200).json({ success: true, message: postData });

        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: error })
        }
    },

    async publish_post(req, res) {
        try {
            const postData = await PostModel.publish_post(req);
            const postTime = {
                post_id: req.params.postId,
                user_id: req.user.userid,
                start_time: getDateTime(),
                end_time: getDateTime(),

            }
            console.log({ postTime });
            const timeResponce = await PostModel.updatePublishTime(postTime);
            console.log({ timeResponce });
            res.status(200).json({ success: true, message: postData });

        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: error })
        }
    },

    async getPostDetails(req, res) {
        try {
            const result = await PostModel.getPostDetails(req.params)
            res.status(201).json({ success: true, message: `post destails success`, result });
        } catch (error) {
            res.status(501).json({ success: false, message: 'post details error', error: error });
        }
    },

    async previewPost(req, res) {
        try {
            const result = await PostModel.previewPost(req.params)
            res.status(201).json({ success: true, message: `post destails success`, result });
        } catch (error) {
            res.status(501).json({ success: false, message: 'post details error', error: error });
        }
    },

    async userPostData(req, res) {
        try {
            const result = await PostModel.userPostData(req.params.userId)
            res.status(201).json({ success: true, message: `post data success`, result });
        } catch (error) {
            res.status(501).json({ success: false, message: 'post data error', error: error });
        }
    },


    async navSearchPost(req, res) {
        // const category = req.params.category || 'news';
        // const sarchParam = {
        //     category: category,
        //     keyword: req.params.keyword,
        // }
        // console.log({ sarchParam });
        // console.log('navsearch');
        console.log(req.params.keyword);
        try {
            const postData = await PostModel.navSearchPost(req.params.keyword);
            res.json({ success: true, searchQuery: req.params.keyword, postData });
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, searchQuery: req.params.keyword, message: 'error getting posts data' })
        }
    },

    async searchPost(req, res) {
        // const category = req.params.category || 'all';

        const sarchParam = {
            category: req.params.category,
            keyword: req.params.keyword,
            page: req.query.page,
            limit: req.query.limit

        }

        try {
            const result = await PostModel.searchPost(sarchParam, req.body);
            res.json({ success: true, result });
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: 'error getting posts data', error: error })
        }
    },


    async searchCategory(req, res) {
        console.log('insde searchcategory');
        const searchCat = {
            category: req.params.category,
            subcategory: req.params.subcategory,
            page: req.query.page,
            limit: req.query.limit
        };
        try {
            const postData = await PostModel.searchCategory(searchCat);
            res.json({ success: true, posts: postData });
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: 'error getting posts data' })
        }
    },

    // async searchSubCategory(req, res) {
    //     const category = req.params.category || 'news';
    //     const searchSubCat ={
    //         category : category,
    //         subcategory : req.params.subcategory,
    //         page : req.query.page,
    //         limit : req.query.limit
    //     };
    //     console.log('contoller '+searchSubCat);
    //     try {
    //         const postData = await PostModel.searchSubCategory(searchSubCat);
    //         res.json({ success: true, posts :postData});
    //     } catch (error) {
    //         console.log("post error " + error);
    //         res.status(500).json({ success: false, message: 'error getting posts data' })
    //     }
    // },

    async searchSubCategory(req, res) {
        const subCat = req.params.subcategory;
        try {
            const postData = await PostModel.searchSubCategory(subCat);
            res.json({ success: true, posts: postData });
        }
        catch (error) {
            console.log('subcat data getting error ' + error.message);
            res.status(500).json({ success: false, message: `error getting post data` });
        }
    },

    async searchTopic(req, res) {
        const { topic, keyword } = req.params;
        console.log(req.params.topic);
        console.log(req.params.keyword);
        console.log(req.query.page);
        // res.status(500).json({success:true,category:req.params.topic,keyword: req.params.keyword})
        try {
            const postData = await PostModel.searchTopic(req);
            res.json({ success: true, postData });
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: 'error getting posts data' })
        }
    },

    async uploadImage(req, res) {
        try {
            upload.single('image')(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: 'Error uploading image' + err });
                }
                if (!req.file) {
                    return res.status(400).json({ error: 'No image provided' });
                }
                const { filename, originalname, mimetype, size } = req.file;
                const newPost = {
                    title: req.body.title,
                    content: req.body.content,
                    // Add other fields as needed
                    image: filename, // Store the image filename in the database
                };

                const postId = await PostModel.uploadImage(newPost);
                res.json({ message: 'Post created with image', postId });

            });
        } catch (error) {
            console.error('post error ' + error);
            res.status(500).json({ error: 'Error creating the post with an image' });
        }
    },


    // async createPost(req, res) {

    //     try {
    //         upload.single('banner_img')(req, res, async (err) => {
    //             if (err) {
    //                 return res.
    //                 status(400).json({ error: 'Error uploading image' + err });
    //             }


    //             const newPost = {
    //                 post_title: req.body.post_title,
    //                 post_name: req.body.post_name,
    //                 post_content: req.body.post_content,
    //                 post_author: req.body.post_author,
    //                 post_date: req.body.post_date,
    //                 cat_id: req.body.cat_id,
    //                 subcat_id: req.body.subcat_id,
    //                 meta_title: req.body.meta_title,
    //                 meta_description: req.body.meta_description,
    //                 meta_keywords: req.body.meta_keywords,
    //                 reading_time: req.body.reading_time,
    //                 session_user: req.body.session_user,
    //                 comments: req.body.comments,
    //                 handover_to: req.body.handover_to,
    //             };

    //             if (req.file) {
    //                 const { filename, originalname, mimetype, size } = req.file;
    //                 newPost.banner_img = filename;
    //             }


    //             // if banner_image is required/ mandatory
    //             // if (!req.file) {
    //                 //     return res.status(400).json({ error: 'No image provided' });
    //                 // }

    //                 // const { filename, originalname, mimetype, size } = req.file;
    //                 console.log(newPost);
    //                 try {
    //                     const response = await PostModel.createPost(newPost);
    //                     res.status(201).json({success:true, message: 'Post created with image',response:response });

    //                 } catch (error) {
    //                     console.error('post error ' + error);
    //                     res.status(400).json({success:false,error: `Error creating the post `,message:error.message }); 
    //                 }

    //         });
    //     } catch (error) {
    //         console.error('post error ' + error);
    //         res.status(400).json({success:false,error: `Error creating the post with image `,message:error.message }); 
    //     }

    // },

    async deleteBanner(req, res) {
        try {
            console.log(req.body.postId);
            res.status(201).json({ success: true, message: 'success' });
        } catch (error) {
            res.status(400).json({ success: false, error: `Error`, message: error.message });
        }
    },

    async deletePost(req, res) {
        console.log('DELETE post');
        try {
            console.log(req.params.post_id);
            const result = await PostModel.deletePost(req.params.post_id);
            console.log(result);
            res.status(201).json({ success: true, message: `Post id ${req.params.post_id} deleted!`, result });
        } catch (error) {
            res.status(400).json({ success: false, error: `Error deleteing post with id ${req.params.post_id}`, message: error.message });
        }
    },


    async createPost(req, res) {
        try {
            const response = await PostModel.createPost(req);
            const postTime = {
                post_id: response.insertId,
                user_id: req.body.session_user,
                start_time: req.body.startTime,
                assigned_time: req.body.startTime
            }
            const timeResponce = await PostModel.createTimeLine(postTime)
            res.status(201).json({ success: true, message: 'Post Createad', response: response });
        } catch (error) {
            console.error('post error ' + error);
            res.status(400).json({ success: false, error: 'Error creating the post', message: error.message });
        }

    },

    async updatePost(req, res) {
        // console.log(req.body);
        // res.status(201).json({success:true,postID: req.body})
        try {
            const response = await PostModel.updatePost(req);

            const postTime = {
                post_id: req.body.post_id,
                user_id: req.body.session_user,
                start_time: req.body.startTime,
                end_time: req.body.endTime,
                handover: req.body.handover_to
            }
            console.log({ postTime });
            const timeResponce = await PostModel.updateTimeLine(postTime);
            console.log({ timeResponce });



            res.status(201).json({ success: true, message: 'Post updated', response: response });
        } catch (error) {
            console.error('post error ' + error);
            res.status(400).json({ success: false, error: 'Error updating the post', message: error.message });
        }
    },


    // async updatePost(req, res) {
    //     console.log('inside updatePost');
    //     console.log(req.body);
    //     // res.status(201).json({success:true,postID: req.body})

    //     try {
    //         upload.single('banner_img')(req, res, async (err) => {
    //             if (err) {
    //                 return res.status(400).json({ error: 'Error uploading image ' + err });
    //             }


    //             const newPost = {
    //                 post_title: req.body.post_title,
    //                 post_name: req.body.post_name,
    //                 post_content: req.body.post_content,
    //                 post_author: req.body.post_author,
    //                 post_date: req.body.post_date,
    //                 cat_id: req.body.cat_id,
    //                 subcat_id: req.body.subcat_id,
    //                 meta_title: req.body.meta_title,
    //                 meta_description: req.body.meta_description,
    //                 meta_keywords: req.body.meta_keywords,
    //                 reading_time: req.body.reading_time,
    //                 session_user: req.body.session_user,
    //                 comments: req.body.comments,
    //                 handover_to: req.body.handover_to,
    //             };

    //             const updateId =  req.body.post_id;

    //             if (req.file) {
    //                 const { filename, originalname, mimetype, size } = req.file;
    //                 newPost.banner_img = filename;
    //             }


    //             // if banner_image is required/ mandatory
    //             // if (!req.file) {
    //                 //     return res.status(400).json({ error: 'No image provided' });
    //                 // }

    //                 // const { filename, originalname, mimetype, size } = req.file;

    //                 // console.log(newPost);

    //                 try {
    //                     const response = await PostModel.updatePost(newPost, updateId);
    //                     res.status(201).json({ success: true, message: 'Post updated', response: response });
    //                 } catch (error) {
    //                     res.status(400).json({ success: false, error: 'Error updating the post', message: error.message });
    //                 }
    //             });
    //         } catch (error) {
    //             console.error('post error ' + error);
    //             res.status(400).json({ success: false, error: 'Error updating the post', message: error.message });
    //         }


    // },

    async autoSavePost(req, res) {
        console.log('inside autoSavePost');
        console.log(req.body);
        // res.status(201).json({success:true,postID: req.body})

        try {



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

            };

            const updateId = req.body.post_id;




            // if banner_image is required/ mandatory
            // if (!req.file) {
            //     return res.status(400).json({ error: 'No image provided' });
            // }

            // const { filename, originalname, mimetype, size } = req.file;

            console.log(newPost);

            const response = await PostModel.autoSavePost(newPost, updateId);
            console.log({ response });
            res.status(201).json({ success: true, message: 'Post udpated', response: response });




        } catch (error) {
            console.error('post error ' + error);
            res.status(400).json({ success: false, error: `Error updating iamge the post `, message: error.message });
        }


    },


    async latestPost(req, res) {
        try {
            const allPosts = await PostModel.latestPost();
            res.json(allPosts);
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'error getting latest posts data' })
        }
    },

    async latestNewsPost(req, res) {
        try {
            const allPosts = await PostModel.latestNewsPost();
            res.json(allPosts);
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'error getting latest posts data' })
        }
    },

    async popularPost(req, res) {
        try {
            const allPosts = await PostModel.latestPost();
            const allPosts1 = await PostModel.popularPost();
            res.json({ latest: allPosts, popular: allPosts1 });
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'error getting latest posts data' })
        }
    },

    async quickBytePost(req, res) {
        try {
            const allPosts = await PostModel.quickBytePost();
            res.json({ quickByte: allPosts });
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'error getting latest posts data' })
        }
    },

    async articlePost(req, res) {
        try {
            const allPosts = await PostModel.articlePost();
            res.json({ article: allPosts });
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'error getting latest posts data' })
        }
    },

    async interviewPost(req, res) {
        try {
            const allPosts = await PostModel.interviewPost();
            res.json({ interview: allPosts });
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'error getting latest posts data' })
        }
    },

    async latestMenuPost(req, res) {
        try {
            const allPosts = await PostModel.latestMenuPost();
            res.json(allPosts);
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'error getting latest posts data' })
        }
    },

    async leadershipPost(req, res) {
        try {
            const allPosts = await PostModel.leadershipPost();
            res.json(allPosts);
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'error getting latest posts data' })
        }
    },


    async featuredPost(req, res) {
        try {
            const allPosts = await PostModel.featuredPost();
            res.json(allPosts);
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'error getting latest posts data' })
        }
    },
    // home page apis 
    async homePost(req, res) {
        try {
            const latestPost = await PostModel.latestPost();
            // const latestNewsPost = await PostModel.latestNewsPost();
            // const popularPost = await PostModel.popularPost();
            // const quickBytePost = await PostModel.quickBytePost();
            // const articlePost = await PostModel.articlePost();
            // const interviewPost = await PostModel.interviewPost();
            // const podcastPost = await PostModel.podcastPost();

            const allPostData = {
                // latestNews: latestNewsPost,
                latest: latestPost,
                // popular: popularPost,
                // quickbyte: quickBytePost,
                // article: articlePost,
                // interview: interviewPost,
                // podcast: podcastPost
            }

            res.json(allPostData);
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'error getting latest posts data' })
        }
    },

    // latest news post 
    async latestNewsPosts(req, res) {
        // const { page, pageSize, search } = req.query;
        try {
            const latestNewsPost = await PostModel.latestNewsPost();
            res.json(latestNewsPost);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Error fetching posts' });
        }
    },

    // popular post for home page 
    async popularPosts(req, res) {
        // const { page, pageSize, search } = req.query;
        try {
            const popularPost = await PostModel.popularPost();
            res.json(popularPost);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Error fetching posts' });
        }
    },

    //  quickbyte  for home page 
    async quickBytePosts(req, res) {
        // const { page, pageSize, search } = req.query;
        try {
            const quickBytePost = await PostModel.quickBytePost();
            res.json(quickBytePost);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Error fetching posts' });
        }
    },

    // articles - home page 
    async articlePosts(req, res) {
        // const { page, pageSize, search } = req.query;
        try {
            const articlePost = await PostModel.articlePost();
            res.json(articlePost);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Error fetching posts' });
        }
    },

    // interview post - home page 
    async interviewPosts(req, res) {
        // const { page, pageSize, search } = req.query;
        try {
            const interviewPost = await PostModel.interviewPost();
            res.json(interviewPost);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Error fetching posts' });
        }
    },

    // podcast post - home page 
    async podcastPosts(req, res) {
        // const { page, pageSize, search } = req.query;
        try {
            const podcastPost = await PostModel.podcastPost();
            res.json(podcastPost);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Error fetching posts' });
        }
    },

    async postData(req, res) {
        // const { page, pageSize, search } = req.query;
        try {
            const usersData = await PostModel.postData(req);
            res.json(usersData);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Error fetching posts' });
        }
    },

    async teamPostData(req, res) {
        // const { page, pageSize, search } = req.query;
        try {
            const usersData = await PostModel.teamPostData(req);
            res.json(usersData);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Error fetching posts' });
        }
    },


    // page wise apis
    async latestPage(req, res) {
        try {
            const postData = await PostModel.latestPage();

            res.json({ success: true, postData });

        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: error })
        }
    },


    async asideCategory(req, res) {
        console.log('insde asideCategory');
        try {
            const postData = await PostModel.asideCategory(req.params.category);
            res.status(201).json({ success: true, message: `post details fetch Success`, result: postData });
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: 'error getting posts data' })
        }
    },

    async assignedPost(req, res) {
        const userId = req.params.userId;
        try {

            const userPosts = await PostModel.assignedPost(userId);
            res.status(201).json({ success: true, message: `post details fetch Success`, userPosts: userPosts });
        } catch (error) {
            console.log(`post fetch error for user id ${userId} error ` + error);
            res.status(500).json({ success: false, message: `post fetch error for user id ${userId} error: ${error}` })
        }
    },

    async handoverPost(req, res) {
        const userId = req.params.userId;
        try {

            const userPosts = await PostModel.handoverPost(userId);
            res.status(201).json({ success: true, message: `post details fetch Success`, userPosts: userPosts });
        } catch (error) {
            console.log(`post fetch error for user id ${userId} error ` + error);
            res.status(500).json({ success: false, message: `post fetch error for user id ${userId} error: ${error}` })
        }
    },

    async draftPost(req, res) {
        const userId = req.params.userId;
        try {

            const userPosts = await PostModel.draftPost(userId);
            res.status(201).json({ success: true, message: `post details fetch Success`, userPosts: userPosts });
        } catch (error) {
            console.log(`post fetch error for user id ${userId} error ` + error);
            res.status(500).json({ success: false, message: `post fetch error for user id ${userId} error: ${error}` })
        }
    },

    async getAllPostsTeam(req, res) {
        try {
            const allPosts = await PostModel.getAllPostsTeam(req);

            res.json(allPosts);
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'error getting posts data' })
        }
    },

    async getUserPendingPosts(req, res) {
        console.log(req.params.userId);
        try {
            const postData = await PostModel.getUserPendingPosts(req.params.userId);

            res.json({ success: true, postData });

        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: error })
        }
    },

    async getTeamPendingPosts(req, res) {
        console.log(req.params.roleId);
        try {
            const postData = await PostModel.getTeamPendingPosts(req.params.roleId);

            res.json({ success: true, postData });

        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: error })
        }
    },

    async getSeoTeamPending(req, res) {
        console.log(req.params.roleId);
        try {
            const postData = await PostModel.getSeoTeamPending(req.params.roleId);

            res.json({ success: true, postData });

        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: error })
        }
    },

    async postViewCount(req, res) {
        try {
            const postData = await PostModel.postViewCount(req);
            res.status(200).json({});

        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({})
        }
    },

    async getPostDescHistoryList(req, res) {
        console.log(req.params.id);
        try {
            const postDesc = await PostModel.getPostDescHistoryList(req.params.id);

            res.json({ success: true, postDesc });

        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: error })
        }
    },

    async getPostDescHistory(req, res) {
        console.log(req.params.id);
        try {
            const postDesc = await PostModel.getPostDescHistory(req.params.id);

            res.json({ success: true, postDesc });

        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: error })
        }
    },


    async uploadPostImage(req, res) {

        try {
            const response = await PostModel.uploadPostImage(req);
            res.status(201).json({ success: true, message: 'New Post Image Created', response: response });
        } catch (error) {
            console.error('post error ' + error);
            res.status(400).json({ success: false, error: 'Error creating Post Image', message: error.message });
        }


    },

    async allPostImage(req, res) {
        // const { page, pageSize, search } = req.query;
        try {
            const postImageData = await PostModel.allPostImage(req);
            res.json(postImageData);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Error fetching posts' });
        }
    },



    async searchPostList(req, res) {
        const search_val = req.params.search_val;
        console.log(search_val);

        // res.status(500).json({success:true,category:req.params.topic,keyword: req.params.keyword})
        try {
            const postData = await PostModel.searchPostList(search_val);
            res.json({ success: true, postData });
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: 'error getting posts data' })
        }
    },

    async getPostImageByID(req, res) {
        const imageId = req.params.imageId;

        try {
            const postData = await PostModel.getPostImageByID(imageId);
            res.json(postData);
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: 'error getting posts data' })
        }
    },

    async deletePostImage(req, res) {
        console.log(req.params.deletId);
        try {
            const result = await PostModel.deletePostImage(req.params.deletId);
            res.status(201).json({ success: true, message: `Post Image ${req.params.deletId} deleted!`, result });
        } catch (error) {
            res.status(400).json({ success: false, error: `Error deleteing post image with id ${req.params.deletId}`, message: error.message });
        }
    },

    async updatePostImage(req, res) {
        // console.log('update post image');
        try {
            const result = await PostModel.updatePostImage(req);
            res.status(201).json({ success: true, message: `Post Image Udpated!`, result });
        } catch (error) {
            res.status(400).json({ success: false, error: `Error udpating post image `, message: error.message });
        }
    },


    async sitemapPosts(req, res) {
        try {
            const allPosts = await PostModel.sitemapPosts();

            res.json(allPosts);
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'error getting posts data' })
        }
    },

}








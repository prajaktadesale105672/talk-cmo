import express from "express";
const router = express.Router();
import postController from '../controllers/PostController.mjs'
import checkLogin from "../middleware/checkLogin.mjs";
import checkPermission from "../middleware/checkPermission.mjs";

router.get('/', (req, res) => {
    res.send('Post Routes');
})

// Get all post details
router.get('/all', postController.getAllPosts)

// all Post with pagination
router.get('/allposts', checkPermission('Post Management', 'read'), postController.postData);

router.get('/team-posts', checkPermission('Post Management', 'read'), postController.teamPostData);


// Route for front-end

// home page latest limit 3  - navbar
router.get('/latest', postController.latestPost)

// home page latest limit 3
router.get('/latestnews', postController.latestNewsPost)

// home page latest + popular  limit 3
router.get('/popular', postController.popularPost)

// home page quick byte limit 5
router.get('/quick_byte', postController.quickBytePost)

// home page featured article limit 5
router.get('/article', postController.articlePost)

// home page featured interview limit 5
router.get('/interview', postController.interviewPost)



// home page apis
// Search post using keyword
router.get('/latestPost', postController.homePost)

// latest news post 
router.get('/latestNewsPost', postController.latestNewsPosts)

// populer posts - home page 
router.get('/popularPost', postController.popularPosts)

// quickbytes - homepage
router.get('/quickbytes', postController.quickBytePosts)

// articles post - home page 
router.get('/articlePost', postController.articlePosts)

// intervew post - home page 
router.get('/interviewPost', postController.interviewPosts)

// podcast post - home page 
router.get('/podcastPosts', postController.podcastPosts)

// Menu letest api
router.get('/latestPost', postController.latestMenuPost)

// Search post using keyword
router.get('/leadership', postController.leadershipPost)
// Search post using keyword
router.get('/featured', postController.featuredPost)

// all Post with pagination
router.get('/user_posts/:userId', postController.userPostData);

// page wise apis
// latest page
router.get('/page/latest', postController.latestPage)


// Search post using category
router.get('/topic/:category', postController.searchCategory)

router.get('/topic/:category/:subcategory', postController.searchCategory)

// Search post using sub-category - Done
// if category is not passed then default category will be 'news'
router.get('/tag/:subcategory', postController.searchSubCategory)
// if category parameter is passed
router.get('/tag/:category/:subcategory', postController.searchSubCategory)



// Search post using keyword
router.get('/navsearch/:keyword', postController.navSearchPost)
// router.get('/search/:category',postController.searchPost)
// router.get('/search/:keyword',postController.searchPost)
router.get('/search/:category/:keyword', postController.searchPost)

// get post details using post id
router.get('/viewpost/:id', postController.getPost)

// publish post details using post id
router.put('/change_post_status/:postId', checkPermission('Post Management', 'update'), postController.changePostStatus)

// publish post using post id
router.put('/publish_post/:postId', checkPermission('Post Management', 'update'), postController.publish_post)


// View post count by post id
router.post('/post_count/:post_id', postController.postViewCount)

// Search post using keyword
// router.get('/:topic/:keyword',postController.searchTopic)


// Search post using category
router.get('/asidetopic/:category', postController.asideCategory)

// get post details using post id
router.get('/postdetails/:cat_slug/:post_slug', postController.getPostDetails)

// preview post details using post id
router.get('/preview-post/:cat_slug/:post_slug', postController.previewPost)

router.get('/assigned_posts/:userId', postController.assignedPost);
router.get('/handover_posts/:userId', postController.handoverPost);
router.get('/draft_posts/:userId', postController.draftPost);

// get post description history list using post id
router.get('/post-desc-history-list/:id', postController.getPostDescHistoryList)
// publish post description history using post id
router.get('/post-desc-history/:id', postController.getPostDescHistory)

// Create new post
router.post('/', checkPermission('Post Management', 'create'), postController.createPost)

router.put('/', checkPermission('Post Management', 'update'), postController.updatePost)

// Post Autosave
router.put('/autosave', checkLogin, postController.autoSavePost)
// router.put('/',(req,res) =>{
//     console.log('inside upadte');
//     console.log( req.body);
//     res.status(201).json({success:"update route"});
// })

// Upload Image for Post
router.post('/image', postController.uploadImage)

router.delete('/banner_img', postController.deleteBanner)
router.delete('/delete_post/:post_id', postController.deletePost)

// Get all post details
router.get('/user_pending_posts/:userId', checkPermission('Post Management', 'read'), postController.getUserPendingPosts)

// Get all post details
router.get('/team_pending_posts/:roleId', checkPermission('Post Management', 'read'), postController.getTeamPendingPosts)
// Get all post details
router.get('/team_pending_posts1/seo', checkPermission('Post Management', 'read'), postController.getSeoTeamPending)


// Get all post details
router.get('/allteam', checkPermission('Post Management', 'read'), postController.getAllPostsTeam)

// Upload Image for Post
router.post('/post_image', postController.uploadPostImage)

// get all post Images
router.get('/post_image_all', postController.allPostImage);

// search posts for image upload
router.get('/search_post_list/:search_val', postController.searchPostList)

// get post Image details by imageid
router.get('/post_img/:imageId', postController.getPostImageByID)

// delete post Image details by imageid
router.delete('/delete_post_image/:deletId', postController.deletePostImage)

// update post Image details
router.put('/update_post_image', postController.updatePostImage)


// home page latest limit 3
router.get('/sitemap_posts', postController.sitemapPosts)


export default router;
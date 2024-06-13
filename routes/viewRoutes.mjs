import { Router } from "express";
import pkg from 'jsonwebtoken';
import verifyUser from "../middleware/verifyUser.mjs";
import checkLogin from "../middleware/checkLogin.mjs";
const { verify } = pkg;
const router = Router({ strict: true });
import roleModel from '../models/roleModel.mjs'
import permModel from '../models/permissionModel.mjs'
import categoryModel from '../models/categoryModel.mjs'
import PostModel from "../models/PostModel.mjs";
import AuthorModel from "../models/AuthorModel.mjs"
import handoverModel from "../models/handoverModel.mjs"
import checkPermission from "../middleware/checkPermission.mjs";
import UserModel from "../models/UserModel.mjs";
import AdvertisementModel from "../models/advertisementModel.mjs";
import dashboard from "../models/dashboardModel.mjs";
import pendingPosts from "../middleware/pendingPosts.mjs"




router.get('/', checkPermission('Dashboard Management', 'read'),pendingPosts, async (req, res) => {
    res.redirect('/dashboard');
});




router.get('/submenu1', (req, res) => {
    res.render('submenu1', { page: 'submenu1', title: 'submenu1' });
});

router.get('/userdata', checkLogin, (req, res) => {
    res.render('userdata', { page: 'userdata', title: 'userdata' });
});

router.get('/postcreate', checkPermission('Post Management', 'create'),pendingPosts, async (req, res) => {
    try {
    const user = req.user;
    const role = user.role_id;
    const catData = await categoryModel.getCategoryList();
    const subCatData = await categoryModel.getSubCategoryList();
    const authorData = await AuthorModel.getActiveAll();
    const handoverData = await handoverModel.getByRoleId({ params: { role } });
  
    res.render('postcreate', { page: 'postcreate', title: 'Create Post', user: req.user, catData, subCatData, authorData, handoverData, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
} catch (error) {
    console.log({ error });
    res.render('error-page', { page: 'postall', title: 'Create Post', user: req.user, error: "Master Details Incomplete", permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    // res.redirect('postall');
}
});

// router.get('/postedit/:postId',checkLogin, async (req, res) => {
//     console.log( req.params.postId);
//     try {
//         const renderData = await PostModel.getPost(req.params.postId);
//         // console.log(renderData);
//         res.render('postedit', {page: 'postedit',title: 'postedit',user:req.user,postData : renderData[0]});
//     } catch (error) {
//         console.log({error});
//         res.render('postall', {page: 'postall',title: 'postall',user:req.user});
//     }

// });

router.get('/postedit/:postId', checkPermission('Post Management', 'update'),pendingPosts, async (req, res) => {
    console.log(req.params.postId);
    try {
        const user = req.user;
        // console.log({ user });
        const role = user.role_id;
        const renderData = await PostModel.getPost(req.params.postId);
        const descHistory = await PostModel.getPostDescHistoryList(req.params.postId);
        const catData = await categoryModel.getCategoryList();
        const subCatData = await categoryModel.getSubCategoryList();
        const authorData = await AuthorModel.getActiveAll();
        const handoverData = await handoverModel.getByRoleId({ params: { role } }); // Pass the role as part of the request object
        res.render('postedit', { page: 'postall', title: 'Edit Post', user: req.user, postData: renderData[0], catData, subCatData, authorData, handoverData, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts,descHistory:descHistory });
    } catch (error) {
        console.log({ error });
        res.render('error-page', { page: 'postall', title: 'Edit Post', user: req.user, error: 'Post details fetch errorr!', permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
        // res.redirect('postall');
    }

});



router.get('/postdelete/:postId', checkPermission('Post Management', 'delete'),pendingPosts, async (req, res) => {
    // console.log(req.params.postId);
    try {
        const user = req.user;
        // console.log({ user });
        const role = user.role_id;
        const renderData = await PostModel.getPost(req.params.postId);
        const catData = await categoryModel.getCategoryList();
        const subCatData = await categoryModel.getSubCategoryList();
        const authorData = await AuthorModel.getAll();
        const handoverData = await handoverModel.getByRoleId({ params: { role } }); // Pass the role as part of the request object
        res.render('postdelete', { page: 'postall', title: 'Post Delete', user: req.user, postData: renderData[0], catData, subCatData, authorData, handoverData, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    } catch (error) {
        // console.log({error});
        res.render('error-page', { page: 'dashboard', title: 'Post Delete - Error', user: req.user, error: error, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
        // res.redirect('postall');
    }

});

router.get('/postall', checkPermission('Post Management', 'read'),pendingPosts, async (req, res) => {
    try {
    // to check the permission for model
    const user = req.user;
    // console.log({ user });
    // const id = user.role_id;
    // const perdata = await permModel.getRolewisePermission({ params: { id } });
    // console.log(perdata);
    // console.log(req.user);
    const catData = await categoryModel.getCategoryList();
    const subCatData = await categoryModel.getSubCategoryList();
    const authorData = await AuthorModel.getActiveAll();

    res.render('postall', { page: 'postall', title: 'All Posts', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts,catData, subCatData, authorData });
    } catch (error) {
        // console.log({error});
        res.render('error-page', { page: 'postall', title: 'All Posts', user: req.user, error: error, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    // res.redirect('postall');
}
});

router.get('/postall1', checkPermission('Post Management', 'read'),pendingPosts, async (req, res) => {
    try {
    // to check the permission for model
    const user = req.user;
    // console.log({ user });
    // const id = user.role_id;
    // const perdata = await permModel.getRolewisePermission({ params: { id } });
    // console.log(perdata);
    // console.log(req.user);
    const catData = await categoryModel.getCategoryList();
    const subCatData = await categoryModel.getSubCategoryList();
    const authorData = await AuthorModel.getActiveAll();

    res.render('postall1', { page: 'postall1', title: 'All Posts', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts,catData, subCatData, authorData, });
    } catch (error) {
        // console.log({error});
        res.render('error-page', { page: 'postall1', title: 'All Posts', user: req.user, error: error, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    // res.redirect('postall');
}
});

router.get('/team-posts', checkPermission('Post Management', 'read'),pendingPosts, async (req, res) => {
    try {
        // to check the permission for model
        const user = req.user;
        // console.log({ user });
        // const id = user.role_id;
        // const perdata = await permModel.getRolewisePermission({ params: { id } });
        // console.log(perdata);
        // console.log(req.user);

        res.render('team-posts', { page: 'team-posts', title: 'Team posts', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    } catch (error) {
        // console.log({error});
        res.render('error-page', { page: 'team-posts', title: 'Team Posts', user: req.user, error: error, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
        // res.redirect('postall');
    }
});

router.get('/postallcopy', checkPermission('Post Management', 'read'),pendingPosts, async (req, res) => {
    const renderingData = await categoryModel.getCategoryList(req, res);
    const postdata = await PostModel.getAllPostsTeam(req);
    res.render('postallcopy', { page: 'postallcopy', title: 'postallcopy', user: req.user, postdata: postdata, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });

});

router.get('/pending-user-posts/:userId', checkPermission('Post Management', 'read'),pendingPosts, async (req, res) => {
    try {
        const userDetails = await UserModel.getUserByid(req.params.userId);
        const userName = userDetails[0].display_name;
        const userPosts = await PostModel.getUserPendingPosts(req.params.userId);
        const sessionUserPost = await dashboard.getPostTotalForSessionUser(req.user.userid)
        res.render('pending-user-posts', { page: 'dashboard', title: 'User Pending Posts', user: req.user, userPosts: userPosts, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts, userName: userName });
    } catch (error) {
        // console.log({error});
        
        res.render('error-page', { page: 'dashboard', title: 'User Pending Posts', user: req.user, error: 'User Not Found', permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
        // res.redirect('postall');
    }
});

// router.get('/pending-team-posts/:teamName/:roleId', checkPermission('Post Management', 'read'),pendingPosts, async (req, res) => {
router.get('/pending-team-posts/:roleId', checkPermission('Post Management', 'read'),pendingPosts, async (req, res) => {
    try {
        // console.log(req.params.teamName);
        // const t_name = req.params.teamName;
        // if(t_name == 'content-team'){
        //     const teamName = 'Content Team'
        // }else if(t_name == 'seo-team'){
        //     const teamName = 'SEO Team'
        // }else{
        //     const teamName = 'SMO Team'
        // }
        // console.log({teamName});
        const teamPosts = await PostModel.getTeamPendingPosts(req.params.roleId);
        res.render('pending-team-posts', { page: 'dashboard', title: 'Team Pending Posts', user: req.user, teamPosts: teamPosts, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    } catch (error) {
        // console.log({error});
        res.render('error-page', { page: 'dashboard', title: 'Team Pending Posts', user: req.user, error: error, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
        // res.redirect('postall');
    }
});

router.get('/seo-team-posts', checkPermission('Post Management', 'read'),pendingPosts, async (req, res) => {
    try {
        // console.log(req.params.teamName);
        // const t_name = req.params.teamName;
        // if(t_name == 'content-team'){
        //     const teamName = 'Content Team'
        // }else if(t_name == 'seo-team'){
        //     const teamName = 'SEO Team'
        // }else{
        //     const teamName = 'SMO Team'
        // }
        // console.log({teamName});
        const teamPosts = await PostModel.getSeoTeamPending();
        res.render('seo-team-posts', { page: 'seo-team-posts', title: 'Team Pending Posts', user: req.user, teamPosts: teamPosts, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    } catch (error) {
        // console.log({error});
        res.render('error-page', { page: 'dashboard', title: 'Team Pending Posts', user: req.user, error: error, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
        // res.redirect('postall');
    }
});


router.get('/assigned', checkPermission('Post Management', 'read'),pendingPosts, async (req, res) => {

    const user = req.user;
    const userPosts = await PostModel.assignedPost(user.userid);
    res.render('assigned_post', { page: 'assigned', title: 'Posts Assigned', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts, userPosts: userPosts });

});

router.get('/handover', checkPermission('Post Management', 'read'),pendingPosts, async (req, res) => {

    const user = req.user;
    const userPosts = await PostModel.handoverPost(user.userid);
    res.render('handover_post', { page: 'handover', title: 'Posts Handover', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts, userPosts: userPosts });

});

router.get('/draft', checkPermission('Post Management', 'read'),pendingPosts, async (req, res) => {

    const user = req.user;
    const userPosts = await PostModel.draftPost(user.userid);
    res.render('draft_post', { page: 'draft', title: 'Draft Posts', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts, userPosts: userPosts });

});

router.get('/connect_leads', checkPermission('Lead Management', 'read'),pendingPosts, (req, res) => {
    res.render('connect_leads', { page: 'connect_leads', title: 'Subscription Leads', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
});
router.get('/subscription_leads', checkPermission('Lead Management', 'read'),pendingPosts, (req, res) => {
    res.render('subscription_leads', { page: 'subscription_leads', title: 'Subscription Leads', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
});


router.get('/useradd', checkPermission('User Management', 'read'),pendingPosts, async (req, res) => {
    // console.log(req.sessionExpired );
    const userData = await UserModel.getAllUsers(req, res);
    const rolesData = await roleModel.getRoles(req, res);

    res.render('useradd', { page: 'useradd', title: 'Add User', user: req.user, userList: userData, rolesData: rolesData.result, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
});

router.get('/roleadd', checkPermission('Role Management', 'read'),pendingPosts, async (req, res) => {
    // console.log(req.sessionExpired );
    // res.render('roleadd', {page: 'roleadd',title: 'roleadd',user:req.user,userid:req.userid});

    // Call the controller to fetch user data and prepare rendering data
    const renderingData = await roleModel.getRoles(req, res);
    // console.log('renderd data '+ renderingData.result);
    // Render the 'roleadd' EJS file and pass rendering data
    res.render('roleadd', { page: 'roleadd', title: 'Add Role Information', user: req.user, roles: renderingData.result, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });

});


router.get('/category', checkPermission('Category Management', 'read'),pendingPosts, async (req, res) => {
    const renderingData = await categoryModel.getCategoryList(req, res);
    res.render('category', { page: 'category', title: 'Category', user: req.user, category: renderingData, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });

});

router.get('/sub-category', checkPermission('Category Management', 'read'),pendingPosts, async (req, res) => {
    const renderingData = await categoryModel.getSubCategoryList(req, res);
    res.render('subcategory', { page: 'subcategory', title: 'Sub-Category', user: req.user, subcategory: renderingData, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });

});

router.get('/rolepermissions/:roleId', checkPermission('Role Management', 'update'),pendingPosts, async (req, res) => {
    const permData = await permModel.getPermissionList(req, res);
    const renderingData = await roleModel.getRoles(req, res);
    // console.log(renderingData);
    // var idExists = renderingData.result.some(function(item) {
    //     return item.id == req.params.roleId;
    //   });

    if (renderingData.result.some(item => item.id == req.params.roleId)) {

        res.render('rolepermissions', { page: 'roleadd', title: 'Add Role', user: req.user, updateRole: req.params.roleId, permData: permData, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    }
    else {
        res.render('error-page', { page: 'dashboard', title: 'Add Role', user: req.user, error: 'No data available!', permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });

    }


});

router.get('/dashboard', checkPermission('Dashboard Management', 'read'),pendingPosts, async (req, res) => {
    try {
        const userCountData = await dashboard.getPostsCountByUser();
        const teamCountData = await dashboard.getTotalPostsByTeam();
        const postCountData = await dashboard.totalPosts();
        const sessionUserPost = await dashboard.getPostTotalForSessionUser(req.user.userid)
        const userPendingPosts = await PostModel.getUserPendingPosts(req.user.userid);
        // console.log('dashboard route-------->', sessionUserPost)
        res.render('dashboard', { page: 'dashboard', title: 'Dashboard', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts, postCountData: postCountData, userCountData: userCountData, teamCountData: teamCountData, sessionUserPost: sessionUserPost });
    } catch (error) {
        // console.log({error});
        res.render('error-page', { page: 'dashboard', title: 'Dashboard', user: req.user, error: 'No data available!', permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
        // res.redirect('postall');
    }
});

router.get('/author', checkPermission('Author Management', 'read'),pendingPosts, async (req, res) => {
    try {
        const authorData = await AuthorModel.getAll();
        if(authorData.length !=0){
            res.render('author', { page: 'author', title: 'Author', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts, authorData: authorData });
        }
        else{
            res.render('author', { page: 'author', title: 'Author', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts, authorData: null });
        }
    } catch (error) {
        // console.log({error});
        res.render('error-page', { page: 'author', title: 'Author', user: req.user, error: 'No Authors data available!', permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
        // res.redirect('postall');
    }
});


// edit author route
router.get('/editAuthor/:author_id', checkPermission('Author Management', 'update'),pendingPosts, async (req, res) => {
    try {
        const user = req.user;
        const role = user.role_id;
        const id = req.params.author_id;
        
        const renderData = await AuthorModel.getAuthorById(id);
        const authorList = await AuthorModel.getActiveAll();
        
        res.render('editAuthor', { page: 'author', title: 'Edit Author', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts, authorData: renderData[0], authorList: authorList });
    } catch (error) {
        res.render('error-page', { page: 'dashboard', title: 'Edit Author', user: req.user, error: 'No Authors data available!', permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    }
});
router.get('/permission-denied', (req, res) => {
    // console.log(req.user);
    // Render the login template and pass the sessionExpired variable
    res.render('permission-denied', { page: 'permission-denied', title: 'permission-denied', user: req.user });
    // res.replace('login');
});

router.get('/login', (req, res) => {
    // res.render('login', {page: 'login',title: 'login'});
    const sessionExpired = req.query.sessionExpired === 'true'; // Convert the query parameter to a boolean
    // Render the login template and pass the sessionExpired variable
    res.render('login', { page: 'login', title: 'Login', sessionExpired: sessionExpired });
    // res.replace('login');
});


// Adevertisement routes
router.get('/advertisement-add', checkPermission('Advertisement Management', 'create'),pendingPosts, async (req, res) => {
    try {
        res.render('advertisement-add', { page: 'advertisement-add', title: 'Add Advertisement', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    } catch (error) {
        res.render('error-page', { page: 'advertisement-add', title: 'Add Advertisement', user: req.user, error: error, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    }
});

router.get('/advertisement-all', checkPermission('Advertisement Management', 'update'),pendingPosts, async (req, res) => {
    const activeAdv = await AdvertisementModel.getActiveAdv();
    const advData = await AdvertisementModel.getAllAdv();
    
    res.render('advertisement-all', { page: 'advertisement-all', title: 'Advertisement Banner List', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts, advData: advData, activeAdv: activeAdv });
});

//publish posts
// router.get('/publish-posts/:status',checkPermission('Dashboard Management','read'),pendingPosts, async(req, res) => {
//     const post_status = req.params.status
//     const publishPosts = await dashboard.getPulishedPostsList(post_status)
//     res.render('publish-posts', {page: 'publish-posts',title: 'publish-posts',user:req.user,permissions:req.permissions,postData:publishPosts});
// });
//
// get post list having status unpublished and draft
router.get('/post-list/:status', checkPermission('Dashboard Management', 'read'),pendingPosts, async (req, res) => {
    const countData = await dashboard.getPostsList(req);
     res.render('post-list', { page: 'dashboard', title: `${req.params.status} Posts`, user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts, countData: countData });
});
router.get('/published-posts/:status', checkPermission('Dashboard Management', 'read'),pendingPosts, async (req, res) => {
    res.render('published-posts', { page: 'dashboard', title: `${req.params.status} Posts`, user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
});


router.get('/post-images', checkPermission('Post Management', 'read'),pendingPosts, async (req, res) => {
    try {
        res.render('post-images', { page: 'post-images', title: 'Add Post Images', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    } catch (error) {
        res.render('error-page', { page: 'post-images', title: 'Add Post Images', user: req.user, error: error, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    }
});

router.get('/url-redirect', checkPermission('Post Management', 'create'),pendingPosts, async (req, res) => {
    try {
        res.render('url-redirect', { page: 'url-redirect', title: 'Add Post Banner Image', user: req.user, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    } catch (error) {
        res.render('error-page', { page: 'url-redirect', title: 'Add Post Banner Image', user: req.user, error: error, permissions: req.permissions,userPendingPosts: req.userPosts,teamPending: req.teamPosts });
    }
});

router.get('/test', (req, res) => {
    res.render('test');
});

export default router;
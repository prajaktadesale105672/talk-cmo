import  express  from "express";
const router = express.Router();
import dashboardController from "../controllers/dashboardController.mjs";

router.get('/total-posts/categorywise',dashboardController.getAll);
router.get('/get/:status',dashboardController.getPublishedPosts);
router.get('/total-posts',dashboardController.totalPosts);
router.get('/total-leads/subscribers',dashboardController.totalSubscribers);
router.get('/total-leads/contact',dashboardController.totalSubscribers);
router.get('/posts-total/userwise',dashboardController.getTotalPostsByUser);
router.get('/posts-total/teamwise',dashboardController.getTotalPostsByTeam);

router.get('/:status',dashboardController.getPostsList);
router.get('/total/:id',dashboardController.getPostTotalForSessionUser);


export default router;
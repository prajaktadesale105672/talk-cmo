import  express  from "express";
const router = express.Router();
import AuthorController from "../controllers/authorController.mjs";

// router.get('/',(req,res)=>{
//     res.send('Author Routes');
// })
router.get('/get-list',AuthorController.getAll);
router.get('/get-active-authors',AuthorController.getActiveAll);
router.post('/create',AuthorController.createAuthorProfile);
router.get('/:id',AuthorController.getAuthorById);
router.put('/edit/:id',AuthorController.editAuthorProfile);

// Search posts by author
router.get('/post-by-author/:authorId',AuthorController.postsByAuthor)

export default router;
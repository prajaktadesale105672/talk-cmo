import  express  from "express";
const router = express.Router();
import categoryController from '../controllers/categoryController.mjs'


router.get('/',(req,res)=>{
    res.send('Post Routes');
})

// Get all post details
router.get('/get_category/:id',categoryController.getCategory)
router.get('/get_categorySlug/:cat_slug',categoryController.getCategoryBySlug)
router.get('/delete_category/:id',categoryController.deleteCategory)
router.post('/add_category',categoryController.addCategory)
router.post('/udpate_category',categoryController.updateCategory)

router.get('/list',categoryController.getCategoryList)
router.get('/all',categoryController.getAllList)
router.get('/subcatlist',categoryController.getSubCategoryList)
router.get('/subcat/',categoryController.searchSubCat)


router.get('/get_subcategory/:id',categoryController.getSubCategory)
router.get('/get_subcategorySlug/:subcat_slug',categoryController.getSubCategoryBySlug)
router.get('/delete_subcategory/:id',categoryController.deleteSubCategory)
router.post('/add_subcategory',categoryController.addSubCategory)
router.post('/udpate_subcategory',categoryController.updateSubCategory)

router.get('/sitemap-cat-list',categoryController.sitemapCategoryList)
router.get('/sitemap-subcat-list',categoryController.sitemapSubCategoryList)



export default router;
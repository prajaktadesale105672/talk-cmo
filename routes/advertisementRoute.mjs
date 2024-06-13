import  express  from "express";
const router = express.Router();
import advertisementController from '../controllers/AdvertisementController.mjs'
import checkPermission from "../middleware/checkPermission.mjs";

router.get('/',(req,res)=>{
    res.send('Post Routes');
})

// Get all post details
router.get('/all',advertisementController.getAllAdv)

// Get all post details
router.get('/get_active',advertisementController.getActiveAdv)

// Get all post details
router.get('/get_banner/:banner_id',advertisementController.getBanner)


// Create new Advertisement
router.post('/create-ad',checkPermission('Advertisement Management', 'create'),advertisementController.createAdv)


router.put('/udpate',checkPermission('Advertisement Management', 'update'),advertisementController.updateBanner)


// router.get('/allposts',checkPermission('Advertisement Management', 'read'), advertisementController.adData);





export default router;
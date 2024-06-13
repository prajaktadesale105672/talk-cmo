import express  from "express";
import urlRedirectController from '../controllers/urlRedirectController.mjs'

const router  = express.Router();


router.get('/',urlRedirectController.getUrlList);
router.post('/',urlRedirectController.createUrlRedirect);
router.post('/check_redirect',urlRedirectController.getUrlRedirect);
router.get('/get_url/:id',urlRedirectController.getUrlInfo);
router.delete('/delete_redirect/:id',urlRedirectController.deleteUrlRedirect);
router.put('/edit', urlRedirectController.editUrlRedirect);

export default router;
import urlRedirectModel from '../models/urlRedirectModel.mjs';

export default {
    async getUrlList(req,res){
        try {
            const roles = await urlRedirectModel.getUrlList(req);
            res.json(roles);
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' })
        }
    },

    async createUrlRedirect(req,res){
        try {

            const setDetails = await urlRedirectModel.createUrlRedirect(req);
            res.status(200).json({ success: true, message : setDetails })
          
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' })
        }
    },

    async getUrlRedirect(req,res){
        try {
            const urlDetails = await urlRedirectModel.getUrlRedirect(req);
            res.status(200).json({ urlDetails })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' })
        }
    },

    async getUrlInfo(req,res){
        try {
            const urlDetails = await urlRedirectModel.getUrlInfo(req);
            res.status(200).json({ success: true, urlDetails : urlDetails })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' })
        }
    },

    async deleteUrlRedirect(req,res){
        try {
            console.log('delete controller');
            const urlDetails = await urlRedirectModel.deleteUrlRedirect(req);
            res.status(200).json({ success: true, urlDetails : urlDetails })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' })
        }
    },

    
    async editUrlRedirect(req, res) {
        try {
        const editUrl = await urlRedirectModel.editUrlRedirect(req);
        res.status(200).json({ success: true, message : 'Url Details Udpated!' })
        } catch (error) {
        console.error('Error while fetching result:', error);
        res.status(500).json({ error: 'Error whilefetching  result' });
        }
    },


}



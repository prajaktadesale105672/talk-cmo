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


import advertisementModel from '../models/advertisementModel.mjs'


export default {
    async getAllAdv(req, res) {
        try {
            const allAdv = await advertisementModel.getAllAdv();
           
            res.json(allAdv);
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'Error Fetching Adv data' })
        }
    },

    async getActiveAdv(req, res) {
        try {
            const activeAdv = await advertisementModel.getActiveAdv();
           
            res.json(activeAdv);
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ error: 'Error Fetching Adv data' })
        }
    },

    async createAdv(req, res) {
        try {
            const response = await advertisementModel.createAdv(req);
            res.status(201).json({ success: true, message: 'New Adv Banner Created', response: response });
        } catch (error) {
            console.error('post error ' + error);
            res.status(400).json({ success: false, error: 'Error creating new Adv Banner', message: error.message });
        }

    },

    async getBanner(req, res) {
        console.log(req.params.banner_id);
        try {
            const response = await advertisementModel.getBanner(req.params.banner_id);
           
            res.status(201).json({ success: true, message: `Banner Id ${req.params.banner_id} details received`, response: response });
           
        } catch (error) {
            console.log("banner error " + error);
            res.status(500).json({ success: false, message: error })
        }
    },

    async updateBanner(req, res) {
        // console.log(req.body);
        // res.status(201).json({success:true,postID: req.body})
        try {
            const response = await advertisementModel.updateBanner(req);
            res.status(201).json({ success: true, message: 'Banner information updated', response: response });
        } catch (error) {
            console.error('Banner information update error ' + error);
            res.status(400).json({ success: false, error: 'Error updating the Banner', message: error.message });
        }
    },


}








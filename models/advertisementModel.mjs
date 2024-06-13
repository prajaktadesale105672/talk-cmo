import { resolveInclude } from 'ejs'
// import db from '../dbconfig.mjs'
import pool from '../dbconfig.mjs';
// const pool = await initializeApp();
import uploadImage from '../middleware/uploadAdvBanner.mjs';



const AdvertisementModel = {
    getAllAdv: async () => {
        console.log('inside getallposts');
        try {
            const sql = `select * from ad_banner order by banner_status = 1 DESC, banner_id DESC `;
            const [advData] = await pool.query(sql);

            console.log(sql);
            return advData;
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }

    },

    getActiveAdv: async () => {
        try {
            const sql = `select * from ad_banner where banner_status = 1 ORDER BY banner_type ASC`;
            const [advData] = await pool.query(sql);
            return advData;
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }

    },

    createAdv: async (req,res) => {
        return new Promise((resolve, reject) => {
            uploadImage.single('banner_img')(req, null, async (err) => {
                if (err) {
                    reject(err);
                } else {
                    const newAdv = {
                        banner_type: req.body.banner_type,
                        banner_name: req.body.banner_name,
                        dest_url: req.body.dest_url,
                    };

                    if (req.file) {
                        const { filename, originalname, mimetype, size } = req.file;
                        newAdv.banner_img = '/uploads/pixel_img/'+ filename;
                    }else{
                        reject(new Error('Adv Banner Image not Provided'));
                    }
                    try {
                        const advAddQuery = `insert into ad_banner set ? `;
                        const [result] = await pool.query(advAddQuery, [newAdv]);

                        if (result.affectedRows > 0) {
                            resolve(result);
                        } else {
                            reject(new Error('Adv Banner creating error'));

                        }
                    } catch (error) {
                        reject(new Error(error.message));
                    }

                }
            });
        })
    },

    getBanner: async (id) => {
        console.log(' post model '+id);
        try {
            const dataQuery = `select * from ad_banner WHERE banner_id = ? `;
            const [postData] = await pool.query(dataQuery, [id]);
            if (postData.length == 0) {
                throw new Error(`Invalid Banner Id  ${id}`)
            }
            return (postData)
        }
        catch (error) {
            // console.log(error);
            throw error.message
        }
    },

    updateBanner: async (req,res) => {
       
        return new Promise((resolve, reject) => {
            uploadImage.single('banner_img')(req, null, async (err) => {
                if (err) {
                    console.error('Error during file upload:', err.message);
                    reject(err);
                } else {
                    const udpateAdv = {
                        banner_type: req.body.banner_type,
                        banner_name: req.body.banner_name,
                        dest_url: req.body.dest_url,
                        banner_status: req.body.banner_status,
                    };

                    if (req.file) {
                        const { filename, originalname, mimetype, size } = req.file;
                        udpateAdv.banner_img =  '/uploads/pixel_img/'+filename;
                    }

                    try {
                        const dataQuery = `select * from ad_banner WHERE banner_id = ? `;
                        const [postData] = await pool.query(dataQuery, [req.body.banner_id]);
                        if (postData.length == 0) {
                            throw new Error(`Invalid Banner Id  ${id}`)
                        }
                        const prevStatus = postData[0].banner_status;
                        if((udpateAdv.banner_status != prevStatus)&& udpateAdv.banner_status == 1 ){
                            // udpate all the other banner type to 0
                            const bannerStatuQuery = `update ad_banner set banner_status = 0 where banner_type =? `;
                            const [statusResult] = await pool.query(bannerStatuQuery, [udpateAdv.banner_type]);
                      
                            const bannerQuery = `update ad_banner set ? where banner_id =? `;
                            const [result] = await pool.query(bannerQuery, [udpateAdv,req.body.banner_id]);
                      
                            if (result.affectedRows > 0) {
                                resolve(result);
                            } else {
                                reject(new Error('Banner details update error'));
                               
                            }
                        }else{
                            const bannerQuery = `update ad_banner set ? where banner_id =? `;
                            const [result] = await pool.query(bannerQuery, [udpateAdv,req.body.banner_id]);
                      
                            if (result.affectedRows > 0) {
                                resolve(result);
                            } else {
                                reject(new Error('Banner details update error'));
                               
                            }
                        }
                        
                    } catch (error) {
                        reject(new Error(error.message));
                    }
                   
                }
            });
        })
    },


    

}


export default AdvertisementModel;
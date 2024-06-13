import  dashboard from '../models/dashboardModel.mjs'

export default {
    async getAll(req,res){
        try {
            const result = await dashboard.getAll(req)
            res.status(201).json({success:true,message:' fetched successfully', result: result});
        } catch (error) {
            res.status(501).json({success:false,message:`  failed to retrive data`, error: error.message});
        }
    },
    async getPublishedPosts(req,res){
        try {
            const result = await dashboard.getPulishedPostsList(req)
            res.json(result);
            // res.status(201).json({success:true,message:'fetched successfully', result: result});
        } catch (error) {
            res.status(501).json({success:false,message:`failed to retrive`, error: error.message});
        }
    },

    async totalPosts(req,res){
        try {
            const result = await dashboard.totalPosts(req)
            res.status(201).json({success:true,message:'fetched successfully', result: result});
        } catch (error) {
            res.status(501).json({success:false,message:`failed to retrive`, error: error.message});
        }
    },

    async totalSubscribers(req,res){
        try {
            const result = await dashboard.totalSubscribers(req)
            res.status(201).json({success:true,message:'fetched successfully', result: result});
        } catch (error) {
            res.status(501).json({success:false,message:`failed to retrive`, error: error.message});
        }
    },
    async totalContactLeads(req,res){
        try {
            const result = await dashboard.totalContactLeads(req)
            res.status(201).json({success:true,message:'fetched successfully', result: result});
        } catch (error) {
            res.status(501).json({success:false,message:`failed to retrive`, error: error.message});
        }
    },
    
    async getTotalPostsByUser(req,res){
        try {
            const result = await dashboard.getPostsCountByUser(req)
            res.status(201).json({success:true,message:'fetched successfully', result: result});
        } catch (error) {
            res.status(501).json({success:false,message:`failed to retrive`, error: error.message});
        }
    },

    async getTotalPostsByTeam(req,res){
        try {
            const result = await dashboard.getTotalPostsByTeam(req)
            res.status(201).json({success:true,message:'fetched successfully', result: result});
        } catch (error) {
            res.status(501).json({success:false,message:`failed to retrive`, error: error.message});
        }
    },
    async getPostsList(req,res){
        try {
            const result = await dashboard.getPostsList(req)
            res.status(201).json({success:true,message:'fetched successfully', result: result});
        } catch (error) {
            res.status(501).json({success:false,message:`failed to retrive`, error: error.message});
        }
    },
// get total posts count for assigned, handover , draft for the session user
    async getPostTotalForSessionUser(req,res){
        

        try {
            const session_user = req.params.id
            // console.log('controller ------>', session_user)
            const result = await dashboard.getPostTotalForSessionUser(session_user)
            res.status(201).json({success:true,message:'fetched successfully', result: result});
        } catch (error) {
            res.status(501).json({success:false,message:`failed to retrive`, error: error.message});
        }
    },
  
}
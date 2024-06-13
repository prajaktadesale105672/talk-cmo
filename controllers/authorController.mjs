import AuthorModel from '../models/AuthorModel.mjs'

export default {
    async getAll(req,res){
        try {
            const result = await AuthorModel.getAll(req)
            res.status(201).json({success:true,message:'Author fetched successfully', result: result});
        } catch (error) {
            res.status(501).json({success:false,message:`  failed to retrive data`, error: error.message});
        }
    },
    async getActiveAll(req,res){
        try {
            const result = await AuthorModel.getActiveAll(req)
            res.status(201).json({success:true,message:'Author fetched successfully', result: result});
        } catch (error) {
            res.status(501).json({success:false,message:`  failed to retrive data`, error: error.message});
        }
    },
    async getAuthorById(req,res){

        try {
            const result = await AuthorModel.getAuthorById(req.params.id)
            res.status(201).json({success:true,message:'fetched successfully', result: result});
        } catch (error) {
            res.status(501).json({success:false,message:`failed to retrive`, error: error.message});
        }
    },

    async createAuthorProfile(req,res){
      
        try {
            const result = await AuthorModel.createAuthorProfile(req)
            res.status(201).json({success:true,message:'success', result: result });
        } catch (error) {
            res.status(404).json({success: false, message: 'Error while adding ', error: error.message });
        }
    },
    async editAuthorProfile(req,res){
        try {
            const result = await AuthorModel.editAuthorProfile(req)
            res.status(201).json({success:true,message:'success', result: result });
        } catch (error) {
            console.log('contoller error '+error);
            res.status(404).json({success: false, message: 'Error while updating ', error:error.message});
        }
    },

    async postsByAuthor(req, res) {
        console.log('insde postsByAuthor');
        const searchAuthor = {
            authorId: req.params.authorId,
            page: req.query.page,
            limit: req.query.limit
        };
        console.log({searchAuthor});
        try {
            const authorInfo = await AuthorModel.getAuthorById(req.params.authorId)
            const authorData = await AuthorModel.postsByAuthor(searchAuthor);
            res.json({ success: true,authorInfo:authorInfo, authorData: authorData });
        } catch (error) {
            console.log("post error " + error);
            res.status(500).json({ success: false, message: 'error getting posts data' })
        }
    },
}
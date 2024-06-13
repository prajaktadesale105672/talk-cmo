import categoryModel from '../models/categoryModel.mjs'

export default {

    async addCategory(req, res) {
        try {
            const catAddData ={
                cat_name : req.body.cat_name,
                cat_slug : req.body.cat_slug
            };
            const addResponce = await categoryModel.addCategory(catAddData);
            res.status(201).json({ success: true, category: addResponce });
        }
        catch (error) {
            if(error == 'duplicate'){
                res.status(500).json({ success: false,message:'category add error', error: 'Category Or Category Slug already exists' });
            }
            else{
                res.status(500).json({ success: false,message:'category add error', error: `Category add Error` });
            }
        }
    },

    async updateCategory(req, res) {
        try {
            const catUpdateData = {
                id: req.body.cat_id,
                cat_name: req.body.cat_name,
                cat_slug: req.body.cat_slug
            };
            const catUpdate = await categoryModel.updateCategory(catUpdateData);
            res.status(201).json({ success: true, messsage: `Category Updated`, data: catUpdate })
        } catch (error) {
            if(error == 'duplicate'){
                res.status(500).json({ success: false,message:'Category Update Error', error: 'Category Or Category Slug already exists' });
            }
            else{
                res.status(500).json({ success: false,message:'Category Update Error', error: `Category Update Error` });
            }
            
        }
    },

    async getCategory(req, res) {
        try {
            const catId = req.params.id;
            const catData = await categoryModel.getCategory(catId);
            res.status(201).json({ success: true, category: catData });
        }
        catch (error) {
            res.status(500).json({ success: false, messsage: error })
        }
    },

    async getCategoryBySlug(req, res) {
        try {
            const catId = req.params.id;
            const catData = await categoryModel.getCategoryBySlug(catId);
            res.status(201).json({ success: true, category: catData });
        }
        catch (error) {
            res.status(500).json({ success: false, messsage: error })
        }
    },

    async deleteCategory(req,res){
        try{
            const delCatId = req.params.id;
            const catResponce = await categoryModel.deleteCategory(delCatId);
            res.status(201).json({success:true,data:catResponce});
        }catch(error){
            res.status(500).json({ success: false, messsage: error })
        }
    },

    async getCategoryList(req, res) {
        try {
            const categoryList = await categoryModel.getCategoryList();
            res.status(201).json({ success: true, category: categoryList });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    },

    async getSubCategoryList(req, res) {
        try {
            const subCategoryList = await categoryModel.getSubCategoryList();
            res.json(subCategoryList);
        }
        catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    },

    async getAllList(req, res) {
        try {
            const categoryList = await categoryModel.getCategoryList();
            const subCategoryList = await categoryModel.getSubCategoryList();
            res.json({ category: categoryList, subcategory: subCategoryList });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    },

    async searchSubCat(req, res) {
        const searchval = req.query.searchVal;
        console.log('inside contoller ' + searchval);
        try {
            const subCategoryList = await categoryModel.searchSubCat(searchval);
            res.json(subCategoryList);
        }
        catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    },

    async getSubCategoryBySlug(req, res) {
        const searchval = req.params.subcat_slug;
        console.log('inside contoller ' + searchval);
        try {
            const subCategoryList = await categoryModel.getSubCategoryBySlug(searchval);
            res.json(subCategoryList);
        }
        catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    },

    async addSubCategory(req, res) {
        try {
            const subCatData ={
                subcat_name : req.body.subcat_name,
                subcat_slug : req.body.subcat_slug
            };
            const addResponce = await categoryModel.addSubCategory(subCatData);
            res.status(201).json({ success: true, subCategory: addResponce });
        }
        catch (error) {
            console.log({error});
            if(error == 'duplicate'){
                res.status(500).json({ success: false,message:'Sub-Category Add Error', error: 'Sub-Category Or Sub-Category Slug already exists' });
            }
            else{
                res.status(500).json({ success: false,message:'Sub-Category Add Error', error: `Sub-Category Add Error` });
            }
        }
    },

    async updateSubCategory(req, res) {
        try {
            const subCatData = {
                subcat_id: req.body.subcat_id,
                subcat_name: req.body.subcat_name,
                subcat_slug: req.body.subcat_slug
            };
            const subCatUpdate = await categoryModel.updateSubCategory(subCatData);
            res.status(201).json({ success: true, messsage: `Sub-Category Updated`, data: subCatUpdate })
        } catch (error) {
            if(error == 'duplicate'){
                res.status(500).json({ success: false,message:'Sub-Category Update Error', error: 'Sub-Category Or Sub-Category Slug already exists' });
            }
            else{
                res.status(500).json({ success: false,message:'Sub-Category Update Error', error: `Sub-Category Update Error` });
            }
        }
    },

    async getSubCategory(req, res) {
        try {
            const subCatId = req.params.id;
            console.log({ subCatId });
            const subCatData = await categoryModel.getSubCategory(subCatId);
            res.status(201).json({ success: true, subCategory: subCatData });
        }
        catch (error) {
            res.status(500).json({ success: false, messsage: error })
        }
    },
    async deleteSubCategory(req,res){
        try{
            const delSubCatId = req.params.id;
            const catResponce = await categoryModel.deleteSubCategory(delSubCatId);
            res.status(201).json({success:true,data:catResponce});
        }catch(error){
            res.status(500).json({ success: false, messsage: error })
        }
    },

    async sitemapCategoryList(req, res) {
        try {
            const subCategoryList = await categoryModel.sitemapCategoryList();
            res.json(subCategoryList);
        }
        catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    },

    async sitemapSubCategoryList(req, res) {
        try {
            const subCategoryList = await categoryModel.sitemapSubCategoryList();
            res.json(subCategoryList);
        }
        catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    },


}
import pool from '../dbconfig.mjs'

const categoryModel = {
    addCategory: async (catData) => {
        const { cat_name, cat_slug } = catData;
        try {
            const catQuery = `select cat_name from p_cat where cat_name = ? or cat_slug  = ?`
            const [catData] = await pool.query(catQuery, [cat_name,cat_slug]);
            if(catData.length > 0) throw new Error('duplicate');

            const createCatQuery = `insert into p_cat set ?`;
            const [catAdd] = await pool.query(createCatQuery, { cat_name, cat_slug })
            console.log(createCatQuery);
            return catAdd;
        } catch (error) {
            console.log(error.message);
            throw error.message;
        }
    },

    getCategory: async (catId) => {
        try {
            const catQuery = `select cat_id, cat_name,cat_slug from p_cat where cat_id = ?`
            const [catData] = await pool.query(catQuery, catId);
            if (catData.length != 0) {
                return catData
            }
            else {
                throw new Error(`No category found with ${catId}`)
            }

        } catch (error) {
            throw error.message;
        }
    },

    deleteCategory: async (delCatId) => {
        try {
            const delCatQuery = `delete from p_cat where cat_id = ?`;
            const [result] = await pool.query(delCatQuery, delCatId);
            if (result.affectedRows > 0) {
                return result
            }
            else {
                throw new Error(`No category found with id ${delCatId} to Delete`)
            }

        } catch (error) {
            throw error.message;
        }
    },

    updateCategory: async (updateData) => {
        try {
            const catQuery = `select cat_name from p_cat where cat_name = ? or cat_slug  = ?`
            const [catCheckData] = await pool.query(catQuery, [updateData.cat_name,updateData.cat_slug]);
            if(catCheckData.length > 0) throw new Error('duplicate');
            const updateQuery = `update p_cat set cat_name = ? , cat_slug = ? where cat_id = ?`;
            const [catData] = await pool.query(updateQuery, [updateData.cat_name, updateData.cat_slug, updateData.id]);

            return catData;

        } catch (error) {
            throw error.message
        }
    },

    getCategoryList: async () => {
        try {
            const catQuery = `select cat_id ,cat_name ,cat_slug  ,created_at,updated_at from p_cat`
            const [allCat] = await pool.query(catQuery);
            // console.log(allCat);
            return allCat;
        }
        catch (error) {
            throw error.message
        }
    },
    getSubCategoryList: async () => {
        try {
            const subCatQuery = `select subcat_id ,subcat_name , subcat_slug,created_at,updated_at  from p_sub_cat`
            const [allSubCat] = await pool.query(subCatQuery);
            // console.log(allSubCat);
            return allSubCat;
        }
        catch (error) {
            throw error.message
        }
    },
    searchSubCat: async (searchval) => {
        try {
            const subCatQuery = `select sub_cat_id,sub_cat_name from sub_category where sub_cat_name like ? limit 10`
            const [allSubCat] = await pool.query(subCatQuery, [`%${searchval}%`]);
            // console.log(allSubCat);
            // console.log(allSubCat.length);
            return allSubCat;
        }
        catch (error) {
            throw error.message
        }
    },
    addSubCategory: async (catData) => {
        const { subcat_name, subcat_slug } = catData;
        try {
            const subcatQuery = `select subcat_name from p_sub_cat where subcat_name = ? or subcat_slug  = ?`
            const [catCheckData] = await pool.query(subcatQuery, [subcat_name,subcat_slug]);
            if(catCheckData.length > 0) throw new Error('duplicate');

            const createSubCatQuery = `insert into p_sub_cat set ?`;
            const [catAdd] = await pool.query(createSubCatQuery, { subcat_name, subcat_slug })
            return catAdd;
        } catch (error) {
            throw error.message;
        }
    },

    getSubCategory: async (catId) => {
        try {
            const subCatQuery = `select subcat_id, subcat_name,subcat_slug from p_sub_cat where subcat_id = ?`
            const [catData] = await pool.query(subCatQuery, catId);
            if (catData.length != 0) {
                return catData
            }
            else {
                throw new Error(`No Subcategory found with ${catId}`)
            }

        } catch (error) {
            throw error.message;
        }
    },

    getSubCategoryBySlug: async (catId) => {
        try {
            const subCatQuery = `select subcat_id, subcat_name,subcat_slug from p_sub_cat where subcat_slug = ?`
            const [catData] = await pool.query(subCatQuery, catId);
            if (catData.length != 0) {
                return catData
            }
            else {
                throw new Error(`No Subcategory found with ${catId}`)
            }

        } catch (error) {
            throw error.message;
        }
    },

    updateSubCategory: async (updateData) => {
        try {
            const subcatQuery = `select subcat_name from p_sub_cat where subcat_name = ? or subcat_slug  = ?`
            const [catCheckData] = await pool.query(subcatQuery, [updateData.subcat_name,updateData.subcat_slug]);
            if(catCheckData.length > 0) throw new Error('duplicate');

            const updateQuery = `update p_sub_cat set subcat_name = ? , subcat_slug = ? where subcat_id = ?`;
            const [catData] = await pool.query(updateQuery, [updateData.subcat_name, updateData.subcat_slug, updateData.subcat_id]);

            return catData;

        } catch (error) {
            throw error.message
        }
    },
    deleteSubCategory: async (delCatId) => {
        try {
            const delCatQuery = `delete from p_sub_cat where subcat_id = ?`;
            const [result] = await pool.query(delCatQuery, delCatId);
            if (result.affectedRows > 0) {
                return result
            }
            else {
                throw new Error(`No Subcategory category found with id ${delCatId} to Delete`)
            }

        } catch (error) {
            throw error.message;
        }
    },

    sitemapCategoryList: async () => {
        try {
            const catQuery = `select cat_slug  from p_cat`
            const [allCat] = await pool.query(catQuery);
            // console.log(allCat);
            return allCat;
        }
        catch (error) {
            throw error.message
        }
    },

    sitemapSubCategoryList: async () => {
        try {
            const subCatQuery = `select subcat_slug  from p_sub_cat`
            const [allSubCat] = await pool.query(subCatQuery);
            // console.log(allSubCat);
            return allSubCat;
        }
        catch (error) {
            throw error.message
        }
    },
}

export default categoryModel;
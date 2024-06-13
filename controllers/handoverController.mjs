import handoverModel from "../models/handoverModel.mjs";

export default {
    async get(req, res) {
      try {
        const result = await handoverModel.get();
        res.json({success: true, message: " fetched successfully ", result : result});
      } catch (error) {
        console.error('Error while fetching result:', error);
        res.status(404).json({success: false, message: 'Error while feching ', error: error });
      }
    },
    async getByRole(req, res) {
        try {
          const result = await handoverModel.getByRoleId(req);
          res.json({success: true, message: " fetched successfully ", result : result});
        } catch (error) {
          console.error('Error while fetching result:', error);
          res.status(404).json({success: false, message: 'Error while feching ', error: error });
        }
      },
    async add(req, res) {
        // console.log('req------------>', req.route.path)
        try {
          const result = await handoverModel.add(req);
          res.json({success: true, message: "added successfully ", insertId : result});
        } catch (error) {
          console.error('Error while fetching result:', error);
          res.status(404).json({success: false, message: 'Error while adding ', error: error });
        }
      },
    async update(req, res) {
        try {
        const result = await handoverModel.update(req);
        res.json({success: true, message: "updated successfully ", result : result});
        } catch (error) {
        console.error('Error while fetching result:', error);
        res.status(404).json({success: false, message: 'Error while updating ', error: error });
        }
    },
}
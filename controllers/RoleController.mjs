import RoleModel from "../models/roleModel.mjs";

export default {
    async getRoles(req, res) {
      try {
        const roles = await RoleModel.getRoles(req);
        res.json(roles);
      } catch (error) {
        console.error('Error while fetching result:', error);
        res.status(500).json({ error: 'Error whilefetching  result' });
      }
    },
    async roleInfo(req, res) {
      try {
        const roleId = req.params.roleId;
        const roles = await RoleModel.roleInfo(roleId);
        res.json(roles);
      } catch (error) {
        console.error('Error while fetching result:', error);
        res.status(500).json({ error: 'Error whilefetching  result' });
      }
    },
    async addRole(req, res) {
        try {
          const roles = await RoleModel.addRoles(req);
          res.json(roles);
        } catch (error) {
          console.error('Error while fetching result:', error);
          res.status(500).json({ succcess: false, message: 'Error whilefetching  result',  error: error });
        }
      },
    async editRole(req, res) {
        try {
        const roles = await RoleModel.editRole(req);
        res.json(roles);
        } catch (error) {
        console.error('Error while fetching result:', error);
        res.status(500).json({ error: 'Error whilefetching  result' });
        }
    },
}
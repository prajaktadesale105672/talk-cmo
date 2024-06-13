import PermissionModel  from "../models/permissionModel.mjs";

export default {
async addpermission(req, res) {
    try {
      const result = await PermissionModel.addPermission(req);
      res.status(201).json({ success : true , message: ' permission added', data : result});
    } catch (error) {
      console.error('Error while fetching result:', error);
      res.status(500).json({ success : false, error: 'Error whilefetching  result', error : error });
    }
  },
  async editpermission(req, res) {
    try {
      const result = await PermissionModel.editPermission(req);
      res.status(201).json({ success : true , message: 'updated successfully ', data : result});
    } catch (error) {
      console.error('Error while fetching result:', error);
      res.status(500).json({ success : false, error: 'Error whilefetching  result', error : error });
    }
  },
  async rolewisePermission(req, res) {
    try {
      const result = await PermissionModel.getRolewisePermission(req);
      res.status(201).json({ success : true , message: 'fetched  successfully ', data : result});
    } catch (error) {
      console.error('Error while fetching result:', error);
      res.status(500).json({ success : false, error: 'Error while fetching  result', error : error });
    }
  },
  async getPermissions(req, res) {
    try {
      const result = await PermissionModel.getPermissionList();
      res.status(201).json({ success : true , message: 'fetched  successfully ', data : result});
    } catch (error) {
      console.error('Error while fetching result:', error);
      res.status(500).json({ success : false, error: 'Error while fetching  result', error : error });
    }
  },
  async updateRolePerm(req,res){
    const rolePermData = req.body.permissions;
    // console.log(rolePermData);
    // let perm_role_update = JSON.parse(req.body.perm_role);
    // console.log(perm_role_update);
    // const { permData } = req.body;
    // console.log(req.body.data);
    // console.log(req.body.perm_role);
    // console.log('this is permission data in controller '+rolePermData);
    // res.status(201).json({success:true,permissionsData:`perm data ${rolePermData}`})
    try{  
      const result = await PermissionModel.updateRolePerm(rolePermData);
        res.status(201).json({success:true,message:`Role permisstion Udpated Successfully`,data:result})
      }catch(error){
      console.error(`Error updating Role Permisssion `, error);
      res.status(500).json({success:false,error:`Error updating Role Permisssion`,error:error})
    }
  }

}

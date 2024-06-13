
import jwt from 'jsonwebtoken'; // Import the JWT library (you need to install it)
import permModel from '../models/permissionModel.mjs'

const checkPermission = (module, action) => async (req, res, next) => {
    try {
        // Check if the user is authenticated
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/login?sessionExpired=true');
        }

        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = user;
        // console.log(user);
        const id = user.role_id;
        console.log({id});
        const permissionsData = await permModel.getRolewisePermission({ params: { id } });
        req.permissions = permissionsData;
        // console.log({permissionsData});
        const permData = permissionsData.filter(record => record.permission_name === module);
        // console.log({permData});
      

        if (!permData) {
            return res.render('permission-denied', { page: 'permission-denied', title: 'Access Denied!', user, permissions: req.permissions });
        }



        const hasPermission = await checkUserPermission(permData, action);
        console.log({ hasPermission });
        // const hasPermission = 1;

        if (hasPermission) {
            // req.permission = true;
            next();
        } else {
            // req.permission = false;
            // next();
            // return res.redirect('/permission-denied');
            return res.render('permission-denied', { page: 'permission-denied', title: 'Access Denied!', user, permissions: req.permissions });
        }
    } catch (error) {
        console.error('Error checking permission:', error);
        res.status(500).send('Internal Server Error');
    }
};


const checkUserPermission = async (permData, action) => {
    

    // console.log({permData});

    // Check if the user has the required permission for the specified action
    if (permData) {
        switch (action) {
            case 'create':
                return permData[0].create == 1;
            case 'read':
                return permData[0].read == 1;
            case 'update':
                return permData[0].update == 1;
            case 'delete':
                return permData[0].delete == 1;
            default:
                return false;
        }
    }else{
        // Return false if no matching permission is found
        return false;

    }

};

export default checkPermission;
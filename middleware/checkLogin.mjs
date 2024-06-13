// verifyUserMiddleware.js

import jwt from 'jsonwebtoken'; // Import the JWT library (you need to install it)

const checkLogin = (req, res, next) => {
  const token = req.cookies.token; // Assuming you are using cookies for authentication
  // const token = yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidmFpYmhhdmRlc2FsZTJAZXhhbXBsZS5jb20iLCJ1c2VyaWQiOjEsInJvbGUiOiJBZG1pbiIsImlhdCI6MTcwMzI0NTY2OCwiZXhwIjoxNzAzMzMyMDY4fQ.u4uCWRKpuf5NIvrcy_eamb3ua2mJFnw0RdnG_sFrn3w
  console.log('token in  middlware '+token);
  if (!token) {
   
    // res.status(401).json({ message: 'Token Expired' });
    // return res.redirect('/login?sessionExpired=true');
    
    return res.redirect('/login?sessionExpired=true');
  }

  else{
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = user;
        // console.log('use after verify in checklogin', req.user);
        // req.userid = user.userid;
        // req.role_id = user.role_id;
        // req.user_name = user.user_name;
        // console.log(user);
        next();
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token Expired' });
        }else{
        console.log('catch Unauthorized');
        return res.status(401).json({ message: 'Unauthorized' });
      }
    }
   
  }
 
};

export default checkLogin;

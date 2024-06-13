// verifyUserMiddleware.js

import jwt from 'jsonwebtoken'; // Import the JWT library (you need to install it)

const verifyUser = (req, res, next) => {
  const token = req.cookies.token; // Assuming you are using cookies for authentication
  console.log('token '+token);
  if (!token) {
    req.sessionExpired = true;
    // res.status(401).json({ message: 'Token Expired' });
    // return res.redirect('/login?sessionExpired=true');
    next();
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(user);
    req.user = user.user;
    req.userid = user.userid;
    console.log(req.user);
    console.log(req.userid);
    next();
  } catch (err) {
    console.log('catch Unauthorized');
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default verifyUser;

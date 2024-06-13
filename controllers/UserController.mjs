
import UserModel from '../models/UserModel.mjs';
import jwt from 'jsonwebtoken';
import Mailjet from 'node-mailjet';
const mailjet = new Mailjet({
  apiKey: '931351f79f4dd56a06f7a520bc9a216e',
  apiSecret: '26691ef9475b0cb4f4467add483b9ca6'
});

export default {
  async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.status(201).json({ success: true, message: 'user list fetched successfully', data: users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  },

  async getUserById(req, res) {
    try {
      const user_id = req.params.id
      const users = await UserModel.getUserByid(user_id);
      res.status(201).json({ success: true, message: 'data fetched successfully', data: users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  },

  async userFilter(req, res) {
    console.log('filter');
    const { page, pageSize, search } = req.query;
    try {
      const users = await UserModel.userFilter(page, pageSize, search);
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  },

  async userFilter1(req, res) {
    console.log('filter1');
    // const { page, pageSize, search } = req.query;
    try {
      const usersData = await UserModel.userFilter1(req);
      res.json(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  },

  async createUser(req, res) {
    try {
      const user = await UserModel.createUser(req);
      res.status(201).json({ success: true, message: 'User created successfully', data: user });
    } catch (error) {
      if (error === 'duplicate') {
        res.status(500).json({ success: false, message: 'Error while creating user', error: 'Email already registered to another user.' });
      } else {
        res.status(500).json({ success: false, message: 'Error while creating user', error: `Error while creating user` });
      }
    }
  },
  async updateUser(req, res) {
    try {
      const user = await UserModel.updateUserInfo(req);
      res.status(201).json({ success: true, message: 'User details updated successfully', data: user });
    } catch (error) {
      console.log('error in cotnoler'+error);
      res.status(500).json({ success: false, message: 'Error while updating user', error: error.message });
    }
  },

  async userLogin(req, res) {
    const user_email = req.body.email;
    const user_password = req.body.password;
    console.log({ user_email, user_password });
    try {
      const loginRes = await UserModel.userLogin(user_email, user_password);
      const userInfo = loginRes.result;
      if (userInfo) {
        const jsontoken = jwt.sign({ user: userInfo.user_email, userid: userInfo.user_id, user_name: userInfo.display_name, role: userInfo.role, role_id: userInfo.role_id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        // change below on production - Vinod
        // res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.
        console.log('session time ' + new Date(Number(new Date()) + 24 * 60 * 60 * 1000));
        res.cookie('token', jsontoken, { httpOnly: true, SameSite: 'strict', expires: new Date(Number(new Date()) + 24 * 60 * 60 * 1000) }); //we add secure: true, when using https.
        res.status(201).json({ success: true, username: userInfo.user_email, autToken: jsontoken, role: userInfo.role });

      } else {
        res.status(401).json({ success: false, message: 'Error while log in - User not found' });
      }
    } catch (error) {
      console.error('Error Loggin in user:', error);
      res.status(401).json({ success: false, message: 'Error while log in', error: error });
    }
  },

  async userLogout(req, res) {
    try {
      // Clear the token on the client side (remove from cookies or local storage)
      // const token = req.cookies.token; 
      console.log('insde logutn cotrolelr');
      // res.cookie('token', "", { expires: new Date(Date.now() + 1000), httpOnly: true });
      res.clearCookie('token'); // Clear the token cookie
      res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
      console.error('Error logging out user:', error);
      res.status(500).json({ success: false, message: 'Error while logging out', error: error });
    }
  },

  async userAdd(req, res) {
    const userData = {
      emp_fname: req.body.fname,
      emp_lname: req.body.lname,
      emp_work_id: req.body.workId,
      emp_mail: req.body.email,
      emp_pass: req.body.password

    }

    const user = req.user;
    const userid = req.userid;

    console.log(userData, user, userid);
    res.status(201).json({ success: true });

    // try {
    //   const addUser =  await UserModel.userAdd(userData);
    //    res.status(201).json({success:true,addUser:addUser});

    // } catch (error) {
    //   console.error('Error Loggin in user:', error);
    //   res.status(401).json(error);
    // }
  },
  async forgetPassword(req, res) {
    const email = req.body.user_email
    try {
      const token = await UserModel.forgetPassword(req);
      // console.log('controller ------------->', token)

      // reset passsword link for the page
      const resetLink = `http://localhost:3000/api/users/reset-password?token=${token}`;
      const request = mailjet.post("send", { 'version': 'v3.1' })
        .request({
          "Messages": [{
            "From": {
              "Email": "talk@kingsresearch.com",
              "Name": "Kings Research"
            },
            "To": [{
              "Email": email
            },
            ],
            "Subject": `Password Reset - Kingsresearch`,
            // "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
            resetLink
          }]
        })
      // const response = await request;
      // console.log('response----------------->',response.body);

      request
        .then((result) => {

        })
        .catch((err) => {
          // console.log(err)
        })

      res.status(201).json({ success: true, message: `link has been sent successfully on given ${email}`, result: resetLink });
    } catch (error) {
      // console.error('Error while creating user:', error);
      res.status(404).json({ success: false, message: 'Error while creating user', error: error });
    }
  },
  async resetPassword(req, res) {
    try {
      const result = await UserModel.resetUserPassword(req);
      res.status(201).json({ success: true, message: ' password updated successfully', result: result });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(404).json({ success: true, message: 'failed to update', error: error });
    }
  },
};

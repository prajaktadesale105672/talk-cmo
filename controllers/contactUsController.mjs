import ContactModel from "../models/contactUsModel.mjs";

export default {
  async add(req, res) {
    try {
      const result = await ContactModel.add(req);
      res.status(201).json({ success: true, message: 'created successfully', data: result });
    } catch (error) {
      console.error('Error while fetching result:', error);
      res.status(500).json({ success: false, error: 'Error while creating ', error: error });
    }
  },
  async getContactList(req, res) {
    console.log('insde  controlleer ');
   
    try {
      
      const result = await ContactModel.getContactList(req);
      res.json(result);
      // res.status(201).json({ success: true, message: 'data fetched  successfully ', data: result });
    } catch (error) {
      console.error('Error while fetching result:', error);
      res.status(500).json({ success: false, message: 'Error while fetching  result', error: error });
    }
  },
  async getById(req, res) {
    try {
      const result = await ContactModel.getById(req);
      res.status(201).json({ success: true, message: 'fetched  successfully ', data: result });
    } catch (error) {
      console.error('Error while fetching result:', error);
      res.status(500).json({ success: false, error: 'Error while fetching  result', error: error });
    }
  },
  async update(req, res) {
    try {
      const result = await ContactModel.update(req);
      res.status(201).json({ success: true, message: 'updated successfully ', data: result });
    } catch (error) {
      console.error('Error while fetching result:', error);
      res.status(500).json({ success: false, error: 'Error whilefetching  result', error: error });
    }
  },
}

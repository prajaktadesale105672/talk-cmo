import  subscriptionModel  from "../models/userSubscribeModel.mjs";

export default {
    async add(req, res) {
        try {
          const result = await subscriptionModel.add(req);
          res.status(201).json({ success : true , message: 'created successfully', data : result});
        } catch (error) {
          console.error('Error while fetching result:', error);
          res.status(404).json({ success : false, error: 'Error while creating ', error : error });
        }
      },
      async getAll(req, res) {
      
        try {
          const result = await subscriptionModel.getAll(req);
          res.json(result);
          // res.status(201).json({ success : true , message: 'fetched  successfully ', data : result});
        } catch (error) {
          console.error('Error while fetching result:', error);
          res.status(500).json({ success : false, error: 'Error while fetching  result', error : error });
        }
      },
      async getById(req, res) {
        try {
          const result = await subscriptionModel.getById(req);
          res.status(201).json({ success : true , message: 'fetched  successfully ', data : result});
        } catch (error) {
          console.error('Error while fetching result:', error);
          res.status(500).json({ success : false, error: 'Error while fetching  result', error : error });
        }
      },
      async update(req, res) {
        try {
          const result = await subscriptionModel.update(req);
          res.status(201).json({ success : true , message: 'updated successfully ', data : result});
        } catch (error) {
          console.error('Error while fetching result:', error);
          res.status(500).json({ success : false, error: 'Error whilefetching  result', error : error });
        }
      },
      async unsubscribeUser(req, res) {
        try {
          const result = await subscriptionModel.unsubscribeUser(req);
          res.status(201).json({ success : true , message: 'unsubscribed successfully ', data : result});
        } catch (error) {
          console.error('Error while fetching result:', error);
          res.status(500).json({ success : false, message: 'Error while  fetching result', error : error });
        }
      },
      async getSubscribersByDate(req, res) {
        try {
          const result = await subscriptionModel.getSubscribersByDate(req);
          res.status(201).json({ success : true , message: ' feched successfully ', data : result});
        } catch (error) {
          console.error('Error while fetching result:', error);
          res.status(500).json({ success : false, message: 'Error while  fetching result', error : error });
        }
      },
    }

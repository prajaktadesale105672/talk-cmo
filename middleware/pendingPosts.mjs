import dashboard from "../models/dashboardModel.mjs";

const pendingPosts = async (req, res, next) => {
    try {
        // Assuming userId is extracted from request, e.g., req.userId
        const userId = req.user.userid;
        
        // Call dashboard.getPostTotalForSessionUser(userId) and wait for the result
        const userPosts = await dashboard.getPostTotalForSessionUser(userId);
        const teamPosts = await dashboard.getTotalPostsByTeam();
        // console.log({teamPosts});
        // Set the result as a property on the response object
        req.userPosts = userPosts;
        req.teamPosts = teamPosts;
        
        // Call next middleware or route handler
        next();
    } catch (error) {
        // Handle error
        console.error('Error in pendingPosts:', error);
        res.status(500).send('Internal Server Error');
    }
};

export default pendingPosts;
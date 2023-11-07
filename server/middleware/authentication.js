
const jwt = require('jsonwebtoken');
const JWT_SECRET = "MANISH_Love_SONA_$99261_$91098_$29235_$32291";

const authentication = async (req, res, next)=>{
    try {
        const token = req.header('auth-token');
        if(!token){
            return res.status(400).json({error: "Please authenticate with valid token"})
        }

        const verify_user =  jwt.verify(token, JWT_SECRET);
        req.user = verify_user;
        next();
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
}

module.exports = authentication;
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const isAuthenticated = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({ err: "Auth failed"});
        }

        const token = authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({ err: "token not found"});
        }

        const decode = jwt.verify(token, "SECRET");

        const user = await User.findOne({ where: { id: decode.user.id } });

        if(!user){
            return res.status(401).json({ err: "user not found"});
        }

        req.user = user;

        next();
    } catch (e) {
        return res.status(500).send(e);
    }
}

const isSeller = async (req, res, next) => {
    if(req.user.dataValues.isSeller){
        next();
    } else {
        return res.status(401).json({ err: "you're not a seller"});
    }
}

module.exports = { 
    isAuthenticated, isSeller
}
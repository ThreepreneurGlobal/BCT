const { verify } = require("jsonwebtoken");
const User = require("../model/user");
const ErrorHandler = require("./error");


exports.isAuthenticateUser = async (req, resp, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return next(new ErrorHandler("Please Login Firstly..."));
        }

        const decode = verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.id);
        
        next();
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};



exports.isAuthorizeRole = (...roles) => {
    return (req, resp, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                return next(new ErrorHandler(`Role : ${req.user.role} is Not Allowed to access this Resource.`, 403));
            }
            next();
        } catch (error) {
            resp.status(500).json({ success: false, message: error.message });
        }
    }
};
const User = require("../model/user");
const Group = require("../model/group");
const sendToken = require("../middleware/jwtoken");
const ErrorHandler = require("../middleware/error");



exports.registerUser = async (req, resp, next) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.create({ name, email, password });
        const imgPath = req.file.path;
        user.avatar.public_id = imgPath.slice(7, 20);
        user.avatar.url = `${process.env.HOSTING_URL}/${req.file.path}`;

        user.save();
        resp.status(200).json({ success: true, user });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


exports.addUser = async (req, resp, next) => {
    try {
        const { name, email, password, groupId } = req.body;
        const group = await Group.findById(groupId);

        const user = await User.create({ name, email, password });

        group.team.unshift(user.id);
        user.group = group.id;

        user.save();
        group.save();
        resp.status(200).json({ success: true, user });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


exports.loginUser = async (req, resp, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("Please Enter Mail or Password!", 401));
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("Please Enter Valid Mail or Password!", 401));
        }

        const isPassMatched = user.comparePassword(password);
        if (!isPassMatched) {
            return next(new ErrorHandler("Please Enter Mail or Password!", 401));
        }

        sendToken(user, 200, resp);
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


exports.logoutUser = async (req, resp, next) => {
    try {
        resp.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
            .status(200).json({ success: true, message: "Logged Out Successfully..." });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


exports.myDetails = async (req, resp, next) => {
    try {
        const user = await User.findById(req.user.id).populate("group").populate("transactions");

        resp.status(200).json({ success: true, user });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


exports.userDetails = async (req, resp, next) => {
    try {
        const user = await User.findById(req.params.id);

        resp.status(200).json({ success: true, user });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


exports.getAllUsers = async (req, resp, next) => {
    try {
        const users = await User.find({});
        const count = await User.countDocuments();

        resp.status(200).json({ success: true, users, count });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


exports.updatePassword = async (req, resp, next) => {
    try {
        const user = await User.findById(req.user.id).select("+password");
        const isPassMatch = user.comparePassword(req.body.oldPass);
        if (!isPassMatch) {
            return next(new ErrorHandler("Please Enter Correct Old Password!", 400));
        }

        if (req.body.newPass !== req.body.confirmPass) {
            return next(new ErrorHandler("New and Confirm Passwords Doesn't Match...", 400));
        };

        user.password = req.body.newPass;
        await user.save();
        sendToken(user, 200, resp);
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


exports.updateProfile = async (req, resp, next) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.id);

        const imgId = req.file.path;
        user.avatar.public_id = imgId.slice(7, 20);
        console.warn(user.avatar.public_id);
        user.avatar.url = `http://localhost:4300/${req.file.path}`;
        user.updateOne({ name, email }, { new: true, runValidators: true, useFindAndModify: false });
        user.save();
        resp.status(200).json({ success: true, message: "User Profile Updated Successfully..." });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


exports.updateRole = async (req, resp, next) => {
    try {
        const { role } = req.body;
        let user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler(`User Does Not Exists with Id : ${req.params.id}`, 404));
        }
        user.updateOne({ role }, { new: true, runValidators: true, useFindAndModify: false });
        user.save();
        resp.status(200).json({ success: true, message: "User Role Updated Successfully..." });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};



exports.deleteUser = async (req, resp, next) => {
    try {
        const user = await User.findById(req.params.id);
        const group = await Group.findById(req.body.groupId);
        if (!user) {
            return next(new ErrorHandler(`User Does Not Exists with Id : ${req.params.id}`, 404));
        }

        group.team.shift(user);
        user.deleteOne();
        group.save();
        resp.status(200).json({ success: true, message: "User Deleted Successfully..." });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};
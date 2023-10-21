const Group = require("../model/group");
const User = require("../model/user");



exports.createGroup = async (req, resp, next) => {
    try {
        const user = await User.findById(req.user._id);
        const { name, email, date, address: { line01, line02, tah, dist, pinCode } } = req.body;

        var newGrp = await Group.create({ name, email, date, address: { line01, line02, tah, dist, pinCode } });
        newGrp.team.unshift(user.id);
        newGrp.save();

        user.group = newGrp.id;
        user.save();
        resp.status(200).json({ success: true, newGrp });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};



exports.getGroupById = async (req, resp, next) => {
    try {
        let group = await Group.findById(req.params.id).populate("team").populate("transactions");
        group.transactions.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        resp.status(200).json({ success: true, group });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};



exports.getAllGrps = async (req, resp, next) => {
    try {
        const groups = await Group.find({});
        const count = await Group.countDocuments();

        resp.status(200).json({ success: true, groups, count });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};



exports.addAccount = async (req, resp, next) => {
    try {
        const { grpId, account, name, branch, ifsc } = req.body;

        let group = await Group.findById(grpId);
        group.bank.unshift({account, name, branch, ifsc});
        group.save();
        resp.status(200).json({ success: true, message: "Bank Account Added Successfully..." });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


// exports.deleteAccount = async (req, resp, next) => {
//     try {
//         const { email } = req.body;

//         const group = await Group.findOne({ email });
//         group.bank.shift(req.params.id);
//         group.save();
//         resp.status(200).json({ success: true, message: "Bank Account Remove Successfully" });
//     } catch (error) {
//         resp.status(500).json({ success: false, message: error.message });
//     }
// };


// exports.addAccount = async (req, resp, next) => {
//     try {
//         const { grpId, title, branch, ifsc, address, account } = req.body;

//         const group = await Group.findById(grpId);
//         const bank = await Bank.create({title, branch, ifsc, address, account});
        
//         group.bank.unshift(bank.id);
//         group.save();
//         resp.status(200).json({ success: true, message: "Bank Account Added Successfully..." });
//     } catch (error) {
//         resp.status(500).json({ success: false, message: error.message });
//     }
// };
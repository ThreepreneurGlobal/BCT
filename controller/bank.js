const Group = require("../model/group");
const Bank = require("../model/bank");




exports.createBank = async (req, resp, next) => {
    try {
        const { grpId, title, branch, address, ifsc, account } = req.body;
        const group = await Group.findById(grpId);
        const bank = await Bank.create({ title, branch, address, ifsc, account });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};
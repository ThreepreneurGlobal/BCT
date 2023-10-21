const ifsc = require("ifsc");
const Transaction = require("../model/transaction");
const User = require("../model/user");
const Group = require("../model/group");


exports.contraEntry = async (req, resp, next) => {
    try {
        const { groupId, amount: { word, number }, account, date, description, transType } = req.body;
        let group = await Group.findById(groupId);
        let acc = group.bank.find((item) => item._id.toString() === account.toString());

        const transaction = await Transaction.create({ date, transType, description, account, amount: { word, number } });

        if (transType === "deposite") {
            acc.amount -= number;
            group.cashAmt += number;
        } else {
            acc.amount += number;
            group.cashAmt -= number;
        }
        group.transactions.unshift(transaction.id);
        group.save();
        resp.status(200).json({ success: true, transaction });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


exports.userTrans = async (req, resp, next) => {
    try {
        const { groupId, user, date, amount: { word, number }, description, transType, mode, cheque: { chqNumber, chqDate, chqIfsc }, onlineTrans: { transId, transDate }, account } = req.body;
        const group = await Group.findById(groupId);
        const userData = await User.findById(user);

        const transaction = await Transaction.create({ date, user, description, transType, amount: { word, number }, mode, cheque: { chqNumber, chqDate, chqIfsc }, onlineTrans: { transId, transDate }, account });

        if (transType === "deposite") {
            userData.amount += number;
            if (mode === "cash") {
                group.cashAmt -= number;
            } else {
                const bankAcc = group.bank.find((i) => i._id.toString() === account.toString());
                bankAcc.amount -= number;
            }
        } else {
            userData.amount -= number;
            if (mode === "cash") {
                group.cashAmt += number;
            } else {
                const bankAcc = group.bank.find((i) => i._id.toString() === account.toString());
                bankAcc.amount += number;
            }
        }

        userData.transactions.unshift(transaction.id);
        group.transactions.unshift(transaction.id);
        userData.save();
        group.save();

        resp.status(200).json({ success: true, transaction });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


exports.getAllTrans = async (req, resp, next) => {
    try {
        let trans = await Transaction.find({});
        trans.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        resp.status(200).json({ success: true, trans, count: trans.length });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


exports.getTransById = async (req, resp, next) => {
    try {
        const trans = await Transaction.findById(req.params.id).populate("user");

        resp.status(200).json({ success: true, trans });
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};


exports.checkBank = async (req, resp, next) => {
    try {
        const ifscCode = req.body.ifscCode;

        if (ifsc.validate(ifscCode)) {
            ifsc.fetchDetails(ifscCode).then((response) => {
                // console.warn(response);
                resp.status(200).json({ success: true, data: response });
            }).catch((err) => { console.warn(err); });
        } else {
            resp.send("IFSC Code Wrong!, Try Again....");
        };
    } catch (error) {
        resp.status(500).json({ success: false, message: error.message });
    }
};
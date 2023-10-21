const { Router } = require("express");
const { isAuthenticateUser, isAuthorizeRole } = require("../middleware/auth");
const { checkBank, getAllTrans, contraEntry, userTrans, getTransById } = require("../controller/transaction");



const router = Router();



router.get("/ifsccheck", isAuthenticateUser, checkBank);

router.post("/usertrans", isAuthenticateUser, isAuthorizeRole("admin"), userTrans);

router.post("/contra", isAuthenticateUser, isAuthorizeRole("admin"), contraEntry);

router.get("/get", isAuthenticateUser, isAuthorizeRole("admin"), getAllTrans);

router.get("/get/:id", isAuthenticateUser, getTransById);


module.exports = router;
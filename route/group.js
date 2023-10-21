const { Router } = require("express");
const { isAuthenticateUser, isAuthorizeRole } = require("../middleware/auth");
const { createGroup, getGroupById, addAccount, getAllGrps } = require("../controller/group");


const router = Router();


router.post("/create", isAuthenticateUser, isAuthorizeRole("admin"), createGroup);

router.get("/get/:id", isAuthenticateUser, getGroupById);

router.get("/get", isAuthenticateUser, isAuthorizeRole("admin"), getAllGrps);

router.put("/account/add", isAuthenticateUser, isAuthorizeRole("admin"), addAccount);



module.exports = router;
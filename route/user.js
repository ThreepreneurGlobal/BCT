const { Router } = require("express");
const {
    registerUser, loginUser, myDetails, logoutUser, userDetails, addUser, getAllUsers, updateProfile
} = require("../controller/user");
const { isAuthenticateUser, isAuthorizeRole } = require("../middleware/auth");
const upload = require("../middleware/upload");


const router = Router();


router.post("/register", upload.single("avatar"), registerUser);

router.post("/addUser", isAuthenticateUser, isAuthorizeRole("admin"), addUser);

router.post("/login", loginUser);

router.get("/details", isAuthenticateUser, myDetails);

router.get("/get/:id", userDetails);

router.get("/logout", isAuthenticateUser, logoutUser);

router.get("/get", isAuthenticateUser, isAuthorizeRole("admin"), getAllUsers);

router.put("/update/profile", isAuthenticateUser, upload.single("avatar"), updateProfile);




module.exports = router;
const {connect} = require("mongoose");



const DBConnect = () => { 
    connect(`${process.env.DB_URI}`, { autoIndex: false, maxPoolSize: 10, serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000, family: 4 })
    .then(() => {
        // console.warn("Connected....");
    })
    .catch((err) => {
        console.warn("Disconnected....", err);
    });
}

module.exports = DBConnect;
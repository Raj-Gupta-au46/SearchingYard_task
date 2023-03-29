const jwt = require('jsonwebtoken')
const userModel = require("../models/taskModel")
const validate = require("../Validators/validation")

//========================================= authentication ======================================================


let authentication = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"] || req.headers["X-Api-Key"]
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
        let decodedToken = jwt.verify(token, "Searching_Yard");
        if (!decodedToken) return res.status(400).send({ status: false, message: "Invalid Token" })
        req.userLoggedIn = decodedToken.userId
        next()

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}


//========================================  authorisation =============================================


let authorization = async function (req, res, next) {
    try {
        let userid = req.params.userId
        let validUser = req.decodedToken // userid from token
        //===================== format of userid ===============================================
        if (!validate.isValidObjectId(userid)) {
            return res.status(400).send({ status: false, message: "Invalid Format of User Id" })
        }

        let user = await userModel.findById(userid)
        if (user) {
            let users = user._id.toString() //userId from user
            if (users !== validUser) {
                return res.status(403).send({ status: false, message: "Sorry! Unauthorized User" })
            }
            next()
        }
        else {
            return res.status(404).send({ status: false, message: "user not found or userId does not exist" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}


module.exports.authentication = authentication
module.exports.authorization = authorization
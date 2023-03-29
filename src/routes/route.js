const express = require("express")
const passport = require("passport")
const router = express.Router()



const { createTask, getTaskDetails, loginTask, updateTask, deleteTask } = require("../controller/taskController")
const { authentication, authorization } = require("../middlewares/auth")

// router.get('/',function (request,response){
//     response.render()
// )}


router.post("/register", createTask)
router.post("/login", loginTask)
router.get("/task/:taskId/profile", authentication, authorization, getTaskDetails)
router.put("/user/:taskId/profile", authentication, authorization, updateTask)
router.delete("/task/:taskId", deleteTask)


module.exports = router
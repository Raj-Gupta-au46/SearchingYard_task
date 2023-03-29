const express = require("express");
const jwt = require("jsonwebtoken");
const uploadFile = require("../aws/aws");
const { default: mongoose } = require("mongoose");
const Validators = require("../Validators/validation");
const taskModel = require("../models/taskModel")



// create a new product :-

const createTask = async function (request, response) {
    try {
        let requestBody = request.body;
        let files = request.files

        const {title,description,password} = requestBody

        // validation for body data

        if (Validators.isValidBody(requestBody)) {
            return response.status(400).send({ status: false, message: "Enter some data to create user" })
        }

        // validation for Image
       if (!files || files.length == 0) { return response.status(400).send({ status: false, message: "Image is mandatory" }) }

       let Image = await uploadFile(files[0]) // using aws for link creation 

        if (!Validators.validImage(Image)) {
            return response.status(400).send({ status: false, message: "profileImage is in incorrect format" })
        }

        requestBody.profileImage = Image

        if (!password) { return res.status(400).send({ status: false, msg: "password is mandatory" }) }
        if (!Validators.isValidPassword(password)) { return res.status(400).send({ status: false, message: "password is invalid ,it should be of minimum 8 digits and maximum of 15 and should have atleast one special character and one number & one uppercase letter" }) }



        //====== user creation ==
        let created = await taskModel.create(requestBody)
        response.status(201).send({ status: true, message: "task is successfully created", data: created })

    }
    catch (error) {
        response.status(500).send({ status: false, message: error.message })
    }
}


//===============================login api part for product=================

const loginTask = async function (request, response) {
    try {
        let loginData = request.body
        let { title, password } = loginData
        //===== if body is empty ==
        if (!Validators.isValidBody(loginData)) { return response.status(400).send({ status: false, message: "Please fill email or password" }) }

        if (!title) { return response.status(400).send({ status: false, message: "title is required" }) }

        if (!password) { return res.status(400).send({ status: false, msg: "password is mandatory" }) }
        if (!Validators.isValidPassword(password)) { return res.status(400).send({ status: false, message: "password is invalid ,it should be of minimum 8 digits and maximum of 15 and should have atleast one special character and one number & one uppercase letter" }) }

        let taskDetails = await userModel.findOne({ title: title, password: password, });
        if (!taskDetails) { return response.status(401).send({ status: false, message: "title or password is incorrect" }) }

        //======token creation==
        let token = jwt.sign({ "taskId": taskDetails._id }, "Searching_Yard", { expiresIn: '24h' })

        return res.status(200).send({ status: true, message: "login successfully", data: { taskId: taskDetails._id, token: token } })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//================================= getting taskdetails ===================================================


const getTaskDetails = async function (request, response) {
    try {
        let data = request.params.taskId
        if (!data) { return response.status(400).send({ status: false, msg: "user id is no present" }) }


        let taskData = await taskModel.findOne({ _id: data })
        if (!taskData) { return response.status(404).send({ status: false, msg: "task data is not present" }) }

        return response.status(200).send({ status: true, message: "task etails", Data: taskData })
    }
    catch (error) {
        return response.status(500).send({ status: false, message: error.message })
    }
}


//==========================================Update task=======================================================

const updateTask = async function (request, response) {
    try {

        const taskId = request.params.taskId
        const files = request.files
        var { title, description } = request.body

        if (Object.keys(request.body).length == 0 && (!files || files.length == 0)) {
            return response.status(400).send({ status: false, message: "data required for profile updated" })
        }

        let taskData = await taskModel.findOne({ _id: taskId })

        if (!taskData) return response.status(404).send({ status: false, message: "task data is not present" })

        let update = {}

        if (title) {
            update.title
        }

        if (description) {
            update.description
        }


        if (files.length > 0) {

            if (!files && files.length == 0) return response.status(400).send({ status: false, message: "profileImage is mandatory" })
            let Image = await uploadFile(files[0])
            if (!Validators.validImage(Image)) {
                return response.status(400).send({ status: false, message: "profileImage is in incorrect format" })
            }
            update.profileImage = Image
        }

        let updateTaskData = await taskModel.findOneAndUpdate({ _id: taskId }, update, { new: true })
        return response.status(200).send({ status: true, "message": "User profile updated", data: updateTaskData })
    }
    catch (error) {
        return response.status(500).send({ status: false, message: error.message })
    }
}



//=============================Delete Task======================================================

const deleteTask = async function (request, response) {
    try {

        let task = request.params.taskId

        let getId = await taskModel.findOne({ _id: task, isDeleted: false })
        if (!getId) {
            return response.status(400).send({ status: false, message: "Task not found" })
        }
        getId.isDeleted = true
        getId.deletedAt = Date.now()
        getId.save()
        return response.status(200).send({ status: true, message: "Task is deleted successfully" })

    }
    catch (error) {
        return response.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { createTask, getTaskDetails, loginTask, updateTask, deleteTask }
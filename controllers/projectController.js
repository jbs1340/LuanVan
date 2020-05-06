var moment = require('moment')
var userDB = require('../models/user')
var projectDB = require('../models/project')
var taskDB = require('../models/task')

exports.create = (req,res)=>{
    var currentUser = req.currentUser
    var deadline = req.body.deadline || ""
    console.log(currentUser)
    var query = req.body
    if(!query.name || deadline == "" || !moment(deadline).isValid()){
        return res.status(400).send({status:400, message:"Input invalid. Must have name is String and deadline is Date"})
    }else{
       projectDB.getBy({name: query.name},1,0,(err,p)=>{
        if(err)
            return res.status(500).send({status:500, message:err.message})
        if(p.length == 0){
            userDB.getFromId(currentUser._id,(err,user)=>{
                if(err)
                    return res.status(500).send({status:500, message:err.message})
                var data ={
                    name: query.name,
                    description: query.description||'',
                    deadline: query.deadline,
                    creator:user,
                    tasks: query.tasks||[],
                    status: query.status || "RESOLVING",
                    createdTime: moment().format(),
                    members: query.members||[]
                }
                projectDB.create(data,(err,proj)=>{
                    if(err)
                        return res.status(500).send({status:500, message:err.message})
                        console.log(proj)
                    if(proj)
                        return res.status(200).send({status:200, message:"Tạo dự án thành công",data:proj})
                })
            })
        } else {
            return res.status(400).send({status:400, message:"Tên dự án đã tồn tại"})
        }
    })
    }
}

exports.getMyProjectsIsActive = (req,res)=>{
    var currentUser = req.currentUser;
    var limit = req.query.limit || 1;
    var offset = req.query.offset || 0;
    var data = {
        creator: {
            _id: currentUser._id
        }
    }
    projectDB.getAnyProjectsIsActive(data,limit,offset).then(project=>{
        if(project.length == 0){
            return res.status(404).send({status: 404, message:"Không tìm thấy.", data:[]})
        } else {
            return res.status(200).send({status: 200, message:"Query successfully", data:project})
        }
    })
}

exports.getMyProjects = (req,res) =>{
    var currentUser = req.currentUser
    var limit = parseInt(req.query.limit) || 1;
    var offset = parseInt(req.query.offset) || 0;
    var creator = {}
    var _id = currentUser._id
    projectDB.getMyProjects(_id,limit,offset, async(err,project)=>{
        if(err)
            return res.status(500).send({status:500, message:err.message})

        if(project.length == 0){
            return res.status(404).send({status:404, message:"Không tìm thấy", data:[]})
        } else if(project.length > 0){
            for(const p of project){
                console.log(p._id)
            await taskDB.getTasksBy({projectID: p._id},100,0).then(task=>{
                    console.log(task)
                    if(task)
                        p.tasks = task
                }).catch(err => res.status(500).send({status:500, message:err.message})                )
            }
            return res.status(200).send({status:200, message:"Query successfully", data:project})
        }
    })
}

exports.getMyProjectsIsActive = (req,res) =>{
    var currentUser = req.currentUser
    var limit = parseInt(req.query.limit) || 1;
    var offset = parseInt(req.query.offset) || 0;
    projectDB.getMyProjectsIsActive(currentUser._id,limit,offset,async (err,project)=>{
        if(err)
            return res.status(500).send({status:500, message:err.message})

        if(project.length == 0){
            return res.status(404).send({status:404, message:"Không tìm thấy", data:[]})
        } else if(project.length > 0){
            for(const p of project){
                console.log(p._id)
            await taskDB.getTasksBy({projectID: p._id},100,0).then(task=>{
                    console.log(task)
                    if(task)
                        p.tasks = task
                }).catch(err => res.status(500).send({status:500, message:err.message})                )
            }
                return res.status(200).send({status:200, message:"Query successfully", data:project})
        }
    })
}

exports.updateMembers = (req,res)=>{
    var query = req.body
    var projectID = req.query.projectID ||""
    if(query.members.length == undefined){
        return res.status(400).send({status:400, message:"Input invalid, members is always Array"})
    }
    if(projectID == "")
        return res.status(400).send({status:400, message:"Input invalid"})
    
    projectDB.getByID(projectID,(err,project)=>{
        if(err)
            return res.status(500).send({status:500, message:err.message})
        var members = project.members
        query.members.forEach(mem => {
            members.push(mem)            
        });
        var dataQuery = {
            _id: projectID
        }
        console.log(members)
        var dataUpdate = {
            members: members
        }
        projectDB.updateMembers(dataQuery,dataUpdate,(err,mems)=>{
            if(err)
                return res.status(500).send({status:500, message:err.message})
            if(mems){
                mems.members = members
                return res.status(200).send({status:200, message:"Query successfully", data:mems})
            }
        })
    })
}

exports.removeMembers = (req,res)=>{
    var query = req.body
    var projectID = req.query.projectID ||""
    if(query.members.length == undefined){
        return res.status(400).send({status:400, message:"Input invalid, members is always Array"})
    }
    if(projectID == "")
        return res.status(400).send({status:400, message:"Input invalid"})
        var dataQuery = {
            _id: projectID
        }
        var dataUpdate = {
            members: query.members
        }
        projectDB.updateMembers(dataQuery,dataUpdate,(err,mems)=>{
            if(err)
                return res.status(500).send({status:500, message:err.message})
            if(mems){
                mems.members = query.members
                return res.status(200).send({status:200, message:"Query successfully", data:mems})
            }
        })
}

exports.getProjectByID = (req, res)=>{
    var currentUser = req.currentUser
    var projectID = req.query.projectID ||""
    if(projectID == "")
        return res.status(400).send({status:400, message:"Input invalid"})
    projectDB.getByID(projectID,(err,project)=>{
        if(err)
            return res.status(500).send({status:500, message:err.message})
        if(project){
            console.log(project)
            if(project.creator._id == currentUser._id || 
                project.members.findIndex(i=> i._id == currentUser._id)!== -1){
                return res.status(200).send({status:200, message:"Query successfully", data:project})
            } else
                return res.status(404).send({status:404, message:"NOT FOUND", data:[]})
        }
            return res.status(404).send({status:404, message:"NOT FOUND", data:[]})
    })
}

exports.updateStatus = (req,res)=>{
    var status = req.body.status || ""
    var currentUser = req.currentUser
    var projectID = req.query.projectID || ""
    var dataQuery = {
        _id: projectID,
        "creator._id": currentUser._id
    }
    if(status == "" ||  projectID == ""){
        return res.status(400).send({status:400, message:"Input invalid"})
    }
    var dataUpdate = {
        status: status
    }

    projectDB.updateStatus(dataQuery,dataUpdate,(err,project)=>{
        if(err)
            return res.status(500).send({status:500, message:err.message})
        if(project){
            project.status = status
            return res.status(200).send({status:200, message:"Query successfully", data:project})
        }
        else
            return res.status(404).send({status:404, message:"NOT FOUND", data:[]})
    })
}
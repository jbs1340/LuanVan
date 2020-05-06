const mongoose = require('mongoose')
var moment = require('moment')
const Schema = mongoose.Schema

const projectSchema = {
    _id:Number,
    name: String,
    description: String,
    deadline: Date,
    creator:{_id: String, name: String, avatar: String},
    tasks: Array,
    status: String,
    createdTime: Date,
    members: Array
}

var projectModel = mongoose.model("Project",projectSchema)

exports.create = (data,cb)=>{
    projectModel.create(data,(err,project)=>{
        return cb(err,project)
    })
}

exports.getMyProjectsIsActive = (_id,limit, offset,cb)=>{
        projectModel.find({"creator._id":_id,
            status: {$ne:"COMPLETED"},
            "deadline":{$gte: moment().format()}}
            ,(err,project)=>{
                return cb(err,project)
        })
        .limit(limit)
        .skip(offset)
        .sort({deadline:1})
    }

exports.getMyProjects = (userID,limit, offset,cb)=>{
        projectModel.find({"creator._id": userID},(err,project)=>{
            console.log(project,err)
            return cb(err,project)
        }).limit(limit).skip(offset)
        .sort({deadline:1})
       
}

exports.getAnyProjects = async (data,limit, offset)=>{
    try{
        var projects = await projectModel.find(data).limit(limit).skip(offset)
        .sort({deadline:1})
        return projects
    }catch(err){
        return(err)
    }
}

exports.getAnyProjectsIsActive = async (data,limit, offset)=>{
    try{
        var projects = await projectModel.find({data,status: {$neq:"COMPLETED"}}).limit(limit).skip(offset)
        .sort({deadline:1})
        .gte({deadline: moment().format()})
        return projects
    }catch(err){
        return(err)
    }
}

exports.updateMembers = async (query,data,cb)=>{
    await projectModel.findOneAndUpdate(query,data,(err,project)=>{
        return cb(err,project)
    })
}

exports.getBy = async(query, limit,offset,cb)=>{
    projectModel.find(query,(err,project)=>{
        return cb(err,project)
    }).limit(limit).skip(offset)
}

exports.getByID = (id,cb)=>{
    projectModel.findById(id,(err,project)=>{
        console.log(project)
        if(err) return cb(err)
        return cb(err,project)
    })
}

exports.updateStatus = (query,data,cb)=>{
    projectModel.findByIdAndUpdate(query,data,(err,project)=>{
        if(err) return cb(err)
        return cb(err,project)
    })
}
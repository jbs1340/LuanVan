const mongoose = require('mongoose')

var missionSchema = mongoose.Schema({
    title: String,
    description: String,
    img: String,
    deadline: Date,
    createdTime: Date,
    creator:{_id: String, avatar: String,name: String},
    coin: Number,
    experience: Number,
    type: String,
    target: Array
})

var missionModel = mongoose.model("Mission",missionSchema)

exports.create = (data,cb)=>{
    missionModel.create(data, (err, mission)=>{
        if(err) return cb(err)
        return cb(err,mission)
    })
}

exports.get = (query,limit,offset,cb)=>{
    missionModel.find(query,(err,mission)=>{
        if(err) return cb(err)
        return cb(err,mission)
    }).limit(limit).skip(offset).sort({createdTime: -1})
}
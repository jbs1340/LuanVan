var missionDB = require('../models/mission')
var userDB = require('../models/user')
var moment = require('moment')
exports.create = (req, res)=>{
    var currentUser = req.currentUser;
    var query = req.body
    var type = query.type || ""
    var title = query.title || ""
    var description = query.description || ""
    var coin = query.coin || 0
    var experience = query.experience || 0
    var target = query.target || null
    var deadline = query.deadline || ""

    if(type == "" || title == "" || description == "" || coin <= 0 || experience <= 0 || 
    (target != null && target.length == undefined ) || deadline == "" || !moment(deadline).isValid()){
        return res.status(500).send({status: 500, message:"Input invalid. Must have : type (BONUS or DAILY), "
        +"title, description, coin & exp > 0 , target is Array or null, deadline is Date"}) 
    }
    if(type != "BONUS" && type != "DAILY"){
        return res.status(500).send({status: 500, message:"Input invalid. type must be 'BONUS' or 'DAILY'"}) 
    }
    userDB.getFromId(currentUser._id,(err,user)=>{
        if(err)
            return res.status(500).send({status: 500, message:err.message}) 
        if(user){
            query.creator = user
            query.createdTime = moment().format()
            if(moment().isBefore(deadline)){
                data.outOfDate = false
            } else {
                data.outOfDate = true
            }
            missionDB.create(query,(err,mission)=>{
                if(err)
                    return res.status(500).send({status: 500, message:err.message})
                if(mission){
                    return res.status(200).send({status: 200, message:"Created successfully", data: mission}) 
                }else{
                    return res.status(500).send({status: 500, message:"Không thể tạo mission"}) 
                }
            })
        } else {
            return res.status(500).send({status: 500, message:"Token không đúng"}) 
        }
    })
}

exports.getMission = (req,res)=>{
    var currentUser = req.currentUser
    var limit = parseInt(req.query.limit) || 1;
    var offset = parseInt(req.query.offset) || 0;
    userDB.getFromId(currentUser._id,(err,user)=>{
        if(err)
            return res.status(500).send({status: 500, message:err.message})
        var query = {
            $or: [
                {"target.position": user.position},
                {target: null}
            ]
        }
        missionDB.get(query,limit,offset,(err,missions)=>{
            if(err)
                return res.status(500).send({status: 500, message:err.message})
            if(missions.length > 0 ){
                var arrayMissions = []
                missions.forEach(mission=>{
                    var data = mission
                    if(moment().isBefore(data.deadline)){
                        data.outOfDate = false
                    } else {
                        data.outOfDate = true
                    }
                    arrayMissions.push(data)
                })
                return res.status(200).send({status: 200, message:"Query successfully", data: arrayMissions}) 
            } else {
                return res.status(404).send({status: 404, message:"NOT FOUND", data:[]}) 
            }
        })
    })
}

exports.getBy = (req,res)=>{
    var currentUser = req.currentUser
    var limit = parseInt(req.query.limit) || 1;
    var offset = parseInt(req.query.offset) || 0;
    userDB.getFromId(currentUser._id,(err,user)=>{
        if(err)
            return res.status(500).send({status: 500, message:err.message})
        var query = JSON.parse(req.query.q)
        query.$or= [
                {"target.position": user.position},
                {target: null}
            ]
        console.log(req.query.q)
        missionDB.get(query,limit,offset,(err,missions)=>{
            if(err)
                return res.status(500).send({status: 500, message:err.message})
            if(missions.length > 0 ){
                var arrayMissions = []
                missions.forEach(mission=>{
                    var data = mission
                    if(moment().isBefore(data.deadline)){
                        data.outOfDate = false
                    } else {
                        data.outOfDate = true
                    }
                    arrayMissions.push(data)
                })
                return res.status(200).send({status: 200, message:"Query successfully", data: arrayMissions}) 
            } else {
                return res.status(404).send({status: 404, message:"NOT FOUND", data:[]}) 
            }
        })
    })
}

exports.done = async (req,res)=>{
    var currentUser = req.currentUser
    var missionID = req.query.missionID
    await missionDB.getLogs({missionID: missionID,userID: currentUser._id},1,0, async(err,mission)=>{
        if(err)
            return res.status(500).send({status: 500, message:err.message})
        if(mission.length > 0){
            return res.status(400).send({status: 400, message:"Bạn đã hoàn thành nhiệm vụ này rồi."})
        } else {
            var data ={
                missionID: missionID,
                userID : currentUser._id,
                status : "DONE",
                completedTime: moment().format()
            }
            await missionDB.done(data,async (err,m)=>{
                console.log(1)
                if(err)
                return res.status(500).send({status: 500, message:err.message})
                if(m){
                    await missionDB.get({_id: missionID},1,0,async (err,curMission)=>{
                        if(err)
                            return res.status(500).send({status: 500, message:err.message})
                        if(curMission.length > 0){
                            console.log(curMission)
                            var bonusCoin = curMission[0].coin
                            var bonusExperience = curMission[0].experience
                            await userDB.getFromId(currentUser._id, async(err,user)=>{
                                if(err)
                                    return res.status(500).send({status: 500, message:err.message})
                                if(user){
                                    var curCoin = parseInt(user.coin) + parseInt(bonusCoin)
                                    var curExperience = parseInt(user.experience) + parseInt(bonusExperience)
                                    var curLevel = parseInt(user.level)
                                        if(curExperience%1000==0)
                                            curLevel += 1
                                    await userDB.updateUser(currentUser._id,{coin: curCoin, experience: curExperience},async(err,usr)=>{
                                        if(err)
                                            return res.status(500).send({status: 500, message:err.message})
                                        if(!usr){
                                            return res.status(500).send({status: 500, message:"Không thể update"})
                                        }else{
                                            return await res.status(200).send({status: 200, message:"Chúc mừng bạn đã hoàn thành nhiệm vụ"})
                                        }
                                    })
                                } else {
                                    return res.status(404).send({status: 404, message:"Không tìm thấy user"})
                                }
                            })
                        } else {
                            return res.status(404).send({status: 404, message:"Không tìm thấy nhiệm vụ"})
                        }
                    })
                } else {
                    return res.status(500).send({status: 500, message:err.message})
                }

            })

        }
    })

}
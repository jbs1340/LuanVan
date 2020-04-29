var BureauDB = require("../models/bureau")

exports.create = (req,res) =>{
    console.log(req.body)
    query =  req.body
    var data = {
        members: query.member,
        chef: query.chef,
        name: query.name,
        totalPower: 0,
        warehouse: [{}],
        rank: 0,
    }
    var msg = null
    if(data.member == "" || data.chef == ""){
        return res.status(500).send({message:"Thiếu thông tin"});
    }
    BureauDB.getFromName(data.name,(err,data)=>{
        if(err) msg = "Lỗi không xác định, không tạo được phòng ban";
        if(data) msg = "Tên phòng ban đã được đăng ký" ;
    })
    BureauDB.create(data,(err,id)=>{
        if (err || msg){
            var message = msg != null ? msg : err != null ? err.message:null
            return res.status(406).send({status:406, message: message})
        } else
            return res.status(200).send({status: 200,id:id,message: "Tạo văn phòng ban thành công"})
    })
}
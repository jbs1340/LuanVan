var BureauDB = require("../models/bureau")

exports.create = (req,res) =>{
    console.log(req.body)
    query =  req.body
    var data = {
        members: query.member || "",
        chef: query.chef || "",
        name: query.name || "",
        totalPower: 0,
        warehouse: [{}],
        rank: 0,
    }
    var msg = ''
    if(data.member == "" || data.chef == ""){
        return res.status(500).send({message:"Thiếu thông tin"});
    }
    BureauDB.getFromName(data.name,(err,data)=>{
        if(err != null) msg = "Lỗi không xác định, không tạo được phòng ban";
        if(data != null){
            msg = "Tên phòng ban đã được đăng ký" ;
        } 
    if(msg == '')
    {
        BureauDB.create(data,(err,data)=>{
            if (err){
                var message = msg != null ? msg : err != null ? err.message:null
                return res.status(406).send({status:406, message: message})
            } else
                return res.status(200).send({status: 200,data:data,message: "Tạo văn phòng ban thành công"})
        })
    } else if(msg!='')
        return res.status(406).send({status:406, message: msg})
    })
}
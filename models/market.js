const mongoose = require('mongoose')

var ItemSchema = mongoose.Schema({
    name : String,
    cost: Number,
    img: String,
    quantities: Number,
    createdTime: Date,
    discount: Number,
    creatorID: String
})

var marketModel = mongoose.model("Market",ItemSchema)

exports.create = (data,cb)=>{
    marketModel.create(data,(err,item)=>{
        if(err) return cb(err)
        return cb(err,item)
    })
}

exports.get = (query,limit,offset,cb)=>{
    marketModel.find(query,(err,item)=>{
        if(err) return cb(err)
        return cb(err,item)
    }).limit(limit).skip(offset)
}

exports.update = (querySearch, queryUpdate,cb) =>{
    marketModel.update(querySearch,queryUpdate,(err,item)=>{
        if(err) return cb(err)
        return cb(err,item)
    })
}
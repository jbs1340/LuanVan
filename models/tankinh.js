var mongoose = require('mongoose')

var tanKinhSchema = mongoose.Schema({
    name: String,
    code: Number,
    books: Array,
    questions: Array,
    skill: String,
    creator: {_id: String, name: String, avatar: String}
})

var tanKinhModel = mongoose.model("TanKinh",tanKinhSchema)

exports.create = (data,cb)=>{
    tanKinhModel.create(data,(err,tk)=>{
        return cb(err,tk)
    })
}

exports.get = (query,limit,offset,cb)=>{
    tanKinhModel.find(query,(err,tk)=>{
        return cb(err,tk)
    }).limit(limit).skip(offset)
}

exports.update = (query,data,cb)=>{
    tanKinhModel.update(query,data,(err,tk)=>{
        return cb(err,tk)
    })
}
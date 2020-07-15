var mongoose = require("mongoose")

var relationSchema = mongoose.Schema({
    mentor: { _id: String, name: String, avatar: String },
    trainee: { _id: String, name: String, avatar: String },
    createdTime: Date
})

relationSchema.index({ mentor: 1 })
relationSchema.index({ trainee: 1 })
var relationModel = mongoose.model("Relationship", relationSchema)


exports.create = (data, cb) => {
    relationModel.create(data, (err, master) => {
        return cb(err, master)
    })
}

exports.get = (query, cb) => {
    relationModel.find(query, (err, master) => {
        return cb(err, master)
    })
}
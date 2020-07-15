var mongoose = require('mongoose');
const e = require('express');

const hub = mongoose.Schema({
    itemCode: String,
    user: { _id: String, name: String, avatar: String },
    createdTime: Date,
    level: Number,
    isUsed: Boolean,
    img: String,
    name: String
})
hub.index([{ itemCode: 1 }, { "user._id": 1 }, { isUsed: 1 }, { level: 1 }])

var HubModel = mongoose.model("Hub", hub)

exports.create = async(data, cb) => {
    await HubModel.create(data, (err, hub) => {
        if (err) return cb(err)
        else return cb(null, hub)
    })
}

exports.getAny = async(query, limit, offset, reverse, cb) => {
    if (reverse) {
        await HubModel.find(query, (err, hub) => {
            if (err) return cb(err)
            else return cb(null, hub)
        }).limit(limit).skip(offset).sort({ createdTime: -1 })
    } else {
        await HubModel.find(query, (err, hub) => {
            if (err) return cb(err)
            else return cb(null, hub)
        }).limit(limit).skip(offset)
    }
}

exports.getAllSortByLevel = async(limit, offset, cb) => {
    await HubModel.find({}, (err, hub) => {
        if (err) return cb(err)
        else return cb(null, hub)
    }).limit(limit).skip(offset).sort({ level: -1 })
}

exports.updateAny = async(query, updater, cb) => {
    await HubModel.update(query, updater, (err, item) => {
        return cb(err, item)
    })
}
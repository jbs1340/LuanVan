var fs = require("fs");
var formidable = require("formidable");
var moment = require('moment')
var path = require('path');
require('dotenv').config();

exports.uploads = (req, res) => {
    var file = req.body.file || ""
    var name = req.body.name || "img-" + moment().unix() + ".jpg"
    var realFile = Buffer.from(file, "base64")
        // console.log(file)
    fs.writeFile(process.env.PUBLIC_DIR + "/" + name, realFile, (err) => {

        if (err) {
            return res.status(400).send({ status: 400, url: "", message: err })
        }
        var newName = moment().unix() + "-" + name
        var newPath = process.env.PUBLIC_DIR + '/uploads/' + newName
        fs.rename(process.env.PUBLIC_DIR + "/" + name, newPath, (err) => {
            if (err) {
                return res.status(400).send({ status: 400, url: "", message: err })
            }
            var path = "uploads/" + newName
            return res.status(200).send({ status: 200, url: path, message: "Uploaded !" })
        })
    })
}
var fs = require("fs");
var moment = require('moment')
var path = require('path');
require('dotenv').config();
var sharp = require('sharp')

exports.uploads = (req, res) => {
    var file = req.body.file || ""
    var name = req.body.name || "img-" + moment().unix() + ".jpg"
    var realFile = Buffer.from(file, "base64")
    if (!fs.existsSync(process.env.PUBLIC_DIR)) {
        fs.mkdirSync(process.env.PUBLIC_DIR);
    }

    if (!fs.existsSync(process.env.PUBLIC_DIR + "/uploads")) {
        fs.mkdirSync(process.env.PUBLIC_DIR + "/uploads");
    }

    fs.writeFile(path.join(process.env.PUBLIC_DIR, "/", name), realFile, (err) => {

        if (err) {
            return res.status(400).send({ status: 400, url: "", message: err })
        }
        var newName = moment().unix() + "-" + name
        var newPath = process.env.PUBLIC_DIR + '/uploads/' + newName
        sharp(path.join(process.env.PUBLIC_DIR, "/", name))
            .resize(250, 200)
            .toFile(newPath)
            .then(() => {
                var path = "uploads/" + newName
                return res.status(200).send({ status: 200, url: path, message: "Uploaded !" })
            });
    })
}
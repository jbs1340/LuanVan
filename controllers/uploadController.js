var fs = require("fs");
var formidable = require("formidable");
var moment = require('moment')

exports.uploads = (req, res) => {
    // let form = new formidable.IncomingForm();
    // form.uploadDir = "public/uploads/"
    // form.parse(req, (err, fields, files) => {
    //     if (err) {
    //         return res.status(400).send({status: 400, message:err.message})
    //     };
    //     // Lấy ra đường dẫn tạm của tệp tin trên server

    //     if (files.file == undefined || files.file == "" || files.file == null) {
    //         return res.status(400).send({status: 400, message:"File is invalid"})
    //     }
    //     let tmpPath = files.file.path;
    //     // Khởi tạo đường dẫn mới, mục đích để lưu file vào thư mục uploads của chúng ta
    //     let newFile = moment().unix()+'-'+ files.file.name ;
    //     let newPath = form.uploadDir + newFile
    //     // Đổi tên của file tạm thành tên mới và lưu lại
    //     if(files.file.type == "image/jpeg" || files.file.type == "image/png"){
    //         fs.rename(tmpPath, newPath, (err) => {
    //             if (err) throw err;
    //             var path = 'uploads/' + newFile
    //             return res.status(200).send({status: 200, message:"Uploaded", data:{url: path}})
    //           });
    //     }else {
    //         return res.status(400).send({status: 400, message:"File is not acceptable"})
    //     }
    // });

    var file = req.body.file || ""
    var name = req.body.name || "img-" + moment().unix() + ".jpg"
    var realFile = Buffer.from(file, "base64")
    fs.writeFile("public/" + name, realFile, (err) => {

        if (err) {
            return res.status(400).send({ status: 400, url: "", message: err })
        }
        var newName = moment().unix() + "-" + name
        var newPath = 'public/uploads/' + newName
        fs.rename("public/" + name, newPath, (err) => {
            if (err) {
                return res.status(400).send({ status: 400, url: "", message: err })
            }
            var path = "uploads/" + newName
            return res.status(200).send({ status: 200, url: path, message: "Uploaded !" })
        })
    })
}
var fs = require("fs");
var formidable = require("formidable");
var moment = require('moment')

exports.uploads = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.uploadDir = "uploads/"
    form.parse(req, (err, fields, files) => {
        if (err) throw err;
        // Lấy ra đường dẫn tạm của tệp tin trên server
        let tmpPath = files.file.path;
        // Khởi tạo đường dẫn mới, mục đích để lưu file vào thư mục uploads của chúng ta
        let newPath = form.uploadDir + moment().unix()+'-'+ files.file.name ;
        // Đổi tên của file tạm thành tên mới và lưu lại
        if(files.file.type == "image/jpeg" || files.file.type == "image/png"){
            fs.rename(tmpPath, newPath, (err) => {
                if (err) throw err;
                return res.status(200).send({status: 200, message:"Uploaded", data:{url: newPath}})
              });
        }else {
            return res.status(400).send({status: 400, message:"File is not acceptable"})
        }
    });

      // Return ở đây để code không chạy tiếp xuống dưới
      return;
}
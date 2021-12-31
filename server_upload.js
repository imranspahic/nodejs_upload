const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        var extension = path.extname(file.originalname);
        cb(null, `${uuid()}${extension}`);
    }
});


const upload = multer({storage: storage, onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },});

const app = express();

app.use('/uploads', express.static('uploads'));

app.post("/upload", upload.array('image'), (req, res) => {
    var uploadedFiles = [];
    var json = {"status": "OK",};
    req.files.forEach((file) => {
        console.log(req.file);
        uploadedFiles.push({"filename": file.filename, "path": file.path, "size": file.size});
    });
    json["files"] = uploadedFiles;
 res.json(json);
});

app.get("/files", (req, res) => {
  fs.readdir("./uploads", (error, files) =>{
    res.json({"count": files.length, "files": files});
  });
});

app.get("/", (req, res) => {
    res.send("Welcome to uploader!");
});

app.listen(3000, (req, res) => {
 console.log("App is listening on port 3000 ...");
});
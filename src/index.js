const fileUpload = require("express-fileupload");
const path = require("path");
const multer = require("multer");
const db = require("@prisma/client");
const fsExtra = require('fs-extra');
const upload = multer({ dest: __dirname + "/temp" });
const fs = require("fs");
const express = require("express");
const prisma = new db.PrismaClient();
const port = 80;
const mysql = require("mysql2")
var connection = mysql.createConnection({ host: "localhost", user: "root", password: "magicznysiurek213769420.hostlol", database: "69420"});
const app = express();
app.use(express.json());

const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";

app.listen(port, () => {
  console.log(`Uploader started on port ${port}`);
});

app.post("/", upload.single("69420"), async (req, res) => {
  try {
    const file = req.file
    //console.log(file.originalname, file.mimetype);
    let token = req.headers.authorization;
    const data = await prisma.accounts.findFirst({
      where: {
        token: token,
      },
    });
    if (!data) {
      res.status(401).json({ error: "Your upload token invalid." });
      fsExtra.emptyDirSync(__dirname+"/temp");
      return;
    }
    const banned = false;

    if (banned) {
      res.status(403);
      fsExtra.emptyDirSync(__dirname+"/temp");
      return res.json({ error: `You are blacklisted for: <reason>` });
    }
    const domain = "cool.wikomiks.space";

    const fileNameMethod = data.fileNameMethod;
    const username = data.username;
    const embedAuthor = data.embedAuthor;
    const embedColor = data.embedColor;
    const embedDesc = data.embedDesc;
    const embedSiteName = data.embedSiteName;
    const embedTitle = data.embedTitle;
 
    if (
      req.file.mimetype == "image/png" ||
      req.file.mimetype == "image/jpeg" ||
      req.file.mimetype == "image/bmp"
    ) {
      var fileType = ".png";
    } else if (req.file.mimetype == "image/gif") {
      var fileType = ".gif";
    } else if (req.file.mimetype == "video/mp4") {
      var fileType = ".mp4";
    } else {
      return res.status(415).json({ error: "Not supported media type" }); // gdy plik nie jest wspierany wywala error
    }

    if (fileNameMethod === "normal") {
      var realFileName = randomString()+fileType;
      var Alias = realFileName
      var url = ("https://" + domain + "/" + Alias)
    }

    else if (fileNameMethod === "invisible") {

      const invisibleChars = "01";
      const randomArray = Array.from(
        { length: 20 },
        () => invisibleChars[Math.floor(Math.random() * invisibleChars.length)]);
      let stringMain = randomArray.join("");
      var string = ""
      for (var i = 0; i < stringMain.length; i++) {
        if (stringMain.charAt(i) == "0") { string=string+"​"}
        else if (stringMain.charAt(i) == "1") { string=string+"‌"}
      }
      var Alias = stringMain
      var realFileName = randomString();
      var realFileName = (realFileName+fileType)
      var url = ("https://" + domain + "/" + string)
    }
    
    else if (fileNameMethod === "emoji") {
      var realFileName = randomString();
      var realFileName = (realFileName+fileType)
      var Alias = emojiString();
      var url = ("https://" + domain + "/" + Alias)
    }
    
    const oldPath = path.join(__dirname + "/temp/" + file.filename);
    const newPath = path.join(__dirname + "/contentfolder/" + realFileName);
    fs.rename(oldPath, newPath, () => {});
    if (fileNameMethod === "normal" || fileNameMethod === "invisible"){
      await prisma.files.create({
        data: 
        {
          fileName: realFileName,
          owner: username,
          ownerUid: data.uid,
          alias: (Alias.toString()),
          embedAuthor: embedAuthor,
          embedSiteName: embedSiteName,
          embedTitle: embedTitle,
          embedDesc: embedDesc,
          embedColor: embedColor,
          uploadDate: (Date.now().toString()),
          Mimetype: fileType,
        },
      });
    } else { 

    }
    return res.status(201).json({ url: url });
  } catch(err) {
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
});
// real filenames
function randomString() {
  const randomArray = Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)]
  );
  let realFileName = randomArray.join("");
  return realFileName;
}
// emoji filenames
function emojiString() {
  const emojiChars = "seks";
  const randomArray = Array.from(
    { length: 5 },
    () => emojiChars[Math.floor(Math.random() * emojiChars.length)]
  );
  let emojiFileName = randomArray.join("");
  return emojiFileName;
}



app.get("/:params", async (req, res) => {
  try {
    content = req.params.params.toString();
    if (content.startsWith("​") || content.startsWith("‌")) {
      var string2 = ""
      for (var i = 0; i < content.length; i++) {
        if (content.charAt(i) == "​") { string2=string2+"0"} // u+200b
        else if (content.charAt(i) == "‌") { string2=string2+"1"} // u+200c
      }
      content = string2
    }

    let data = await prisma.files.findFirst({
      where: 
      {
        alias: (content)
      }
    });
    if (!data) {return res.send("file not found")}
    if (data.Mimetype === ".png" || data.Mimetype === ".gif") {
      videoOrPic = `<meta property="og:image" content="/content/${(data.fileName)}">
      <meta property="twitter:card" content="summary_large_image">` 
    }
    else {videoOrPicbody = `<video width="400" controls> <source src=${(data.fileName)} type="video/mp4"></video>`}
      res.send(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <meta name="theme-color" content="${data.embedColor}" />
    <meta property="og:image" content="/content/${data.fileName}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="og:title" content="${data.embedTitle}" />
    <meta property="og:description" content="${data.embedDesc}" />
    <meta property="og:url" content="https://69420.host" />
    <meta property="og:site_name" content="${data.embedSiteName}" />
    <meta property="og:type" content="website" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap"
      rel="stylesheet"
    />
    <title>Document</title>
  </head>
  <body>
    <div class="content">
      <div style="position: absolute; top: 0; margin-top: 5px; font-size: 20px">
        <p>${data.fileName}</p>
      </div>
      <img class="image" src="/content/${data.fileName}" />
      <div>
        <h3>Uploaded by: ${data.owner}</h3>
        <h3>Uploaded on: ${data.uploadDate}</h3>
      </div>
      <button class="button">Report Image</button>
    </div>
  </body>

  <style>
    body {
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      font-family: "Quicksand", sans-serif;
      text-align: center;
      background-color: #121212;
      color: white;
    }

    .content {
      display: flex;
      gap: 5vh;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      background-color: #161616;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(38 38 38);
      border-radius: 10px;
      height: 65vh;
      width: 60vw;
      margin-top: 15px;
    }

    .image {
      vertical-align: middle;
      border-radius: 3.5px;
      max-height: 30vh;
      width: auto;
      max-width: 100%;
      margin-top: 10px;
    }

    .button {
      display: block;
      color: white;
      background: rgb(185 28 28);
      width: 200px;
      height: 30px;
      border-radius: 10px;
      border-color: transparent;
    }
    .button:hover {
      cursor: pointer;
      background: rgb(153 27 27);
    }
  </style>
</html>
      `)
  }catch {
    return res.send("error")
  }
})


app.get("/test", async (req, res) => {
  var input = '2122';
  console.log(String.fromCodePoint(input));
});

app.use("/content", express.static(__dirname + "/contentfolder"));
app.use(function (req, res, next) {
  res.removeHeader("X-Powered-By");
  next();
});


app.use((req, res, next) => {
  res.status(404).redirect("https://69420.host");
});
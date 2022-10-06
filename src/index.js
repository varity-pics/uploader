const fileUpload = require("express-fileupload");
const path = require("path");
const multer = require("multer");
const db = require("@prisma/client");
const fsExtra = require('fs-extra');
const upload = multer({ dest: __dirname + "/temp" });
const fs = require("fs");
const express = require("express");
const prisma = new db.PrismaClient();
const port = 5000;
const strlength = 5;
const mysql = require("mysql2")
var connection = mysql.createConnection({ host: "localhost", user: "root", password: "magicznysiurek213769420.hostlol", database: "69420"});
const app = express();
app.use(express.json());

const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz23456789";

app.listen(port, () => {
  console.log(`Uploader started on port ${port}`);
});

// uploader part
app.post("/", upload.single("69420"), async (req, res) => {
  // wypisuje nazwe oraz typ pliku
  try {
    const file = req.file
    console.log(file.originalname, file.mimetype);
    let token = req.headers.authorization;
    const data = await prisma.accounts.findFirst({
      where: {
        token: token,
      },
    });
    ////////res.send(tokenExist);
    console.log(data);
    if (!data) {
      res.status(401).json({ error: "Your upload token invalid." });
      fsExtra.emptyDirSync(__dirname+"/temp");
      return;
    }
    console.log("dupa")
    const banned = false;

    if (banned) {
      //sprawdzanie czy uzytkownik jest zbanowany
      res.status(403);
      fsExtra.emptyDirSync(__dirname+"/temp");
      return res.json({ error: `You are blacklisted for: <reason>` });
    }

    //console.log(data); // i to juz jest prased json

    const fileNameMethod = data.fileNameMethod;
    const username = data.username;
    const domain = "localhost:5000";
    const embedAuthor = data.embedAuthor;
    const embedColor = data.embedColor;
    const embedDesc = data.embedDesc;
    const embedSiteName = data.embedSiteName;
    const embedTitle = data.embedTitle;
 

    //if (fileNameMethod == ("normal"))

    // sprawdzanie jakiego typu jest plik
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
    // u+200b i u+200c
    // generowanie randomowego ciagu znakow

    
    console.log(fileNameMethod);
    if (fileNameMethod === "normal") {
      var realFileName = randomString()+fileType;
      var Alias = realFileName
      var url = ("http://" + domain + "/" + Alias)
    }
    else if (fileNameMethod === "invisible") {

      const invisibleChars = "01";
      //let invisibleFileName = invisibleArray.sort(() => .5 - Math.random()).slice(0,n)
      const randomArray = Array.from(
        { length: 20 },
        () => invisibleChars[Math.floor(Math.random() * invisibleChars.length)]);
      let stringMain = randomArray.join("");
      //unicodes and other shit
      var string = ""
      for (var i = 0; i < stringMain.length; i++) {
        if (stringMain.charAt(i) == "0") { string=string+"​"}
        else if (stringMain.charAt(i) == "1") { string=string+"‌"}
      }
      var Alias = stringMain
      var realFileName = randomString();
      var realFileName = (realFileName+fileType)
      var url = ("http://" + domain + "/" + string)
    }


    else if (fileNameMethod === "emoji") {
      var realFileName = randomString();
      var realFileName = (realFileName+fileType)
      var Alias = emojiString();
      var url = ("http://" + domain + "/" + Alias)
    }
    

    // przeniesienie pliku z /temp do /content folder
    const oldPath = path.join(__dirname + "/temp/" + file.filename);
    const newPath = path.join(__dirname + "/contentfolder/" + realFileName);
    fs.rename(oldPath, newPath, () => {});
    // tutaj
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
    { length: strlength },
    () => chars[Math.floor(Math.random() * chars.length)]
  );
  let realFileName = randomArray.join("");
  return realFileName;
}


// invisible filenames



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
      console.log("started")
      var string2 = ""
      for (var i = 0; i < content.length; i++) {
        
        if (content.charAt(i) == "​") { string2=string2+"0"} // u+200b
        else if (content.charAt(i) == "‌") { string2=string2+"1"} // u+200c
        console.log(content.charAt(i))
        //content = string2
      }
      console.log(string2)
      content = string2
    }

    console.log(content, "content");
  
    let data = await prisma.files.findFirst({
      where: 
      {
        alias: (content)
      }
    });
    if (!data) {return res.send("file not found")}
      res.send(`
      <head>
          <meta name="theme-color" content="${data.embedColor}">
          <meta property="og:image" content="/content/${(data.fileName)}">
          <meta property="og:title" content="${data.embedTitle}}">
          <meta property="og:description" content="${data.embedDesc}">
          <meta property="og:url" content="https://69420.host">
          <meta property="og:site_name" content="${data.embedSiteName}">
          <meta property="og:type" content="website">
          <meta property="twitter:card" content="summary_large_image">
      </head>
      <body>
        <center>
          <div>
            <p>${(data.fileName)} | uploaded by ${(data.owner)} || upload number ${data.uploadId}</p>
            <img src=/content/${(data.fileName)}>
            <p>This image is hosted on 69420.host</p>
          </div>
        </cetner>
      </body> `)
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
  res.removeHeader("X-Powered-By"); // usuwa xpoweredby express
  next();
});
// app.use((req, res, next) => {
//   res.status(404).redirect("https://69420.host");
// });

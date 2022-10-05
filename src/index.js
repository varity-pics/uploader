const fileUpload = require("express-fileupload");
const path = require("path");
const multer = require("multer");
const db = require("@prisma/client");

const upload = multer({ dest: __dirname + "/temp/" });

//const PrismaClient = require("@prisma/client")
const fs = require("fs");
const express = require("express");

const prisma = new db.PrismaClient();

const port = 5000;
//const url = "http://localhost:5000";
//const url = "https://i.69420.host";
const strlength = 5;

const app = express();
app.use(express.json());

const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";

app.listen(port, () => {
  console.log(`Uploader started on port ${port}`);
});

// uploader part
app.post("/", upload.single("69420"), async (req, res) => {
  // wypisuje nazwe oraz typ pliku
  //try {
    console.log(req.file.originalname, req.file.mimetype);
    let token = req.headers.authorization;
    const tokenExist = await prisma.accounts.findFirst({
      where: {
        token: token,
      },
    });
    ////////res.send(tokenExist);
    console.log(tokenExist);
    if (!tokenExist) {
      // tutaj jest sprawdzany token
      // fs.rmSync(path.join(__dirname + "/temp/"), {
      //   recursive: true,
      //   force: true,
      // });
      res.status(401).json({ error: "Your upload token invalid." }); // zwraca ze token jest zly!
      return;
    }
    const banned = false;

    if (banned) {
      //sprawdzanie czy uzytkownik jest zbanowany
      res.status(403);
      fs.rmSync(path.join(__dirname + "/temp/"), {
        recursive: true,
        force: true,
      });
      res.json({ error: `You are blacklisted for: <reason>` });
      return;
    }
    const data = await prisma.accounts.findFirst({
      where: {
        token: token,
      },
    });
    console.log(data); // i to juz jest prased json

    const fileNameMethod = data.fileNameMethod;
    const username = data.username;
    const domain = "localhost:5000";
    const embedAuthor = data.embedAuthor;
    const embedColor = data.embedColor;
    const embedDesc = data.embedDesc;
    const embedSiteName = data.embedSiteName;
    const embedTitle = data.embedTitle;

    const file = req.file;

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
      return res.status(415).json({ error: "Unsupported media type" }); // gdy plik nie jest wspierany wywala error
    }
    // u+200b i u+200c
    // generowanie randomowego ciagu znakow

    var realFileName = randomString();
    console.log(fileNameMethod);
    if (fileNameMethod == "normal") {
      var alias = realFileName + fileType
      var url = ("https://" + domain + "/" + alias)
    }
    else if (fileNameMethod == "invisible") {
      var alias = invisibleString();
      var url = ("https://" + domain + "/" + alias)
    }

    // przeniesienie pliku z /temp do /content folder
    const oldPath = path.join(__dirname + "/temp/" + file.filename);
    const newPath = path.join(__dirname + "/contentfolder/" + realFileName + fileType);
    fs.rename(oldPath, newPath, () => {});
    // tutaj
    await prisma.files.create({
      data: {
        fileName: alias,
        owner: username,
        ownerUid: data.uid,
        alias: alias,
        embedAuthor: embedAuthor,
        embedSiteName: embedSiteName,
        embedTitle: embedTitle,
        embedDesc: embedDesc,
        embedColor: embedColor,
      },
    });
    return res.status(201).json({ url: url });
  //} catch(err) {
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
);

function randomString() {
  const randomArray = Array.from(
    { length: strlength },
    () => chars[Math.floor(Math.random() * chars.length)]
  );
  let realFileName = randomArray.join("");
  return realFileName;
}

function invisibleString() {
  const invisibleChars = "​‌";
  const randomArray = Array.from(
    { length: 20 },
    () => invisibleChars[Math.floor(Math.random() * invisibleChars.length)]
  );
  let invisibleFileName = randomArray.join("");
  return invisibleFileName;
}

app.get("/:params", (req, res) => {
  content = req.params.params;
  res.send(`
    <head>
        <meta name="theme-color" content="#ae34eb">
        <meta property="og:image" content="/content/${content}">
        <meta property="og:title" content="69420.host">
        <meta property="og:description" content="69420.host is the best">
        <meta property="og:url" content="https://69420.host">
        <meta property="og:site_name" content="69420.host">
        <meta property="og:type" content="website">
        <meta property="twitter:card" content="summary_large_image">
    </head>
    <body>
        <center>
          <div>
            <p>${content}</p>
            <img src="/content/${content}">
          </div>
        </cetner>
    </body>
    `);
});

app.get("/lol/e", async (req, res) => {
  const lol = "";
  const tokenExist = await prisma.accounts.findFirst({
    where: {
      token: lol,
    },
  });
  res.send(tokenExist);
});

app.use("/content", express.static(__dirname + "\\contentfolder"));
app.use(function (req, res, next) {
  res.removeHeader("X-Powered-By"); // usuwa xpoweredby express
  next();
});
// app.use((req, res, next) => {
//   res.status(404).redirect("https://69420.host");
// });

const express = require("express");
const fileUpload = require("express-fileupload");
const qrcode = require("qrcode");

const Jimp = require("jimp");
const fs = require("fs");
const qrCodeReader = require("qrcode-reader");

const app = express();

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {
    textToCodeResult: "",
    textToCodeResult: "",
    codeToDaraResult: "",
  });
});

app.get("/dataToCode", (req, res) => {
  const data = req.query.data;
  if (!data) {
    res.redirect("/");
  }
  qrcode.toDataURL(data, function (err, url) {
    res.render("index", {
      textToCodeResult: "",
      textToCodeResult: url,
      codeToDaraResult: "",
    });
  });
});

app.post("/upload", (req, res) => {
  if (req.files) {
    const file = req.files.file;
    const fileName = file.name.replaceAll(" ", "_");
    file.mv(`${__dirname}/img/${fileName}`, (err) => {
      if (err) {
        console.log(err);
        res.redirect('/')
      } else {
        res.redirect("/codeToData/"+fileName);
      }
    });
  } else {
    res.render("error", {
      errorCode: "404",
      errorText: "There are no file",
    });
  }
});

app.get("/codeToData/:name", (req, res) => {
  const buffer = fs.readFileSync('./img/'+req.params.name, (err)=>{
    if(err)
        console.log(err);
        res.redirect('/')
  });
  Jimp.read(buffer, function (err, image) {
    if (err) {
      console.error(err);
      res.redirect("/");
    }
    // Creating an instance of qrcode-reader module
    let qrCode = new qrCodeReader();
    qrCode.callback = function (err, value) {
      if (err) {
        console.error(err);
        fs.unlink("./img/" + req.params.name);
        res.redirect("/");
      }
      fs.unlink("./img/" + req.params.name);
      res.render("index", {
        textToCodeResult: "",
        textToCodeResult: '',
        codeToDaraResult: value.result,
      });
    };
    // Decoding the QR code
    qrCode.decode(image.bitmap);
  });
});

app.listen(5000, () => {
  console.log(`Server running on http://localhost:5000/ `);
});

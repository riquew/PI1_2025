//jshint esversion:6
import express from "express";
import sqlite3 from "sqlite3";
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: (req, file, cb) => {
    const nomeUnico = Date.now() + path.extname(file.originalname);
    cb(null, nomeUnico);
  }
});
const upload = multer({ storage });


const db = new sqlite3.Database('./pets.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database sqlite.');
});


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS petAdocao (
      	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	      nome varchar(200) NOT NULL,
        tipo varchar(100) NOT NULL,
        imagem varchar(5000),
        bairro varchar(200) NOT NULL,
        telefone varchar (100) NOT NULL,
        conteudo varchar (500)
    );
  `);
});



app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
  const pets = db.all("SELECT * FROM petAdocao", (err, data) => {
    if(err) {
      console.log(err,message)
    } else {
      res.render("home", {conteudo: data})
    }
  })
});

app.get("/about", function(req, res) {
  res.render("about", {conteudo: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {conteudo: contactContent});
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", upload.single('imagem'), function(req, res) {
  const nomePost = req.body.nome;
  const tipoPost = req.body.tipo;
  const imagemPost = req.file ? `/uploads/${req.file.filename}` : null;
  const bairroPost = req.body.bairro;
  const telefonePost = req.body.telefone;
  const conteudoPost = req.body.conteudo;

  const sql = `INSERT INTO petAdocao (NOME, TIPO, IMAGEM, BAIRRO, TELEFONE, CONTEUDO) VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(sql, [nomePost, tipoPost, imagemPost, bairroPost, telefonePost, conteudoPost], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error creating post' });
    } else {
      console.log('Post created successfully');
      res.redirect("/");
    }
  });
});

app.get("/post/:id", (req, res)=> {
  let id = req.params.id;
  db.get("SELECT * FROM petAdocao WHERE id = ?", [id], (err, data) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(data)
    res.render('post', { conteudo: data});
  });
})







app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//jshint esversion:6
import express from "express";
import sqlite3 from "sqlite3";


const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

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
  const pets = db.all("SELECT * FROM petAdocao", (err, rows) => {
    if(err) {
      console.log(err,message)
    } else {
      res.render("home", {conteudo: rows, nomePagina: "HOME"})
    }
  })
});

app.get("/about", function(req, res) {
  res.render("about", {conteudo: aboutContent, nomePagina: "SOBRE NÓS"});
});

app.get("/contact", function(req, res) {
  res.render("contact", {conteudo: contactContent, nomePagina: "CONTATO"});
});

app.get("/compose", function(req, res) {
  res.render("compose", {nomePagina: "NOVO POST"});
});

app.post("/compose", function(req, res) {
  const nomePost = req.body.nome;
  const tipoPost = req.body.tipo;
  const imagemPost = req.body.imagem;
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
      res.redirect("/")
    }
  });
});

app.get("/post/:id", (req, res)=> {
  let id = req.params.id;
  const sql = `SELECT * FROM POST WHERE id = ${id}`;
  const connection = handleConnection();
  let data;
  connection.query(sql,(err, result) => {
    if(err) {
      return console.error(err.message);
    } else {
      data = Object.values(JSON.parse(JSON.stringify(result)));
      return data;
    }
  })

  const espera = async() => {
    await new Promise(r => setTimeout(r, 500));
    res.render("post", {conteudo: data[0], nomePagina: "POST"} )
  }
  espera();
  
  connection.end();
})







app.listen(3000, function() {
  console.log("Server started on port 3000");
});

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  app.get('/login', (req, res) => {
    res.render('login' )
  })
  app.get('/register', (req, res) => {
    res.render('register')
  })
  app.get('/forgotpassword', (req, res) => {
    res.render('forgotpassword')
  })
  app.get('/admin', (req, res) => {
    res.render('admin')
  })
  app.get('/addproduct', (req, res) => {
    res.render('addproduct')
  })
  app.get('/deleteproduct', (req, res) => {
    res.render('deleteproduct')
  })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));

var path = require("path");
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true }));

//connect to db
const sqlite3 = require("sqlite3").verbose();
const db_name = path.join(__dirname, "data", "database.db");
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database ");
});
const db_name2 = path.join(__dirname, "data", "data2.db");
const db2 = new sqlite3.Database(db_name2, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database ");
});

app.post('/home', (req, res) => {
    console.log("hello");
    let user = req.body.username;
    let pass = req.body.password;
    console.log(user, pass);
    if (user && pass) {
        let query = "SELECT * FROM users WHERE username = ? AND password = ? ;";
        db.get(query,[user,pass], (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            if (result) {
                res.render('home');
            } else {
                res.send("Incorrect username or password");
            }
        })
    }
});
app.post('/newuser', (req, res) => {
    console.log("hello");
    let user = req.body.username;
    let pass = req.body.password;
    if (user && pass) {
        let sql = "INSERT INTO users values(?,?);";
        db.run(sql,[user,pass], (err) => {
            if (err) {
                return console.error(err.message);
            }
             else {
                res.render("login");
            }
        })
    }
});
app.post('/addnewproduct', (req, res) => {
    console.log("hello");
    let name = req.body.name;
    let id = req.body.id;
    let price = req.body.price;
    let category_id = req.body.category_id;
    let description = req.body.description;
    let photo = req.body.photo;
    let slug = req.body.slug;
    let date_view = req.body.date_view;
    let counter = req.body.counter;
    let sellerid = req.body.sellerid;
    
    if (name && id && price) {
        let sql = "INSERT INTO products values(?,?,?,?,?,?,?,?,?,?);";
        db2.run(sql,[id,category_id,name,description,slug,price,photo,date_view,counter,sellerid], (err) => {
            if (err) {
                return console.error(err.message);
            }
             else {
                res.render("productlist");
            }
        })
    }
});

app.post('/deleteaproduct', (req, res) => {
    console.log("hello");
    let name = req.body.name;
    if (name ) {
        let sql = "DELETE FROM products WHERE name = ? ;";
        db2.run(sql,[name], (err) => {
            if (err) {
                return console.error(err.message);
            }
             else {
                res.render("home");
            }
        })
    }
});

app.post('/forgotpassword', (req, res) => {
    let user = req.body.username;
    let pass = req.body.password;
    if (user && pass) {
        let sql = "UPDATE users SET password = ? WHERE username = ? ;";
        db.run(sql,[pass,user], (err) => {
            if (err) {
                return console.error(err.message);
            }
             else {
                res.render("login");
            }
        })
    }
});

app.get("/home", (req, res) => {
    res.render("home")
})
app.get("/productlist", (req, res) => {
    let query = "SELECT * FROM products";
    db2.all(query, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
            console.log("rows products")
            res.render("productlist", {
            products: rows
        });
    });
});
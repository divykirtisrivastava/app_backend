const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

let app = express()
app.use(express.json())
app.use(cors())

let db = mysql.createConnection({
    database:'pashuapp',
    host:'localhost',
    user:'root',
    password:'1234'
})
db.connect((err)=>{
    if(err) throw err
    else{
        console.log("database connected")
    }
})
let clientDetailTableQuery  = `CREATE TABLE if not exists profile (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NULL,
    name VARCHAR(255) NULL,
    PRIMARY KEY (id));`

    db.query(clientDetailTableQuery, (err, result)=>{
        if(err) throw err
        else{
            console.log("clientDetail Table created")
        }
    })

app.post('/app/saveprofile', (req, res)=>{
    let email = req.body.email
    let name = req.body.name
    let uname = email.split('@')[0]
    let value = [[email, name]]
    db.query('insert into profile(email, name) values ?', [value], (err, result)=>{
        if(err) throw err
        else{
            pashu(uname)
            res.send("saved")
        }
    })
})
app.get('/app/getprofile', (req, res)=>{
    db.query('select * from profile',(err, result)=>{
        if(err) throw err
        else{
            res.json(result)
        }
    })
})

async function pashu(name) {
    let pashuTableQuery  = `CREATE TABLE if not exists ${name} (
        id INT NOT NULL AUTO_INCREMENT,
        type VARCHAR(255) NULL,
        lactation VARCHAR(255) NULL,
        currentmilk VARCHAR(255) NULL,
        capacitymilk VARCHAR(255) NULL,
        price VARCHAR(255) NULL,
        negotiable VARCHAR(255) NULL,
        pictureOne TEXT,
        pictureTwo TEXT,
        PRIMARY KEY (id));`
    
        db.query(pashuTableQuery, (err, result)=>{
            if(err) throw err
            else{
                console.log("clientDetail Table created")
            }
        })
}
app.listen(3000, ()=>{
    console.log("server is running")
})
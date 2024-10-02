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

app.post('/save', (req, res)=>{
    let email = req.body.email
    let pasword = req.body.pasword
    console.log(email)
    let value = [[email, pasword]]
    db.query('insert into user(email, password) values ?', [value], (err, result)=>{
        if(err) throw err
        else{
            res.send("saved")
        }
    })
})
app.get('/getdata', (req, res)=>{
    db.query('select * from user',(err, result)=>{
        if(err) throw err
        else{
            res.json(result)
        }
    })
})
app.listen(3000, ()=>{
    console.log("server is running")
})
const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const multer =  require('multer')
const path =  require('path')
const { v4: uuidv4 } = require('uuid');
let app = express()
app.use(express.json())
app.use(cors())
app.use('/pashu_uploads', express.static(path.join(__dirname, 'pashu_uploads')));
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
    let allpashuTableQuery  = `CREATE TABLE if not exists allpashu (
        id INT NOT NULL AUTO_INCREMENT,
        type VARCHAR(255) NULL,
        lactation VARCHAR(255) NULL,
        currentmilk VARCHAR(255) NULL,
        capacitymilk VARCHAR(255) NULL,
        price VARCHAR(255) NULL,
        negotiable VARCHAR(255) NULL,
        pictureOne TEXT,
        pictureTwo TEXT,
        username VARCHAR(255) NULL,
        useremail VARCHAR(255) NULL,
        userphone VARCHAR(255) NULL,
        userwhatsapp VARCHAR(255) NULL,
        PRIMARY KEY (id));`
    
        db.query(allpashuTableQuery, (err, result)=>{
            if(err) throw err
            else{
                console.log("allpashuTableQuery Table created")
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
app.get('/app/verifyUser/:email', (req, res)=>{
    let email = req.params.email
    db.query('select * from profile where email = ?',[email],(err, result)=>{
        if(err) throw err
        else{
            if(result.length>0){
                res.json({isMatch:true, result})
            }else{
                res.json({isMatch:false})
            }
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


let storage = multer.diskStorage({
    destination: './pashu_uploads',
    filename: function(req, file, cb){
        const uniqueSuffix = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, file.fieldname + "-" + uniqueSuffix)
    }
})
let uploads = multer({ storage: storage });

app.post('/app/savepashu/:email', uploads.fields([{ name: 'pictureOne', maxCount: 1 }, { name: 'pictureTwo', maxCount: 1 }]), (req, res) => {
    let email = req.params.email;
    let name = email.split('@')[0];

    const {
        lactation, currentmilk, capacitymilk, price, negotiable, type, username,useremail,userphone,userwhatsapp,
    } = req.body;

    // Debugging: Log the body and uploaded files
    console.log('Request Body:', req.body);
    console.log('Uploaded files:', req.files);

    try {
        // Check if the required images are uploaded
        let pictureOne = req.files['pictureOne'] ? req.files['pictureOne'][0].filename : null;
        let pictureTwo = req.files['pictureTwo'] ? req.files['pictureTwo'][0].filename : null;

        // Debugging: Log the filenames
        console.log('Picture One:', pictureOne);
        console.log('Picture Two:', pictureTwo);

        const newProfile = {
            lactation: lactation,
            currentmilk: currentmilk,
            capacitymilk: capacitymilk,
            price: price,
            negotiable: negotiable,
            type: type,
            pictureOne: pictureOne,
            pictureTwo: pictureTwo
        };

        const query = `INSERT INTO ${name} SET ?`;
        db.query(query, newProfile, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: results.insertId, ...newProfile });
        });
        const allpashu = {
            lactation: lactation,
            currentmilk: currentmilk,
            capacitymilk: capacitymilk,
            price: price,
            negotiable: negotiable,
            type: type,
            pictureOne: pictureOne,
            pictureTwo: pictureTwo,
            useremail:username,
            useremail:useremail,
            userphone:userphone,
            userwhatsapp:userwhatsapp
        };

        const allquery = `INSERT INTO allpashu SET ?`;
        db.query(allquery, allpashu, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: results.insertId, ...allpashu });
        });
    } catch (error) {
        console.error('Error handling request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.delete('/app/deletepashu/:email/:id',(req, res)=>{
    let email = req.params.email
    let name = email.split('@')[0]
    let id = req.params.id

    
        const query = `delete from ${name} where id = ?`;
        db.query(query, [id], (err, results) => {
          if (err) {
            console.log(err)
          }
          res.send("deleted");
        });
})
app.get('/app/allpashu',(req, res)=>{
        const query = `select * from allpashu`;
        db.query(query, (err, results) => {
          if (err) {
            console.log(err)
          }
          res.json(results);
        });
})

app.listen(3000, ()=>{
    console.log("server is running")
})

// pictureTwo-1728201166342-32e25668-db13-41c3-9c64-68efd98cdb32.jpg
// pictureOne-1728201166340-57ba8130-1595-4bf7-aeee-ac6358fc3bb5.jpg
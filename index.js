const express = require('express')
const fileUpload = require('express-fileupload')

const app = express();

app.use(fileUpload());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
    res.render('index', {status: '', text: ""});
})

app.post('/', (req, res)=>{
    if(req.files){
        const file = req.files.file;
        const fileName = file.name.replaceAll(' ', '_');
        
        file.mv(`${__dirname}/store/${fileName}`, err => {
            if(err){
                console.log(err);
                res.render('index', {status: 'status code: 500', text: err})
            }else{
                res.render('index', {status: 'status code: 200', text: 'File successful uploaded'})
            }
        })
    }else{
        res.render('index', {status: 'status code: 500', text: 'There are no file'})
    }
})

app.listen(5000, ()=>{
    console.log(`Server running on http://localhost:5000/ `);
})
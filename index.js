import express from "express";
import bodyParser from "body-parser";

import { dirname } from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
let listOfFiles = []
let selectedArticle;
let updating = false;


function createFile(content){
    let title = content.title + ".txt";
    let article = content.article;
    let filePath = __dirname + '/Articles/' + title;
    fs.writeFile( filePath, JSON.stringify(article), (err) =>{
        if(err){   
            console.log("there was a error" + err)
    }
    else{
        console.log('File Created successfully', title);
    }
     
    });

}

function readAllFiles(){
    const folderName = __dirname + '/Articles/';
    listOfFiles = [];
    try{
        let lsFiles = fs.readdirSync(folderName);
        lsFiles.forEach((element)=>{
            listOfFiles.push(element.slice(0,-4));
            
        })
        } catch (err) {
          console.error("read file err : " + err  );
        }
        return listOfFiles
    }

async function readFileContent(fileName){
    const fullpath = __dirname + '/Articles/' + fileName;
    try{
        const data = await fs.promises.readFile(fullpath,'utf8');

        return data;
      
    } catch (err) {
        console.log(err);
        return null;
  }


}

async function deleteFile(fileName){
        fileName = __dirname + '/Articles/' +fileName

        fs.unlink(fileName, (err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log('file is deleted' + fileName);
            }
        });
    

}

async function updateFile(fileName){
    

}







app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.use(express.static('public'));

app.listen(port, () => {
    console.log('listening on port ');
})

app.get('/', (req, res) => {
    readAllFiles();
    res.render("index.ejs", {listOfFiles});
  });


app.get('/create',(req, res)=>{
    updating = false
    let title = ""
    let content = ""
    res.render("create.ejs", {updating, title, content});
})

app.get('/popular',(req, res)=>{
    res.render("popular.ejs");
})


app.post('/submitArticle', (req, res) =>{
    createFile(req.body);
    readAllFiles();
    res.redirect('/')


});
app.get('/delete', async (req, res)=>{
    deleteFile(selectedArticle);
    selectedArticle ="";
    res.redirect('/')
});

app.get('/update', async(req, res)=>{
    updating = true;
    let title = selectedArticle.slice(0,-4);
    console.log("akwasi " + selectedArticle);
    let content = await readFileContent(selectedArticle);
    console.log("akwasi title: " + title, content);

    res.render("create.ejs", {updating, title, content});
})

app.get('/article', async (req, res)=>{
    let file = req.url.slice(9,-1);
    file = file + ".txt";
    file = file.replaceAll("+", " ");
    let currArticle = await readFileContent(file);
    currArticle = currArticle.slice(1,-1);
    selectedArticle = file;
    res.render("article.ejs", {currArticle});
})
app.get('/updateArticle', async (req, res)=>{

});



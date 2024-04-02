import express from "express";
import bodyParser from "body-parser";

import { dirname } from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
let listOfFiles = []


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
        console.log('list of files' + JSON.stringify(listOfFiles));
        return listOfFiles
    }

async function readFileContent(fileName){
    const fullpath = __dirname + '/Articles/' + fileName;
    try{
        const data = await fs.promises.readFile(fullpath,'utf8');
        console.log("akwasi" + data);
        return data;
      
    } catch (err) {
        console.log(err);
        return null;
  }


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
    res.render("create.ejs");
})

app.get('/popular',(req, res)=>{
    res.render("popular.ejs");
})


app.post('/submitArticle', (req, res) =>{
    createFile(req.body);
    readAllFiles();
    res.redirect('/')


});

app.get('/article', async (req, res)=>{
    console.log("request: " +req.url);
    console.log("request method: " +req.method);
    console.log("request headers: " +req.headers);
    let file = req.url.slice(9,-1);
    file = file + ".txt";
    file = file.replaceAll("+", " ");
    console.log("file no: " + file);
    let currArticle = await readFileContent(file);

    currArticle = currArticle.slice(1,-1);
    console.log("curr article= " + currArticle);
    res.render("article.ejs", {currArticle});
})

const { json } = require('express');
const express = require('express');
const   fs = require('fs/promises');
const path = require('path');


const app = express();

app.use(express.json());
const jsonPath = path.resolve('./files/todoList.json')

app.get('/todos', async (req, res) => {
   const jsonFile = await fs.readFile(jsonPath, 'utf8');
   res.send(jsonFile);
});

app.post( '/todos', async (req, res) => {
    const toDo = req.body;
    const toDoArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const lastIndex = toDoArray.length -1 ;
    const newId = toDoArray[lastIndex].id +1;
    toDoArray.push({id: newId, ...toDo});
    await fs.writeFile(jsonPath, JSON.stringify(toDoArray));
    console.log(toDoArray);

    res.send("Tarea nueva creada")
});
app.put('/todos', async (req, res) => {
    const toDoArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const { status, id } = req.body;
    const toDoIndex = toDoArray.findIndex( toDO => toDO.id === id);
    if(toDoIndex >= 0){
        toDoArray[toDoIndex].status= status;
    }
    await fs.writeFile(jsonPath, JSON.stringify(toDoArray));
    res.send("Estado modificado");
});
app.delete('/todos', async (req, res) => {
    const toDo = req.body;
    const toDoArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    console.log(toDoArray);
    for(let i = 0; i < toDoArray.length; i++){
  
        if( toDoArray[i].id === toDo.id ){
            let index = toDoArray.indexOf( toDoArray[i]);
            const newArray = toDoArray.splice(index,1);
            await fs.writeFile(jsonPath, JSON.stringify(toDoArray));
            // console.log( `se elimina el siguiente usuario con ID: ${ toDoArray[i].id}`);
            console.log(newArray);
            console.log(toDoArray);
        }  
        
       }
       res.end();
});

const PORT = 8000;
app.listen( PORT, () => {
    console.log(`Servidor escuchando en el puerto ${8000}`);
});
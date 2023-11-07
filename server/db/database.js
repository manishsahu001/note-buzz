const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/note-buzz';

const connection = mongoose.connect(URI);
if(connection){
    console.log("Connection Successfully")
}else{
    console.log("Failed to connect with database");
}
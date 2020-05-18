
const mongoose = require('mongoose')
mongoose.connect(
    'mongodb+srv://root:root@cluster0-hg20y.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }
)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

module.exports= mongoose;
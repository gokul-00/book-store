const mongoose = require('mongoose');


const ProjectSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:false
    },
    publishDate:{
        type: Date,
        default:Date.now
    },
    projectEstimate:{
        type: Number,
        required:true
    },
    
})


module.exports = mongoose.model('Project',ProjectSchema);

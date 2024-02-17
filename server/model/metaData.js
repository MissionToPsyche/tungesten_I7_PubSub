const mongoose = require('mongoose');
const metaData = new mongoose.Schema({ //schema for metadata 
    metadataid: { type: String, required: true, unique: true },
    documentid: { type: String, required: true },
    metadatype: { type: String, enum: ['COMMENT', 'DISC', 'FEED'], default: 'COMMENT' }

});


const MetaData = mongoose.model('MetaData', metaData);

module.exports = MetaData;

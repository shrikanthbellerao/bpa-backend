const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const MilestoneSchema = new Schema({
    
    milestone: Schema.Types.Mixed,
    _id: String
});

const MilestoneModel = mongoose.model('milestone', MilestoneSchema);
module.exports = MilestoneSchema;
module.exports = MilestoneModel;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const GradesSchema = new Schema({
  student_id: Number,
  scores: Array,
  class_id: Number
});

const GradesModel = mongoose.model('Grade', GradesSchema);
module.exports = GradesSchema;
module.exports = GradesModel;

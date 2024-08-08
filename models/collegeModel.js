const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    clgName: {
      type: String,
      required: true,
    },
    // location: {
    //   type: String,
    //   required: true,
    // },
    students: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student'
        },
        name: String,
        usn: String,
      }
    ]
  });
  
  const College = mongoose.model('College', collegeSchema);
  module.exports = College;
  
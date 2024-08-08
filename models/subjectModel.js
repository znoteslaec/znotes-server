
const mongoose = require('mongoose');

<<<<<<< HEAD
const ReferenceSchema = new mongoose.Schema({
    refTitle: {
        type: String,
        required: true
    },
    refLink: {
        type: String,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    addedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student' 
    },
    addedByName:{
        type: String
    },
});

=======
>>>>>>> 9c0bba2a79e0e956aa27140439afbc8af19368b8

const SubjectSchema = new mongoose.Schema({
    subCode: {
        type: String,
        required: true
    },
    subAbb: {
        type: String,
    },
    subName: {
        type: String,
        required: true
    },
<<<<<<< HEAD
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester'
    },
    scheme: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scheme'
    },

    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    addedByName: {
        type: String
    },

    addedAt: {
        type: Date,
        default: Date.now
    },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],

    references: [ReferenceSchema]
=======
    department: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Department' 
    },
    semester: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Semester' 
    },
    scheme: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Scheme' 
    },

    addedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student' 
    },
    addedByName:{
        type: String
    },

    addedAt: { 
        type: Date, 
        default: Date.now 
    },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }]
>>>>>>> 9c0bba2a79e0e956aa27140439afbc8af19368b8
});


const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject;

















// const mongoose = require('mongoose');

// const SectionSchema = new mongoose.Schema({
//     sectionName: {
//         type: String,
//         required: true
//     },
//     sectionDesc: {
//         type: String,
//     },
// });

// const SubjectSchema = new mongoose.Schema({
//     subCode: {
//         type: String,
//         required: true
//     },
//     subAbb: {
//         type: String,
//     },
//     subName: {
//         type: String,
//         required: true
//     },
//     department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
//   semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
//   scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' },

//     addedAt: { type: Date, default: Date.now },
//     sections: [SectionSchema] // Array of sections
// });

// module.exports = mongoose.model('Subject', SubjectSchema);




















// const mongoose = require('mongoose');

// const SubjectSchema = new mongoose.Schema({
//     subCode: {
//         type: String,
//         required: true
//     },
//     subAbb: {
//         type: String,
//      },
//     subName: {
//         type: String,
//         required: true
//     },
//     department: {
//         type: String,
//         required: true
//     },
//     semester: {
//         type: String,
//         required: true
//     },
//     scheme: {
//         type: String,
//         required: true
//     },
//     addedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Subject', SubjectSchema);

















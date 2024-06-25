const Batch = require('../models/batchModel');
const College = require('../models/collegeModel');
const Department = require('../models/deptModel');
const Scheme = require('../models/schemeModel');
const Semester = require('../models/semModel');

// get the department complete data as it is in db

const dss = async (req, res, next) => {
    try {

        // const departmentData = req.department;
        const departmentData = await Department.find();
        const schemeData = await Scheme.find();
        const semesterData = await Semester.find();
        const collegeData = await College.find();
        const batchData = await Batch.find();

        const dssData = {
            department: departmentData,
            scheme: schemeData,
            semester: semesterData,
            college: collegeData,
            batch: batchData
        };

        // console.log(departmentData);
        res.status(200).json({dssData});

    } catch (error) {
        next(error);
        res.status(400).send({ message: `error from the dss route controller ${error}` })
    }
};


module.exports = {dss };
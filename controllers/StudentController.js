const Student = require('../models/studentsModel');
const Department = require('../models/deptModel');
const Scheme = require('../models/schemeModel');
const Semester = require('../models/semModel');
const Batch = require('../models/batchModel');
const College = require('../models/collegeModel');





// get the student complete data as it is in db

const student = async (req, res, next) => {
    try {

        const studentData = req.student;

        // console.log(studentData);
        res
            .status(200)
            .json({ studentData }
            );

    } catch (error) {
        next(error);
        res.status(400).send({ message: `error from the user route ${error}` })
    }
};


// *--------------------------------
// * Function to get all students
// *--------------------------------
const getAllStudents = async (req, res, next) => {
    try {
        // Retrieve all students from the database
        const students = await Student.find()
            .populate('department')
            .populate('scheme')
            .populate('semester')
            .populate('batch')
            .populate('college')
            .exec();
        res.status(200).json(students);
    } catch (error) {
        next(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



// *--------------------------------
// * Logic for adding New Student
// *---------------------------------



// Route for student registration
const register = async (req, res, next) => {
    try {
        // Extract departmentId, semesterId, and batchId from request body
        const { name, dob, gender, usn, password, email, contact, department, semester, batch, scheme, college, isApproved } = req.body;
        // Get the current date and time
        const currentDate = new Date();

        // console.log("Request Body:", req.body);

        // Find the department, semester, and scheme documents based on their names
        const checkDepartment = await Department.findOne({ deptId: department });

        const checkSemester = await Semester.findOne({ semNum: semester });

        const checkBatch = await Batch.findOne({ batch: batch });

        const checkScheme = await Scheme.findOne({ scheme: scheme });

        const checkCollege = await College.findOne({ clgCode: college });


        // Check if any of the referenced documents are not found
        if (!checkDepartment || !checkSemester || !checkBatch || !checkScheme || !checkCollege) {
            return res.status(400).json({ message: "Department, Semester, Batch, Scheme, or College not found" });
        }



        // Check if customer with the same usn already exists
        const studentExist = await Student.findOne({ usn });

        if (studentExist) {
            return res.status(400).json({ message: "You are already Registered !" });
        }



        // Create a new student document
        const newStudent = new Student({
            name,
            dob,
            password,
            gender,
            usn,
            email,
            contact,
            isApproved,
            regesteredAt: currentDate,
            department: checkDepartment._id,
            semester: checkSemester._id,
            batch: checkBatch._id,
            scheme: checkScheme._id,
            college: checkCollege._id
        });



        // Save the student document to the database
        const savedStudent = await Student.create(newStudent);

        // Add basic student info to the college's students array
        checkCollege.students.push({
            studentId: savedStudent._id,
            name: savedStudent.name,
            usn: savedStudent.usn
        });

        // Save the updated college document
        await checkCollege.save();

        res.status(201).json({ message: "Registration Successfull" });
    } catch (error) {
        next(error);
        // console.error(error);
        // res.status(500).send('Internal Server Error');
    }
};



// *--------------------------
// * Logic for Student Login
// *--------------------------

// Function to handle user login
const studentLogin = async (req, res, next) => {
    try {
        const { usn, password } = req.body;
        const student = await Student.findOne({ usn });

        if (!student || student.password !== password) {
            return res.status(401).json({ message: 'Invalid USN or password.' });
        }

        if (student) {

            res.status(200).json({
                msg: "Login Successful",
                token: await student.generateToken(),
                userId: student.usn
            });


        } else {
            res.status(401).json({ message: "Login page ke controller logic me error hai " })
        }


        // const token = jwt.sign({ userId: user.c_id }, process.env.JWT_SECRET);
        // res.status(200).json({ token });
    } catch (error) {
        next(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};




module.exports = { student, register, studentLogin, getAllStudents };




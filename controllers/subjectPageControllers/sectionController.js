const Section = require('../../models/sectionModel');
const Subject = require('../../models/subjectModel');
const bucket = require('../../utils/gcsConfig'); 

// Controller function to add a section to a subject
const addSectionsToSubject = async (req, res, next) => {
    const { subCode, sectionName, sectionDesc, addedBy, addedByName } = req.body;

    try {
        // Get the current date and time
        const currentDate = new Date();

        // Find the subject by subCode
        const checkSubject = await Subject.findOne({ subCode });

        if (!checkSubject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Check if section with the same name already exists within the subject
        const existingSection = await Section.findOne({ sectionName, subject: checkSubject._id });


        if (existingSection) {
            return res.status(400).json({ message: 'Section with the same name already exists for this subject' });
        }


        // Create a new section
        const newSection = new Section({ sectionName, sectionDesc, subject: checkSubject._id, addedAt: currentDate, addedBy, addedByName });

        await newSection.save();

        // Add the new section to the subject's sections array
        checkSubject.sections.push(newSection);

        // Save the updated subject
        await checkSubject.save();

        res.status(201).json({ message: 'Section added successfully', section: newSection });
    } catch (error) {
        next(error);
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to get sections of a subject
const getSubjectSections = async (req, res, next) => {
    const subCode = req.params.subCode;

    try {
        // Find the subject by subCode and populate its sections
        const subject = await Subject.findOne({ subCode }).populate('sections');
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.status(200).json({ sections: subject.sections });
    } catch (error) {
        next(error);
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to update a section within a subject
const updateSectionInSubject = async (req, res, next) => {
    const { subCode, sectionId } = req.params;
    const { sectionName, sectionDesc } = req.body;

    try {
        // Find the subject by subCode
        const subject = await Subject.findOne({ subCode });

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }


        // Find the section to update by its ID
        const sectionToUpdate = subject.sections.find(section => section._id.toString() === sectionId.toString());
        //  console.log("section to update",sectionToUpdate)
        if (!sectionToUpdate) {
            return res.status(404).json({ message: 'Section not found' });
        }


        // Retrieve the Mongoose model instance of the section from the database
        const sectionModel = await Section.findById(sectionId);
        if (!sectionModel) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Update the section's name and description
        sectionModel.sectionName = sectionName;
        sectionModel.sectionDesc = sectionDesc;


        // Save the updated section
        await sectionModel.save();
        // console.log('Section updated successfully',sectionModel );
        // Save the updated subject
        await subject.save();
        res.status(200).json({ message: 'Section updated successfully', section: sectionModel });
    } catch (error) {
        next(error);
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




const deleteSectionFromSubject = async (req, res, next) => {
    const { subCode, sectionIndex } = req.params;

    try {
        // Find the subject by subCode and populate its sections with PDFs
        const subject = await Subject.findOne({ subCode }).populate({
            path: 'sections',
            populate: { path: 'pdfs' } // Populate the pdfs field of each section
        });

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Check if the section index is valid
        if (sectionIndex < 0 || sectionIndex >= subject.sections.length) {
            return res.status(400).json({ message: 'Invalid section index' });
        }

        // Remove the section at the specified index
        const removedSection = subject.sections.splice(sectionIndex, 1)[0];
        // console.log('Removed Section:', removedSection);

        // Delete associated PDFs from GCS
        if (removedSection.pdfs && Array.isArray(removedSection.pdfs)) {
            for (const pdf of removedSection.pdfs) {
                const blob = bucket.file(pdf.pdfFile);
                await blob.delete();
            }
        }

        // Remove the section reference from the Section collection
        await Section.findByIdAndDelete(removedSection._id);

        // Save the updated subject
        await subject.save();

        res.status(200).json({ message: 'Section deleted successfully' });
    } catch (error) {
        next(error);
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { addSectionsToSubject, getSubjectSections, updateSectionInSubject, deleteSectionFromSubject };

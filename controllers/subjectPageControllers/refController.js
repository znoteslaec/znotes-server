const mongoose = require('mongoose');
const Subject = require('../../models/subjectModel');

exports.addReference = async (req, res, next) => {
    try {
        const subject = await Subject.findOne({ subCode: req.params.subCode });
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        const newReference = {
            refTitle: req.body.refTitle,
            refLink: req.body.refLink,
            addedBy: req.body.addedBy,
            addedByName: req.body.addedByName,
        };
        subject.references.push(newReference);
        await subject.save();
        res.status(201).json({ message: 'Reference added successfully' });
    } catch (error) {
        // res.status(500).json({ message: 'Error adding reference' });
        next(error)
    }
};


exports.updateReference = async (req, res, next) => {
    try {
        const subject = await Subject.findOne({ subCode: req.params.subCode });
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        const reference = subject.references.id(req.params.refId);
        if (!reference) {
            return res.status(404).json({ message: 'Reference not found' });
        }
        reference.refTitle = req.body.refTitle || reference.title;
        reference.refLink = req.body.refLink || reference.link;
        await subject.save();
        res.status(200).json({ message: 'Reference updated successfully' });
    } catch (error) {
        // res.status(500).json({ message: 'Error updating reference' });
        next(error)
    }
};







exports.deleteReference = async (req, res, next) => {
    try {
        const { subCode, refId } = req.params;

        // Validate refId as ObjectId
        if (!mongoose.Types.ObjectId.isValid(refId)) {
            return res.status(400).json({ message: 'Invalid reference ID' });
        }

        const subject = await Subject.findOne({ subCode });
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const referenceIndex = subject.references.findIndex(ref => ref._id.toString() === refId);
        if (referenceIndex === -1) {
            return res.status(404).json({ message: 'Reference not found' });
        }

        // Remove the reference from the array
        subject.references.splice(referenceIndex, 1);

        await subject.save();
        res.status(200).json({ message: 'Reference deleted successfully' });
    } catch (error) {
        console.error('Error deleting reference:', error); // Log error details
        next(error);
    }
};










// exports.deleteReference = async (req, res, next) => {
//     try {
//         const subject = await Subject.findOne({ subCode: req.params.subCode });
//         if (!subject) {
//             return res.status(404).json({ message: 'Subject not found' });
//         }
//         subject.references.id(req.params.refId).remove();
//         await subject.save();
//         res.status(200).json({ message: 'Reference deleted successfully' });
//     } catch (error) {
//         // res.status(500).json({ message: 'Error deleting reference', error: error.message });
//         next(error)
//     }
// };

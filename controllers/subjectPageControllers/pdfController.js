const Section = require('../../models/sectionModel');
const Subject = require('../../models/subjectModel');
const bucket = require('../../utils/gcsConfig');

// Controller function to add PDF to a section
const addPdfToSection = async (req, res, next) => {
    const { deptId, sectionId } = req.params;
    const { subCode, pdfTitle, pdfDescription, addedBy, addedByName } = req.body;
    const pdfFile = req.file;

    try {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}${currentDate.getSeconds().toString().padStart(2, '0')}`;
        const uniqueFilename = `${formattedDate}-znotes-${pdfFile.originalname}`;



        const checkSubject = await Subject.findOne({ subCode });

        if (!checkSubject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        const blob = bucket.file(`${deptId}/${uniqueFilename}`);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on('error', (err) => {
            next(err);
        });

        blobStream.on('finish', async () => {
            // const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

            const newPdf = {
                pdfTitle,
                pdfDescription,
                // pdfFile: publicUrl,
                pdfFile: blob.name,
                subjectAbb: checkSubject.subAbb,
                subjectCode: checkSubject.subCode,
                addedBy,
                addedByName,
                addedAt: currentDate,
            };

            section.pdfs.push(newPdf);
            await section.save();

            res.status(200).json({ message: "PDF Added Successfully", pdf: newPdf });
        });

        blobStream.end(pdfFile.buffer);
    } catch (error) {
        next(error);
    }
};

// Controller function to get PDFs of a section
const getPdfsOfSection = async (req, res) => {
    const { subCode, sectionId } = req.params;

    try {
        const existingSubject = await Subject.findOne({ subCode });
        if (!existingSubject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const section = existingSubject.sections.find(section => section._id.toString() === sectionId);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        res.status(200).json({ pdfs: section.pdfs });
    } catch (error) {
        res.status(500).json({ message: 'Server error (Problem in Controller)' });
    }
};



// *-------------------------------
// * PDF Viwer through signed url
// * ------------------------------

// const getPdfsOfSection = async (req, res) => {

//   try {
//       const { filename } = req.params;
//       const file = bucket.file(filename);

//       const [url] = await file.getSignedUrl({
//           action: 'read',
//           expires: Date.now() + 10 * 1000, // URL valid for 10 seconds
//          //  expires: Date.now() + 60 * 60 * 1000, // URL valid for 1 hour
//       });

//       res.json({ url });
//   } catch (error) {
//       console.error('Error generating signed URL:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// };




// Controller function to delete a PDF from a section
const deletePdfFromSection = async (req, res, next) => {
    const { pdfId, sectionId } = req.body;
    try {
        if (!pdfId || !sectionId) {
            return res.status(400).json({ error: 'PDF ID and Section ID are required' });
        }

        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ error: 'Section not found' });
        }

        const pdfIndex = section.pdfs.findIndex(pdf => pdf._id.toString() === pdfId);
        if (pdfIndex === -1) {
            return res.status(404).json({ error: 'PDF not found' });
        }

        const pdf = section.pdfs[pdfIndex];
        const blob = bucket.file(pdf.pdfFile);

        await blob.delete();

        section.pdfs.splice(pdfIndex, 1);
        await section.save();

        res.status(200).json({ message: 'PDF deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { addPdfToSection, getPdfsOfSection, deletePdfFromSection };

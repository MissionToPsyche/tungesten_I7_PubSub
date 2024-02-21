const Document = require("../model/documentSchema");

const searchDocsByTitle = async (req, res) => {
    try {
        const { substring } = req.body;
        const filteredDocuments = await Document.find({ title: { $regex: new RegExp(substring, 'i') } });
        const documentsWithRelevance = filteredDocuments.map(document => {
            const relevanceScore = calculateRelevance(document.title, substring);
            return { document, relevanceScore };
        });
        const sortedDocuments = documentsWithRelevance.sort((a, b) => b.relevanceScore - a.relevanceScore).map(entry => entry.document);
        res.json(sortedDocuments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const searchDocsByFilters = () => {

}

function calculateRelevance(title, substring) {
    const matchCount = (title.match(new RegExp(substring, 'gi')) || []).length;
    return matchCount;
}

module.exports = { searchDocsByTitle, searchDocsByFilters };
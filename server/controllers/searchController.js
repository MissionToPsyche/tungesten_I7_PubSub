const {Document, Comment} = require("../model/documentSchema");

const searchDocsByTitle = async (req, res) => {
    try {
        const { substring } = req.body;
        const filteredDocuments = await Document.find({ title: { $regex: new RegExp(substring, 'i') } });
        const documentsWithRelevance = filteredDocuments.map(document => {
            const relevanceScore = calculateRelevance(document.title, substring);
            return { document, relevanceScore };
        });
        const sortedDocuments = documentsWithRelevance.sort((a, b) => b.relevanceScore - a.relevanceScore).map(entry => entry.document);
        res.status(200).json(sortedDocuments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const searchDocsByFilters = async (req, res) => {
    try {
      const { username, abstract, year } = req.body;
      const filter = {};
      if (username !== undefined) filter['author'] = { $regex: new RegExp(username, 'i') };
      if (abstract !== undefined) filter['abstract'] = { $regex: new RegExp(abstract, 'i') };
      if (year !== undefined) {
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
        filter['publicationDate'] = { $gte: startDate, $lte: endDate };
      }
      const filteredDocuments = await Document.find(filter);
  
      res.json(filteredDocuments);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

function calculateRelevance(title, substring) {
    const matchCount = (title.match(new RegExp(substring, 'gi')) || []).length;
    return matchCount;
}

module.exports = { searchDocsByTitle, searchDocsByFilters };
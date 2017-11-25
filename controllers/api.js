/**
 * GET /api/artist
 */
exports.getArtist = (req, res) => {
    res.status(200).json({ name: 'Le Knight Club' });
};
const db = require('../db');

const getUserHistory = async (req, res) => {
    try {
        const userId = req.user.userId; 

        const snapshot = await db.collection('history')
            .where('userId', '==', userId)
            .orderBy('date', 'desc')
            .get();

        const history = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate ? doc.data().date.toDate().toLocaleString('ro-RO') : doc.data().date
        }));

        res.status(200).json(history);
    } catch (error) {
        console.error("Eroare Backend History:", error);
        res.status(500).json({ error: "Eroare la preluarea istoricului." });
    }
};


module.exports = {
    getUserHistory
};
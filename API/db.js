const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
 
function initializeFirestore() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    return admin.firestore();
}

const db = initializeFirestore();

module.exports = db;
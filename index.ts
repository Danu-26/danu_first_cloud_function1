const express = require('express');
const cors = require('cors');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('./iltdemo-379501-firebase-adminsdk-7sr4v-43d144826f.json');

initializeApp({
    credential: cert(serviceAccount)
});

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

app.post('/', async (req, res) => {
    try {
        const db = getFirestore();
        const data = req.body;
        const insertPromises = data.map(async (item) => {
            const itemWithId = {
                ...item,
                id: db.collection('danuform3').doc().id
            };
            await db.collection('danuform3').doc(itemWithId.id).set(itemWithId);
        });
        await Promise.all(insertPromises);
        res.send({ message: 'Success' });
    } catch (error) {
        res.send({ message: error.message });
    }
});

app.get('/', async (req, res) => {
    try {
        const db = getFirestore();
        const studentRef = db.collection('danuform3');
        const students = await studentRef.get();

        const stuData = [];
        students.forEach((doc) => {
            stuData.push({...doc.data(), id: doc.id});
        });

        res.send(stuData);
    } catch (error) {
        res.send({ message: error.message });
    }
});

app.delete('/:id', async (req, res) => {
    try {
        const db = getFirestore();
        const id = req.params.id;
        await db.collection('danuform3').doc(id).delete();
        res.send({ message: 'Deleted' });
    } catch (error) {
        res.send({ message: error.message });
    }
});

app.put('/:id', async (req, res) => {
    try {
        const db = getFirestore();
        const id = req.params.id;
        const newData = req.body;
        const itemRef = db.collection('danuform3').doc(id);
        const doc = await itemRef.get();
        if (!doc.exists) {
            res.send({ message: 'Data not found' });
            return;
        }
        await itemRef.update(newData);
        res.send({ message: 'Updated' });
    } catch (error) {
        res.send({ message: error.message });
    }
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});
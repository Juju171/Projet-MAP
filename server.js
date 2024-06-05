const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const sequelize = new Sequelize('projet_map', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projet_map'
});

db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données MySQL:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

app.post('/register', (req, res) => {
    const { email, first_name, last_name, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = 'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)';
    db.query(query, [email, first_name, last_name, hashedPassword], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'enregistrement:', err);
            res.status(500).json({ error: 'Erreur lors de l\'enregistrement' });
            return;
        }
        res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la connexion' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
            return;
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            res.status(401).json({ error: 'Mot de passe incorrect' });
            return;
        }

        req.session.userId = user.id;
        res.status(200).json({ message: 'Connexion réussie' });
    });
});

app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});

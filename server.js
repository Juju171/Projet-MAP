const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

const sessionStore = new SequelizeStore({
    db: sequelize,
});

app.use(session({
    secret: 'my_secret_key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1800000 } // 30 minutes
}));

sessionStore.sync();

app.use(express.static(path.join(__dirname, 'public')));

// Configure multer storage for profile images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.session.userId;
        const dir = path.join(__dirname, 'uploads/profiles', userId.toString());
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, 'profile' + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

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

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
        }
        res.status(200).json({ message: 'Déconnexion réussie' });
    });
});

app.get('/isAuthenticated', (req, res) => {
    if (req.session.userId) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});

app.get('/profileData', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Vous devez être connecté pour accéder à cette ressource' });
    }

    const query = 'SELECT first_name, last_name, profile_image, match_history, affiliation_status, subscription_valid_until FROM users WHERE id = ?';
    db.query(query, [req.session.userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des données du profil' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Données du profil non trouvées' });
        }

        const user = results[0];
        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            profile_image: user.profile_image,
            match_history: JSON.parse(user.match_history || '[]'),
            affiliation_status: user.affiliation_status,
            subscription_valid_until: user.subscription_valid_until
        });
    });
});

app.post('/updateProfile', upload.single('profileImage'), (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Vous devez être connecté pour accéder à cette ressource' });
    }

    const { first_name, last_name, subscription_valid_until } = req.body;
    let profileImage = null;

    if (req.file) {
        profileImage = `/uploads/profiles/${req.session.userId}/profile${path.extname(req.file.originalname)}`;
    }

    const query = 'UPDATE users SET first_name = ?, last_name = ?, profile_image = ?, subscription_valid_until = ? WHERE id = ?';
    db.query(query, [first_name, last_name, profileImage, subscription_valid_until, req.session.userId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du profil:', err);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
        }
        res.status(200).json({ message: 'Profil mis à jour avec succès' });
    });
});

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.status(401).json({ error: 'Vous devez être connecté pour accéder à cette ressource' });
}

// Exemple d'utilisation de la fonction middleware
app.get('/profile', isAuthenticated, (req, res) => {
    res.json({ message: 'Voici votre profil' });
});

app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});

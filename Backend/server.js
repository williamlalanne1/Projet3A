const http = require('http');
const mysql = require('mysql2');
const app = require('./app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const express = require('express');
require('dotenv').config();


const secret = process.env.JWT_SECRET;
const port = 3000;


const server = http.createServer(app);


//Connection à la base de données des utilisateurs
const connection = mysql.createConnection({
    host: "localhost",
    user: "williamlalanne",
    password: process.env.password,
    database: "utilisateurs"
});

const connection2 = mysql.createConnection({
    host: "localhost",
    user: "williamlalanne",
    password: process.env.password,
    database: "Annonces"
});

connection.connect((err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("Connecté à la base de données")
    }
});

connection2.connect((err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("Connecté à la deuxième base de données")
    }
});

app.use('/uploads', express.static(path.join(__dirname, '')));

// Route qui gère la présence ou non de l'utilisateur dans la base de données
app.get('/users', (req, res) => {

    const email = req.query.email;

    const sql = 'SELECT * FROM utilisateurs WHERE email = ?';
    connection.query(sql, [email], (err, results) => {
        if (err) {
            console.log('Requête users echec', err);
            res.status(500).send('Erreur');
        }
        if (results.length>0) {
            console.log('Utilisateur déjà inscrit');
            return res.status(201).json({message:'Utilisateur déjà existant'})
        }
        else {
            return res.status(200).json({message: 'Utilisateur non trouvé' })
        }
    });
});



//Route qui gère l'inscription au site
app.post('/inscription', (req, res) => {
    
    const saltRounds = 10;
    const { email, prenom, nom, adresse, mot_de_passe, mdpConfirmation } = req.body;

    bcrypt.hash(mot_de_passe, saltRounds, (err, hash) => {
        if (err) {
            console.error('Erreur lors du hachage du mot de passe :', err);  
        } 
        else {
            const sql = 'INSERT INTO utilisateurs (email, prenom, nom, adresse, mot_de_passe) VALUES (?, ?, ?, ?, ?)';
            connection.query(sql, [email, prenom, nom, adresse, hash], (err, results) => {
                if (err) {
                    console.log('Erreur inscription', err);
                    return res.status(500).send('Erreur inscription');
                }
                console.log('Inscription succès');
                return res.status(200).json(results);
            });
        }
    })
});

// Route qui gère la connexion
app.post('/connexion', (req, res) => {
    const { email, mot_de_passe } = req.body;
    const sql = 'SELECT * FROM utilisateurs WHERE email = ?';

    connection.query(sql, [email], (err, results) => {
        if (err) {
            console.log('Erreur pour la connexion', err);
            res.status(500).json({ message: 'Erreur connexion' });
        } else {
            if (results.length > 0) {
                const user = results[0];
                bcrypt.compare(mot_de_passe, user.mot_de_passe, (bcryptErr, passwordMatch) => {
                    if (bcryptErr) {
                        console.error('Erreur lors de la comparaison des mots de passe', bcryptErr);
                        res.status(401).json({ message: 'Erreur lors de la connexion' });
                    } else {
                        if (passwordMatch) {
                            console.log('Email de l\'utilisateur:', user.email);
                            const token = jwt.sign({ email: user.email }, secret, { expiresIn: '1d' });
                            console.log('Token généré:', token);
                            res.status(200).json({ token });
                        } else {
                            res.status(401).json({ message: 'Mot de passe incorrect' });
                        }
                    }
                });
            } else {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
        }
    });
});

// Route qui gère le profil de l'utilisateur
/*app.get('/profil', requireAuth, (req, res) => {
    const userEmail = req.user.email;
    console.log('Email récupéré depuis le token:', userEmail);
    const sql = 'SELECT * FROM utilisateurs WHERE email = ?';
    connection.query(sql, [userEmail], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des détails du profil :', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des détails du profil' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'Profil non trouvé' });
            } else {
                const userProfile = results[0];
                console.log('Profil trouvé:', userProfile);
                res.json(userProfile);
            }
        }
    });
});*/

// Middleware pour vérifier et valider le token d'authentification
function verifyToken(req, res, next) {
    // Récupérer le token d'authentification de l'en-tête Authorization
    const token = req.headers.authorization.substring(7);
    if (!token) {
        return res.status(401).json({ message: 'Token d\'authentification manquant' });
    }

    // Vérifier et valider le token
    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: 'Token d\'authentification invalide' });
        } else {
            // Récupérer l'adresse e-mail de l'utilisateur à partir du token décodé
            req.userEmail = decodedToken.email;
            next();
        }
    });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });
  
  // Définir la route POST pour le téléchargement d'images
  app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('Aucune image téléchargée.');
    }
    res.send(req.file.path);
  });

// Route qui gère la création d'une annonce
app.post('/annonces', verifyToken, (req, res) => {
    const { titre, descriptif, debut, fin, adresse } = req.body;
    const email_utilisateur = req.userEmail;

    // Utilisez le chemin de l'image récupéré depuis la route /uploads
    const imagePath = req.body.imagePath;

    const sql = 'INSERT INTO Annonces (email_utilisateur, titre, descriptif, image, date_debut, date_fin, adresse) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection2.query(sql, [email_utilisateur, titre, descriptif, imagePath, debut, fin, adresse], (err, results) => {
        if (err) {
            console.error('Erreur lors de la création de l\'annonce :', err);
            return res.status(500).json({ message: 'Erreur lors de la création de l\'annonce' });
        }
        console.log('Annonce créée avec succès');
        return res.status(200).json({ message: 'Annonce créée avec succès' });
    });
});




app.get('/annonces', (req, res) => {
    const sql = "SELECT * FROM Annonces;";
    connection2.query(sql, (err, results) => {
        if (err) {
            console.log("Annonces non récupérées")
            res.status(500).json({message: 'Erreur récupération Annonces'});
        }
        else {
            res.status(200).json({annonces: results});
        }
    })
});



app.get('/annonces/user', verifyToken, (req, res) => {
    const email = req.userEmail;
    console.log(email);

    const sql = "SELECT * FROM Annonces WHERE email_utilisateur = ?";
    connection2.query(sql, [email], (err, results) => {
        if (err) {
            console.log("Annonces non récupérées")
            res.status(500).json({message: 'Erreur récupération Annonces'});
        }
        else {
            res.status(200).json({annonces: results});
        }
    })
});

// Route qu gère la déconnexion
app.post('/deconnexion', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Déconnexion réussie' });
    console.log("Déconnexion reussie");
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const http = require('http');
const mysql = require('mysql2');
const app = require('./app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
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

//Affichage connexion à la base de données des utilisateurs
connection.connect((err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("Connecté à la base de données")
    }
});


//Connection à la base de données des annonces
const connection2 = mysql.createConnection({
    host: "localhost",
    user: "williamlalanne",
    password: process.env.password,
    database: "Annonces"
});

//Affichage connexion à la base de données des annonces
connection2.connect((err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("Connecté à la deuxième base de données")
    }
});


//Connection à la base de données des favoris
const connection3 = mysql.createConnection({
    host: "localhost",
    user: "williamlalanne",
    password: process.env.password,
    database: "Favoris"
});

//Affichage connexion à la base de données des favoris
connection3.connect((err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("Connecté à la troisième base de données")
    }
})


//Connexion à gmail pour envoyer des mails automatique
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.email,
      pass: process.env.gmailPassword,
    }
});



app.use(express.static('public'));

app.use('/uploads', express.static(path.join(__dirname, '')));


app.use('/profil', express.static(path.join(__dirname, '')));



// Middleware pour vérifier et valider le token d'authentification
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token d\'authentification manquant' });
    }

    const token = authHeader.substring(7);
    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: 'Token d\'authentification invalide' });
        } else {
            req.userEmail = decodedToken.email;
            next();
        }
    });
};



// <<<<<<<<<PARTIE SUR LA BASE DE DONNEES DES UTILISATEURS>>>>>>>>


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
    const { email, prenom, nom, facebook, adresse, mot_de_passe, mdpConfirmation, imagePath } = req.body;

    bcrypt.hash(mot_de_passe, saltRounds, (err, hash) => {
        if (err) {
            console.error('Erreur lors du hachage du mot de passe :', err);  
        } 
        else {
            const sql = 'INSERT INTO utilisateurs (email, prenom, nom, adresse, mot_de_passe, image, facebook) VALUES (?, ?, ?, ?, ?, ?, ?)';
            connection.query(sql, [email, prenom, nom, adresse, hash, imagePath, facebook], (err, results) => {
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


// Permet d'uploader l'image de profil dans un dossier et de récupérer ensuite cette image
const storageProfil = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'profil/'); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
const profil = multer({ storage: storageProfil });

app.post('/profil', profil.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('Aucune image téléchargée.');
    }
    console.log(req.file.path);
    res.send(req.file.path);
});


// Route qui gère la modification du profil
app.patch('/inscription', (req, res) => {
    
    const saltRounds = 10;
    const { email, mot_de_passe, mdpConfirmation } = req.body;

    bcrypt.hash(mot_de_passe, saltRounds, (err, hash) => {
        if (err) {
            console.error('Erreur lors du hachage du mot de passe :', err);  
        } 
        else {
            const sql = 'UPDATE utilisateurs SET mot_de_passe = ? WHERE email = ?';
            connection.query(sql, [hash, email], (err, results) => {
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


// Route qui gère le mot de passe oublié
app.post('/mot-de-passe-oublie', (req, res) => {
    
    const email  = req.body.email;
    console.log(req.body.email);
  
    const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
    
    const sql = 'UPDATE utilisateurs SET token = ? WHERE email = ?';
    connection.query(sql, [token, email], (err, results) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du token dans la base de données :', err);
            return res.status(500).json({ message: 'Erreur lors de la mise à jour du token dans la base de données' });
        }

        console.log('Token ajouté avec succès dans la base de données');
    });

    const resetPasswordLink = `http://127.0.0.1:5501/Frontend/Page_NouveauMdp/mdp.html?token=${token}`;
  
    const mailOptions = {
      from: 'centralemaide@gmail.com',
      to: `${email}`,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : ${resetPasswordLink}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation de mot de passe :', error);
        res.status(500).json({message : 'Erreur lors de l\'envoi de l\'e-mail de réinitialisation de mot de passe'});
      } else {
        console.log('E-mail de réinitialisation de mot de passe envoyé avec succès:', info.response);
        res.status(200).json({message :'E-mail de réinitialisation de mot de passe envoyé avec succès'});
      }
    });
});


// Route qui permet l'envoie d'un mail à l'utilisateur lorsqu'il oublie son mot de passe
app.get('/email/:token', (req, res) => {
    const token  = req.params.token;
    console.log(token);
  
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error('Erreur lors de la vérification du token :', err);
        return res.status(400).json({ message: 'Token invalide' });
      }
      const userEmail = decoded.email;
  
      res.status(200).json({ email: userEmail });
    });
  });
  


// Route qui permet de récupérer les informations de l'utilisateur
app.get('/profil', verifyToken, (req, res) => {
    const userEmail = req.userEmail;
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
                res.json({profil: userProfile});
            }
        }
    });
});


// Route qui permet de modifier le profil de l'utilisateur
app.patch("/profil", verifyToken, (req, res) => {
    console.log(req.body);
    const prenom = req.body.prenom;
    const nom = req.body.nom;
    const facebook = req.body.facebook;
    const adresse = req.body.adresse;
    const image = req.body.image; 
    const email = req.userEmail
    const sql = "UPDATE utilisateurs SET prenom = ?, nom = ?, adresse = ?, image = ?, facebook = ? WHERE email = ?";
    connection.query(sql, [prenom, nom, adresse, image, facebook, email], (err, results) => {
        if (err) {
            res.status(500).json({message: "La requête pour modifier le profil a échoué"});
            console.error(`Erreur lors de la modification du profil: ${err}`);
        }
        else {
            res.status(200).json({message: "Le profil a éte modifié"});
        }
    })
});



// <<<<<<<<<<PARTIE SUR LA BASE DE DONNEES DE L'ANNONCE>>>>>>>>>>>


// Route qui permet de récupérer toutes les annonces 
app.get('/annonces', (req, res) => {
    const annonceId = req.body;
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


// Route qui gère la création d'une annonce
app.post('/annonces', verifyToken, (req, res) => {
    const { titre, descriptif, debut, fin, adresse } = req.body;
    const email_utilisateur = req.userEmail;

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


// Route qui permet de récupérer les informations de la personne qui a déposé l'annonce regardée
app.get('/annonce/:id/profil', verifyToken, (req, res) => {
    const annonceId = req.params.id;
    const sql = 'SELECT utilisateurs.* FROM annonces INNER JOIN utilisateurs.utilisateurs ON annonces.email_utilisateur = utilisateurs.email WHERE annonces.id = ?;';
    connection2.query(sql, [annonceId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des détails du profil du déposeur:', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des détails du profil du déposeur' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'Profil du déposeur non trouvé' });
            } else {
                const deposeurProfile = results[0];
                console.log('Profil du déposeur trouver trouvé:', deposeurProfile);
                res.json({profil: deposeurProfile});
            }
        }
    });
});



  

// Permet de stocker l'image d'une annonce
const storageAnnonce = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
},
filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
}
});
  
const upload = multer({ storage: storageAnnonce });


// Route POST pour le téléchargement d'images dans la base de données des annonces
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('Aucune image téléchargée.');
    }
    res.send(req.file.path);
});






// Route qui permet de récupérer une annonce spécifique grâce à l'id
app.get('/annonce/:id', verifyToken, (req, res) => {
    const annonceId = req.params.id;
    const sql = "SELECT * FROM Annonces WHERE ID = ?;";
    connection2.query(sql, [annonceId], (err, results) => {
        if (err) {
            res.status(500).json({message: "Erreur lors de la récupération de l'annonce"});
            console.log(`Annonce n°${annonceId} pas récupérée`);
        }
        else {
            if (results.length === 0) {
                res.status(404).json({message: "Annonce non trouvée"});
            }
            else {
                res.status(200).json({annonce: results[0]});
                console.log(`Annonce n°${annonceId} récupérée avec succès`);
            }
        }
    });
});


// Route qui permet de supprimer une annonce qu'on a posté
app.delete("/annonce", verifyToken, (req, res) => {
    const annonceId = req.body.annonceId;
    console.log(annonceId);
    const sql = "DELETE FROM Annonces WHERE id = ?";
    connection2.query(sql, [annonceId], (err, results) => {
        if (err) {
            res.status(500).json({message: "Erreur lors de la suppression de l'annonce"});
            console.log(`Annonce n°${annonceId} pas supprimée`);
        }
        else {
            res.status(200).json({message: "Annonce supprimée"});
        }
    })
});


// Route qui permet de modifier une annonce
app.patch("/annonce", verifyToken, (req, res) => {
    console.log(req.body);
    const titre = req.body.titre;
    const descriptif = req.body.descriptif;
    const adresse = req.body.adresse;
    const debut = req.body.debut;
    const fin = req.body.fin;
    const image = req.body.image; 
    const id = req.body.id;
    const email = req.userEmail;

    const sql = "UPDATE annonces SET titre = ?, descriptif = ?, image = ?, date_debut = ?, date_fin = ?, adresse = ? WHERE id = ? AND email_utilisateur = ?";
    connection2.query(sql, [titre, descriptif, image, debut, fin, adresse, id, email], (err, results) => {
        if (err) {
            res.status(500).json({message: "La requête pour modifier le profil a échoué"});
            console.error(`Erreur lors de la modification du profil: ${err}`);
        }
        else {
            res.status(200).json({message: "Le profil a éte modifié"});
        }
    })
});

// Route qui permet d'avoir toutes les annonces publiées par un utilisateur
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







// <<<<<<<<<<<<<<<PARTIE SUR LA BASE DE DONNEES DES FAVORIS>>>>>>>>>>>>>>>

// Route qui permet de récupérer tous les favoris pour un utilisateur
app.get('/favoris', verifyToken, (req, res) => {
    const email_utilisateur = req.userEmail;
    const sql = "SELECT * FROM Favoris WHERE email_utilisateur = ?";
    connection3.query(sql, [email_utilisateur], (err, results) => {
        if (err) {
            res.status(500).json({message: "Erreur lors de la récupération des favoris"});
        }
        else {
            res.status(200).json({favoris: results});
            console.log(results);
        }
    })
});


// Route qui permet d'ajouter une annonce dans les favoris
app.post("/favoris", verifyToken, (req, res) => {
    const id_annonce = req.body.id;
    const email_utilisateur = req.body.email;
    const sql = "INSERT INTO FAVORIS (email_utilisateur, id_annonce) VALUES (?, ?)";
    connection3.query(sql, [email_utilisateur, id_annonce], (err, results) => {
        if (err) {
            res.status(500).json({message: "Erreur lors de l'ajout aux favoris"});
            console.log('Annonce pas ajoutée aux favoris')
        }
        else {
            res.status(200).json({message: "Annonce ajoutée aux favoris avec succès"});
        }
    })
});


// Route qui permet de supprimer une annonce des favoris
app.delete("/favoris", verifyToken, (req, res) => {
    const id_annonce = req.body.id_annonce;
    const email_utilisateur = req.body.email;
    const sql = "DELETE FROM Favoris WHERE email_utilisateur = ? AND id_annonce = ?";
    connection3.query(sql, [email_utilisateur, id_annonce], (err, results) => {
        if (err) {
            console.error(`Erreur lors de la suppression de l'annonce dans les favoris : ${err}`);
            res.status(500).json({ message: "Erreur lors de la suppression de l'annonce dans les favoris" });
        } else {
            res.status(200).json({ message: "Annonce supprimée des favoris" });
        }
    });
});








// Route qu gère la déconnexion
app.post('/deconnexion', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Déconnexion réussie' });
    console.log("Déconnexion reussie");
});


// Permet de se connecter au port choisi
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

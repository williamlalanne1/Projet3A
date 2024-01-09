const http = require('http');
const mysql = require('mysql2');
const app = require('./app');
const bcrypt = require('bcrypt');
const port = 3000;

const server = http.createServer(app);

//Connection à la base de données des utilisateurs
const connection = mysql.createConnection({
    host: "localhost",
    user: "williamlalanne",
    password: "0w23vu7ySql!",
    database: "utilisateurs"
});

connection.connect((err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("Connecté à la base de données")
    }
});

// Route qui gère la présence ou non de l'utilisateur dans la base de données

app.get('/users', (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(200).send('Utilisateur non inscrit')
    }

    const sql = 'SELECT * FROM utilisateurs WHERE email = ?';
    connection.query(sql, [email], (err, results) => {
        if (err) {
            console.log('Requête users echec', err);
            res.status(500).send('Erreur');
        }
        if (results.length>0) {
            console.log('Utilisateur inscrit');
            return res.status(409).json({message: 'Utilisateur déjà existant' })
        }
        else {
            return res.status(200).json({message: 'Utilisateur non trouvé' })
        }
    });
});


//Route qui gère l'inscription au site

app.post('/inscription', (req, res) => {
    
    const { email ,prenom, nom, adresse, mot_de_passe, mdpConfirmation } = req.body;
    
    const sql = 'INSERT INTO utilisateurs (email, prenom, nom, mot_de_passe) VALUES (?, ?, ?, ?)'
    connection.query(sql, [email, prenom, nom, adresse, mot_de_passe], (err, results) => {
        if (err) {
            console.log('Erreur inscription', err);
            res.status(500).send('Erreur inscription');
        }
        else {
            if (mot_de_passe === mdpConfirmation) {
                console.log('Inscription succès');
                res.status(200).json(results);
            }
            else {
                console.log("Mots de passe différents");
                res.status(400).send('Entrez des mots de passe identiques');
            }   
        }
    });
});


// Route qui gère la connexion
app.post('/connection', (req, res) => {
    const email = req.body.email;
    const password = req.body.mot_de_passe; 
    const sql = 'SELECT * FROM users WHERE email = ?';

    connection.query(sql, [email], (err, results) => {
        if (err) {
            console.log('Erreur pour la connexion', err);
            res.status(500).json({ message: 'Erreur connexion' });
        } 
        else {
            if (results.length > 0) {

                const storedPassword = results[0].mot_de_passe; 
                bcrypt.compare(password, storedPassword, (bcryptErr, passwordMatch) => {
                    if (bcryptErr) {
                        console.log('Erreur lors de la comparaison des mots de pass', bcryptErr);
                        res.status(500).json({message: 'Erreur lors de la connexion'});
                    }
                    else {
                        if (passwordMatch) {
                            res.status(200).json({message: 'Connexion réussie'});
                        }
                        else {
                            res.status(401).json({message: 'Mot de passe incorect'});
                        }
                    }
                })
            } 
        }
    });
});
// Bouton se connecter
const seConnecterButton = document.getElementById('seConnecterButton');

// Bouton s'inscrire au milieu de la page et en haut
const inscriptionButtonMiddle = document.getElementById("inscriptionButtonMiddle");
const sInscrireButton = document.getElementById("sInscrireButton");

const inscriptionSucces = document.getElementById("inscriptionSucces");

// Les deux popup qui apparaissent 
const connexionPopup = document.getElementById("connexionPopup");
const inscriptionPopup = document.getElementById("inscriptionPopup");

// Overlay qui recouvre l'écran lorsque les popup s'ouvrent 
const popupOverlay1 = document.getElementById('popupOverlay1');
const popupOverlay2 = document.getElementById('popupOverlay2');

// Les differents liens sur la page
const nouveauCompteLink = document.getElementById('nouveauCompte');
const connectLink = document.getElementById("connectLink");
const mdpOublieLink = document.getElementById("mdpOublie");

// Les différents form à remplir, inscription et connexion
const inscriptionForm = document.getElementById('inscriptionForm');
const connectionForm = document.getElementById("connectionForm");

// Boutons connexion et inscription dans les forms
const inscriptionButton = document.getElementById("inscriptionButton");
const connexionButton = document.getElementById('connexionButton');


// Input pour l'inscription
const emailInput = document.getElementById("email");
const prenomInput = document.getElementById("prenom");
const nomInput = document.getElementById("nom");
const facebookInput = document.getElementById("facebook");
const adresseInput = document.getElementById("adresse");
const mdpConfirmationInput = document.getElementById("mdpConf");
const mot_de_passeInput = document.getElementById("mdp");


// Valeur des différents input d'inscription
const email = document.getElementById("email").value;
const prenom = document.getElementById("prenom").value;
const nom = document.getElementById("nom").value;
const adresse = document.getElementById("adresse").value;
const mdpConfirmation = document.getElementById("mdpConf").value;
const mot_de_passe = document.getElementById("mdp").value;

// Input pour la connexion
const connexionEmailInput = document.getElementById("connexionEmail")
const connexionMdpInput = document.getElementById("connexionMdp")


// Valeur des différents input de connexion
const connexionEmail = document.getElementById("connexionEmail").value;
const connexionMdp = document.getElementById("connexionMdp").value;


// Token généré lors de la connexion
const token = localStorage.getItem('token');


// Ouverture du popup de connexion et de l'overlay
seConnecterButton.addEventListener("click", () => {
    connexionPopup.classList.add('open');
});

popupOverlay1.addEventListener("click", () => {
    connexionPopup.classList.remove('open');  
});


// Ouverture du popup d'inscription et de l'overlay
sInscrireButton.addEventListener("click", () =>{
    inscriptionPopup.classList.add('open');
});

popupOverlay2.addEventListener("click", () => {
    inscriptionPopup.classList.remove('open');
});


// Ouverture du popup d'inscription avec le bouton au milieu de la page
inscriptionButtonMiddle.addEventListener("click", () => {
    inscriptionPopup.classList.add('open');
});


// Ouverture du popup d'inscription et fermeture du popup de connexion
nouveauCompteLink.addEventListener("click", () => {
    connexionPopup.classList.remove('open');
    inscriptionPopup.classList.add('open');
});


// Ouverture du popup de connexion et fermeture du popup de inscription
connectLink.addEventListener("click", () => {
    connexionPopup.classList.add('open');
    inscriptionPopup.classList.remove('open');
})


// Ouverture de la page de renouvellement du mot de passe
mdpOublieLink.addEventListener("click", () => {
    window.location.href = "../Page_RenouvelerMdp/renouveler_mdp.html"
});



// Validation de l'adresse mail
async function validEmailInscription() {
    const email = document.getElementById('email').value;
    let emailValid = true;
    try {
        const response = await fetch(`http://localhost:3000/users?email=${email}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
        
        if (!response.ok) {
                throw new Error(`Erreur lors de la requête GET: ${response.status}`)
        }
        
        const data = await response.json();
        
        
        if (data.message === 'Utilisateur déjà existant') {
                document.getElementById("emailError").classList.add('emailVisible');
                document.getElementById("emailError").classList.remove('emailHidden');
                document.getElementById("email").classList.add('inscriptionInputError');
                document.getElementById("email").classList.remove('inscriptionInput');
                document.getElementById("email").classList.remove('inscriptionInputValid');
                emailValid = false;
        }
        else {
            document.getElementById("emailError").classList.remove('emailVisible');
            document.getElementById("emailError").classList.add('emailHidden');
            document.getElementById("email").classList.remove('inscriptionInputError');
            document.getElementById("email").classList.add('inscriptionInputValid');
            emailValid = true;
        }
    }
    catch (error) {
        console.error("Erreur :", error);
        emailValid = false;
    }
    
    return emailValid;
};


//aide visuelle pour la validation de l'email
emailInput.addEventListener("blur", () =>  validEmailInscription());



// Validation du mot de passe
function validPasswordInscription() {
    let validPassword = true;
    const mot_de_passe = mot_de_passeInput.value.trim();
    const mdpConfirmation = mdpConfirmationInput.value.trim();

    if (mot_de_passe !== mdpConfirmation && mdpConfirmation) {
        mot_de_passeInput.style.borderColor = 'red';
        mdpConfirmationInput.style.borderColor = 'red';
        validPassword = false;
    }
    if (mot_de_passe === mdpConfirmation) {
        mot_de_passeInput.style.borderColor = 'green';
        mdpConfirmationInput.style.borderColor = 'green';
        validPassword = true;
    }

    return validPassword;
};


//aide visuelle pour la validation du mot de passe
mdpConfirmationInput.addEventListener("blur", () =>  validPasswordInscription());



// Validation pour les autres input
function validInput(input) {
    if(!input.value.trim()) {
        input.style.borderColor='red';
    }
    else {
        input.style.borderColor='green';
    }
};


//aide visuelle pour la validation des autres input
prenomInput.addEventListener("blur", () => validInput(prenomInput));
nomInput.addEventListener("blur", () => validInput(nomInput));
adresseInput.addEventListener("blur", () => validInput(adresseInput));
facebookInput.addEventListener("blur",() => validInput(facebookInput));



//Validation de tout le form pour l'inscription
function validateForm() {
    const inputs = [emailInput, prenomInput, nomInput, adresseInput, mot_de_passeInput, mdpConfirmationInput];
    let formIsValid = true;

    for (const input of inputs) {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            formIsValid = false;
        } else {
            input.style.borderColor = '';
        }
    }

    if (!validPasswordInscription()) {
        mot_de_passeInput.style.borderColor = 'red';
        mdpConfirmationInput.style.borderColor = 'red';
        formIsValid = false;
    }

    if(!validEmailInscription()) {
        formIsValid = false;
    }
    
    return formIsValid;
};


// Message pour dire à l'utilisateur que son inscription est valide
function inscriptionSuccesMessage() {
    inscriptionSucces.classList.add('inscription-succes-open');
}


// Soumission du form d'inscription
inscriptionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Récupérer les valeurs des champs du formulaire
    const email = document.getElementById("email").value;
    const prenom = document.getElementById("prenom").value;
    const nom = document.getElementById("nom").value;
    const facebook = document.getElementById("facebook").value;
    const adresse = document.getElementById("adresse").value;
    const mot_de_passe = document.getElementById("mdp").value;
    const mdpConfirmation = document.getElementById("mdpConf").value;

    let imagePath; // Déclarer la variable pour stocker le chemin de l'image

    // Valider le formulaire
    if (!validateForm()) {
        console.log("Tous les champs doivent être remplis");
        return;
    }

    try {
        // Télécharger l'image vers le serveur
        const imageFile = document.getElementById('photo').files[0];
        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            const uploadResponse = await fetch("http://localhost:3000/profil", {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error(`Erreur lors du téléchargement de l'image: ${uploadResponse.status}`);
            }

            // Récupérer le chemin de l'image téléchargée depuis la réponse du serveur
            imagePath = await uploadResponse.text();
        } else {
            
            imagePath = 'profil/defaut.png'; 
        }

        // Envoyer les données du formulaire au serveur pour l'inscription
        const response = await fetch("http://localhost:3000/inscription", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, prenom, nom, facebook, adresse, mot_de_passe, mdpConfirmation, imagePath }),
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la requête POST: ${response.status}`);
        }

        const data = await response.json();
        console.log("Réponse du serveur :", data);

    } 
    catch (error) {
        console.error("Erreur :", error);
    }

    alert(" Félicitations ! Tu es maintenant inscrit sur Centrale M'Aide.");
    
});




// Soumission du form de connexion
connectionForm.addEventListener("submit", (event) => {
    
    event.preventDefault();
    fetch('http://localhost:3000/connexion', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: connexionEmail, mot_de_passe: connexionMdp}),
    })
    .then(response => {
        if (!response.ok) {
            console.log(response.status);
            throw new Error(`Erreur lors de la requête POST pour la connexion: ${response.status}`)
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            
            localStorage.setItem('token', data.token);
            // Redirection vers Annonces.html
            window.location.href = 'http://127.0.0.1:5501/Frontend/Page_Annonces/Annonces.html';
        }
    })
    .catch(error => {
        console.error('Erreur lors de la requête:', error);
        document.getElementById("mdpError").classList.add("mdpErrorVisible");
        document.getElementById("mdpError").classList.remove("mdpErrorHidden");
        document.getElementById("connexionMdp").classList.add("connexionMdpError");
        document.getElementById("connexionMdp").classList.remove("connexionInput");
        
    })
});





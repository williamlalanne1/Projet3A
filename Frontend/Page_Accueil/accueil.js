const inscriptionButton = document.getElementById("inscriptionButton");
const inscriptionButtonMiddle = document.getElementById("inscriptionButtonMiddle");
const inscriptionPopup = document.getElementById("inscriptionPopup");

const connexionPopup = document.getElementById("connexionPopup");
const seConnecterButton = document.getElementById('seConnecterButton');

const popupOverlay1 = document.getElementById('popupOverlay1');
const popupOverlay2 = document.getElementById('popupOverlay2');

const nouveauCompteLink = document.getElementById('nouveauCompte');
const connectLink = document.getElementById("connectLink");
const mdpOublieLink = document.getElementById("mdpOublie");

sInscrireButton.addEventListener("click", () =>{
    inscriptionPopup.classList.add('open');
});

popupOverlay2.addEventListener("click", () => {
    inscriptionPopup.classList.remove('open');
});


seConnecterButton.addEventListener("click", () => {
        connexionPopup.classList.add('open');
});

popupOverlay1.addEventListener("click", () => {
        connexionPopup.classList.remove('open');  
});

inscriptionButtonMiddle.addEventListener("click", () => {
    inscriptionPopup.classList.add('open');
});

nouveauCompteLink.addEventListener("click", () => {
    connexionPopup.classList.remove('open');
    inscriptionPopup.classList.add('open');
});

connectLink.addEventListener("click", () => {
    connexionPopup.classList.add('open');
    inscriptionPopup.classList.remove('open');
})

mdpOublieLink.addEventListener("click", () => {
    window.location.href = "../Page_ChangementMdp/mdp.html";
});


const connexionButton = document.getElementById('connexionButton');
const inscriptionForm = document.getElementById('inscriptionForm');

const email = document.getElementById("email").value;
const prenom = document.getElementById("prenom").value;
const nom = document.getElementById("nom").value;
const adresse = document.getElementById("adresse").value;
const mdpConfirmation = document.getElementById("mdpConf").value;
const mot_de_passe = document.getElementById("mdp").value;

const emailInput = document.getElementById("email");
const prenomInput = document.getElementById("prenom");
const nomInput = document.getElementById("nom");
const adresseInput = document.getElementById("adresse");
const mdpConfirmationInput = document.getElementById("mdpConf");
const mot_de_passeInput = document.getElementById("mdp");


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



inscriptionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const prenom = document.getElementById("prenom").value;
    const nom = document.getElementById("nom").value;
    const adresse = document.getElementById("adresse").value;
    const mdpConfirmation = document.getElementById("mdpConf").value;
    const mot_de_passe = document.getElementById("mdp").value;

    if (!validateForm()) {
        console.log("Tous les champs doivent être remplis");
        return;
    }
    else {
        console.log(email);
        fetch("http://localhost:3000/inscription", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, prenom, nom, adresse, mot_de_passe, mdpConfirmation }),
        })
        .then(response => {
            if (!response.ok) {
                console.log(response.status);
                throw new Error(`Erreur lors de la requête POST: ${response.status}`);
            }
            return response.json(); 
        })
        .then(data => {
            inscriptionPopup.classList.remove('open');
            console.log("Réponse du serveur :", data);
        })
        .catch(error => {
            console.error("Erreur :", error);
        });
    }       
    
});

const connectionForm = document.getElementById("connectionForm");

async function validatePasswordConnection() {

}

connectionForm.addEventListener("submit", (event) => {
    const connexionEmail = document.getElementById("connexionEmail").value;
    const connexionMdp = document.getElementById("connexionMdp").value;
    
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
            // Stocker le token JWT dans le localStorage ou dans un cookie
            localStorage.setItem('token', data.token);
            // Redirection vers Annonces.html
            window.location.href = 'http://127.0.0.1:5501/Frontend/Page_Annonces/Annonces.html';
        }
        if (data.message === "Mot de passe incorrect") {
            document.getElementById("mdpError").classList.add("mdpErrorVisible");
            document.getElementById("mdpError").classList.remove("mdpErrorHidden");
            document.getElementById("connexionMdp").classList.add("connexionMdpError");
            document.getElementById("connexionMdp").classList.remove("connexionInput");
        }
    })
});





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
function validEmail() {
    const email = document.getElementById('email').value;
    let emailValid = true;

    fetch(`http://localhost:3000/users?email=${email}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur lors de la requête GET: ${response.status}`)
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'Utilisateur déjà existant') {
            document.getElementById("emailError").classList.add('emailVisible');
            document.getElementById("emailError").classList.remove('emailHidden');
            document.getElementById("email").classList.add('inscriptionInputError');
            document.getElementById("email").classList.remove('inscriptionInput');
            emailValid = false;
        }
        else {
            document.getElementById("emailError").classList.remove('emailVisible');
            document.getElementById("emailError").classList.add('emailHidden');
            document.getElementById("email").classList.remove('inscriptionInputError');
            document.getElementById("email").classList.add('inscriptionInputValid');
            emailValid = true;
        }
    })
    return emailValid;
};
//aide visuelle pour la validation de l'email
emailInput.addEventListener("blur", () =>  validEmail());



// Validation du mot de passe
function validPassword() {
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
mdpConfirmationInput.addEventListener("blur", () =>  validPassword());


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

    if (!validPassword()) {
        mot_de_passeInput.style.borderColor = 'red';
        mdpConfirmationInput.style.borderColor = 'red';
        formIsValid = false;
    }

    if(!validEmail()) {
        formIsValid = false;
    }
    
    return formIsValid;
};










inscriptionForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
        console.log("Tous les champs doivent être remplis");
        return;
    }
    else {

        const email = document.getElementById('email').value;

        fetch(`http://localhost:3000/users?email=${email}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur lors de la requête GET: ${response.status}`)
            }
            return response.json();

        })
        .then(data => {
            if (data.message === 'Utilisateur déjà existant') {
            
                document.getElementById("emailError").classList.add('emailVisible');
                document.getElementById("emailError").classList.remove('emailHidden');
                document.getElementById("email").classList.add('inscriptionInputError');
                document.getElementById("email").classList.remove('inscriptionInput');

            }
            else {
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

                    document.getElementById("emailError").classList.remove('emailVisible');
                    document.getElementById("emailError").classList.add('emailHidden');
                    document.getElementById("email").classList.remove('inscriptionInputError');
                    document.getElementById("email").classList.add('inscriptionInputValid');
                    console.log("Réponse du serveur :", data);
                    
                })
                .catch(error => {
                    console.error("Erreur :", error);
                });
            }
        })
        .catch(error => {
            console.log('Erreur', error);
        })
    }
});





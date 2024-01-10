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

inscriptionForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const prenom = document.getElementById("prenom").value;
    const nom = document.getElementById("nom").value;
    const adresse = document.getElementById("adresse").value;
    const mdpConfirmation = document.getElementById("mdpConf").value;
    const mot_de_passe = document.getElementById("mdp").value;
    
    console.log(email, prenom);
    fetch('http://localhost:3000/users', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur lors de la requête GET: ${reponse.status}`)
        }
        return response.json();

    })
    .then(data => {
        if (data.message === 'Utilisateur déjà existant') {
            document.getElementById("email").style.borderColor='red';
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
                if (data.message === 'Mots de passe différents') {
                    
                    console.log("Mots de passe différents");
                    document.getElementById("mdp").style.borderColor='red';
                    document.getElementById('mdpConf').style.borderColor='red';
                } else {
                
                    console.log("Réponse du serveur :", data);
                }
            })
            .catch(error => {
                console.error("Erreur :", error);
            });
        }
    })
    .catch(error => {
        console.log('Erreur', error);
    })


            

    

});





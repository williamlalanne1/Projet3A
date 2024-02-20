const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const token = localStorage.getItem('token');
const deconnexion = document.getElementById("deconnexion");
const boutonAnnonce = document.getElementById("boutonAnnonce");
const mesAnnonces = document.getElementById('mesAnnonces');
const monProfil = document.getElementById("monProfil");
const menuLogo = document.getElementById("menuLogo");
const cmLogo = document.getElementById("logo");
const popupMenu = document.getElementById("popupMenu");
var isOpen = false;


cmLogo.addEventListener("click", () => {
    window.location.href = "../Page_Accueil/accueil.html";
});

menuLogo.addEventListener("click", () => {
    if (!isOpen) {
        console.log(isOpen);
        popupMenu.style.visibility='visible';
        isOpen = true;
    }
    else {
        console.log(isOpen);
        popupMenu.style.visibility='hidden';
        isOpen = false;
    }

});

boutonAnnonce.addEventListener("click", () => {
    window.location.href='http://127.0.0.1:5501/Frontend/Page_Annonces/Annonces.html';
});

mesAnnonces.addEventListener("click", () => {
    window.location.href = 'http://127.0.0.1:5501/Frontend/Page_MesAnnonces/MesAnnonces.html';
});



//Logique de deconnexion d'un utilisateur
deconnexion.addEventListener("click", () => { 


    fetch('http://localhost:3000/deconnexion', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    .then(response => {
        if (!response.ok) {
            console.log(response.status);
            throw new Error(`Erreur lors de la requête POST pour la déconnexion: ${response.status}`)
        }
        return response.json();
    })
    .then(data => {
        localStorage.removeItem('token');
    
        window.location.href = 'http://127.0.0.1:5501/Frontend/Page_Accueil/accueil.html';
        console.log("Deconnexion reussie");
    })
    .catch(error => {
        console.error('Erreur lors de la requête fetch:', error);
    });
});



fetch('http://localhost:3000/profil', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
})
.then(response => {
    if (!response.ok) {
        console.log(response.status);
        throw new Error(`Erreur lors de la requête : ${response.status}`);
    }
    return response.json();
})
.then(data => {
    const profil = data.profil;
    const email = profil.email;
    const prenom = profil.prenom;
    const nom = profil.nom;
    const adresse = profil.adresse;
    const div = document.getElementById('profilContainer');
             
    div.innerHTML = `
        <div class="imageContainer">
            <img src="../../Backend/${profil.image}" alt="Image de l'annonce" class="profilImage">
        </div>
        <div class="informationsContainer">
            <h2>Informations sur ${prenom}</h2>
            <p> Prénom: ${prenom}</p>
            <p> Nom: ${nom} </p>
            <p> Adresse: ${adresse}</p>
            <p> Email: ${email}</p>
        </div>
        `;
    parentElement.appendChild(div);
})
.catch(error => {
    console.log("Erreur", error);
})

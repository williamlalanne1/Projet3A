const menuLogo = document.getElementById("menuLogo");
const popupMenu = document.getElementById("popupMenu");
const deconnexion = document.getElementById("deconnexion");
const addAnnonces = document.getElementById("addAnnonces");
const mesAnnonces = document.getElementById('mesAnnonces');
var isOpen = false;

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

addAnnonces.addEventListener("click", () => {
    window.location.href = 'http://127.0.0.1:5501/Frontend/Page_DeposAnnonce/form.html';
})

deconnexion.addEventListener("click", () => {
    
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/deconnexion', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Ajouter le token JWT dans l'en-tête Authorization
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
        // Supprimer le token JWT du localStorage ou du cookie après la déconnexion
        localStorage.removeItem('token');
        // Redirection vers la page d'accueil
        window.location.href = 'http://127.0.0.1:5501/Frontend/Page_Accueil/accueil.html';
        console.log("Deconnexion reussie");
    })
    .catch(error => {
        console.error('Erreur lors de la requête fetch:', error);
    });
});

fetch('http://localhost:3000/annonces', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Erreur: ${response.status};`);
    }
    return response.json();
})
.then(data => {
    if (Array.isArray(data.annonces)) {
        data.annonces.forEach(annonce => {
            console.log(annonce.image.data);
            const parentElement = document.getElementById('annoncesContainer');
            const div = document.createElement('div');
            div.classList.add('annonce');
            
            // Convertir les données de l'image en base64
            
            
            div.innerHTML = `
                <img src="../../Backend/${annonce.image}" alt="Image de l'annonce" class="imageAnnonce">
                <h2 class="titreAnnonce">${annonce.titre}</h2>
                <p class="debutAnnonce">${annonce.date_debut}</p>
                <p class="finAnnonce">${annonce.date_fin}</p>
            `;
            parentElement.appendChild(div);
        });
    } 
    else {
        console.error('Les annonces ne sont pas au format attendu.');
    }
})
.catch(error => {
    console.log("Erreur", error);
});

// Fonction pour convertir un ArrayBuffer en base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}


mesAnnonces.addEventListener("click", () => {
    window.location.href = 'http://127.0.0.1:5501/Frontend/Page_MesAnnonces/MesAnnonces.html';

})
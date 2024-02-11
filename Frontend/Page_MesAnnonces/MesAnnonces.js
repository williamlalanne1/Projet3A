const menuLogo = document.getElementById("menuLogo");
const cmLogo = document.getElementById("logo");
const popupMenu = document.getElementById("popupMenu");
const deconnexion = document.getElementById("deconnexion");
const monBoutton = document.getElementById("monBoutton");
const boutonAnnonce = document.getElementById("boutonAnnonce");
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


window.addEventListener("DOMContentLoaded", async (event) => {
    event.preventDefault();
    
    try {
        const token = localStorage.getItem('token');
        ;
        fetch('http://localhost:3000/annonces/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
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
    }
    catch (error) {
        console.log("Erreur", error);
    }

});

boutonAnnonce.addEventListener("click", () => {
    window.location.href='http://127.0.0.1:5501/Frontend/Page_Annonces/Annonces.html';
});

deconnexion.addEventListener("click", () => {
    
    const token = localStorage.getItem('token');

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
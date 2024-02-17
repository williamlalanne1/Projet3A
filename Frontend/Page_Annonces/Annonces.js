const menuLogo = document.getElementById("menuLogo");
const popupMenu = document.getElementById("popupMenu");
const deconnexion = document.getElementById("deconnexion");
const addAnnonces = document.getElementById("addAnnonces");
const mesAnnonces = document.getElementById('mesAnnonces');
const annonce = document.getElementsByClassName("annonce");
const annoncesContainer = document.getElementById("annoncesContainer");
var isOpen = false;


//Logique du meno déroulant
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


//Redirection vers la page de dépos d'annonces
addAnnonces.addEventListener("click", () => {
    window.location.href = 'http://127.0.0.1:5501/Frontend/Page_DeposAnnonce/form.html';
})


//Logique de deconnexion d'un utilisateur
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


//Récupération des annonces dans la base de données
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
        
            const parentElement = document.getElementById('annoncesContainer');
            const div = document.createElement('div');
            div.classList.add('annonce');
            div.setAttribute("id", `${annonce.id}`)
            
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



annoncesContainer.addEventListener("click", (event) => {
    console.log(event.target.parentElement)
    if (event.target.parentElement.classList.contains("annonce")) {
        const annonceElement = event.target.parentElement;
        const id = annonceElement.getAttribute("id");
        window.location.href= `/Frontend/Page_Annonce/Annonce.html?id=${id}`;
        console.log(id);
    }
})


mesAnnonces.addEventListener("click", () => {
    window.location.href = 'http://127.0.0.1:5501/Frontend/Page_MesAnnonces/MesAnnonces.html';
});


const menuLogo = document.getElementById("menuLogo");
const cmLogo = document.getElementById("logo");
const popupMenu = document.getElementById("popupMenu");
const deconnexion = document.getElementById("deconnexion");
const monBoutton = document.getElementById("monBoutton");
const boutonAnnonce = document.getElementById("boutonAnnonce");
const monProfil = document.getElementById("monProfil");
const boutonsSupprimer = document.getElementsByClassName("suppression");
console.log(boutonsSupprimer);
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

monProfil.addEventListener("click", () => {
    window.location.href='http://127.0.0.1:5501/Frontend/Page_Profil/Profil.html';
});


function formatDate(dateString) {
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    return formattedDay + '-' + formattedMonth + '-' + year;
};


//Fonction qui se lance au chargement de la page
window.addEventListener("DOMContentLoaded", async (event) => {
    event.preventDefault();
    
    try {
        const token = localStorage.getItem('token');
        ;
        fetch('http://localhost:3000/favoris', {
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
            if (Array.isArray(data.favoris)) {
                data.favoris.forEach(favori => {
                    const id = favori.id_annonce;
                    fetch(`http://localhost:3000/annonce/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            console.log(response.status);
                            throw new Error(`Erreur: ${response.status}`)
                        }
                        return response.json();
                    })
                    .then(data => {
                        const annonce = data.annonce;
                        const adresse = annonce.adresse;
                        const descriptif = annonce.descriptif;
                        const debut = formatDate(annonce.date_debut);
                        const fin = formatDate(annonce.date_fin);
                        const parentElement = document.getElementById('annoncesContainer');
                        const div = document.createElement('div');
                        div.classList.add('annonce');
                        div.setAttribute("id", `${annonce.id}`)
                        
                        div.innerHTML = `
                            <div class="annonceContainer">
                                <div class="imageDiv2">
                                    <img src="../../Backend/${annonce.image}" alt="Image de l'annonce" class="imageAnnonce">
                                </div>
                                <p class="titreAnnonce">${annonce.titre}</h2>
                                <p class="debutAnnonce">Du: ${debut}</p>
                                <p class="finAnnonce">Au: ${fin}</p>
                            </div>
                        `;
                        parentElement.appendChild(div);
                    });
                }) 
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
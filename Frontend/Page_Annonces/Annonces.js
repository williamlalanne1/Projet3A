const menuLogo = document.getElementById("menuLogo");
const popupMenu = document.getElementById("popupMenu");
const searchInput = document.getElementById("searchInput");
const deconnexion = document.getElementById("deconnexion");
const addAnnonces = document.getElementById("addAnnonces");
const mesAnnonces = document.getElementById('mesAnnonces');
const mesFavoris = document.getElementById("mesFavoris");
const annonce = document.getElementsByClassName("annonce");
const annoncesContainer = document.getElementById("annoncesContainer");
var checkbox = document.getElementById("radio-button");
var isOpen = false;


//Logique du meno déroulant
menuLogo.addEventListener("click", () => {
    if (!isOpen) {
        popupMenu.style.visibility='visible';
        isOpen = true;
    }
    else {
        popupMenu.style.visibility='hidden';
        isOpen = false;
    }
});




//Redirection vers la page de dépos d'annonces
addAnnonces.addEventListener("click", () => {
    window.location.href = 'http://127.0.0.1:5501/Frontend/Page_DeposAnnonce/form.html';
})

monProfil.addEventListener("click", () => {
    window.location.href = 'http://127.0.0.1:5501/Frontend/Page_Profil/Profil.html';
})

mesFavoris.addEventListener("click", () => {
    window.location.href = 'http://127.0.0.1:5501/Frontend/Page_Favoris/MesFavoris.html';
})


window.addEventListener("DOMContentLoaded",  (event) => {
    
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
                const date_debut = formatDate(annonce.date_debut);
                const date_fin = formatDate(annonce.date_fin);
                const parentElement = document.getElementById('annoncesContainer');
                const div = document.createElement('div');
                div.classList.add('annonce');
                div.setAttribute("id", `${annonce.id}`)
                
                div.innerHTML = `
                    <img src="../Images/pas-favoris.png" class="pas-favoris">
                    <img src="../../Backend/${annonce.image}" alt="Image de l'annonce" class="imageAnnonce">
                    
                    <h2 class="titreAnnonce">${annonce.titre}</h2>
                    <p class="debutAnnonce">Du: ${date_debut}</p>
                    <p class="finAnnonce">Au: ${date_fin}</p>
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
});


annoncesContainer.addEventListener("click", (event) => {
    console.log("clique sur l'annonce");
    if (event.target.classList.contains("imageAnnonce") || event.target.classList.contains("titreAnnonce") || event.target.classList.contains("debutAnnonce") || event.target.classList.contains("finAnnonce")) {
        
        event.stopPropagation();
        const annonceElement = event.target.parentElement;
        const id = annonceElement.getAttribute("id");
        window.location.href= `/Frontend/Page_Annonce/Annonce.html?id=${id}`;  
    }
})

document.addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("pas-favoris")) {
        const annonce = event.target.parentElement;
        const id = annonce.getAttribute("id");
        const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token');
            fetch('http://localhost:3000/favoris', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({id, email}),
            })
            .then(response => {
                if (!response) {
                    throw new Error(`Erreur lors de l'ajout aux favoris: ${response.status}`)
                }
                return response.json();
            })
            .then(data => {
                event.target.setAttribute('src', '../Images/favoris.png');
                event.target.classList.add("favoris");
                event.target.classList.remove("pas-favoris");
            })
            .catch(error => {
                console.error("Erreur lors de la requête pour ajouter une annonce aux favoris :", error);
            })
        })
        .catch(error => {
            console.log("Erreur", error);
        })
        
        
    }
    else if (event.target && event.target.classList.contains("favoris")) {

        const annonce = event.target.parentElement;
        const id_annonce = annonce.getAttribute("id");
        const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token');
            fetch('http://localhost:3000/favoris', {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({id_annonce, email}),
            })
            .then(response => {
                if (!response) {
                    throw new Error(`Erreur lors de l'ajout aux favoris: ${response.status}`)
                }
                return response.json();
            })
            .then(data => {
                event.target.setAttribute('src', '../Images/pas-favoris.png');
                event.target.classList.add("pas-favoris");
                event.target.classList.remove("favoris");
            })
            .catch(error => {
                console.error("Erreur lors de la requête pour ajouter une annonce aux favoris :", error);
            })
        })
        .catch(error => {
            console.log("Erreur", error);
        })   
    }
});

window.onload = chargerAnnoncesEtVerifierFavoris();

// Fonction pour charger les annonces et vérifier si elles sont dans les favoris de l'utilisateur
function chargerAnnoncesEtVerifierFavoris() {
    const token = localStorage.getItem('token');
    if (token) {
        fetch('http://localhost:3000/favoris', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur lors de la requête : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const favoris = data.favoris;
            
            const annonces = document.querySelectorAll('.annonce');
            
            annonces.forEach(annonce => {
                const id = parseInt(annonce.getAttribute('id'));
                const estDansLesFavoris = favoris.some(favori => favori.id_annonce === id);
                
                
                const image = annonce.querySelector('img:nth-child(1)');
                
                if (estDansLesFavoris) {
                    console.log("favorri");
                    image.setAttribute('src', '../Images/favoris.png');
                    //image.classList.add('favoris');
                } else {
                    console.log('pas');
                    image.setAttribute('src', '../Images/pas-favoris.png');
                    //image.classList.add('pas-favoris');
                }
            });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des favoris :", error);
        });
    }
}



function formatDate(dateString) {
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    return formattedDay + '-' + formattedMonth + '-' + year;
}


const token = localStorage.getItem('token');

function initMap() {
    fetch(`http://localhost:3000/annonces`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            console.log(res.status);
            throw new Error(`Erreur: ${response.status}`)
        }
        return response.json();
    })
    .then(data => {
        if (Array.isArray(data.annonces)) {
            const mapOptions = {
                zoom: 13,
                center: { lat: 43.300000, lng: 5.3700000 } 
            };

            const map = new google.maps.Map(document.getElementById('map'), mapOptions);

            data.annonces.forEach(annonce => {
                const adresse = annonce.adresse;
                const address = `${adresse}`;
                const date_debut = formatDate(annonce.date_debut);
                const date_fin = formatDate(annonce.date_fin);
                const geocoder = new google.maps.Geocoder();
                const id = annonce.id;

                function getInfo() {
                    return `
                        <div class="infoWindow">
                            <img src="../../Backend/${annonce.image}" alt="Image de l'annonce" class="imageAnnonceWindow">
                            <h2 class="titreAnnonceWindow">${annonce.titre}</h2>
                            <p class="debutAnnonceWindow">Du: ${date_debut}</p>
                            <p class="finAnnonceWindow">Au: ${date_fin}</p>
                        </div>
                    `;
                };

                geocoder.geocode({ address: address }, (results, status) => {
                    if (status === 'OK') {
                        const location = results[0].geometry.location;
                        const latitude = location.lat();
                        const longitude = location.lng();

                        const marker = new google.maps.Marker({
                            position: { lat: latitude, lng: longitude },
                            map: map,
                            title: address
                        });

                        marker.addListener('click', () => {
                            
                            const infoWindow = new google.maps.InfoWindow({
                                content: getInfo() 
                            });
                            
                            google.maps.event.addListenerOnce(infoWindow, 'domready', function() {
                                
                                const infoWindowElement = document.querySelector('.infoWindow');
                                console.log(infoWindowElement);
                        
                                infoWindowElement.addEventListener('click', function() {
                                    
                                    window.location.href= `/Frontend/Page_Annonce/Annonce.html?id=${id}`;
                                });
                            });

                            infoWindow.open(map, marker);
                        });
                    } else {
                        console.error('Erreur de géocodage:', status);
                    }
                });
            });
        }
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des données d\'annonces:', error);
    });
};


//recherche dans la barre
searchInput.addEventListener("input", (event) => {
    const annonces = document.querySelectorAll(".annonce");
    var searchValue = event.target.value.toLowerCase();
    console.log("clique sur la barre");
    annonces.forEach((annonce) => {
        const titreAnnonce = annonce.querySelector(".titreAnnonce").textContent.toLowerCase();
        console.log(titreAnnonce);
        
        if (titreAnnonce.includes(searchValue)) {
            
            annonce.style.display = "flex";
        } else {
            
            annonce.style.display = "none";
        }
    });

});


mesAnnonces.addEventListener("click", () => {
    window.location.href = 'http://127.0.0.1:5501/Frontend/Page_MesAnnonces/MesAnnonces.html';
});


checkbox.addEventListener('click', () => {
    if (checkbox.checked == true) {
        console.log("checked");
        document.getElementById("map").classList.remove("hiddenMap");
        document.getElementById("map").classList.add("visibleMap");
        document.getElementById("annoncesContainer").classList.remove("annoncesContainer");
        document.getElementById("annoncesContainer").classList.add("annoncesContainerHidden");
        document.getElementById("carte_des_annonces").innerText="Voir la cartes des annonces";
        document.getElementById("carte_des_annonces").innerText="Revenir à la liste des annonces";
    }
    else {
        document.getElementById("map").classList.remove("visibleMap");
        document.getElementById("map").classList.add("hiddenMap");
        document.getElementById("annoncesContainer").classList.remove("annoncesContainerHidden");
        document.getElementById("annoncesContainer").classList.add("annoncesContainer");
        document.getElementById("carte_des_annonces").innerText="Voir la cartes des annonces";
    }
});



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
                    const id = String(favori.id_annonce);
                    console.log(typeof id);
                    console.log(id);
                    const annonce = document.getElementById(id);
                    console.log(annonce);
                    const image = annonce.querySelector(".pas-favoris");
                    image.src='../Images/favoris.png';
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

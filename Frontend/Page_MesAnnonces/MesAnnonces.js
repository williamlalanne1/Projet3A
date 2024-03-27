const menuLogo = document.getElementById("menuLogo");
const cmLogo = document.getElementById("logo");
const popupMenu = document.getElementById("popupMenu");
const deconnexion = document.getElementById("deconnexion");
const monBoutton = document.getElementById("monBoutton");
const boutonAnnonce = document.getElementById("boutonAnnonce");
const monProfil = document.getElementById("monProfil");
const mesFavoris = document.getElementById("mesFavoris");
const boutonsSupprimer = document.getElementsByClassName("suppression");
const modificationForm = document.getElementById("modificationForm");
const modifPopup = document.getElementById("modif-annonce-popup");
const popupOverlay = document.getElementById("popupOverlay");
const token = localStorage.getItem('token');
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

mesFavoris.addEventListener("click", () => {
    window.location.href = 'http://127.0.0.1:5501/Frontend/Page_Favoris/MesFavoris.html';
})

popupOverlay.addEventListener("click", ()=> {
    modifPopup.classList.remove("open");
})

function formatDate(dateString) {
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    return year + '-' + formattedMonth + '-' + formattedDay;
}

window.addEventListener("DOMContentLoaded", async (event) => {
    event.preventDefault();
    
    try {
        
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
                    const date_debut = formatDate(annonce.date_debut);
                    const date_fin = formatDate(annonce.date_fin);
                    const parentElement = document.getElementById('annoncesContainer');
                    const div = document.createElement('div');
                    div.classList.add("annonce");
                    div.setAttribute("id", `${annonce.id}`)
                    
                    div.innerHTML = `
                    <div class="annonceInfo">
                        <img src="../../Backend/${annonce.image}" alt="Image de l'annonce" class="imageAnnonce">
                        <h2 class="titreAnnonce">${annonce.titre}</h2>
                        <p class="debutAnnonce">${date_debut}</p>
                        <p class="finAnnonce">${date_fin}</p>
                    </div>
                    <div class="boutonsContainer">
                        <Button class="voir">Voir l'annonce</Button>
                        <Button id=${annonce.id} class="suppression">Supprimer</Button>
                        <Button class="modifier">Modifier</Button>
                    </div>
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


document.addEventListener('click', function(event) {

    if (event.target && event.target.classList.contains('suppression')) {
        console.log('suppression');
        const annonceId = event.target.parentElement.parentElement.id;
        
        fetch(`http://localhost:3000/annonce`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({annonceId: annonceId})
        })
        .then(response => {
            if (!response) {
                console.log(response.status);
                throw new Error(`annonce pas supprimé: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const annonce = document.getElementById(annonceId);
            annonce.innerHTML="";
            this.location.reload();
        })
    }

    if (event.target && event.target.classList.contains('voir')) {
        const annonceId = event.target.parentElement.parentElement.id;
        window.location.href= `/Frontend/Page_Annonce/Annonce.html?id=${annonceId}`;
        console.log(annonceId);
    }

    if(event.target && event.target.classList.contains('modifier')) {
        const id = event.target.parentElement.parentElement.id;
        modifPopup.classList.add('open');
        
        fetch(`http://localhost:3000/annonce/${id}`, {
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
            const annonce = data.annonce;
            const titre = annonce.titre;
            const descriptif = annonce.descriptif;
            const adresse = annonce.adresse;
            console.log(adresse);
            const debut = annonce.date_debut;
            const fin = annonce.date_fin;
            const image = annonce.image;
            document.getElementById("titre").setAttribute('value', titre);
            document.getElementById("descriptif").setAttribute('value', descriptif);
            document.getElementById("adresse").setAttribute('value', adresse);
            document.getElementById("debut").setAttribute('value', debut);
            document.getElementById("fin").setAttribute('value', fin);
            const div = document.querySelector('.modificationPopupElementPhoto');
            div.innerHTML = `
                <div class="modificationPopupElementPhoto">
                    <label class="modifitionLabel" for="image">Image de l'annonce</label>
                    <div class="nouvellePhoto">
                        <img src="../../Backend/${image}" alt="Image de l'annonce" class="modifProfilImage" id="imagePreview">
                        <input class="modificationInput" id="image" type="file" placeholder="Photo de profil">
                    </div>
                </div>  
            `;
            document.getElementById('image').addEventListener('change', function(event) {
                const nouvellePhoto = event.target.files[0]; 
                const photoPreview = document.getElementById('imagePreview'); 
            
                if (nouvellePhoto) {
                    const reader = new FileReader(); 
                    reader.onload = function() {
                        photoPreview.src = reader.result;
                    }
                    reader.readAsDataURL(nouvellePhoto);
                }
            });
            modificationForm.addEventListener("submit", async (event) => {
                event.preventDefault();
                
                const titre = document.getElementById("titre").value;
                const descriptif = document.getElementById("descriptif").value;
                const adresse = document.getElementById("adresse").value;
                const debut = document.getElementById("debut").value;
                const fin = document.getElementById("fin").value;
                const imageFile = document.getElementById("image").files[0];
                let imagePath;
            
                if (imageFile) {
                    const formData = new FormData();
                    formData.append('image', imageFile);
                    
                    try {
                        const uploadResponse = await fetch("http://localhost:3000/upload", {
                            method: 'POST',
                            body: formData,
                        });
            
                        if (!uploadResponse.ok) {
                            throw new Error(`Erreur lors du téléchargement de l'image: ${uploadResponse.status}`);
                        }
            
                        imagePath = await uploadResponse.text();
                        
                        
                    } 
                    catch (error) {
                        console.error("Erreur lors du téléchargement de l'image :", error);
                    }
                }
                else {
                    console.log("aucune image");
                }
            
                try {
                    
                    const patchResponse = await fetch('http://localhost:3000/annonce', {
                        method: 'PATCH', 
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({titre, descriptif, adresse, debut, fin, image: imagePath, id}),
                    });
                    if (!patchResponse.ok) {
                        throw new Error(`Erreur lors de la modification: ${patchResponse.status}`);
                    }
            
                    const data = await patchResponse.json();
                    console.log(data.body);
                    
                    document.getElementById("modif-annonce-popup").classList.remove("open");
                    
                } catch (error) {
                    console.error("Erreur lors de la modification de l'annonce :", error);
                    
                }
            
            });
        })

    }
});



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


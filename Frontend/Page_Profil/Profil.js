const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const token = localStorage.getItem('token');
const deconnexion = document.getElementById("deconnexion");
const boutonAnnonce = document.getElementById("boutonAnnonce");
const mesAnnonces = document.getElementById('mesAnnonces');
const monProfil = document.getElementById("monProfil");
const mesFavoris = document.getElementById("mesFavoris");
const menuLogo = document.getElementById("menuLogo");
const cmLogo = document.getElementById("logo");
const popupMenu = document.getElementById("popupMenu");
const facebookLink = document.getElementById("facebookLink");
const modificationPopup = document.getElementById("modif-info-popup");
const popupOverlay = document.getElementById('popupOverlay');
var isOpen = false;
const modifBouton = document.getElementById("modifBouton");
const modificationButton = document.getElementById("modificationButton");


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

mesFavoris.addEventListener("click", () => {
    window.location.href = 'http://127.0.0.1:5501/Frontend/Page_Favoris/MesFavoris.html';
})

popupOverlay.addEventListener('click', () => {
    modificationPopup.classList.remove('open');
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
    const facebook = profil.facebook;
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
            <div class="facebookDiv">
                <p> Facebook: </p> 
                <a href="${facebook}" id="facebookLink" class="facebookLink">${facebook}</a>
            </div>
        </div>
        `;
   
})
.catch(error => {
    console.log("Erreur", error);
})



modifBouton.addEventListener("click", () => {
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
        const prenom = profil.prenom;
        const nom = profil.nom;
        const adresse = profil.adresse;
        const photo = profil.image;
        const facebook = profil.facebook;
        const prenom_input = document.getElementById('prenom');
        const nom_input = document.getElementById("nom");
        const adresse_input = document.getElementById("adresse");
        const photo_input = document.getElementById("photo");
        const facebook_input = document.getElementById("facebook");
        const div = document.querySelector('.modificationPopupElementPhoto');
        prenom_input.setAttribute('value', prenom);
        nom_input.setAttribute('value', nom);
        adresse_input.setAttribute('value', adresse);
        facebook_input.setAttribute('value', facebook);
        div.innerHTML = `
                <label class="modifitionLabel" for="photoInput">Photo de profil</label>
                <div class="nouvellePhoto">
                    <img src="../../Backend/${photo}" alt="Image de l'annonce" class="modifProfilImage" id="image">
                    <input class="modificationInput" id="photoInput" type="file" placeholder="Photo de profil">
                </div>
        `;
        document.getElementById('photoInput').addEventListener('change', function(event) {
            const nouvellePhoto = event.target.files[0]; 
            const photoPreview = document.getElementById('image'); 
        
            if (nouvellePhoto) {
                const reader = new FileReader(); 
                reader.onload = function() {
                    photoPreview.src = reader.result;
                }
                reader.readAsDataURL(nouvellePhoto);
            }
        });

    })
    .catch(error => {
        console.log("Erreur", error);
    })
    document.getElementById("modif-info-popup").classList.add("open");
});


modificationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const prenom = document.getElementById('prenom').value;
    const nom = document.getElementById('nom').value;
    const facebook = document.getElementById('facebook').value;
    const adresse = document.getElementById('adresse').value;
    const imageFile = document.getElementById('photoInput').files[0];
    let imagePath;

    if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        try {
            const uploadResponse = await fetch("http://localhost:3000/profil", {
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
    } else {
        
        imagePath = 'profil/defaut.png'; 
    }

    if (prenom && nom && adresse) {
        try {
            const patchResponse = await fetch('http://localhost:3000/profil', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({prenom, nom, facebook, adresse, image: imagePath}),
            });

            if (!patchResponse.ok) {
                throw new Error(`Erreur lors de la modification: ${patchResponse.status}`);
            }

            const data = await patchResponse.json();
            console.log(data.body);
            
            document.getElementById("modif-info-popup").classList.remove("open");
            
        } catch (error) {
            console.error("Erreur lors de la modification du profil :", error);
            
        }
    } else {
        console.log("Certains champs sont vides !");
    }
});


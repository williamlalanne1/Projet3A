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

monProfil.addEventListener("click", () => {
    window.location.href='http://127.0.0.1:5501/Frontend/Page_Profil/Profil.html';
});

boutonAnnonce.addEventListener("click", () => {
    window.location.href='http://127.0.0.1:5501/Frontend/Page_Annonces/Annonces.html';
});

mesAnnonces.addEventListener("click", () => {
    window.location.href = 'http://127.0.0.1:5501/Frontend/Page_MesAnnonces/MesAnnonces.html';
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

function formatDate(dateString) {
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    return formattedDay + '-' + formattedMonth + '-' + year;
}

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
    const parentElement = document.getElementById('annonceContainer');
    const div = document.createElement('div');
    div.classList.add('annonce');
    const date_debut = formatDate(annonce.date_debut);
    const date_fin = formatDate(annonce.date_fin);
    
            
    div.innerHTML = `
        <img src="../../Backend/${annonce.image}" alt="Image de l'annonce" class="imageAnnonce">
        <h2 class="titreAnnonce">${annonce.titre}</h2>
        <p class="descriptif"> Descriptif : ${annonce.descriptif}</h2>
        <p class="debutAnnonce">Du : ${ date_debut  } Au : ${ date_fin}</p>
    `;
    parentElement.appendChild(div);
})

fetch(`http://localhost:3000/annonce/${id}/profil`, {
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
    const deposeurProfil = data.profil;
    const email = deposeurProfil.email;
    const prenom = deposeurProfil.prenom;
    const facebook = deposeurProfil.facebook;
    const adresse = deposeurProfil.adresse;
    const div = document.getElementById('profilContainer');
    
             
    div.innerHTML = `
        <div class="imageContainer">
            <img src="../../Backend/${deposeurProfil.image}" alt="Image de l'annonce" class="profilImage">
        </div>
        <div class="informationsContainer">
            <h2 class="annonceDeposeur">Annonce déposée par : ${prenom}</h2>
            <p> Email : ${email}</p>
            <div id = "facebookDiv">
                <p> Facebook : </p>
                <a href="${facebook}"><img src="../Images/facebook-logo.png"  style="width:75px;height:42px;"></a>
            </div>
            <p> Adresse : ${adresse}</p>
        </div>
        `;
    
})
.catch(error => {
    console.log("Erreur", error);
})


function initMap() {

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
        const adresse = annonce.adresse;
        const address = `${adresse}`;

        
        const geocoder = new google.maps.Geocoder();

        
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK') {
                
                const location = results[0].geometry.location;
                const latitude = location.lat();
                const longitude = location.lng();

                const mapOptions = {
                    center: { lat: latitude, lng: longitude },
                    zoom: 16
                };

                const map = new google.maps.Map(document.getElementById('map'), mapOptions);

                const marker = new google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map: map,
                    title: address
                });
            } else {
                console.error('Erreur de géocodage:', status);
            }
        });
    })    
};

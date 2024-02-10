const titre = document.getElementById("annonceTitle");

const descriptif = document.getElementById("annonceDescription");

const date_debut = document.getElementById("beginningDate");

const date_fin = document.getElementById("endDate");

const adresse = document.getElementById("adress");

const file = document.getElementById("file");

const annoncesForm = document.getElementById("annoncesForm");

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

titre.addEventListener("blur", ($event) => {
    if ($event.target.value==="") {
        titre.style.border=('solid red');
    }
    else {
        titre.style.border=('solid green');
    }
});

descriptif.addEventListener("blur", ($event) => {
    if ($event.target.value==="") {
        descriptif.style.border=('solid red');
    }
    else {
        descriptif.style.border=('solid green');
    }
    
});

date_debut.addEventListener("blur", ($event) => {
    if ($event.target.value==="") {
        date_debut.style.border=('solid red');
    }
    else {
        date_debut.style.border=('solid green');
    }
});

date_fin.addEventListener("blur", ($event) => {
    if ($event.target.value==="") {
        date_fin.style.border=('solid red');
    }
    else {
        date_fin.style.border=('solid green');
    }
});

adresse.addEventListener("blur", ($event) => {
    if ($event.target.value==="") {
        adresse.style.border=('solid red');
    }
    else {
        adresse.style.border=('solid green');
    }
    
});

file.addEventListener("change", () => {
    if(file.value === '') {
        fileInputLabel.value ='Choose';
    }
} )

submit.addEventListener("click", () => {
    if(titre.value==='') {
        
    }
})


annoncesForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("appuie bouton");

    try {
        // Récupérer le token d'authentification stocké côté client
        const token = localStorage.getItem('token'); // Assurez-vous que le token est stocké correctement
        ;
        // Récupérer les autres données du formulaire
        const titre1 = titre.value;
        const descriptif1 = descriptif.value;
        const adresse1 = adresse.value;
        const debut1 = date_debut.value;
        const fin1 = date_fin.value;

        // Récupérer le fichier image sélectionné par l'utilisateur
        const imageFile = document.getElementById('file').files[0];
        
        // Créer un objet FormData et y ajouter le fichier image
        const formData = new FormData();
        formData.append('image', imageFile);

        // Envoyer le fichier image au serveur pour téléchargement
        const uploadResponse = await fetch("http://localhost:3000/upload", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        if (!uploadResponse.ok) {
            throw new Error(`Erreur lors du téléchargement de l'image: ${uploadResponse.status}`);
        }

        // Récupérer le chemin de l'image téléchargée depuis la réponse du serveur
        const imagePath = await uploadResponse.text();

        // Envoyer les autres données du formulaire avec le chemin de l'image au serveur pour créer l'annonce
        const createAnnounceResponse = await fetch("http://localhost:3000/annonces", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ titre: titre1, descriptif: descriptif1, debut: debut1, fin: fin1, adresse: adresse1, imagePath }),
        });

        if (!createAnnounceResponse.ok) {
            throw new Error(`Erreur lors de la création de l'annonce: ${createAnnounceResponse.status}`);
        }

        const responseData = await createAnnounceResponse.json();

        // Rediriger l'utilisateur vers une autre page ou effectuer d'autres actions après la création de l'annonce
        window.location.href = 'http://127.0.0.1:5501/Frontend/Page_Annonces/Annonces.html';
    }
    catch (error) {
        console.error("Erreur lors de la requête pour créer une annonce :", error);
    }
});







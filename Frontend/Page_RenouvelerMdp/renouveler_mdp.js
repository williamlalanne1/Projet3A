const menuLogo = document.getElementById("menuLogo");
const popupMenu = document.getElementById("popupMenu");
const cmLogo = document.getElementById("logo");
var isOpen = false;

const emailButton = document.getElementById("emailButton");

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

cmLogo.addEventListener("click", () => {
    window.location.href = "../Page_Accueil/accueil.html";
});

emailButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    
    fetch('http://localhost:3000/mot-de-passe-oublie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            //'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({email})
    })
    .then(response => {
        if (!response) {
            console.log("erreur lors du changement de mdp");
            throw new Error(`Erreur lors du changemnt de mdp: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {

    })
    .catch(error => {
        console.error(error);
    })
});
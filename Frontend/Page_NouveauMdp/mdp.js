const menuLogo = document.getElementById("menuLogo");
const popupMenu = document.getElementById("popupMenu");
const cmLogo = document.getElementById("logo");
var isOpen = false;

const passwordForm = document.getElementById("new-password-form");
const email = document.getElementById("email");
const password = document.getElementById("mdp");
const passwordConf = document.getElementById("mdpConfirmation");

//const token = localStorage.getItem('token');

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

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

var token = getParameterByName('token');


function getEmail() {
    fetch(`http://localhost:3000/email/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération de l'email: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const userEmail = data.email;
        return userEmail;
    })
    .catch(error => {
        console.error(error);
    });
}

function validateEmail() {
    const userEmail = getEmail();
    console.log(token);
    return fetch(`http://localhost:3000/email/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération de l'email: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const userEmail = data.email;
        console.log(userEmail);

        if (email.value === userEmail) {
            console.log("Email valide !");
            return true;
        } else {
            console.log("Email non valide !");
            return false;
        }
    })
    .catch(error => {
        console.error(error);
        return false;
    });
};



function validatePassword() {

    if(password.value===passwordConf.value) {
        mdpConfirmation.style.borderColor='green';
        mdp.style.borderColor='green';
        return true;
    }
    else {
        document.getElementById("confirmationDiv").innerHTML=`
            <label for="mdpConfirmation">Confirmer nouveau mot de passe*</label>
            <input type='password' id="mdpConfirmation" placeholder="Confirmer mot de passe">
            <p class="errorMessage">Les mots de passes sont différents</p>
            `;
        mdp.style.borderColor='red';
        mdpConfirmation.style.borderColor='red';
        return false;

    }
    

}

passwordForm.addEventListener("submit", (event) => {
    const email = getEmail();
    const mot_de_passe = document.getElementById("mdp").value;
    const mdpConfirmation = document.getElementById("mdpConfirmation").value;
    event.preventDefault();

    if (validateEmail()) {
    
        fetch("http://localhost:3000/inscription", {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, mot_de_passe, mdpConfirmation}),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur lors de la requête POST: ${response.status}`);
            }
            return response.json();
        })  
        .then(data => {
            
            window.location.href = "../Page_Accueil/accueil.html"
        })
            
        .catch (error => {
            console.error("Erreur :", error);
        })
    }

    else {
        const emailInput = document.getElementById("emailInput");
        emailInput.innerHTML = `
            <label for="email">Email*</label>
            <input type="text" id="email" placeholder="Email">
            <p class="errorMessage">Email incorrect</p>
            `;
    }
    validatePassword();
})
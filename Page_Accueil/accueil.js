const inscriptionButton = document.getElementById("inscriptionButton");
const inscriptionButtonMiddle = document.getElementById("inscriptionButtonMiddle");
const inscriptionPopup = document.getElementById("inscriptionPopup");

const connexionPopup = document.getElementById("connexionPopup");
const connexionButton = document.getElementById('connexionButton');

const popupOverlay1 = document.getElementById('popupOverlay1');
const popupOverlay2 = document.getElementById('popupOverlay2');

const nouveauCompteLink = document.getElementById('nouveauCompte');
const connectLink = document.getElementById("connectLink");
const mdpOublieLink = document.getElementById("mdpOublie");

inscriptionButton.addEventListener("click", () =>{
    console.log("ok");
    inscriptionPopup.classList.add('open');
});

popupOverlay2.addEventListener("click", () => {
    inscriptionPopup.classList.remove('open');
});


connexionButton.addEventListener("click", () => {
        connexionPopup.classList.add('open');
});

popupOverlay1.addEventListener("click", () => {
        connexionPopup.classList.remove('open');  
});

inscriptionButtonMiddle.addEventListener("click", () => {
    inscriptionPopup.classList.add('open');
});

nouveauCompteLink.addEventListener("click", () => {
    connexionPopup.classList.remove('open');
    inscriptionPopup.classList.add('open');
});

connectLink.addEventListener("click", () => {
    connexionPopup.classList.add('open');
    inscriptionPopup.classList.remove('open');
})

mdpOublieLink.addEventListener("click", () => {
    window.location.href = "../Page_ChangementMdp/mdp.html";
});





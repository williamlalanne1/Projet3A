const menuLogo = document.getElementById("menuLogo");
const popupMenu = document.getElementById("popupMenu");
var isOpen = false;

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


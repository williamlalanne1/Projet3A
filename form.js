const title = document.getElementById("annonceTitle");

const description = document.getElementById("annonceDescription");

const beginDate = document.getElementById("beginningDate");

const endDate = document.getElementById("endDate");

const city = document.getElementById("city");

const compensation = document.getElementById("compensation");

const file = document.getElementById("file");

const fileInputLabel = document.getElementById('file-input-label',);

const submit = document.getElementById("submiy");

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

title.addEventListener("blur", ($event) => {
    if ($event.target.value==="") {
        title.style.border=('solid red');
    }
    else {
        title.style.border=('solid green');
    }
});

description.addEventListener("blur", ($event) => {
    if ($event.target.value==="") {
        description.style.border=('solid red');
    }
    else {
        description.style.border=('solid green');
    }
    
});

beginDate.addEventListener("blur", ($event) => {
    if ($event.target.value==="") {
        beginDate.style.border=('solid red');
    }
    else {
        beginDate.style.border=('solid green');
    }
});

endDate.addEventListener("blur", () => {
    endDate.style.border=('solid red');
});

city.addEventListener("blur", ($event) => {
    if ($event.target.value==="") {
        city.style.border=('solid red');
    }
    else {
        city.style.border=('solid green');
    }
    
});

compensation.addEventListener("blur", ($event) => {
    if ($event.target.value==="") {
        compensation.style.border=('solid red');
    }
    else {
        compensation.style.border=('solid green');
    }
    
});

file.addEventListener("change", () => {
    if(file.value === '') {
        fileInputLabel.value ='Choose';
    }
} )

submit.addEventListener("click", () => {
    if(title.value==='') {
        
    }
})



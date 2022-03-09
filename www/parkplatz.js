window.addEventListener("load", function (event) {
    console.log("Seite geladen.")
    checkDarkmode();
    document.getElementById("darkmode_dark").addEventListener("click", darkmode_set_dark)
    document.getElementById("darkmode_light").addEventListener("click", darkmode_set_light)
    window.addEventListener('hashchange', navigate)
    navigate();
})

// Licht aus: Dark Mode aktivieren
function darkmode_set_dark() {
    document.getElementById("darkmode_light").classList.remove("invisible")
    document.getElementById("darkmode_dark").classList.add("invisible");
    document.getElementById("page_header").classList.add("dark");
    document.getElementById("page_nav").classList.add("dark");
    document.getElementById("page_body").classList.add("dark");
    document.getElementById("page_main").classList.add("dark");
    document.getElementById("page_footer").classList.add("dark");

    let links = document.getElementsByClassName("link");
    for (let i = 0, il = links.length; i < il; i++) {
        links[i].classList.add("dark");
    }
    let alinks = document.getElementsByClassName("a");
    for (let i = 0, il = alinks.length; i < il; i++) {
        alinks[i].classList.add("dark");
    }
    let btns = document.getElementsByTagName("button");
    for (let i = 0, il = btns.length; i < il; i++) {
        btns[i].classList.add("dark");
    }
    let input = document.getElementsByTagName("input");
    for (let i = 0, il = input.length; i < il; i++) {
        input[i].classList.add("dark");
    }
    let icon_body = document.getElementsByClassName("icon_body");
    for (let i = 0, il = icon_body.length; i < il; i++) {
        icon_body[i].classList.add("dark");
    }

    document.cookie = "darkmode=true";
    document.getElementById("page_nav").classList.remove("responsive");
    console.log("Lights off.")
}

// Licht an: Dark Mode deaktivieren
function darkmode_set_light() {
    document.getElementById("darkmode_dark").classList.remove("invisible")
    document.getElementById("darkmode_light").classList.add("invisible");
    document.getElementById("page_header").classList.remove("dark");
    document.getElementById("page_nav").classList.remove("dark");
    document.getElementById("page_body").classList.remove("dark");
    document.getElementById("page_main").classList.remove("dark");
    document.getElementById("page_footer").classList.remove("dark");

    let links = document.getElementsByClassName("link");
    for (let i = 0, il = links.length; i < il; i++) {
        links[i].classList.remove("dark");
    }
    let alinks = document.getElementsByClassName("a");
    for (let i = 0, il = alinks.length; i < il; i++) {
        alinks[i].classList.remove("dark");
    }
    let btns = document.getElementsByTagName("button");
    for (let i = 0, il = btns.length; i < il; i++) {
        btns[i].classList.remove("dark");
    }
    let input = document.getElementsByTagName("input");
    for (let i = 0, il = input.length; i < il; i++) {
        input[i].classList.remove("dark");
    }
    let icon_body = document.getElementsByClassName("icon_body");
    for (let i = 0, il = icon_body.length; i < il; i++) {
        icon_body[i].classList.remove("dark");
    }

    document.cookie = "darkmode=false";
    document.getElementById("page_nav").classList.remove("responsive");
    console.log("Lights on.")
}

// Hilfsfunktion: Cookie auslesen
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Hilfsfunktion: checken, ob der Darkmode im Cookie festgelegt wurde 
function checkDarkmode() {
    let darkmode = getCookie("darkmode");
    console.log("Cookie für Darkmode: " + darkmode);
    if (darkmode == "true") {
        darkmode_set_dark();
    } else {
        darkmode_set_light();
    }
}

// Funktion für das Burger-Menü.
function menuFunction() {
    document.getElementById("page_nav").classList.toggle("responsive");
}

// Navigationsleiste mit Funktion ausstatten
function navigate() {
    console.log("Wechsle zu Section: ", location.hash)
    if (location.hash == '#home') {
        showSection('home')
    } else if (location.hash == '#request') {
        showSection('class_request')
    } else if (location.hash == '#offer') {
        showSection('class_offer')
    } else if (location.hash == '#reservations') {
        showSection('class_reservations')
    } else if (location.hash == '#about') {
        showSection('about')
    } else {
        showSection('home')
    }
    // Burger-Menü einklappen
    document.getElementById("page_nav").classList.remove("responsive");
    checkDarkmode();
}

// Sektion einblenden, andere Sektionen ausblenden
function showSection(name) {
    for (let e of document.getElementsByTagName("section")) {
        if (e.classList.contains(name)) {
            e.classList.remove('invisible')
            loadPage(e.id, e)
            checkDarkmode();
        } else {
            e.classList.add('invisible')
        }
        //Generelle Sektionen anzeigen
        if (e.classList.contains("general")) {
            e.classList.remove('invisible')
        }
    }
}

// lädt die Seite nach
function loadPage(name, e) {
    // Check ob schon geladen
    if (e.querySelectorAll('*').length === 0) {
        if (getCookie("darkmode")){
            e.innerHTML = "<p align='center'><i class='fas fa-cog fa-spin fa-lg dark'></i></p>";
        } else{
            e.innerHTML = "<p align='center'><i class='fas fa-cog fa-spin fa-lg'></i></p>";
        }

        fetch(`pages/${name}.html`)
            .then(res => res.text())
            .then(html => {
                e.innerHTML = html

                fetch(`pages/${name}.js`)
                    .then(res => res.text())
                    .then(js => eval(js))

            })
    }
}
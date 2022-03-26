window.addEventListener("load", function (event) {
    checkDarkmode();
    document.getElementById("darkmode_dark").addEventListener("click", darkmode_set_dark)
    document.getElementById("darkmode_light").addEventListener("click", darkmode_set_light)
    window.addEventListener('hashchange', navigate)
    navigate();
    checklogin();
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

    let div = document.getElementsByTagName("div");
    for (let i = 0, il = div.length; i < il; i++) {
        div[i].classList.add("dark");
    }
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
    let labels = document.getElementsByTagName("label");
    for (let i = 0, il = labels.length; i < il; i++) {
        labels[i].classList.add("dark");
    }
    let input = document.getElementsByTagName("input");
    for (let i = 0, il = input.length; i < il; i++) {
        input[i].classList.add("dark");
    }
    let select = document.getElementsByTagName("select");
    for (let i = 0, il = select.length; i < il; i++) {
        select[i].classList.add("dark");
    }
    let icon_body = document.getElementsByClassName("icon_body");
    for (let i = 0, il = icon_body.length; i < il; i++) {
        icon_body[i].classList.add("dark");
    }

    document.cookie = "darkmode=true";
    document.getElementById("page_nav").classList.remove("responsive");
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

    let div = document.getElementsByTagName("div");
    for (let i = 0, il = div.length; i < il; i++) {
        div[i].classList.remove("dark");
    }
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
    let labels = document.getElementsByTagName("label");
    for (let i = 0, il = labels.length; i < il; i++) {
        labels[i].classList.remove("dark");
    }
    let input = document.getElementsByTagName("input");
    for (let i = 0, il = input.length; i < il; i++) {
        input[i].classList.remove("dark");
    }
    let select = document.getElementsByTagName("select");
    for (let i = 0, il = select.length; i < il; i++) {
        select[i].classList.remove("dark");
    }
    let icon_body = document.getElementsByClassName("icon_body");
    for (let i = 0, il = icon_body.length; i < il; i++) {
        icon_body[i].classList.remove("dark");
    }

    document.cookie = "darkmode=false";
    document.getElementById("page_nav").classList.remove("responsive");
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
    if (location.hash == '#home') {
        showSection('home')
    } else if (location.hash == '#request') {
        showSection('class_request')
    } else if (location.hash == '#offer') {
        showSection('class_offer')
    } else if (location.hash == '#reservations') {
        showSection('class_reservations')
    } else if (location.hash == '#myspots') {
        showSection('class_myspots')
    } else if (location.hash == '#about') {
        showSection('about')
    } else if (location.hash == '#profile') {
        showSection('profile')
    } else if (location.hash == '#register') {
        showSection('register')
    }else {
        showSection('home')
    }
    // Burger-Menü einklappen
    document.getElementById("page_nav").classList.remove("responsive");
}

// Sektion einblenden, andere Sektionen ausblenden
function showSection(name) {
    for (let e of document.getElementsByTagName("section")) {
        if (e.classList.contains(name)) {
            e.classList.remove('invisible')
            loadPage(e.id, e)
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
            //load page into section
            .then(res => res.text())
            .then(html => {
                e.innerHTML = html

                //add js file to add functionality
                fetch(`pages/${name}.js`)
                    .then(res => res.text())
                    .then(js => eval(js))
            })
    }
}

// Funktion mit der Elemente abhängig vom Login ein- und ausgeblendet werden
function checklogin() {
    let cookie_userid = getCookie("cookie_username")
    let cookie_sessionid = getCookie("cookie_session")

    if ((cookie_userid && cookie_sessionid)){
        //Login vorhanden? Validität der Daten checken
        fetch(`/login_session/${cookie_userid}/${cookie_sessionid}`)
        .then(res => {
            if(res.status="200") {
                document.getElementById("nav_request").classList.remove("invisible")
                document.getElementById("nav_offer").classList.remove("invisible")
                document.getElementById("nav_myspots").classList.remove("invisible")
                document.getElementById("nav_reservation").classList.remove("invisible")
            }
            else{
                console.log("Session invalid. Please log in.");
                document.cookie = "cookie_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "cookie_username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.getElementById("nav_request").classList.add("invisible")
                document.getElementById("nav_offer").classList.add("invisible")
                document.getElementById("nav_myspots").classList.add("invisible")
                document.getElementById("nav_reservation").classList.add("invisible")
            }
        })
    } else {
        console.log("No login data found.");
        document.getElementById("nav_request").classList.add("invisible")
        document.getElementById("nav_offer").classList.add("invisible")
        document.getElementById("nav_myspots").classList.add("invisible")
        document.getElementById("nav_reservation").classList.add("invisible")
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

async function pp_registered() {
    fetch(`/get_parkingspots/${getCookie("cookie_username")}/${getCookie("cookie_session")}`)
    .then(response => response.json())
    .then(myspots => {
        if(myspots.statuscode.status == 200){
            document.getElementById("nr_registered_spots").innerText = myspots.doc.length
        }
        checkDarkmode();
    })
}
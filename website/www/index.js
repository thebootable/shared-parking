window.addEventListener("load", function (event) {
    checkDarkmode();
    document.getElementById("darkmode_dark").addEventListener("click", darkmode_set_dark)
    document.getElementById("darkmode_light").addEventListener("click", darkmode_set_light)
    window.addEventListener('hashchange', navigate)
    navigate();
    checklogin();
})

// lights off: enable dark-mode. This adds the "dark"-class to different elements
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

    document.cookie = "darkmode=true"; //set cookie to true so lazy-loaded elements can get formatted too
    document.getElementById("page_nav").classList.remove("responsive"); //hide the burger-menu again. This only has an effect if the page is in mobile layout
}

// lights on: disable dark-mode. This removes the "dark"-class to different elements
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

    document.cookie = "darkmode=false"; //set cookie to false so lazy-loaded elements can get formatted too
    document.getElementById("page_nav").classList.remove("responsive"); //hide the burger-menu again. This only has an effect if the page is in mobile layout
}

// helper-function: read a specific cookie. This just loops over all cookies to return the specific one
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// helper-function: check, if darkmode is set in the corresponding cookie
function checkDarkmode() {
    let darkmode = getCookie("darkmode");
    if (darkmode == "true") {
        darkmode_set_dark();
    } else {
        darkmode_set_light();
    }
}

// add functionality to the burger-menu
function menuFunction() {
    document.getElementById("page_nav").classList.toggle("responsive");
}

// adds functionality to the navigation bar
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
    // hide burger-menu
    document.getElementById("page_nav").classList.remove("responsive");
}

// show the correct section, hide all other sections. This function is used by the navigate() function
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

// lazy-loads the content to this page in the corresponding "section"-elements
function loadPage(name, e) {
    // check if content has already been loaded and prevent loading multiple times
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

// this function shows and hides elements depending on wether a valid login exists
function checklogin() {
    let cookie_userid = getCookie("cookie_username")
    let cookie_sessionid = getCookie("cookie_session")

    if ((cookie_userid && cookie_sessionid)){
        //found a login? great! lets check if its valid
        fetch(`/login_session/${cookie_userid}/${cookie_sessionid}`)
        .then(res => {
            if(res.status="200") { //valid session
                document.getElementById("nav_request").classList.remove("invisible")
                document.getElementById("nav_offer").classList.remove("invisible")
                document.getElementById("nav_myspots").classList.remove("invisible")
                document.getElementById("nav_reservation").classList.remove("invisible")
            }
            else{
                console.log("Session invalid. Please log in."); //invalid session - remove session data
                document.cookie = "cookie_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "cookie_username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.getElementById("nav_request").classList.add("invisible")
                document.getElementById("nav_offer").classList.add("invisible")
                document.getElementById("nav_myspots").classList.add("invisible")
                document.getElementById("nav_reservation").classList.add("invisible")
            }
        })
    } else {
        console.log("No login data found."); //no login found
        document.getElementById("nav_request").classList.add("invisible")
        document.getElementById("nav_offer").classList.add("invisible")
        document.getElementById("nav_myspots").classList.add("invisible")
        document.getElementById("nav_reservation").classList.add("invisible")
    }
}

// helper-function to remove child-nodes to a specific element. This function is used in multiple places and is therefore placed in the index.js
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// this function can fill the section showing how many parking-spots have been registered. This function can be used in multiple places and is therefore placed in the index.js
async function pp_registered() {
    fetch(`/get_parkingspots/${getCookie("cookie_username")}/${getCookie("cookie_session")}`)
    .then(response => response.json())
    .then(myspots => {
        if(myspots.statuscode.status == 200){
            document.getElementById("nr_registered_spots").innerText = myspots.doc
        }
        checkDarkmode();
    })
}
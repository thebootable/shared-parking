checkDarkmode();
console.log("Fetching my Spots")

if ((getCookie("cookie_username") && getCookie("cookie_session"))){
    console.log("Using stored session");
    document.getElementById("submit_spot").addEventListener("click", registerNewSpot);
    document.getElementById('reload_myspots').addEventListener('click', pp_myparkingspots)
    pp_myparkingspots();
}
else{
    //kein Login vorhanden
    console.log("No login data found")
    window.location.hash = "profile";
}

async function pp_myparkingspots() {
    fetch(`/get_my_parkingspots/${getCookie("cookie_username")}/${getCookie("cookie_session")}`)
    .then(response => response.json())
    .then(myspots => {
        if(myspots.statuscode.status == 200){
            const cl = document.getElementById('table_myspots')
            removeAllChildNodes(cl)
            let thead = document.createElement('thead');
            let th_tr = document.createElement('tr');
            let th_nr = document.createElement('th');
            th_nr.innerHTML ='Nummer:';
            th_tr.appendChild(th_nr);
            th_nr.setAttribute("id","th_name")
            let th_location = document.createElement('th');
            th_location.innerHTML ='Ort:';
            th_tr.appendChild(th_location);
            let th_creation = document.createElement('th');
            th_creation.innerHTML='Platz angelegt:';
            th_tr.appendChild(th_creation);
            let th_reload = document.createElement('th');
            let reload_icon = document.createElement('i');
            reload_icon.classList.add('fas', 'fa-sync', 'icon_body', 'reload')
            reload_icon.addEventListener('click', pp_myparkingspots)
            th_reload.appendChild(reload_icon);
            th_tr.appendChild(th_reload);
            thead.appendChild(th_tr);

            let tbody = document.createElement('tbody')
            dateformatelement = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'}
            
            for (let spot of myspots.spots) {
                //Create spots data table
                let tr = document.createElement('tr');
                let td_nr = document.createElement('td');
                td_nr.setAttribute("data-label", "Nummer:");
                td_nr.innerText = spot.nr
                let td_location = document.createElement('td');
                td_location.setAttribute("data-label", "Ort:");
                td_location.innerText = spot.location
                let td_creation = document.createElement('td')
                td_creation.setAttribute("data-label", "Platz angelegt:");
                td_creation.innerText = new Date(spot.creation).toLocaleString([], dateformatelement)
                let td_action = document.createElement('td')
                let a_action = document.createElement('a')
                a_action.classList.add("link")
                a_action.innerText ="löschen >>"
                td_action.setAttribute("data-label", "Löschen:");
                td_action.appendChild(a_action)
                td_action.addEventListener("click", removeParkingSpot)
                tr.setAttribute("id", spot._id)
                tr.appendChild(td_nr)
                tr.appendChild(td_location)
                tr.appendChild(td_creation)
                tr.appendChild(td_action)
                tbody.appendChild(tr)
            }

            cl.appendChild(thead)
            cl.appendChild(tbody)
            cl.classList.remove("invisible")

            //Remove spinner
            document.getElementById("loading_spinner_myspots").parentElement.classList.add("invisible");
            document.getElementById("myspotresult").classList.add("invisible")
        } else if (myspots.statuscode.status == 404){
            document.getElementById("myspotresult").innerText = "Keine registrierten Parkplätze gefunden."
            document.getElementById("myspotresult").classList.remove("invisible")
            document.getElementById('table_myspots').classList.add("invisible")
            document.getElementById("loading_spinner_myspots").parentElement.classList.add("invisible");
        } else if (myspots.statuscode.status == 401){
            document.getElementById("myspotresult").innerText = "Parkplätze konnten nicht abgerufen werden: Login ungültig."
            document.getElementById("myspotresult").classList.remove("invisible")
            document.getElementById('table_myspots').classList.add("invisible")
            document.getElementById("loading_spinner_myspots").parentElement.classList.add("invisible");
        } else if (myspots.statuscode.status == 500){
            document.getElementById("myspotresult").innerText = "Parkplätze konnten nicht abgerufen werden: Interner Fehler."
            document.getElementById("myspotresult").classList.remove("invisible")
            document.getElementById('table_myspots').classList.add("invisible")
            document.getElementById("loading_spinner_myspots").parentElement.classList.add("invisible");
        } else{

        }
        checkDarkmode();
    })
}

async function registerNewSpot() {
    let nr = document.getElementById("spot_nr").value;
    let location = document.getElementById("spot_location").value;
    let newSpot = {nr: nr, location: location, owner: getCookie("cookie_username"), sessionid: getCookie("cookie_session"), userid: getCookie("cookie_username")}
    await fetch('/register_spot', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(newSpot)
    })
    .then(response => response.json())
    .then(data => {
        if(data.statuscode.status == 200){
            document.getElementById("spotresult").innerText = "Parkplatz erfolgreich angelegt."
            document.getElementById("spotresult").classList.remove("invisible")
            document.getElementById("spot_nr").value = "";
            document.getElementById("spot_location").value = "";
            pp_myparkingspots();
            pp_registered();
        } else if (data.statuscode.status == 500){
            document.getElementById("spotresult").innerText = "Parkplatz konnte nicht angelegt werden: Interner Fehler."
            document.getElementById("spotresult").classList.remove("invisible")
        } else if (data.statuscode.status == 401){
            document.getElementById("spotresult").innerText = "Parkplatz konnte nicht angelegt werden: Login ungültig."
            document.getElementById("spotresult").classList.remove("invisible")
        } else{
            document.getElementById("spotresult").innerText = "Parkplatz konnte nicht angelegt werden: Allgemeiner Fehler."
            document.getElementById("spotresult").classList.remove("invisible")
        }
    })
}

async function removeParkingSpot(evt) {
    spotid = evt.currentTarget.parentElement.id;
    let removeSpot = {spotid: spotid, sessionid: getCookie("cookie_session"), userid: getCookie("cookie_username")}
    fetch('/remove_spot', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(removeSpot)
    })
    .then(response => response.json())
    .then(data => {
        if(data.statuscode.status == 200){
            document.getElementById("spotresult").innerText = "Parkplatz erfolgreich entfernt."
            document.getElementById("spotresult").classList.remove("invisible")
            document.getElementById("spot_nr").value = "";
            document.getElementById("spot_location").value = "";
            pp_myparkingspots();
            pp_registered();
        } else if (data.statuscode.status == 401){
            document.getElementById("spotresult").innerText = "Parkplatz konnte nicht entfernt werden: Login ungültig."
            document.getElementById("spotresult").classList.remove("invisible")
        } else if (data.statuscode.status == 404){
            document.getElementById("spotresult").innerText = "Parkplatz konnte nicht entfernt werden: Parkplatz wurde nicht gefunden."
            document.getElementById("spotresult").classList.remove("invisible")
        } else{

        }
    })
}
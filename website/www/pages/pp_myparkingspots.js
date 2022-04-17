checkDarkmode(); //make sure stuff fits the general style
console.log("Fetching my Spots")

//get login-data from cookies
if ((getCookie("cookie_username") && getCookie("cookie_session"))){
    //login exists
    console.log("Using stored session");
    document.getElementById("submit_spot").addEventListener("click", registerNewSpot); //add functionality to the submit-button
    document.getElementById('reload_myspots').addEventListener('click', pp_myparkingspots); //add functionality to the reload-button
    pp_myparkingspots(); //start the general build of the site: load content from db
}
else{
    //no login found
    console.log("No login data found")
    window.location.hash = "profile";
}

//get the users registered parkingspots
async function pp_myparkingspots() {
    fetch(`/get_my_parkingspots/${getCookie("cookie_username")}/${getCookie("cookie_session")}`) //check auth
    .then(response => response.json())
    .then(myspots => {
        const cl = document.getElementById('table_myspots') // the table where the elements will be shown
        const rf = document.getElementById("myspotresult") // response field, used for errors    
        if(myspots.statuscode.status == 200){ //auth valid
            removeAllChildNodes(cl) // empty the table first, important for when the reload-function is used

            //build empty table-frame
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
            
            //Add a table entry per registered parkingspot
            for (let spot of myspots.spots) {
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
                tr.setAttribute("id", spot._id) //add the id of the spot to the element. this helps with deleting a parking-spot
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
            rf.classList.add("invisible")
        } else if (myspots.statuscode.status == 404){ //no spots found: show result in response field
            rf.innerText = "Keine registrierten Parkplätze gefunden."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            document.getElementById("loading_spinner_myspots").parentElement.classList.add("invisible");
        } else if (myspots.statuscode.status == 401){ //invalid login data: show result in response field.
            rf.innerText = "Parkplätze konnten nicht abgerufen werden: Login ungültig."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            document.getElementById("loading_spinner_myspots").parentElement.classList.add("invisible");
        } else if (myspots.statuscode.status == 500){ //something on the server-side went wrong: show result in response field
            rf.innerText = "Parkplätze konnten nicht abgerufen werden: Interner Fehler."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            document.getElementById("loading_spinner_myspots").parentElement.classList.add("invisible");
        } else{ //something different went wrong: show error in response field
            rf.innerText = "Angebotene Parkplätze konnten nicht abgerufen werden: Allgemeiner Fehler."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        }
        checkDarkmode();
    })
}

//function to register a new parking-spot. is called when the submit-button is clicked
async function registerNewSpot() {
    let nr = document.getElementById("spot_nr").value;
    let location = document.getElementById("spot_location").value;
    let newSpot = {nr: nr, location: location, owner: getCookie("cookie_username"), sessionid: getCookie("cookie_session"), userid: getCookie("cookie_username")} //build the spot object
    //post the spot-element to the server
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
        if(data.statuscode.status == 200){ //success
            document.getElementById("spotresult").innerText = "Parkplatz erfolgreich angelegt."
            document.getElementById("spotresult").classList.remove("invisible")
            document.getElementById("spot_nr").value = "";
            document.getElementById("spot_location").value = "";
            pp_myparkingspots();
            pp_registered();
        } else if (data.statuscode.status == 500){ //something on the server-side went wrong: show result in response field
            document.getElementById("spotresult").innerText = "Parkplatz konnte nicht angelegt werden: Interner Fehler."
            document.getElementById("spotresult").classList.remove("invisible")
        } else if (data.statuscode.status == 401){ //invalid login data: show result in response field.
            document.getElementById("spotresult").innerText = "Parkplatz konnte nicht angelegt werden: Login ungültig."
            document.getElementById("spotresult").classList.remove("invisible")
        } else{ //something different went wrong: show error in response field
            document.getElementById("spotresult").innerText = "Parkplatz konnte nicht angelegt werden: Allgemeiner Fehler."
            document.getElementById("spotresult").classList.remove("invisible")
        }
    })
}

//function to remove an existing parking-spot
async function removeParkingSpot(evt) {
    spotid = evt.currentTarget.parentElement.id; //get the parkingspot-id from the element
    let removeSpot = {spotid: spotid, sessionid: getCookie("cookie_session"), userid: getCookie("cookie_username")} //use auth
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
        if(data.statuscode.status == 200){ //success
            document.getElementById("spotresult").innerText = "Parkplatz erfolgreich entfernt."
            document.getElementById("spotresult").classList.remove("invisible")
            document.getElementById("spot_nr").value = "";
            document.getElementById("spot_location").value = "";
            pp_myparkingspots();
            pp_registered();
        } else if (data.statuscode.status == 401){ //invalid login data: show result in response field.
            document.getElementById("spotresult").innerText = "Parkplatz konnte nicht entfernt werden: Login ungültig."
            document.getElementById("spotresult").classList.remove("invisible")
        } else if (data.statuscode.status == 404){ //parkingspot not found: show error in response field
            document.getElementById("spotresult").innerText = "Parkplatz konnte nicht entfernt werden: Parkplatz wurde nicht gefunden."
            document.getElementById("spotresult").classList.remove("invisible")
        } else{

        }
    })
}
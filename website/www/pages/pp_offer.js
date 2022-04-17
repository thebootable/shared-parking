checkDarkmode(); //make sure stuff fits the general style
console.log("displaying spot offer form")

//get login-data from cookies
if ((getCookie("cookie_username") && getCookie("cookie_session"))){
    console.log("Using stored session");
    document.getElementById("submit_offer").addEventListener("click", addSpotOffer); //add functionality to the submit-button
    document.getElementById('reload_offer').addEventListener('click', pp_offer); //add functionality to the reload-button
    pp_offer_populate_dropdown(); //populate the drop-down with elements from the db: adds the users spots
    pp_offer(); //start the general build of the site: load content from db
}
else{
    //no login found
    console.log("No login data found")
    window.location.hash = "profile";
}

//adds the users spots to the dropdown field
async function pp_offer_populate_dropdown(){
    fetch(`/get_my_parkingspots/${getCookie("cookie_username")}/${getCookie("cookie_session")}`) //use auth
    .then(response => response.json())
    .then(myspots => {
        if(myspots.statuscode.status == 200){ //success
            let ddwrapper = document.getElementById('offer_spotid')
            //add each element as an option to the dropdown
            for (let spot of myspots.spots) {
                let option = document.createElement('option')
                option.setAttribute("id", spot._id) //add the ID. this helps with identifying the picked element later
                option.innerText = spot.nr
                ddwrapper.appendChild(option)
            }
            document.getElementById('offer_result').classList.add("invisible")
        } else{
            result = document.getElementById('offer_result')
            result.innerHTML = 'Keine Parkplätze gefunden. Bitte zuerst <a href="#myspots"><div class="link" id="pp_reg_btn" style="display: inline;">deinen eigenen Parkplatz registrieren >></div></a>'
            result.classList.remove("invisible")
        }
        checkDarkmode();
    })
}

//get the users offered parkingspots
async function pp_offer() {
    fetch(`/get_my_offers/${getCookie("cookie_username")}/${getCookie("cookie_session")}`) //use auth
    .then(response => response.json())
    .then(myoffers => {
        const cl = document.getElementById('table_myoffers') // the table where the elements will be shown
        const rf = document.getElementById("myofferresult") //response field
        const spinner = document.getElementById("loading_spinner_myoffers") //spinning icon when loading stuff
        if(myoffers.statuscode.status == 200){
            removeAllChildNodes(cl) // empty the table first, important for when the reload-function is used

            //build empty table-frame
            let thead = document.createElement('thead');
            let th_tr = document.createElement('tr');
            let th_nr = document.createElement('th');
            th_nr.innerHTML ='Nummer:';
            th_tr.appendChild(th_nr);
            let th_start = document.createElement('th');
            th_start.innerHTML ='Verfügbar ab:';
            th_tr.appendChild(th_start);
            let th_stop = document.createElement('th');
            th_stop.innerHTML ='Verfügbar bis:';
            th_tr.appendChild(th_stop);
            let th_status = document.createElement('th');
            th_status.innerHTML='Status:';
            th_tr.appendChild(th_status);
            let th_creation = document.createElement('th');
            th_creation.innerHTML='Bereitstellungsdatum:';
            th_tr.appendChild(th_creation);
            thead.appendChild(th_tr);

            let tbody = document.createElement('tbody')
            dateformatelement = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'}
            
            //Add a table entry per offer
            for (let offer of myoffers.doc) {
                let tr = document.createElement('tr');
                let td_nr = document.createElement('td');
                td_nr.setAttribute("data-label", "Nummer:");
                td_nr.innerText =  offer.parkingspot.nr
                let td_start = document.createElement('td');
                td_start.setAttribute("data-label", "Verfügbar ab:");
                td_start.innerText =  new Date(offer.start).toLocaleString([], dateformatelement)
                let td_stop = document.createElement('td');
                td_stop.setAttribute("data-label", "Verfügbar bis:");
                td_stop.innerText =  new Date(offer.stop).toLocaleString([], dateformatelement)
                let td_creation = document.createElement('td')
                let td_status = document.createElement('td');
                td_status.setAttribute("data-label", "Nummer:");
                td_status.innerText =  "offen"
                td_creation.setAttribute("data-label", "Bereitstellungsdatum:");
                td_creation.innerText = new Date(offer.creation).toLocaleString([], dateformatelement)
                let td_action = document.createElement('td')
                let a_action = document.createElement('a')
                a_action.classList.add("link")
                a_action.innerText ="entfernen >>"
                td_action.setAttribute("data-label", "Löschen:");
                td_action.appendChild(a_action)
                td_action.addEventListener("click", removeOffer)
                tr.setAttribute("id", offer._id) //add the id of the spot to the element. this helps with deleting an offer
                tr.appendChild(td_nr)
                tr.appendChild(td_start)
                tr.appendChild(td_stop)
                tr.appendChild(td_status)
                tr.appendChild(td_creation)
                tr.appendChild(td_action)
                tbody.appendChild(tr)
            }

            cl.appendChild(thead)
            cl.appendChild(tbody)
            cl.classList.remove("invisible")

            //Remove spinner
            spinner.parentElement.classList.add("invisible");
            rf.classList.add("invisible")
        } else if (myoffers.statuscode.status == 404){ //no offers found: show result in response field
            rf.innerText = "Keine angebotenen Parkplätze gefunden."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else if (myoffers.statuscode.status == 401){ //invalid login data: show result in response field.
            rf.innerText = "Angebotene Parkplätze konnten nicht abgerufen werden: Login ungültig."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else if (myoffers.statuscode.status == 500){ //something on the server-side went wrong: show result in response field
            rf.innerText = "Angebotene Parkplätze konnten nicht abgerufen werden: Interner Fehler."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else{ //something different went wrong: show error in response field
            rf.innerText = "Angebotene Parkplätze konnten nicht abgerufen werden: Allgemeiner Fehler."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        }
        checkDarkmode();
    })
}

//function to add a new offer. is called when the submit-button is clicked
async function addSpotOffer() {
    var spotoptions = document.getElementById("offer_spotid")
    let parkingspot = spotoptions.options[spotoptions.selectedIndex].id;
    let start = document.getElementById("offer_start").value;
    let stop = document.getElementById("offer_stop").value;
    let contact = getCookie("cookie_username");
    let userid = getCookie("cookie_username");
    let sessionid = getCookie("cookie_session");
    let newOffer = {parkingspot: parkingspot, start: start, stop: stop, contact: contact, userid: userid, sessionid: sessionid} //build the offer object
    //post the spot-element to the server
    await fetch('/offer_spot', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(newOffer)
    })
    .then(response => response.json())
    .then(data => {
        if(data.statuscode.status == 200){ //success
            document.getElementById("offer_result").innerText = "Parkplatz erfolgreich angefragt."
            document.getElementById("offer_result").classList.remove("invisible")
            document.getElementById("offer_start").value = "";
            document.getElementById("offer_stop").value = "";
            pp_offer();
        } else if (data.statuscode.status == 500){ //something on the server-side went wrong: show result in response field
            document.getElementById("offer_result").innerText = "Parkplatz konnte nicht angefragt werden."
            document.getElementById("offer_result").classList.remove("invisible")
        } else{

        }
    })
}

//function to remove an existing offer
async function removeOffer(evt) {
    let offerid = evt.currentTarget.parentElement.id; //get the offer-id from the element
    let removeSpot = {offerid: offerid, sessionid: getCookie("cookie_session"), userid: getCookie("cookie_username")}
    fetch('/remove_offer', {
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
            pp_offer();
            document.getElementById("myofferresult").innerText = "Angebot erfolgreich entfernt."
            document.getElementById("myofferresult").classList.remove("invisible")
        } else if (data.statuscode.status == 401){ //invalid login data: show result in response field.
            document.getElementById("myofferresult").innerText = "Angebot konnte nicht entfernt werden: Login ungültig."
            document.getElementById("myofferresult").classList.remove("invisible")
        } else if (data.statuscode.status == 404){ //parkingspot not found: show error in response field
            document.getElementById("myofferresult").innerText = "Angebot konnte nicht entfernt werden: Angebot wurde nicht gefunden."
            document.getElementById("myofferresult").classList.remove("invisible")
        } else{

        }
    })
}
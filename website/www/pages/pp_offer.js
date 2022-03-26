checkDarkmode();
console.log("displaying spot offer form")

if ((getCookie("cookie_username") && getCookie("cookie_session"))){
    console.log("Using stored session");
    document.getElementById("submit_offer").addEventListener("click", addSpotOffer);
    document.getElementById('reload_offer').addEventListener('click', pp_offer)
    pp_offer_populate_dropdown();
    pp_offer();
}
else{
    //kein Login vorhanden
    console.log("No login data found")
    window.location.hash = "profile";
}

async function pp_offer_populate_dropdown(){
    fetch(`/get_my_parkingspots/${getCookie("cookie_username")}/${getCookie("cookie_session")}`)
    .then(response => response.json())
    .then(myspots => {
        if(myspots.statuscode.status == 200){
            let ddwrapper = document.getElementById('offer_spotid')
            for (let spot of myspots.spots) {
                let option = document.createElement('option')
                option.setAttribute("id", spot._id)
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

async function pp_offer() {
    fetch(`/get_my_offers/${getCookie("cookie_username")}/${getCookie("cookie_session")}`)
    .then(response => response.json())
    .then(myoffers => {
        const cl = document.getElementById('table_myoffers')
        const rf = document.getElementById("myofferresult") //response field
        const spinner = document.getElementById("loading_spinner_myoffers") //spinning icon when loading stuff
        if(myoffers.statuscode.status == 200){
            removeAllChildNodes(cl)
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
            
            for (let offer of myoffers.doc) {
                //Create spots data table
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
                tr.setAttribute("id", offer._id)
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
        } else if (myoffers.statuscode.status == 404){
            rf.innerText = "Keine angebotenen Parkplätze gefunden."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else if (myoffers.statuscode.status == 401){
            rf.innerText = "Angebotene Parkplätze konnten nicht abgerufen werden: Login ungültig."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else if (myoffers.statuscode.status == 500){
            rf.innerText = "Angebotene Parkplätze konnten nicht abgerufen werden: Interner Fehler."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else{
            rf.innerText = "Angebotene Parkplätze konnten nicht abgerufen werden: Allgemeiner Fehler."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        }
        checkDarkmode()
    })
}

async function addSpotOffer() {
    var spotoptions = document.getElementById("offer_spotid")
    let parkingspot = spotoptions.options[spotoptions.selectedIndex].id;
    let start = document.getElementById("offer_start").value;
    let stop = document.getElementById("offer_stop").value;
    let contact = getCookie("cookie_username");
    let userid = getCookie("cookie_username");
    let sessionid = getCookie("cookie_session");
    let newSpot = {parkingspot: parkingspot, start: start, stop: stop, contact: contact, userid: userid, sessionid: sessionid}
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
        body: JSON.stringify(newSpot)
    })
    .then(response => response.json())
    .then(data => {
        if(data.statuscode.status == 200){
            document.getElementById("offer_result").innerText = "Parkplatz erfolgreich angefragt."
            document.getElementById("offer_result").classList.remove("invisible")
            document.getElementById("offer_start").value = "";
            document.getElementById("offer_stop").value = "";
            pp_offer();
        } else if (data.statuscode.status == 500){
            document.getElementById("offer_result").innerText = "Parkplatz konnte nicht angefragt werden."
            document.getElementById("offer_result").classList.remove("invisible")
        } else{

        }
    })
}

async function removeOffer(evt) {
    let offerid = evt.currentTarget.parentElement.id;
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
        if(data.statuscode.status == 200){
            pp_offer();
            document.getElementById("myofferresult").innerText = "Angebot erfolgreich entfernt."
            document.getElementById("myofferresult").classList.remove("invisible")
        } else if (data.statuscode.status == 401){
            document.getElementById("myofferresult").innerText = "Angebot konnte nicht entfernt werden: Login ungültig."
            document.getElementById("myofferresult").classList.remove("invisible")
        } else if (data.statuscode.status == 404){
            document.getElementById("myofferresult").innerText = "Angebot konnte nicht entfernt werden: Angebot wurde nicht gefunden."
            document.getElementById("myofferresult").classList.remove("invisible")
        } else{

        }
    })
}
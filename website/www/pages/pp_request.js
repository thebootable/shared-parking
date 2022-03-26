checkDarkmode();
console.log("displaying spot request form")

if ((getCookie("cookie_username") && getCookie("cookie_session"))){
    console.log("Using stored session");
    document.getElementById("submit_request").addEventListener("click", addSpotRequest);
    document.getElementById('reload_requests').addEventListener('click', pp_request)
    pp_request();
}
else{
    //kein Login vorhanden
    console.log("No login data found")
    window.location.hash = "profile";
}

function pp_request() {
    fetch(`/get_my_requests/${getCookie("cookie_username")}/${getCookie("cookie_session")}`)
    .then(response => response.json())
    .then(myrequests => {
        const cl = document.getElementById('table_myrequests')
        const rf = document.getElementById("myrequestresult") //response field
        const spinner = document.getElementById("loading_spinner_myrequests")
        if(myrequests.statuscode.status == 200){
            removeAllChildNodes(cl)
            let thead = document.createElement('thead');
            let th_tr = document.createElement('tr');
            let th_start = document.createElement('th');
            th_start.innerHTML ='Benötigt ab:';
            th_tr.appendChild(th_start);
            th_start.setAttribute("id","th_name")
            let th_stop = document.createElement('th');
            th_stop.innerHTML ='Benötigt bis:';
            th_tr.appendChild(th_stop);
            let th_creation = document.createElement('th');
            th_creation.innerHTML='Anfragedatum:';
            th_tr.appendChild(th_creation);
            thead.appendChild(th_tr);

            let tbody = document.createElement('tbody')
            dateformatelement = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'}
            
            for (let request of myrequests.doc) {
                //Create spots data table
                let tr = document.createElement('tr');
                let td_start = document.createElement('td');
                td_start.setAttribute("data-label", "Benötigt ab:");
                td_start.innerText =  new Date(request.start).toLocaleString([], dateformatelement)
                let td_stop = document.createElement('td');
                td_stop.setAttribute("data-label", "Benötigt bis:");
                td_stop.innerText =  new Date(request.stop).toLocaleString([], dateformatelement)
                let td_creation = document.createElement('td')
                td_creation.setAttribute("data-label", "Anfragedatum:");
                td_creation.innerText = new Date(request.creation).toLocaleString([], dateformatelement)
                let td_action = document.createElement('td')
                let a_action = document.createElement('a')
                a_action.classList.add("link")
                a_action.innerText ="löschen >>"
                td_action.setAttribute("data-label", "Löschen:");
                td_action.appendChild(a_action)
                td_action.addEventListener("click", removeRequest)
                tr.setAttribute("id", request._id)
                tr.appendChild(td_start)
                tr.appendChild(td_stop)
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
        } else if (myrequests.statuscode.status == 404){
            rf.innerText = "Keine registrierten Parkplätze gefunden."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else if (myrequests.statuscode.status == 401){
            rf.innerText = "Parkplätze konnten nicht abgerufen werden: Login ungültig."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else if (myrequests.statuscode.status == 500){
            rf.innerText = "Parkplätze konnten nicht abgerufen werden: Interner Fehler."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else{

        }
        checkDarkmode()
    })
}

async function addSpotRequest() {
    let start = document.getElementById("request_start").value;
    let stop = document.getElementById("request_stop").value;
    let contact = getCookie("cookie_username");
    let userid = getCookie("cookie_username");
    let sessionid = getCookie("cookie_session");
    let newSpot = {start: start, stop: stop, contact: contact, userid: userid, sessionid: sessionid}
    await fetch('/request_spot', {
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
            document.getElementById("request_result").innerText = "Parkplatz erfolgreich angefragt."
            document.getElementById("request_result").classList.remove("invisible")
            document.getElementById("request_start").value = "";
            document.getElementById("request_stop").value = "";
            pp_request();
        } else if (data.statuscode.status == 500){
            document.getElementById("request_result").innerText = "Parkplatz konnte nicht angefragt werden."
            document.getElementById("request_result").classList.remove("invisible")
        } else{

        }
    })
}

async function removeRequest(evt) {
    requestid = evt.currentTarget.parentElement.id;
    let removeSpot = {requestid: requestid, sessionid: getCookie("cookie_session"), userid: getCookie("cookie_username")}
    fetch('/remove_request', {
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
            document.getElementById("myrequestresult").innerText = "Request erfolgreich entfernt."
            document.getElementById("myrequestresult").classList.remove("invisible")
            pp_request();
        } else if (data.statuscode.status == 401){
            document.getElementById("myrequestresult").innerText = "Parkplatz konnte nicht entfernt werden: Login ungültig."
            document.getElementById("myrequestresult").classList.remove("invisible")
        } else if (data.statuscode.status == 404){
            document.getElementById("myrequestresult").innerText = "Parkplatz konnte nicht entfernt werden: Parkplatz wurde nicht gefunden."
            document.getElementById("myrequestresult").classList.remove("invisible")
        } else{

        }
    })
}
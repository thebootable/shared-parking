checkDarkmode(); //make sure stuff fits the general style
console.log("displaying spot request form")

//get login-data from cookies
if ((getCookie("cookie_username") && getCookie("cookie_session"))){
    //login exists
    console.log("Using stored session");
    document.getElementById("submit_request").addEventListener("click", addSpotRequest); //add functionality to the submit-button
    document.getElementById('reload_requests').addEventListener('click', pp_request) //add functionality to the reload-button
    pp_request(); //start the general build of the site: load content from db
}
else{
    //no login found
    console.log("No login data found")
    window.location.hash = "profile";
}

//get the users open requests
function pp_request() {
    fetch(`/get_my_requests/${getCookie("cookie_username")}/${getCookie("cookie_session")}`)
    .then(response => response.json())
    .then(myrequests => {
        const cl = document.getElementById('table_myrequests') // the table where the elements will be shown
        const rf = document.getElementById("myrequestresult") // response field, used for errors   
        const spinner = document.getElementById("loading_spinner_myrequests")
        if(myrequests.statuscode.status == 200){ //success
            removeAllChildNodes(cl) // empty the table first, important for when the reload-function is used

            //build empty table-frame
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
            
            //Add a table entry per open request
            for (let request of myrequests.doc) {
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
                tr.setAttribute("id", request._id) //add the id of the requests to the element. this helps with deleting a requests
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
        } else if (myrequests.statuscode.status == 404){ //no requests found: show result in response field
            rf.innerText = "Keine offenen Anfragen gefunden."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else if (myrequests.statuscode.status == 401){ //invalid login data: show result in response field.
            rf.innerText = "offene Anfragen konnten nicht abgerufen werden: Login ungültig."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else if (myrequests.statuscode.status == 500){ //something on the server-side went wrong: show result in response field
            rf.innerText = "offene Anfragen konnten nicht abgerufen werden: Interner Fehler."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else{ //something different went wrong: show error in response field
            rf.innerText = "offene Anfragen konnten nicht abgerufen werden: Allgemeiner Fehler."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        }
        checkDarkmode();
    })
}

//function to register a new request. is called when the submit-button is clicked
async function addSpotRequest() {
    let start = document.getElementById("request_start").value;
    let stop = document.getElementById("request_stop").value;
    let contact = getCookie("cookie_username");
    let userid = getCookie("cookie_username");
    let sessionid = getCookie("cookie_session");
    let newSpot = {start: start, stop: stop, contact: contact, userid: userid, sessionid: sessionid} //build the request object
    //post the request-element to the server
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
        if(data.statuscode.status == 200){ //success
            document.getElementById("request_result").innerText = "Parkplatz erfolgreich angefragt."
            document.getElementById("request_result").classList.remove("invisible")
            document.getElementById("request_start").value = "";
            document.getElementById("request_stop").value = "";
            pp_request();
        } else if (data.statuscode.status == 500){ //something on the server-side went wrong: show result in response field
            document.getElementById("request_result").innerText = "Parkplatz konnte nicht angefragt werden."
            document.getElementById("request_result").classList.remove("invisible")
        } else{

        }
    })
}

//function to remove an existing request
async function removeRequest(evt) {
    requestid = evt.currentTarget.parentElement.id; //get the request-id from the element
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
        if(data.statuscode.status == 200){ //success
            document.getElementById("myrequestresult").innerText = "Request erfolgreich entfernt."
            document.getElementById("myrequestresult").classList.remove("invisible")
            pp_request();
        } else if (data.statuscode.status == 401){ //invalid login data: show result in response field.
            document.getElementById("myrequestresult").innerText = "Parkplatz konnte nicht entfernt werden: Login ungültig."
            document.getElementById("myrequestresult").classList.remove("invisible")
        } else if (data.statuscode.status == 404){ //request not found: show error in response field
            document.getElementById("myrequestresult").innerText = "Parkplatz konnte nicht entfernt werden: Parkplatz wurde nicht gefunden."
            document.getElementById("myrequestresult").classList.remove("invisible")
        } else{

        }
    })
}
checkDarkmode();
console.log("Fetching open requests")
pp_open_requests();
document.getElementById('reload_open_requests').addEventListener('click', pp_open_requests)

async function pp_open_requests() {
    fetch('/get_requests')
    .then(res => res.json())
    .then(open_requests => {
        const cl = document.getElementById('table_open_requests')
        const rf = document.getElementById("openrequestresult") //response field
        const spinner = document.getElementById("loading_spinner_open_requests") //spinning icon when loading stuff
        if(open_requests.statuscode.status == 200){
            removeAllChildNodes(cl)
            let thead = document.createElement('thead');
            let th_tr = document.createElement('tr');
            let th_start = document.createElement('th');
            th_start.innerHTML='Benötigt ab';
            th_tr.appendChild(th_start)
            let th_stop = document.createElement('th');
            th_stop.innerHTML='Benötigt bis';
            th_tr.appendChild(th_stop)
            let th_reqdate = document.createElement('th');
            th_reqdate.innerHTML='Anfragedatum';
            th_tr.appendChild(th_reqdate)
            let th_contact = document.createElement('th');
            th_contact.innerHTML='Ansprechpartner';
            th_tr.appendChild(th_contact);
            thead.appendChild(th_tr);

            //Remove spinner
            spinner.parentNode.classList.add("invisible");

            cl.appendChild(thead)

            let tbody = document.createElement('tbody')


            //Add a table entry per open request
            for(let s of open_requests.doc) {
                let tr = document.createElement('tr');

                let td_start = document.createElement('td')
                td_start.setAttribute("data-label", "Benötigt ab");

                let td_stop = document.createElement('td')
                td_stop.setAttribute("data-label", "Benötigt bis");

                let td_reqdate = document.createElement('td')
                td_reqdate.setAttribute("data-label", "Anfragedatum");

                let td_contact = document.createElement('td')
                td_contact.setAttribute("data-label", "Ansprechpartner");

                let td_reservation = document.createElement('td')
                td_reservation.classList.add("link")

                tr.appendChild(td_start)
                tr.appendChild(td_stop)
                tr.appendChild(td_reqdate)
                tr.appendChild(td_contact)
                tr.appendChild(td_reservation)
                tbody.appendChild(tr)

                dateformatelement = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'}

                td_start.innerText = new Date(s.start).toLocaleString([], dateformatelement)
                td_stop.innerText = new Date(s.stop).toLocaleString([], dateformatelement)
                td_reqdate.innerText = new Date(s.creation).toLocaleString([], dateformatelement)
                td_contact.innerText = s.contact.name;
                td_reservation.innerText = 'Meinen Platz anbieten >>'
            }
            cl.appendChild(tbody);
        } else if (open_requests.statuscode.status == 404){
            rf.innerText = "Keine offenen Anfragen gefunden."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else if (open_requests.statuscode.status == 401){
            rf.innerText = "Offenen Anfragen konnten nicht abgerufen werden: Login ungültig."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else if (open_requests.statuscode.status == 500){
            rf.innerText = "Offenen Anfragen konnten nicht abgerufen werden: Interner Fehler."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else{
            rf.innerText = "Offenen Anfragen konnten nicht abgerufen werden: Allgemeiner Fehler."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        }
    })
    .then(()=>{
        checkDarkmode();
    })
}
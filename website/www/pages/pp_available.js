checkDarkmode();
console.log("Fetching available Spots")
pp_available();
document.getElementById('reload_available_spots').addEventListener('click', pp_available)


async function pp_available() {
    fetch('/get_available_spots')
    .then(res => res.json())
    .then(spots => {
        const cl = document.getElementById('table_available_spots')
        const rf = document.getElementById("availableresult") //response field
        const spinner = document.getElementById("loading_spinner_avail") //spinning icon when loading stuff
        if(spots.statuscode.status == 200){
            removeAllChildNodes(cl)
            let thead = document.createElement('thead');
            let th_tr = document.createElement('tr');
            let th_nr = document.createElement('th');
            th_nr.innerHTML ='Parkplatznummer';
            th_tr.appendChild(th_nr);
            let th_start = document.createElement('th');
            th_start.innerHTML='Verfügbarkeit ab';
            th_tr.appendChild(th_start)
            let th_stop = document.createElement('th');
            th_stop.innerHTML='Verfügbarkeit bis';
            th_tr.appendChild(th_stop)
            let th_contact = document.createElement('th');
            th_contact.innerHTML='Ansprechpartner';
            th_tr.appendChild(th_contact);
            let th_reload = document.createElement('th');
            th_tr.appendChild(th_reload);
            thead.appendChild(th_tr);

            //Remove spinner
            document.getElementById('loading_spinner_avail').parentNode.classList.add("invisible");

            cl.appendChild(thead)

            let tbody = document.createElement('tbody')


            //Add a table entry per parkingspot
            for(let s of spots.doc) {
                let tr = document.createElement('tr');

                let td_nr = document.createElement('td');
                td_nr.setAttribute("data-label", "Parkplatz-Nr.");

                let td_start = document.createElement('td')
                td_start.setAttribute("data-label", "Verfügbarkeit ab");

                let td_stop = document.createElement('td')
                td_stop.setAttribute("data-label", "Verfügbarkeit bis");

                let td_contact = document.createElement('td')
                td_contact.setAttribute("data-label", "Ansprechpartner");

                let td_reservation = document.createElement('td')
                td_reservation.classList.add("link")

                tr.appendChild(td_nr)
                tr.appendChild(td_start)
                tr.appendChild(td_stop)
                tr.appendChild(td_contact)
                tr.appendChild(td_reservation)
                tbody.appendChild(tr)

                dateformatelement = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'}

                td_nr.innerText = s.parkingspot.nr
                td_start.innerText = new Date(s.start).toLocaleString([], dateformatelement)
                td_stop.innerText = new Date(s.stop).toLocaleString([], dateformatelement)
                td_contact.innerText = s.contact.name
                td_reservation.innerText = 'reservieren >>'
                
            }
            cl.appendChild(tbody);
        } else if (spots.statuscode.status == 404){
            rf.innerText = "Keine angebotenen Parkplätze gefunden."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else if (spots.statuscode.status == 401){
            rf.innerText = "Angebotene Parkplätze konnten nicht abgerufen werden: Login ungültig."
            rf.classList.remove("invisible")
            cl.classList.add("invisible")
            spinner.parentElement.classList.add("invisible");
        } else if (spots.statuscode.status == 500){
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
        
        checkDarkmode();
    })
    .catch(err => {
        document.getElementById('loading_spinner_avail').parentNode.classList.add("invisible");;
        document.getElementById("availableresult").innerHTML = "Fehler beim Abruf der verfügbaren Parkplätze."
    })
}
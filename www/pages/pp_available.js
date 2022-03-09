console.log("Fetching available Spots")

setTimeout(()=>{

    fetch('/get_available_spots')
        .then(res => res.json())
        .then(spots => {
            const cl = document.getElementById('table_available_spots')
            

            
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
            thead.appendChild(th_tr);

            //Remove spinner
            document.getElementById('loading_spinner_avail').remove();

            cl.appendChild(thead)

            let tbody = document.createElement('tbody')

    
            //Add a table entry per parkingspot
            for(let s of spots) {
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

                td_nr.innerText = s.nr
                td_start.innerText = s.start
                td_stop.innerText = s.stop
                td_contact.innerText = s.contact
                td_reservation.innerText = 'reservieren >>'
                
            }
            cl.appendChild(tbody);
        })

}, 1000)

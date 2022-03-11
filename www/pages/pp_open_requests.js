console.log("Fetching open requests")

setTimeout(()=>{

    fetch('/get_requests')
        .then(res => res.json())
        .then(open_requests => {
            const cl = document.getElementById('table_open_requests')
                       
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
            document.getElementById('loading_spinner_open_requests').parentNode.remove();

            cl.appendChild(thead)

            let tbody = document.createElement('tbody')

    
            //Add a table entry per open request
            for(let s of open_requests) {
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
                td_contact.innerText = s.contact
                td_reservation.innerText = 'Meinen Platz anbieten >>'
                
            }
            cl.appendChild(tbody);
        })
        .catch(err => {
            document.getElementById('loading_spinner_open_requests').parentNode.remove();
            var content = document.getElementById("table_open_requests");
            var p = document.createElement("p");
            p.innerHTML = "Keine offenen Anfragen gefunden."
            content.parentNode.replaceChild(p, content);
        })
}, 1000)
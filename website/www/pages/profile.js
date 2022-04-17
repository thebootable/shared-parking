checkDarkmode(); //make sure stuff fits the general style
console.log("Getting profile...")

//get login-data from cookies
if ((getCookie("cookie_username") && getCookie("cookie_session"))){
    console.log("Login using stored session");
    displayProfileAfterLogin(getCookie("cookie_username"), getCookie("cookie_session")) //start the general build of the site: load content from db
}
else{
    //no login found, show normal login-form
    console.log("No login data found")
    document.getElementById("table_profile").classList.add("invisible");
    document.getElementById("loading_spinner_profile").parentElement.classList.add("invisible");
    document.getElementById("login_header").classList.add("invisible");
    document.getElementById("loginform").classList.remove("invisible");
    document.getElementById("submit_login").addEventListener("click", login);
}


//login-function
async function login(){
    document.getElementById("loading_spinner_profile").parentElement.classList.remove("invisible");
    document.cookie = "cookie_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "cookie_username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    let email = document.getElementById("login_email").value;
    let password = document.getElementById("login_password").value;
    let login = {email: email, password: password} //build login-element
    //post login-element to the server
    await fetch('/login', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(login)
    })
    .then(response => response.json()
        .then(data => ({
            data: data,
            status: response.status
        }))
        .then(resjson => {
            if (resjson.status == 200){ //login valid, server has responded with session-id
                console.log("Login successful");
                document.cookie = `cookie_session=${resjson.data.sessionid}`;
                document.cookie = `cookie_username=${resjson.data.userid}`;
                document.getElementById("loginresult").classList.add("invisible")
                checklogin();
                displayProfileAfterLogin(getCookie("cookie_username"), getCookie("cookie_session")); //start the general build of the site: load content from db
                return true;
            }
            else { //error, login invalid or general error
                console.log("Login failed");
                document.getElementById("loginresult").innerText = "Error during login. Check credentials and try again?"
                document.getElementById("loginresult").classList.remove("invisible")
                return false;
            }
        })
        .catch(error => console.error('Error:', error))
        .then(document.getElementById("loading_spinner_profile").parentElement.classList.add("invisible")) //hide spinner
    )
    .catch(error => console.error('Error:', error));
}

async function logout(userid, sessionid){
    document.cookie = "cookie_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "cookie_username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    fetch(`/logout_session/${sessionid}`)
    .then( res => {
        if (res.status == 200){
            document.getElementById("table_profile").classList.add("invisible");
            document.getElementById("loading_spinner_profile").parentElement.classList.add("invisible");
            document.getElementById("login_header").classList.add("invisible")
            document.getElementById("loginform").classList.remove("invisible");
            document.getElementById("logout_button").classList.add("invisible");
            document.getElementById("submit_login").addEventListener("click", login);
            checklogin();
            window.location.hash = "home";
            return true;
        }
        else {
            return false;
        }
    })
}

//show the profile-data as well as menu-items after login
async function displayProfileAfterLogin(cookie_userid, cookie_sessionid) {
    //check if session is valid
    fetch(`/login_session/${cookie_userid}/${cookie_sessionid}`)
    .then(res => {
        if (res.status = 200){
            console.log("Session gültig");

        } else if (res.status = 404){
            console.log("Session ungültig");
            
        } else {
            console.log("allgemeiner Fehler");
        }
        return res;
    })
    .then(res => {
        if(res.status=200) {
            //valid session
            fetch(`/get_user/${cookie_userid}`) //get profile-data
            .then(user => user.json())
            .then(profile => {
                const cl = document.getElementById('table_profile')
                let td_name, td_mail, td_tel, td_creation, logout_button
                if(!cl.hasChildNodes()){ //has the profile already been shown? if not, create a new table for it
                    let thead = document.createElement('thead');
                    let th_tr = document.createElement('tr');
                    let th_name = document.createElement('th');
                    th_name.innerHTML ='Name: ';
                    th_tr.appendChild(th_name);
                    th_name.setAttribute("id","th_name")
                    let th_mail = document.createElement('th');
                    th_mail.innerHTML ='E-Mail: ';
                    th_tr.appendChild(th_mail);
                    let th_tel = document.createElement('th');
                    th_tel.innerHTML='Telefon: ';
                    th_tr.appendChild(th_tel);
                    let th_creation = document.createElement('th');
                    th_creation.innerHTML='Account erstellt: ';
                    th_tr.appendChild(th_creation);
                    thead.appendChild(th_tr);

                    let tbody = document.createElement('tbody')
                
                    //Create user data table
                    let tr = document.createElement('tr');
                    td_name = document.createElement('td');
                    td_name.setAttribute("data-label", "Name:");
                    td_name.setAttribute("id", "td_name");
                    td_mail = document.createElement('td');
                    td_mail.setAttribute("data-label", "E-Mail:");
                    td_mail.setAttribute("id", "td_mail");
                    td_tel = document.createElement('td')
                    td_tel.setAttribute("data-label", "Telefonnummer:");
                    td_tel.setAttribute("id", "td_tel");
                    td_creation = document.createElement('td')
                    td_creation.setAttribute("data-label", "Account erstellt:");
                    td_creation.setAttribute("id", "td_creation");

                    cl.appendChild(thead)

                    tr.appendChild(td_name)
                    tr.appendChild(td_mail)
                    tr.appendChild(td_tel)
                    tr.appendChild(td_creation)
                    tbody.appendChild(tr)

                    logout_button = document.createElement("button")
                    logout_button.setAttribute('id', 'logout_button');
                    logout_button.classList.add("action")
                    logout_button.innerHTML = "Logout"

                    cl.appendChild(tbody);
                    cl.parentElement.appendChild(logout_button);

                }
                else{ //if the profile has already been shown, use existing fields
                    td_name = document.getElementById('td_name')
                    td_mail = document.getElementById('td_mail')
                    td_tel = document.getElementById('td_tel')
                    td_creation = document.getElementById('td_creation')
                    logout_button = document.getElementById('logout_button')
                }

                //Remove spinner
                document.getElementById("loading_spinner_profile").parentElement.classList.add("invisible");

                //Fill user data into table
                dateformatelement = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'}

                td_name.innerText = profile.name
                td_mail.innerText = profile.email
                td_tel.innerText = profile.tel
                td_creation.innerText = new Date(profile.creation).toLocaleString([], dateformatelement)

                logout_button.addEventListener("click", logout)

                //adjust visibility
                cl.classList.remove("invisible");
                document.getElementById("logout_button").classList.remove("invisible");
                document.getElementById("login_header").innerText = "Mein Profil";
                document.getElementById("login_header").classList.remove("invisible");
                document.getElementById("loginform").classList.add("invisible");

            })
            .catch(err => {
                //document.getElementById('loading_spinner_avail').parentNode.remove();
                console.log(err);
                var content = document.getElementById("table_profile");
                var p = document.createElement("p");
                p.innerHTML = "Beim Aufruf des Profils ist ein Fehler aufgetreten."
                content.parentNode.replaceChild(p, content);
                document.getElementById("table_profile").classList.add("invisible");
            })
        } else { //invalid session. show login-form
            console.log("Session invalid. Please log in.");
            document.cookie = "cookie_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "cookie_username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.getElementById("table_profile").classList.add("invisible");
            document.getElementById("loading_spinner_profile").parentElement.classList.add("invisible");
            document.getElementById("login_header").classList.add("invisible")
            document.getElementById("loginform").classList.remove("invisible");
            document.getElementById("submit_login").addEventListener("click", login)
        }
    })
    .catch(error => console.error('Error:', error));
}
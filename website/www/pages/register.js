checkDarkmode(); //make sure stuff fits the general style
console.log("Preparing registration...")
document.getElementById("submit_register").addEventListener("click", submit_registration) //add functionality to submit-button

function submit_registration(){
    document.getElementById('loading_spinner_register').parentNode.classList.remove("invisible");
    document.getElementById('registerform').classList.add("invisible");
    //get data from register-form
    username = document.getElementById("register_username").value
    mail = document.getElementById("register_mail").value
    tel = document.getElementById("register_tel").value
    password = document.getElementById("register_password").value
    //check if all forms have been filled
    if (!username){
        console.log(`Registration failed: No password`);
        register_result = document.getElementById("register_result")
        register_result.innerHTML = "Fehler bei der Anlage des Accounts: Bitte Username angeben."
        register_result.classList.remove("invisible")
        document.getElementById('loading_spinner_register').parentNode.classList.add("invisible");
        document.getElementById('registerform').classList.remove("invisible");
        return
    }
    if (!mail){
        console.log(`Registration failed: No password`);
        register_result = document.getElementById("register_result")
        register_result.innerHTML = "Fehler bei der Anlage des Accounts: Bitte Telefonnummer angeben."
        register_result.classList.remove("invisible")
        document.getElementById('loading_spinner_register').parentNode.classList.add("invisible");
        document.getElementById('registerform').classList.remove("invisible");
        return
    }
    if (!tel){
        console.log(`Registration failed: No password`);
        register_result = document.getElementById("register_result")
        register_result.innerHTML = "Fehler bei der Anlage des Accounts: Bitte Telefonnummer angeben."
        register_result.classList.remove("invisible")
        document.getElementById('loading_spinner_register').parentNode.classList.add("invisible");
        document.getElementById('registerform').classList.remove("invisible");
        return
    }
    if (!password){
        console.log(`Registration failed: No password`);
        register_result = document.getElementById("register_result")
        register_result.innerHTML = "Fehler bei der Anlage des Accounts: Bitte Passwort angeben."
        register_result.classList.remove("invisible")
        document.getElementById('loading_spinner_register').parentNode.classList.add("invisible");
        document.getElementById('registerform').classList.remove("invisible");
        return
    }
    //send data to the server
    registerUser('/register', { 
        username: username,
        password: password,
        mail: mail,
        tel: tel 
    })
    .then(result => {
        document.getElementById('loading_spinner_register').parentNode.classList.add("invisible");
        if (result.status == 201){
            //registration successful
            console.log(`Registration successful: ${result}`);
            document.cookie = `cookie_session=${result.session}`;
            document.cookie = `cookie_username=${result.user}`;
            register_result = document.getElementById("register_result")
            register_result.innerHTML = "Account erfolgreich angelegt."
            register_result.classList.remove("invisible")
            checklogin();
        }
        else if (result.status == 500){
            //registration failed, server-side error
            console.log(`Registration failed: ${result}`);
            register_result = document.getElementById("register_result")
            register_result.innerHTML = "Fehler bei der Anlage des Accounts: interner Fehler."
            register_result.classList.remove("invisible")
        }
        else {
            //registration failed, general error
            console.log(`Registration failed: ${result}`);
            register_result = document.getElementById("register_result")
            register_result.innerHTML = "Fehler bei der Anlage des Accounts: allgemeiner Fehler."
            register_result.classList.remove("invisible")
        }
    });
}

//function to send the new user-data to the server. returns the server response.
async function registerUser(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
  }
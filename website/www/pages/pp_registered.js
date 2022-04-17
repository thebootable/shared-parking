checkDarkmode(); //make sure stuff fits the general style
console.log("Fetching registered spots")
document.getElementById("nr_registered_spots").addEventListener("click", pp_registered)

if ((getCookie("cookie_username") && getCookie("cookie_session"))){ //use auth
    console.log("Using stored session");
    pp_registered(); //this function is defined in the index.js
}
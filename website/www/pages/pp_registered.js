checkDarkmode();
console.log("Fetching registered spots")
document.getElementById("nr_registered_spots").addEventListener("click", pp_registered)

if ((getCookie("cookie_username") && getCookie("cookie_session"))){
    console.log("Using stored session");
    pp_registered();
}
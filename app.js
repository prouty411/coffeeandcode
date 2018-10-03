$(document).ready(initializeApp);

function initializeApp() {
    $('#carousel').carousel()
}
function displayMap() {
var mapProps = { 
    zoom: 8,
    center: {lat: -34.397, lng: 150.644}
}
var map = new google.maps.Map(document.getElementById("googleMap"), mapProps)
}
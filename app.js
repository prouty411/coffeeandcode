$(document).ready(initializeApp);

function initializeApp() {
    $('#carousel').carousel()
}
function displayMap() {
var mapProps = { 
    zoom: 12,
    center: { lat: 33.6846, lng: -117.8265}
}
var map = new google.maps.Map(document.getElementById("googleMap"), mapProps)
}
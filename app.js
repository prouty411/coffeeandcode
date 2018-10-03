$(document).ready(initializeApp);

function initializeApp() {
    $('#carousel').carousel();
    $("#search").click(initiateSearch);
    $('#library').click(selectType);
    $('#cafe').click(selectType);
  
}
function displayMap() {
let mapProps = { 
    zoom: 8,
    center: {lat: -34.397, lng: 150.644}
}
var map = new google.maps.Map(document.getElementById("googleMap"), mapProps)
}

function selectType() {
    if($(this).hasClass('highlight')) {
        $(this).removeClass('highlight');
        localStorage.clear();
    }
    else {
    $(".type").removeClass('highlight')
    $(this).addClass('highlight')
    var type = $(this).attr('id')
   console.log(type);
   localStorage.setItem('type', `${type}`)
    }
   
}

function initiateSearch() {
   let city  = $('#cityInput').val();
   localStorage.setItem("city", `${city}`);
    
}


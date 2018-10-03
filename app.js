$(document).ready(initializeApp);

function initializeApp() {
    $('#carousel').carousel();
    $("#search").click(initiateSearch);
    $('#library').click(selectType);
    $('#cafe').click(selectType);
  
}
function displayMap() {
var mapProps = { 
    zoom: 12,
    center: { lat: 33.6846, lng: -117.8265}
}
var map = new google.maps.Map(document.getElementById("googleMap"), mapProps)
}

function selectType() {
    //if what we click is highlited...
    if($(this).hasClass('highlight')) {
        $(this).removeClass('highlight');
        localStorage.clear();
    }
    //if what we clicked is NOT highlighted, remove the highlight from every button
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


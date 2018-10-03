$(document).ready(initializeApp);

function initializeApp() {
    $('#carousel').carousel();
    $("#search").click(initiateSearch);
    $('#libraries').click(selectType);
    $('#coffee').click(selectType);
}
function displayMap() {
let mapProps = { 
    zoom: 12,
    center: { lat: 33.6846, lng: -117.8265}
    }
let map = new google.maps.Map(document.getElementById("googleMap"), mapProps)
getYelpData(map);
}


function selectType() {
    if($(this).hasClass('highlight')) {
        $(this).removeClass('highlight');
        localStorage.clear();
    }
    else {
    $(".type").removeClass('highlight')
    $(this).addClass('highlight')
 ;   var types = $(this).attr('id')
   localStorage.setItem('types', `${types}`)
    }
   
}

function initiateSearch() {
   let city  = $('#cityInput').val();
   localStorage.setItem("city", `${city}`);
   window.location.href = "main.html";
    
}
/******** API DATA ******************************************* */
function getYelpData(map) {
    var city;
    var types; 
    var icon;
    if (localStorage.length) {
        debugger;
        city = localStorage.getItem("city");
        types = localStorage.getItem("types");
        localStorage.clear();
    }
    var settings = {

        "async": true,
        "url": "https://yelp.ongandy.com/businesses",
        "method": "POST",
        "dataType": "JSON",
        "data": {
            term: `${types}`,
            location: `${city}`,
            api_key: "w5ThXNvXEMnLlZYTNrvrh7Mf0ZGQNFhcP6K-LPzktl8NBZcE1_DC7X4f6ZXWb62mV8HsZkDX2Zc4p86LtU0Is9kI0Y0Ug0GvwC7FvumSylmNLfLpeikscQZw41pXW3Yx",
            categories: `${types}, All`,
            sort_by: "rating",
            radius: 8000,
            limit: 50,
        },
        success: function (response) {  
            
            map.setCenter({lat:response.businesses[0].coordinates.latitude, lng:response.businesses[0].coordinates.longitude})
          for (var index = 0; index < response.businesses.length; index++) {
            var pos = {
                  lat: response.businesses[index].coordinates.latitude,
                  lng: response.businesses[index].coordinates.longitude
              }
            
        var content = response.businesses[index].name;
           var infowindow = new google.maps.InfoWindow({
                content: content
              });
              console.log(types);
        if (types === `coffee`) {
            icon = "./cafe.svg"
        }
        else 
            {
                icon = "./library.svg"
            }
        var icon = {
                url: icon, // url
                scaledSize: new google.maps.Size(20, 20), // scaled size
            };
           var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: pos,
            title: response.businesses[index].name,
            icon: icon
            });
            google.maps.event.addListener(marker, 'click', (function(marker,content,infowindow){ 
                return function() {
                    infowindow.setContent(content);
                    infowindow.open(map,marker);
                    console.log(marker);
                };
            })(marker,content,infowindow));  
                    }
        },
        error: function (err) {
            console.log("error");
        }
    }
    $.ajax(settings);
}

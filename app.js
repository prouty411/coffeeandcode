$(document).ready(initializeApp);

function initializeApp() {
    $('#carousel').carousel();
    $("#search").click(initiateSearch);
    $('#libraries').click(selectType);
    $('#coffee').click(selectType);
    $('.location').click(getLocation);
    $('.homeButton').click(home);
    $(document).keypress(function(e) {
        if(e.which == 13) {
            e.preventDefault();
            $("#search").click();
        }
    });

}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        console.log('error');
    }
}

function showPosition(position) {
    console.log ("Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude);
}



function home(){
    localStorage.clear();
    window.location.href = "index.html";
}

function displayMap() {
    let mapProps = {
        zoom: 12,
        center: {
            lat: 33.6846,
            lng: -117.8265
        }
    }
    let map = new google.maps.Map(document.getElementById("googleMap"), mapProps)
    getYelpData(map);
}


function selectType() {
    //if what we click is highlited...
    if ($(this).hasClass('highlight')) {
        $(this).removeClass('highlight');
        localStorage.clear();
    }
    //if what we clicked is NOT highlighted, remove the highlight from every button
    else {
        $(".type").removeClass('highlight')
        $(this).addClass('highlight');
        var types = $(this).attr('id')
        localStorage.setItem('types', `${types}`)
    }

}

function initiateSearch() {
    if (localStorage.getItem("types") === null){
        $('#errorMessage').text('Please select cafe or library.');
        $('#errorModal').modal("show");
        return;
    }
    if($('#cityInput').val() === ''){
        $('#errorMessage').text('Please input a city.');
        $('#errorModal').modal("show");
        return;
    }
    let city = $('#cityInput').val();
    localStorage.setItem("city", `${city}`);
    window.location.href = "main.html";

}

function h2(text){
    return $('<h3>').text(text);
}
function convertPhone(string) {
    string = string.slice(2); 
    let array = string.split(''); 

    array.unshift('(');
    array[3] = array[3] + ') ';
    array[6] = array[6] + '-';
    return array.join('');
}

/******** API DATA ******************************************* */
function getYelpData(map) {
    var city;
    var types;
    var icon;
    if (localStorage.length) {
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
            // term: `${types}`,
            term: 'coffee shop',
            location: `${city}`,
            api_key: "w5ThXNvXEMnLlZYTNrvrh7Mf0ZGQNFhcP6K-LPzktl8NBZcE1_DC7X4f6ZXWb62mV8HsZkDX2Zc4p86LtU0Is9kI0Y0Ug0GvwC7FvumSylmNLfLpeikscQZw41pXW3Yx",
            categories: `${types}, All`,
            sort_by: "rating",
            radius: 8000,
            limit: 50,
        },
        success: function (response) {
            let {businesses} = response;
            console.log(businesses)
            let result = businesses.map((eachPlace, index) => {
                let {name, image_url, is_closed, display_phone, phone, url, location: {address1, city, zip_code}} = eachPlace;
                let image = $('<img>', {
                    src: image_url
                })
                let imageAreaElem = $('<div>').addClass('imageArea').append(image);
                let infoAreaElem = $('<div>').addClass('infoArea');
                let titleElem = $('<div>').addClass('title').append(h2(name));
                let phoneElem = h2(convertPhone(phone)).addClass('phone');
                let addressElem = h2(address1).addClass('address');
                let isOpenElem = h2(`${is_closed ? 'Currently Open ✅ ' : 'Currently Closed ❌'}`).addClass('isOpen');
                let marginElem = $('<div>').addClass('margin')
                infoAreaElem.append(titleElem, phoneElem, addressElem, isOpenElem, marginElem);
                let entireItem = $('<div>').addClass('resultContainer').append(imageAreaElem, infoAreaElem)
                $('#info-box').append(entireItem);
            })
            map.setCenter({
                lat: response.businesses[0].coordinates.latitude,
                lng: response.businesses[0].coordinates.longitude
            })
            for (var index = 0; index < response.businesses.length; index++) {
                var pos = {
                    lat: response.businesses[index].coordinates.latitude,
                    lng: response.businesses[index].coordinates.longitude
                }

                var content = response.businesses[index].name;
                var infowindow = new google.maps.InfoWindow({
                    content: content
                });

                if (types === `coffee`) {
                    icon = "./cafe.svg"
                } else {
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
                google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open(map, marker);

                    };
                })(marker, content, infowindow));
            }
        },
        error: function (err) {
            console.log("error");
        }
    }
    $.ajax(settings);
}
/*************************GOOGLE DIRECTIONS */
function getDirections(pos) { // Pass POS which is position of desire coffee shop or library 
   
   console.log(navigator.geolocation);
if (navigator.geolocation) {
   
        navigator.geolocation.getCurrentPosition(function(position) {
               var currentPos = {
                 lat: position.coords.latitude,
                 lng: position.coords.longitude
              }
              directionObjects = {
                origin: currentPos,
                destination: {lat:33.7385, lng:-117.8250 },
                travelMode: "DRIVING",
                } 
            
            var directionsService = new google.maps.DirectionsService
            directionsService.route(directionObjects, (response) => {
            directions = response.routes[0].legs[0].steps;
            // $('#info-box').empty();
            for (var i = 0; i < directions.length; i++) {
                console.log(directions[i].instructions)
                    // var currentDirection = $("<p>").html(directions[i].instructions);
                    // $('#info-box').append(currentDirection)
                }
                                    }); 
            
            })
        }
        
// directionObjects = {
//     origin: currentPos,
//     destination: {lat:33.7385, lng:-117.8250 },
//     travelMode: "DRIVING",
//     } 

// var directionsService = new google.maps.DirectionsService
// directionsService.route(directionObjects, (response) => {
// directions = response.routes[0].legs[0].steps;
// // $('#info-box').empty();
// for (var i = 0; i < directions.length; i++) {
//     console.log(directions[i].instructions)
//         // var currentDirection = $("<p>").html(directions[i].instructions);
//         // $('#info-box').append(currentDirection)
//     }
//                         }); 
    }


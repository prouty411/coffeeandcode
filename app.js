$(document).ready(initializeApp);
var previousRoute = false;

var lastMarker = false;



function initializeApp() {
   if (window.location.pathname === '/index.html') {
    localStorage.clear();
   }
   if (window.location.pathname ==='/main.html') {
       if (window.localStorage.length === 0) {
           home();
       }
   }
    $('#carousel').carousel();
    $("#search").click(initiateSearch);
    $('#libraries').click(selectType);
    $('#coffee').click(selectType);
    $('.location').click(getLocation);
    $('.homeButton').click(home);
    getLocation();
    $(document).keypress(function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#search").click();
        }
    });
    appendCity();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log('error');
        $(".carouselContainer").addClass("hideCarousel");

    }
}

function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getCarouselYelpData(latitude, longitude);
    $(".carouselContainer").removeClass("hideCarousel");

}




function home() {
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
    }
    //if what we clicked is NOT highlighted, remove the highlight from every button
    else {
        $(".type").removeClass('highlight')
        $(this).addClass('highlight');
        var types = $(this).attr('id')
        localStorage.setItem('types', `${types}`)
    }

}

function appendCity() {
    let citySearched = localStorage.getItem('city');
    $('.city-name').text('City Searched: ' + citySearched);
}

function initiateSearch() {
    if (localStorage.getItem("types") === null) {
        $('#errorMessage').text('Please select cafe or library.');
        $('#errorModal').modal("show");
        return;
    }
    if ($('#cityInput').val() === '') {
        $('#errorMessage').text('Please input a city.');
        $('#errorModal').modal("show");
        return;
    }
    if(localStorage.city){
        window.location.href = "main.html";
        return;
    }
    let city = $('#cityInput').val();
    localStorage.setItem("city", `${city}`);
    window.location.href = "main.html";
}

function h2(text) {
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

function getDetailedYelpData(id, map) {
    $('#details-modal').modal('show');
    let ajaxOptions = {
        'async': true,
        "url": 'https://yelp.ongandy.com/businesses/details',
        "method": 'POST',
        "dataType": 'JSON',
        "data": {
            api_key: "w5ThXNvXEMnLlZYTNrvrh7Mf0ZGQNFhcP6K-LPzktl8NBZcE1_DC7X4f6ZXWb62mV8HsZkDX2Zc4p86LtU0Is9kI0Y0Ug0GvwC7FvumSylmNLfLpeikscQZw41pXW3Yx",
            id
        },
        success: function (response) {
            console.log(response);
            //photos is an array of photos
            //is_open_now is a boolean
            let {
                hours,
                name,
                url,
                image_url,
                photos,
                price,
                rating,
                location: {
                    display_address
                },
                coordinates: {
                    latitude,
                    longitude
                }
            } = response;

            let is_open_now = hours[0].is_open_now;
            photos = photos[2]
            display_address = display_address[0] + ' ' + display_address[1];
            console.log(display_address);
            $('#details-header').text(name);
            $('.detailed-image > img').attr('src', photos);
            $('.detailed-address').text(display_address)
            $('.detailed-open').text(`${is_open_now ? 'Open Now ✅' : 'Currently Closed ❌'}`);
            $('.detailed-price').text(`Price range: ${price}`);
            $('.detailed-rating').text(`${rating}/5 stars`);
            $('.detailed-url').attr('href', url);
            $('#directions-button').on('click', function () {
                getDirections(longitude, latitude, map);
            })


        },
        error: function (error) {
            console.log(error);
        }
    }

    $.ajax(ajaxOptions);
}

/******** API DATA FOR CAROUSEL******************************* */
function getCarouselYelpData(latitude, longitude) {
    var types;
    if (localStorage.length) {
        types = localStorage.getItem("types");
    }
    var settings = {
        "async": true,
        "url": "https://yelp.ongandy.com/businesses",
        "method": "POST",
        "dataType": "JSON",
        "data": {
            term: `${types}`,
            latitude: latitude,
            longitude: longitude,
            api_key: "w5ThXNvXEMnLlZYTNrvrh7Mf0ZGQNFhcP6K-LPzktl8NBZcE1_DC7X4f6ZXWb62mV8HsZkDX2Zc4p86LtU0Is9kI0Y0Ug0GvwC7FvumSylmNLfLpeikscQZw41pXW3Yx",
            categories: `${types}, All`,
            sort_by: "rating",
            radius: 8000,
            limit: 10,
        },
        success: function (response) {
            let {
                businesses
            } = response;
            let result = businesses.map((eachPlace, index) => {
                let {
                    name,
                    image_url,
                    display_phone,
                    phone,
                    url,
                    location: {
                        address1,
                        city,
                        zip_code
                    }
                } = eachPlace;
                let image = $('<img>', {
                    src: image_url,
                    class: "img-fluid mx-auto d-block"
                })
                let infoDiv = $('<div>').addClass('carouselInfoDiv').append(name);
                let carouselDiv = $('<div>').addClass('carousel-item col-md-3').append(image, infoDiv);
                $('.carouselItems').append(carouselDiv);
            })
        },
        error: function (err) {
            console.log(err);
        }
    }
    $.ajax(settings);
}

/******** API DATA ******************************************* */
function getYelpData(map) {
    var city;
    var types;
    var icon;
    if (localStorage.length) {
        city = localStorage.getItem("city");
        types = localStorage.getItem("types");

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
            categories: `${types}, US`,
            sort_by: "rating",
            radius: 8000,
            limit: 50,
        },
        success: function (response) {
            let {
                businesses
            } = response;
            let result = businesses.map((eachPlace, index) => {
                let {
                    id,
                    name,
                    image_url,
                    is_closed,
                    display_phone,
                    phone,
                    url,
                    price,
                    rating,
                    location: {
                        address1,
                        city,
                        zip_code
                    }
                } = eachPlace;
                let image = $('<img>', {
                    src: image_url
                })
                let imageAreaElem = $('<div>').addClass('imageArea').append(image);
                let infoAreaElem = $('<div>').addClass('infoArea');
                let titleElem = $('<div>').addClass('title').append(h2(name));
                let phoneElem = h2(convertPhone(phone)).addClass('phone');
                let addressElem = h2(address1).addClass('address');
                let moreInfoElem = $('<div>').addClass('moreInfo').text('More Info')
                infoAreaElem.append(titleElem, phoneElem, addressElem, moreInfoElem);
                let entireItem = $('<div>').addClass('resultContainer').append(imageAreaElem, infoAreaElem)
                $('#info-box').append(entireItem);
                moreInfoElem.on('click', function () {     
                    getDetailedYelpData(id,map);
                })
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

                var content = response.businesses[index].name + "<p class='markerInfo'>More Info</p>";
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
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    position: pos,
                    title: response.businesses[index].name,
                    icon: icon,
                    id: response.businesses[index].id
                });
                google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                    currWindow = false;
                    return function () {
                        if (lastMarker) {
                            lastMarker.close();
                        }
                        infowindow.setContent(content);
                        infowindow.open(map, marker);
                        lastMarker = infowindow;
                        $(".markerInfo").click(() => getDetailedYelpData(this.id, map));

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
/*************************GOOGLE DIRECTIONS *************************************************/
function getDirections(long, lat, map) { // Pass POS which is position of desire coffee shop or library 
    var cafePOS = {
        lat: lat,
        lng: long
    }
    if (navigator.geolocation) {
        console.log("here in nav: google directions")
        navigator.geolocation.getCurrentPosition(function (position) {
            var currentPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            directionObjects = {
                origin: currentPos,
                destination: cafePOS,
                travelMode: "DRIVING",
                avoidTolls: true,
                unitSystem: google.maps.UnitSystem.IMPERIAL,
            }
            console.log(directionObjects);
            var directionsService = new google.maps.DirectionsService
            let display = new google.maps.DirectionsRenderer({
                draggable: false,
                map: map,
            });
            directionsService.route(directionObjects, (response, status) => {
                console.log(response)
                directions = response.routes[0].legs[0].steps;
                var estimateTime = response.routes[0].legs[0];
                if (status === 'OK') {
                    if (previousRoute) {
                        previousRoute.setMap(null);
                    }
                    previousRoute = display;
                    display.setDirections(response);
                    console.log(response);
                    $('#info-box').empty();
                    var distance = $("<p>").html("<b>Estimated Distance</b>: " + estimateTime.distance.text)
                    var travelTime = $("<p>").html("<b>Estimated Travel TimeTime </b>: " + estimateTime.duration.text)
                    var directionDiv = $('<div>').addClass('directions');
                    for (var i = 0; i < directions.length; i++) {

                        var currentDirection = $("<p>").html(directions[i].instructions);
                        $(directionDiv).append(currentDirection)
                    }
                    var backbutton = $("<button>").addClass("backButton").text("Back");
                    $(directionDiv).append(distance, travelTime, backbutton);
                    $('#info-box').append(directionDiv)
                    $('.backButton').click(initiateSearch)
                    $('#details-modal').modal('hide');
                }
                previousRoute = display;
                display.setDirections(response);
                // $('#info-box').empty();
                for (var i = 0; i < directions.length; i++) {
                    // var currentDirection = $("<p>").html(directions[i].instructions);
                    // $('#info-box').append(currentDirection)
                }

            });

        })
    }
}


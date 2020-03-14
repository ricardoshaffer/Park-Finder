  // STRUCTURE OF FUNCTIONALITY POST ON-CLICK ACTIVITY ///////
  //// 1A. User is prompted for permission for location.
  //// 1B. User IP Address is reversed searched via https://IPAPI.CO API.
  //// 2.  Response from 1B. is plugged into https://NPS.Gov API to get state National Parks.
  //// 3.  Response from 1A. is plugged into MapQuest API to generate user Pin location.
  //// 4.  Response from 2. lat. & long. is plugged into MapQuest API to generate Park Locations.
  //// 5.  Response from 2. is appended to MQ Pin as a button to trigger a modal upon click.
  //// 6.  Park Lat. & Long. is measured against user Lat. & Long. to determine direct distance for general proximity.

let parsedDistance ='';

document.addEventListener("DOMContentLoaded", function (event) {
    $("#location-finder").on("click", function(event) {
        event.preventDefault();
/// HIDES HERO BANNER ///
    $(".hero").attr("style", "display: none;");
/// SHOWS THE MAP AREA ///
    $("#body").attr("style", "display: inline;");
/// PROMPTS FOR PERMISSION TO USE PERMISSION /////
    let locatorText = document.getElementById("mapperID");
      getLocation();
      function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        } else {
        locatorText.innerHTML = "Geolocation is not supported by this browser.";
        }
      }
//// GETS USER API & GETS STATE CODE RESPONSE FOR NPS API IF USER DOESN'T GIVE PERMISSION ///
      function showPosition(position) {
          locatorText.innerHTML = "Latitude: " + position.coords.latitude + 
          "<br>Longitude: " + position.coords.longitude;
          console.log("the position: " + position);
          if (position == null || position == false){
            $.get('https://ipapi.co/ip/', function(data){
                let ipFetched = data;
                console.log(ipFetched);
                let ipEmbed = "https://ipapi.co/" + ipFetched + "/json/";
            $.getJSON(ipEmbed, function(data){
                let ipTrace = data;
                console.log(ipTrace);
                position.coords.latitude = ipTrace.latitude;
                position.coords.longitude = ipTrace.longitude;
          })
        })}
/// GETS USER API & GETS STATE CODE RESPONSE FOR NPS API
          $.get('https://ipapi.co/ip/', function(data){
              let ipFetched = data;
              console.log("user IP: " + ipFetched);
              let ipEmbed = "https://ipapi.co/" + ipFetched + "/json/";
          $.getJSON(ipEmbed, function(data){
              let ipTrace = data;
              console.log(ipTrace);
              stateLocation = ipTrace.region_code;
              console.log("state location: "+ stateLocation);
/// SETS NPS API USING IPAPI.CO STATE IDENTIFICATION ///
      let limitResults = "&limit=50";
      let apiKey = "C20X2gP148EDeslk7stqM8BU6u6WmOqbAdPeKG8C";
/// NATIONAL PARKS API:
              /// TO CHANGE RESPONSE QTY: Modify "&limit=15" (min. 1 to max. 50)
      let queryURL = "https://developer.nps.gov/api/v1/parks?stateCode="+ stateLocation +"&limit=15&api_key=C20X2gP148EDeslk7stqM8BU6u6WmOqbAdPeKG8C";
//// GENERATES a mapquest map utilizing the lat & long of the user ///
      L.mapquest.key = 'm6r48gcKnaiZ5cS9fynPUC8mEcXnoOjO';
        let map = L.mapquest.map('map', {
        center: [position.coords.latitude, position.coords.longitude],
        layers: L.mapquest.tileLayer('dark'), /// CONTROLS MAP COLOR: 'light', 'dark', 'hybrid', 'satellite'
        zoom: 9, /// CONTROLS ZOOM; HIGHER #, THE MORE ZOOMED IN
        opacity: 0.7
        });
/// CREATES PIN FOR PHYSICAL LOCATION OF THE USER
        map.addControl(L.mapquest.locatorControl()); // <<< embed map icon (target), to get user's new location
      L.marker([position.coords.latitude, position.coords.longitude], {
        icon: L.mapquest.icons.marker(),
        draggable: false
        }).addTo(map);
/// CALLS NPS API 
      $.ajax({ //
        url: queryURL, 
        method: "GET"
      }).then(function(response){
        let npsResponse = response;
        console.log(npsResponse);
        for(entry=0; entry < 10; entry++){
    
/// NPS RESPONSE / INFORMATION FOR MAP MODAL POPULATION ///
            parkTitle = npsResponse.data[entry].fullName;
            parkDescription = npsResponse.data[entry].description;
            parkDirectionURL = npsResponse.data[entry].directionsUrl;
            parkBannerBackground = npsResponse.data[entry].images[0].url;
            standardHoursMonday= "Monday: " + npsResponse.data[entry].operatingHours[0].standardHours.monday;
            standardHoursTuesday="Tuesday: " + npsResponse.data[entry].operatingHours[0].standardHours.tuesday;
            standardHoursWednesday="Wednesday: " +npsResponse.data[entry].operatingHours[0].standardHours.wednesday;
            standardHoursThursday="Thursday: " +npsResponse.data[entry].operatingHours[0].standardHours.thursday;
            standardHoursFriday="Friday: " +npsResponse.data[entry].operatingHours[0].standardHours.friday;
            standardHoursSaturday="Saturday: " +npsResponse.data[entry].operatingHours[0].standardHours.saturday;
            standardHoursSunday="Sunday: " +npsResponse.data[entry].operatingHours[0].standardHours.sunday;
            parkFeeOne = npsResponse.data[entry].entranceFees[0];
            parkFeeTwo =  npsResponse.data[entry].entranceFees[1];
/// USES PARK LAT & LONG TO CREATE PARK PINS
            parkLatLong = (npsResponse.data[entry].latLong).replace("{", "").replace("}","");
            if(parkLatLong != ''){
            parkLatLong = parkLatLong.split(',');
            parkLat = (parkLatLong[0])
            let parkLatClean = parkLat.replace("lat:", "");
            parkLong = (parkLatLong[1])
            let parkLongClean = parkLong.replace("long:", "");
/// APPENDS BUTTON TO MAPQUEST API ///
            let parkButton = document.createElement("button");
//CALCULATES THE DISTANCE FROM THE USER'S LOCATION TO THAT OF THE NPS LOCATION USING LAT & LONG//
    function distanceMeasurement (){
      let radlat1 = Math.PI * (position.coords.latitude)/180;
      let radlat2 = Math.PI * parkLatClean/180;
      let theta =  position.coords.longitude - parkLongClean;
      let radtheta = Math.PI * theta/180;
          let distOne = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(distOne);
          distTwo = dist * 180/Math.PI;
      distUnitless = distTwo * 60 * 1.1515;
      
      distKM = distUnitless * 1.609344;
      distMiles = (distKM / 1.6093444);
      distMiles = distMiles.toFixed(1);
      console.log("the distance in miles: " + distMiles);
      return distMiles;
      
  }
  distanceMeasurement();

////// MODAL POPULATION////////
  let modalContainer = document.createElement("div");
      $(modalContainer).attr("class", "modal");
      $(modalContainer).attr("id", parkTitle);
    let modalBackground = document.createElement("div");
      $(modalBackground).attr("class", "modal-background");
      $(modalContainer).prepend(modalBackground);
    let modalCard = document.createElement("div");
      $(modalCard).attr("class", "modal-card");
      $(modalContainer).append(modalCard);
      let modalHead = document.createElement("head");
        $(modalHead).attr("class","modal-card-head");
        $(modalCard).append(modalHead);
        $(modalHead).text(parkTitle + ", only "+distMiles+"mi. away*");
      let modalClose = document.createElement("button");
        $(modalClose).attr("class", "modal-close is-large");
        $(modalClose).attr("aria-label", "close");
        $(modalClose).on("click", function(event) {
          event.preventDefault();
          $(modalContainer).attr("class","modal");
          })
          $(".modal-background").on("click", function(event) {
            event.preventDefault();
            $(modalContainer).attr("class","modal");
            })
        $(modalContainer).append(modalClose);
      let modalSection = document.createElement("section");
        $(modalSection).attr("class", "modal-card-body");
        $(modalSection).text(parkDescription);
/// modalsecion below contains modal image background URL & fallback color of orange (#f15025) in case image does not load. ///
        $(modalSection).attr("style","background-image:url('assets/northern-forest.jpg'); background-size: cover; color: #fff; background-repeat: no-repeat;background-color: #f15025;");
          descriptionHeading = document.createElement('H2');
          descriptionHeading.innerHTML = "<u>Why Visit</u>";
          parkWeeklyHours = document.createElement('ul');
          parkWeeklyHours.innerHTML = "<u>Hours</u>";
          dayofWeek = [standardHoursMonday, standardHoursTuesday, standardHoursWednesday, standardHoursThursday, standardHoursFriday, standardHoursSaturday, standardHoursSunday];
          for (let day=0; day< dayofWeek.length; day++){
              parkDailyHours =document.createElement('li');
              parkWeeklyHours.appendChild(parkDailyHours);
              parkDailyHours.innerHTML=parkDailyHours.innerHTML + dayofWeek[day];
          }
        $(modalSection).prepend(descriptionHeading);
        $(modalSection).append(parkWeeklyHours);
        parkDirectionURL = document.createElement('a');
          $(parkDirectionURL).attr("target", "_blank");
          $(parkDirectionURL).attr("href",directionURL);
          parkDirectionURL.innerHTML = "directions to " + parkTitle;
        $(modalSection).append(parkDirectionURL);
        $(modalCard).append(modalSection);
        $("#modalArea").append(modalContainer);


//// NOT USED DUE TO LACK OF BENEFIT:  DISTANCE DRIVING TIME FROM MAPQUEST ////
  // let MQxhr = new XMLHttpRequest();
  // mapQURL = "http://www.mapquestapi.com/directions/v2/routematrix?key=m6r48gcKnaiZ5cS9fynPUC8mEcXnoOjO";
  // MQxhr.open("POST", mapQURL, true);
  // MQxhr.setRequestHeader("Content-Type", "json");
  // MQxhr.onreadystatechange = function () {
  //     if (MQxhr.readyState === 4 && MQxhr.status === 200) {
  //         var json = JSON.parse(MQxhr.responseText);
  //         jsonDistance = json.distance;
  //         parsedDistance = jsonDistance[1];
  //         console.log("parsed Distance: " + parsedDistance);
  //         console.log("distances: " + json.distance +", time: " + json.time);
  //     }
  // };
  // var data = JSON.stringify({
  //   "locations":[
  //     position.coords.latitude +","+ position.coords.longitude,
  //       parkLatClean + ","+parkLongClean
  //       ],
  //       "options": {
  //         "allToAll": true
  //       }
  //     });
  //     MQxhr.send(data);
  //     MQxhr.onreadystatechange();
      
  // console.log(data);
//////// CREATE LIST ON 'DIRECTIONS COLUMN COLLAPSIBLE 
dropdownContainer = document.createElement("div");
  $(dropdownContainer).attr("class","dropdown");
  $(dropdownContainer).attr("id", "dropdown-toggle"+ [entry]);
  $(dropdownContainer).attr("style", "width:100%; margin: 5px;");
  dropdownTrigger = document.createElement("div");
    $(dropdownTrigger).attr("class","dropdown-trigger");
    $(dropdownTrigger).attr("style","width: 100%;");  
    $(dropdownContainer).append(dropdownTrigger);
    dropdownButton = document.createElement("button");
      $(dropdownButton).attr("class", "button is-success is-rounded is-fullwidth");
      $(dropdownButton).attr("aria-haspopup", "true");
      $(dropdownButton).attr("aria-controls", "dropdown-menu-" +[entry]);
      dropdownTitle = document.createElement("span");
        titleTrim = parkTitle.substring(0, 30);
        $(dropdownTitle).text([entry] + ". " + titleTrim +"...");
        dropdownIconSpan = document.createElement("span");
          $(dropdownIconSpan).attr("class","span-dropdown-width")
          $(dropdownIconSpan).attr("class", "icon is-small");
          dropdownIcon = document.createElement("i");
            $(dropdownIcon).attr("class", "fas fa-angle-down");
            $(dropdownIcon).attr("aria-hidden", "true");
        $(dropdownTrigger).append(dropdownButton);
        $(dropdownButton).append(dropdownTitle);
        $(dropdownButton).append(dropdownIconSpan);
        $(dropdownIconSpan).append(dropdownIcon);
  dropdownMenu = document.createElement("div");
    $(dropdownMenu).attr("class", "dropdown-menu");
    $(dropdownMenu).attr("role", "menu");
    $(dropdownMenu).attr("id", "dropdown-menu-" +[entry]);
    dropdownContent = document.createElement("div");
    $(dropdownContent).attr("class", "dropdown-content");
    dropdownItem = document.createElement("div");
      $(dropdownItem).attr("class", "dropdown-item");
      $(dropdownItem).text("<h2>"+parsedDistance+"</h2>");
      $(dropdownItem).text(parkDescription);
    $(dropdownContent).append(dropdownItem);
    $(dropdownMenu).append(dropdownContent);
  $(dropdownContainer).append(dropdownMenu);
$("#park-links").append(dropdownContainer);

$("#dropdown-toggle"+ [entry]).on("click", function(event) {
  this.classList.toggle('is-active');
    }
  )
//// adds one park image per each location to 'directions' section ///
parkImageSection = document.createElement("img");
parkimageTitle = document.createElement("h2");
$(parkimageTitle).text([entry] + ". " + parkTitle);
//$("#park-images").append(parkimageTitle);
$(parkImageSection).attr("style", "width: 100%;");
$(parkImageSection).attr("src", parkBannerBackground);
$(parkImageSection).attr("alt", parkTitle);
$(dropdownContent).append(parkImageSection);

/// adds marker to the map for 'X' AMOUNT OF LOCATIONS FROM NPS FOR THE STATE ///
              L.mapquest.textMarker([parkLatClean, parkLongClean],{
                shadow: true,
                type: 'marker',
                icon: {
                title: parkTitle,
                tooltip: parkTitle,
                primaryColor: '#f14025',
                secondaryColor: '#ffffff',
                symbol: [entry],
                size: 'sm',
              draggable: false
            }
///APPENDS BUTTON CLASS TO MAP PIN ON-CLICK EVENT ///
            }).bindPopup(parkButton).addTo(map);
            $(parkButton).attr("id", parkLongClean);
            $(parkButton).attr("class","button is-light");
           $(parkButton).text(parkTitle);
           $(parkButton).attr("data-target", parkTitle);
           $(parkButton).on("click", function(event) {
            event.preventDefault();
            $(modalContainer).attr("class", "modal is-active");
           })
  $("#location-title").text(fullName);
  $("#location-info").text(addressLine2);
  console.log("parkTitle response: " + parkTitle+ ",distance in miles from current location: "+ distMiles);
              }
            }
        })
      })
    })
  }})
  })
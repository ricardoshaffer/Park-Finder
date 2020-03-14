$("#modal-close").click(function() {
    $(".modal").removeClass("is-active");
  });
  $("#location-info").click(function() {
    $(".modal").addClass("is-active");  
  });

let incrementButton = $(".increment-button");
let decrementButton = $(".decrement-button");
let index=-1;

let queryURL = "https://developer.nps.gov/api/v1/parks?stateCode=MD&limit=5&api_key=C20X2gP148EDeslk7stqM8BU6u6WmOqbAdPeKG8C";
let npsResponse;

let fullName;
let contactEmail;
let contactPhone;
let directionInfo;
let directionURL;
let standardHoursMonday;
let standardHoursTuesday;
let standardHoursWednesday;
let standardHoursThursday;
let standardHoursFriday;
let standardHoursSaturday;
let standardHoursSunday;
let latitude;
let longitude;
let description;
let addressType1;
let addressType2;

let addressLine1;
let addressLine2;
let addressLine3;
let addressCity;
let addressZip;
let addressState;
let displayAddress;
let addressIndex;

// helper functions

// returns index of physical address - if first one is "physical", sets to 0, if second is "physical", sets to 1

function determinePhysical(addressType1,addressType2) {
    if (addressType1 == "Physical") {
        return addressIndex=0;
    } else {
        return addressIndex=1;
    }
}


incrementButton.on("click",function(){
    index++;
    $.ajax({ //
        url: queryURL, 
        method: "GET"
    }).then(function(response){
        console.log(response);
        npsResponse=response;
    

        fullName = response.data[index].fullName;
        contactEmail = response.data[index].contacts["emailAddresses"][0].emailAddress;
        contactPhone = response.data[index].contacts.phoneNumbers[0].phoneNumber;
        directionInfo=response.data[index].directionsInfo;
        directionURL=response.data[index].directionsUrl;
        standardHoursMonday=response.data[index].operatingHours[0].standardHours.monday;
        standardHoursTuesday=response.data[index].operatingHours[0].standardHours.tuesday;
        standardHoursWednesday=response.data[index].operatingHours[0].standardHours.wednesday;
        standardHoursThursday=response.data[index].operatingHours[0].standardHours.thursday;
        standardHoursFriday=response.data[index].operatingHours[0].standardHours.friday;
        standardHoursSaturday=response.data[index].operatingHours[0].standardHours.saturday;
        standardHoursSunday=response.data[index].operatingHours[0].standardHours.sunday;
        latitude=response.data[index].latitude;
        longitude=response.data[index].longitude;
        description = response.data[index].description;

        addressType1=response.data[index].addresses[0].type;
        addressType2=response.data[index].addresses[1].type;

        // determine these based on the result from determinePhysical -> use this as the index
        console.log(determinePhysical(addressType1,addressType2));
        addressLine1=response.data[index].addresses[determinePhysical(addressType1,addressType2)].line1;
        addressLine2=response.data[index].addresses[determinePhysical(addressType1,addressType2)].line2;
        addressLine3=response.data[index].addresses[determinePhysical(addressType1,addressType2)].line3;
        addressCity=response.data[index].addresses[determinePhysical(addressType1,addressType2)].city;
        addressZip=response.data[index].addresses[determinePhysical(addressType1,addressType2)].postalCode;
        addressState=response.data[index].addresses[determinePhysical(addressType1,addressType2)].stateCode;
        
        console.log("fullname: " + fullName + "\nEmail: " + contactEmail + "\nPhone: " + contactPhone + "\nDirections: " + directionInfo + "\nLink to Directions: " + directionURL);
        console.log("latitude: " + latitude + "\nlongitude: " + longitude + "\nDescription: " + description);
        console.log("Monday hours " + standardHoursMonday + "\nTuesday hours " + standardHoursTuesday +"\nWednesday hours " + standardHoursWednesday + "\nThursday hours " + standardHoursThursday + "\nFriday hours " + standardHoursFriday +"\nSaturday hours " + standardHoursSaturday + "\nSunday Hours " + standardHoursSunday)
        console.log("Address: " + "\n" + addressLine1 +  "\n" + addressCity + " " + addressState + " " + addressZip);
    })
})

decrementButton.on("click",function(){
    index--;
    if (index < 0) {
        index = 0;
    }
    $.ajax({ //
        url: queryURL, 
        method: "GET"
    }).then(function(response){
        // console.log(response);
        npsResponse=response;
    
        fullName = response.data[index].fullName;
        contactEmail = response.data[index].contacts["emailAddresses"][0].emailAddress;
        contactPhone = response.data[index].contacts.phoneNumbers[0].phoneNumber;
        directionInfo=response.data[index].directionsInfo;
        directionURL=response.data[index].directionsUrl;
        standardHoursMonday=response.data[index].operatingHours[0].standardHours.monday;
        standardHoursTuesday=response.data[index].operatingHours[0].standardHours.tuesday;
        standardHoursWednesday=response.data[index].operatingHours[0].standardHours.wednesday;
        standardHoursThursday=response.data[index].operatingHours[0].standardHours.thursday;
        standardHoursFriday=response.data[index].operatingHours[0].standardHours.friday;
        standardHoursSaturday=response.data[index].operatingHours[0].standardHours.saturday;
        standardHoursSunday=response.data[index].operatingHours[0].standardHours.sunday;
        latitude=response.data[index].latitude;
        longitude=response.data[index].longitude;
        description = response.data[index].description;

        addressType1=response.data[index].addresses[0].type;
        addressType2=response.data[index].addresses[1].type;

        // determine these based on the result from determinePhysical -> use this as the index
        console.log(determinePhysical(addressType1,addressType2));
        addressLine1=response.data[index].addresses[determinePhysical(addressType1,addressType2)].line1;
        addressLine2=response.data[index].addresses[determinePhysical(addressType1,addressType2)].line2;
        addressLine3=response.data[index].addresses[determinePhysical(addressType1,addressType2)].line3;
        addressCity=response.data[index].addresses[determinePhysical(addressType1,addressType2)].city;
        addressZip=response.data[index].addresses[determinePhysical(addressType1,addressType2)].postalCode;
        addressState=response.data[index].addresses[determinePhysical(addressType1,addressType2)].stateCode;
        
        console.log("fullname: " + fullName + "\nEmail: " + contactEmail + "\nPhone: " + contactPhone + "\nDirections: " + directionInfo + "\nLink to Directions: " + directionURL);
        console.log("latitude: " + latitude + "\nlongitude: " + longitude + "\nDescription: " + description);
        console.log("Monday hours " + standardHoursMonday + "\nTuesday hours " + standardHoursTuesday +"\nWednesday hours " + standardHoursWednesday + "\nThursday hours " + standardHoursThursday + "\nFriday hours " + standardHoursFriday +"\nSaturday hours " + standardHoursSaturday + "\nSunday Hours " + standardHoursSunday)
        console.log("Address: " + addressLine1 + " " + addressLine2 + " " + addressLine3 + ", " + addressCity + ", " + addressState + " " + addressZip);
    })
    

})
// let parkButton = document.createElement("button");
// // $(parkButton).attr("class", "modal-button");
// // $(parkButton).attr("data-target", "modal-ter");
// // $(parkButton).attr("aria-haspopup","true");
// $(parkButton).attr("id", "location-info");
// $(parkButton).attr("class","button");
// $(parkButton).text(fullName);
// $("#location-title").text(fullName);
// $("#location-info").text(addressLine2);
// $("#location-info")
// $("#location-info").click(function() {
// $(".modal").addClass("is-active");  
// });
$(document).ready(function() {

// run the init function every 'x' seconds
setInterval(function(){ 
  init();
}, 3000);



function init() {

 // For each line
 // Calculate the offset position of each station and add as data attribute 
 $('.train-line ul li').each(function(index, value) {
   var position = $(value).position();
   //console.log(position);
   $(this).attr('data-position', position.top.toFixed(0));
 });
 


 // Then, pull in the data from the api 
 // Group the data by line
$.ajax({
  url:'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/all?api_key=ff917ec2243b4b2c9b33d0264d521f1a',  
      success:function(data) {
         console.log(data);
          
          // group data by line
          var trains = _.groupBy(data.Trains, 'Line');
          var stations = [];
          var boarding = [];

          
          // for each line, group data by station
          $.each(trains, function(index, value) {
            //stations = _.groupBy(value, 'LocationName');
            var times = _.groupBy(value, 'Min');
            boarding.push(times);
            var names = _.groupBy(value, 'LocationName');
            stations.push(names);
          });
          
          console.log(stations);
            
  			
          
          // For each line go through and calculate number of trains
 		  // Attach train to their lines and direction
 		  // Start by removing all trains
 		  $('.train').remove();
          $.each(boarding, function(index, value) {

            
             $.each(value.BRD, function(index, train) {
               $('.train-line ul li').each(function(index, station) {
                  var stationName = $(this).text();
                  if (stationName === train.LocationName) {
                    if (train.Group === '1') {
                      $(this).append('<div class="train outbound-train">train</div>');
                    } else {
                      $(this).append('<div class="train inbound-train">train</div>');
                    }
                  }
               });
             });
          });
          
          
          
          
         
      }
   });
 

}
 
   //For each train, look at wait-time value and Location Name
  // Update train positon to location name, offset position based on wait-time/distance from stations (75px) and direction
  
   
 // If wait-time=boarding, make train blink       


});
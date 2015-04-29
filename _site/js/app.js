$(document).ready(function() {

// run the init function every 'x' seconds
setInterval(function(){ 
  init();
}, 500);

// loop over all the transfer divs and call the draw function for each one
$('.transfer').each(function(index, value) {
 var station = $(this).attr('data-official-title'); 
 var transferElement = $(this);
 drawTransfers(station, transferElement);
});

// redraw transfer divs on window resize
$(window).resize(function() {
 $('.transfer').each(function(index, value) {
 var station = $(this).attr('data-official-title'); 
 var transferElement = $(this);
 drawTransfers(station, transferElement);
 });
});

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
                  var lineColor = $(this).parent('ul').attr('data-line');
                  var stationName = $(this).attr('data-official-title');
                  if (stationName === train.LocationName && lineColor === train.Line) {
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

		function drawTransfers(stationTitle, transferElement) {
    
    	// for each station where the official name = X draw an absolute container element
        var transfer = $('li[data-official-title="' + stationTitle + '"]');
        console.log(transfer);
        var transferLength = transfer.length -1;
        //console.log(transferLength);
        var colWidth = $('.col-md-2').width();
        var topLeft = $(transfer[0]).offset(); 
        var topRight = $(transfer[transferLength]).offset();
        var width = topRight.left + colWidth - topLeft.left;
       
        
        // update positions
        $(transferElement).css('top', topLeft.top + 'px');
        $(transferElement).css('left', topLeft.left + 'px');
        $(transferElement).css('width', width + 'px');
         //console.log(topRight);  
          //console.log(topLeft); 
          
        }
          
          
});
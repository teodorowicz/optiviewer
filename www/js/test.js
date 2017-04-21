

/*

$( 'body' ).click(function( event ) {
  console.log( "clicked: " + event.target );
});

*/


/*
var weather = ""
        var ajax_call = "http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139";
        $.ajax({
           type: "GET",
           url: ajax_call,
           dataType: "jsonp",
           success: function(response){
                $.each(response, function(key, value) {
                   //alert(key+"====="+value)
                    if(key == "coord"){
                        weather += '<div><strong>coord<strong><div>';
                        $.each(value, function(key, value) {
                            if(key == "lon")
                               weather += '<div>lon: '+value+'<div>';
                           if(key == "lat")
                               weather += '<div>lat: '+value+'<div>';
                        });
                    }
                });
                alert(weather) 
                console.log(weather)

           }
        }).done(function() {

        }) 
*/


/*
* Validate input to be a correct url
* make ajax call
*/


function _validate_url(input){
  // Remove any http:// and https:// in string
  var i = input.replace("http://");
  var j = i.replace("https://");

  // Define Regex
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);


  // Validate url input
  if (j.match(regex)) {
    alert("Successful match");
    return true;
  } else {
    alert("No match");
    return false;
  }
}

function _make_api_call(url){
  $.get(
    "https://whquhxg9ii.execute-api.eu-west-1.amazonaws.com/dev/dns-prefetch/" + url,
    function(data){
      console.log(data);
      alert( "Load was performed." );
    }
  )
}

$( document ).ready(function(){

  $('.go').click(function(e){
    e.preventDefault();

    var url = $('.url-input').val();

    if (_validate_url(url)) {
      $.ajax({
        url: "https://whquhxg9ii.execute-api.eu-west-1.amazonaws.com/dev/dns-prefetch/" + url,
        type: "GET",
        beforeSend: function(){
          $('.wait').show();
        },
        complete: function(){
          $('.wait').hide();
        },
        success: function(data){
          console.log(data);
          alert( "load was performed");
        },
        error: function(data, error){
          console.log(error);
          alert( "error occurred");
        }
      });
    }
  });
});

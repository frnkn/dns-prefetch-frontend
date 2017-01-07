

/*
* Validate input to be a correct url
* make ajax call
*/

function _clear_url(input){
  var i = input.replace("http://", "");
  var j = i.replace("https://", "");
  return j;
}

function _validate_url(input){
  // Define Regex
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  // Validate url input
  if (input.match(regex)) {
    return true;
  } else {
    return false;
  }
}

function _clean_dns_prefetch(input){
  // iterate through array and get only those items that are external urls

  // remove http, or https url needs to llok like //subdomain.host.tld and no path



}

function _merge_array(input){
  arr = input.results.css_urls.slice();
  arr = arr.concat(input.results.js_urls);
  arr = arr.concat(input.results.img_urls);

  return arr;
}
function _create_dns_prefetch_meta_tag(input){
  // <link rel="dns-prefetch" href="//s3.amazonaws.com">
  // aggregate resukts dict into one large array
  all_urls = _merge_array(input);
  cleaned_urls = _clean_dns_prefetch(all_urls);
  // from this array get all entries into another one, but just proper urls


  console.log("ARR", arr);

  // aggregate this array to just find the unique urls

  // create the tag
}

$( document ).ready(function(){

  //var api_endpoint = "https://whquhxg9ii.execute-api.eu-west-1.amazonaws.com/dev/dns-prefetch/";

  var api_endpoint = "http://localhost:8000/dns-prefetch/";

  $('.go').click(function(e){

    $('.error').hide();
    $('.error').html("");
    e.preventDefault();

    var url = $('.url-input').val();
    var cleaned_url = _clear_url(url);

    if (_validate_url(cleaned_url)) {
      $.ajax({
        url: api_endpoint + cleaned_url,
        type: "GET",
        beforeSend: function(){
          $('.wait').show();
        },
        complete: function(){
          $('.wait').hide();
        },
        success: function(data){
          console.log(data.results);
          var css_urls = data.results.css_urls;
          var js_urls = data.results.js_urls;
          var img_urls = data.results.img_urls;

          // Aggregate static urls to host.
          _create_dns_prefetch_meta_tag(data);
          // Render meta tag in pre code element

          // Render Summary Results
          $('.result-summary').html('You have' + css_urls.length + " css, " + js_urls.length + " javascript and " + img_urls.length + " image ressources on your page.");
          $('.result-summary').show();

          // Render static asset urls based on css, js and images
          $.each(css_urls, function(i, val){
            $('.css-results-list').append("<li>" + val + "</li>");
          });

          $.each(js_urls, function(i, val){
            $('.js-results-list').append("<li>" + val + "</li>");
          });

          $.each(img_urls, function(i, val){
            $('.img-results-list').append("<li>" + val + "</li>");
          });
        },
        error: function(data, error){
          console.log(error);
          $('.error').show();
          $('.error').html("There seems to be a problem with your website! It seems not to be available right now or it simply does not exist.");
        }
      });
    }
    else {
      $('.error').show();
      $('.error').html("That's not a valid url!");
    }
  });
});

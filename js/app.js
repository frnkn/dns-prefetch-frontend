

/*
* Validate input to be a correct url
* make ajax call
*/
Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}

function _clear_url(input){
  if (input != null){
    var i = input.replace("http://", "");
    var j = i.replace("https://", "");
    var k = j.replace("//", "");
    return k;
  }
  else {
    return "http://xyz.abc.de";
  }

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

function _make_dns_prefetch_url(url){
  var cleared_url = _clear_url(url);

  var dns_prefetch_url = cleared_url.split("/")[0];

  return dns_prefetch_url;
}

function _clean_dns_prefetch(input){
  // iterate through array and get only those items that are external urls
  var cleaned_urls = []

  $.each(input, function(i, val){
    console.log("VAL IN", val);
    var cleared_url = _clear_url(val);
    console.log("VAL OUT", cleared_url);
    //console.log("CLEARED_URL", cleared_url);
    if (_validate_url(cleared_url)){
      var the_url = _make_dns_prefetch_url(cleared_url);
      //console.log("THE URL", the_url);
      cleaned_urls.push(the_url);
    }


  });
  return cleaned_urls;
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
  var all_urls = _merge_array(input);
  var cleaned_urls = _clean_dns_prefetch(all_urls);
  var dns_prefetch_url = "";
  meta_urls = []
  console.log("CLEANED URLS", cleaned_urls);
  $.each(cleaned_urls, function(i, val){
    dns_prefetch_url = _make_dns_prefetch_url(val);
    meta_urls.push(dns_prefetch_url);

  });


  console.log("DNS PREFETCH URL", dns_prefetch_url);
  console.log("MEAT URLS", meta_urls);
  //  get only the unique items in the meta urls array
  var unique_urls = meta_urls.unique();
  //var unique_urls = meta_urls.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
  console.log("Unique URLS", unique_urls);
  return unique_urls;

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
          $('.css-results-list').html("");
          $('.js-results-list').html("");
          $('.img-results-list').html("");

          var css_urls = data.results.css_urls;
          var js_urls = data.results.js_urls;
          var img_urls = data.results.img_urls;

          // Aggregate static urls to host.
          var meta_tag_urls = _create_dns_prefetch_meta_tag(data);
          // Render meta tag in pre code element
          var meta_tag_string = "";
          $.each(meta_tag_urls, function(i, val){
            if(val != ""){
              meta_tag_string += '&ltlink rel="dns-prefetch" href="//' + val + '"&gt\n';
            }
          });
          console.log("META TAG STRING", meta_tag_string);
          $('.dns-prefetch-code-snippet').html("<pre><code>"+ meta_tag_string + "</code></pre>");
          // Render Summary Results
          $('.result-summary').html('You have ' + css_urls.length + " css, " + js_urls.length + " javascript and " + img_urls.length + " image ressources on your page.");
          $('.result-summary').show();

          // Render static asset urls based on css, js and images
          $.each(css_urls, function(i, val){
            $('.css-results-list').append("<li>" + val + "</li>");
          });

          $.each(js_urls, function(i, val){
            $('.js-results-list').append("<li><a href=" + val + "</li>");
          });

          $.each(img_urls, function(i, val){
            $('.img-results-list').append("<li>" + val + "</li>");
          });

          $('html, body').animate({
              scrollTop: $(".results").offset().top
          }, 2000);
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

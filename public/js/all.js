$(document).ready(function() {
  $("form").submit(function(event) {
    $(".button").prop("disabled",true).attr('value','wait for it...');
  });
});
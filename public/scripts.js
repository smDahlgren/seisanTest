$(document).ready(function() {

  var URL_VAR = 'https://seisan-test.herokuapp.com/';

  $("#searchName").click(function(event) {

    data = {
      name: $('#name').val()
    };

    event.preventDefault();
    $.get({
      url: URL_VAR + 'api/products/name/' + data.name,
      data: data,
      success: function(notData) {
        alert('Querying the db')
      window.location.replace(URL_VAR + 'products/name/' + data.name);
      }
    });
  });

  $("#searchSku").click(function(event) {

    data = {
      sku: $('#sku').val()
    };

    event.preventDefault();
    $.get({
      url: URL_VAR + 'api/products/sku/' + data.sku,
      data: data,
      success: function(notData) {
        alert('Querying the db')
        window.location.replace(URL_VAR + '/products/sku/' + data.sku);
      }
    });
  });

  $('#submitContact').click(function(event) {

    contact = {
      body: $('#contact').val()
    };

    // console.log('45:' + contact.body);

    event.preventDefault();
    $.post({
      url: URL_VAR + 'api/contact/' + contact.body,
      data: contact,
      success: function(notData) {
        alert('Thanks for your feedback!')
        window.location.replace(URL_VAR);
      }
    });

  });
});

(function ($, ajax_object) {
    window.setTimeout(function ($, ajax_object) {
        $('#subirImagenCliente2').click (function () {
        var fd = new FormData();
        var files = $('#subirImagenCliente1')[0].files[0];
        fd.append('file',files);

        $.ajax({
            // url: ajax_object['ajax_url'],
            url: ajax_object['ajax_url'] + "/wp-content/plugins/convergencia/response.php",
            type: 'POST',
            contentType: false,
            processData: false,
            data: fd,
            success: function (resp) {
                    window.location.reload();
                },
            error: function (xhr, ajaxOptions, thrownError) {
                // this error case means that the ajax call, itself, failed, e.g., a syntax error
                // in your_function()
                // alert ('Request failed: ' + thrownError.message) ;
                alert("Algo salió mal")
                },
            }) ;
        }) ;
    }, 3000, $, ajax_object);
})(jQuery, ajax_object);

function borrarImagen (nombre) {
    var $ = jQuery;

    $.ajax({
        // url: ajax_object['ajax_url'],
        url: ajax_object['ajax_url'] + "/wp-content/plugins/convergencia/borrar.php",
        type: 'POST',
        data: {nombre: nombre},
        success: function (resp) {
            var element = document.querySelector('.marca[data-id="'+nombre+'"]');
            element.parentNode.removeChild(element);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            // this error case means that the ajax call, itself, failed, e.g., a syntax error
            // in your_function()
            // alert ('Request failed: ' + thrownError.message) ;
        },
    }) ;
}
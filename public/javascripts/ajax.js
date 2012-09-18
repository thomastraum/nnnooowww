

function deleteEntry( _url )
{
	$.ajax({
	    url: _url, 
	    type: "DELETE",
	    success: function (_data, _textStatus, _jqXHR) { 
	        // console.dir(_data); 
	        // console.log(_textStatus); 
	        // console.dir(_jqXHR); 
	        hideEntry( _data );
	    }
	});
}

function hideEntry( _data ) 
{
	var id = _data._id;
	$('div#' + id ).hide('fast');
}

function initialize()
{
    $("a.deleteEntry").live("click", function(e) {
        var url = $(this).attr("href");
        deleteEntry( url );
        e.preventDefault();
    });
}

$(document).ready(function() {

    initialize();

});
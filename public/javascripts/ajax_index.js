

var addNewImage = function( imageData )
{
	var html = "<a href='" + imageData.url + "' target='_blank' >"; 
	html += "<img src='" + imageData.url + "' ";
	html += "width='" + imageData.thumb_width + "' ";
	html += "height='" + imageData.thumb_height + "' />";
	html += "</a>";


	$("div#images").prepend( html );

	// console.log( html );
}


$(document).bind( "socketNewImageEvent", function(e, data ){ 

	// console.log( "e: ", data.new_image );
	addNewImage( data.new_image );
});


$(document).ready(function() {

	// $(document).trigger( "socketNewImageEvent", {ficken:true});

});

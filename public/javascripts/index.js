(function ($){

	var $container = $('#container');

	$container.isotope({
		itemSelector : '.element',
		layoutMode: 'cellsByRow',
		cellsByRow: {
			columnWidth: 400,
			rowHeight: 300
		}
	});

	//
	var buffer = [];

	//----------------------------------------------------------------------
	var getFirstElements = function(num){

		var $firstElement = $container.data('isotope').$filteredAtoms.filter( function( i ) {
			return i < num;
		});
		return $firstElement;
	};

	//----------------------------------------------------------------------
	var getAllElements = function(){

		var $elements = $container.data('isotope').$filteredAtoms.filter( function( i ) {
			return i;
		});
		return $elements;
	}

	//----------------------------------------------------------------------
	var getHtmlWrapped = function( html ) {
		return "<div class='element' >" + html + "</div>";
	};

	//----------------------------------------------------------------------
	var addElements = function( imagesBuffer ) {

		var newElements = "";
		for (var i = 0; i < imagesBuffer.length; i++) {
			newElements += getHtmlWrapped( imagesBuffer[i] );
		};
		newElements  = $(newElements);

		// setTimeout( function() {

			$container
				.append( newElements ).isotope( 'appended', newElements );
				// .isotope( 'remove', getFirstElements(5) )
		// }, 1000);
	}

	//----------------------------------------------------------------------
	var addNewImage = function( imageData ) {

		console.log( "jo" );
		
		var html = "<a href='" + imageData.url + "' target='_blank' >"; 
		html += "<img src='/thumbs/" + imageData.thumb_name + "' ";
		html += "width='" + imageData.thumb_width + "' ";
		html += "height='" + imageData.thumb_height + "' />";
		html += "</a>";

		console.log( html );

		// eno sample
		// var html = "";
		// html += "<img src='" + data.image + "' width='150px' height='150px' >"
		// html += "<p>" + data.screen_name + "</p>";

		buffer.push( html );

		if (buffer.length > 1 ) {
			addElements( buffer );
			buffer = [];
		}
	}

	// $('#append a').click(function(){
	// 	addElements( ["hey","ho","one"] );
	// });

	$(document).bind( "socketNewImageEvent", function(e, data ){ 
		console.log( "e: ", data.new_image );
		addNewImage( data.new_image );
	});


	$(document).ready(function() {
		// $("#images").append( "<p>Test</p>" );
		console.log( 'hi');
	});

}(jQuery));
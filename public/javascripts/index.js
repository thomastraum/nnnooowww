(function ($){

	var $container = $('#container');

	$container.isotope({
		itemSelector : '.element',
		layoutMode: 'cellsByRow',
		cellsByRow: {
			columnWidth: 450,
			rowHeight: 350
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
	var getLastElement = function(){
		var all = getAllElements();
		var last = all[all.length-1];
		return last;
	};

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
		$container
			.append( newElements ).isotope( 'appended', newElements );
	}

	//----------------------------------------------------------------------
	var checkScroll = function () {
		// console.log( $(getLastElement()).offset().top );
		// console.log( $(window).scrollTop()  );

		if ( $(getLastElement()).offset().top > $(window).scrollTop() ) {
			$('html, body').animate({scrollTop: $(getLastElement()).offset().top}, 100);
		}
	}

	//----------------------------------------------------------------------
	var addNewImage = function( imageData ) {

		var html = "<a href='" + imageData.url + "' target='_blank' >"; 
		html += "<img src='/thumbs/" + imageData.thumb_name + "' ";
		html += "width='" + imageData.thumb_width + "' ";
		html += "height='" + imageData.thumb_height + "' />";
		html += "</a>";

		buffer.push( html );

		if (buffer.length > 1 ) {
			addElements( buffer );
			buffer = [];
			checkScroll();
		}
	}

	//----------------------------------------------------------------------
	$(document).bind( "socketNewImageEvent", function(e, data ){
		addNewImage( data.new_image );
	});


	$(document).ready(function() {
		// $("#images").append( "<p>Test</p>" );
		console.log( 'hi');
	});

}(jQuery));
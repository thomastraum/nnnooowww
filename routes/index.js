//--------------------------------------------------------------- REQUIRE
var util = require('util')
	, config = require( '../config.js')
  	, check = require('validator').check;

//--------------------------------------------------------------- ROUTES:INDEX
exports.index = function(req, res)
{	
	app.ImageModel.find({}).sort({ updated: -1 }).limit(config.itemsperpage).exec( function( err, images){

		res.render('index.jade', { 
        	title: 'index',
        	images: images
    	});

	});
};

//--------------------------------------------------------------- ROUTES:SITES
exports.sites = function(req, res)
{
	app.Site.find({}).exec( function (err, sites) {

		if (err) return console.error(err);
		res.render( 'sites.jade', {
			title : "All Sites",
			sites : sites
		});

	});
};

//---------------------------------------------------------------
exports.sitesAddGet = function (req, res) 
{	
	res.render( 'sites_add.jade', {
		title : "Add new Site",
        error: null
	});
}

//---------------------------------------------------------------
exports.sitesAddPost = function (req,res) 
{
	// Validate req //
	try {
		check( req.param('url') ).isUrl();
	} catch( e ) {
		return res.render('sites_add.jade', { 
		    title: 'Add new Site',
		    error: "Couldn't save feed: " + e.message
	    });
	}

	// Passed validation try to save to DB //
	var mysite = new app.Site({
		url:req.param('url'),
		updated : new Date
	});

	mysite.save(function (err) {
		if( err ) {
			res.render('sites_add.jade', { 
			  title: 'Add new Site',
			  error: "Couldn't save site: " + err
			});
		} else {
			res.redirect('/sites');
		}
	});
}

//---------------------------------------------------------------
exports.sitesDeleteSite = function (req,res) 
{
	return app.Site.findById(req.params.id, function (err, site) {
		return site.remove(function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log("removed");
				res.contentType('json');
				return res.send( JSON.stringify(site) );
			}
		});
	});
}










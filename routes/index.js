//--------------------------------------------------------------- REQUIRE

var mongoose = require('mongoose')
  , util = require('util')
  , check = require('validator').check
  , models = require('../models')
  , db
  , Site;

//--------------------------------------------------------------- MODELS

models.defineModels( mongoose, function() {

	Site = mongoose.model('Site');
	db = mongoose.connect('mongodb://localhost/nowdev');

	var mysite = new Site({
		url:"http://ficken.com",
		updated : new Date
	});

});

//--------------------------------------------------------------- ROUTES:INDEX

exports.index = function(req, res)
{		
	res.render('index.jade', { 
         title: 'index'
    });
};

//--------------------------------------------------------------- ROUTES:SITES
exports.sites = function(req, res)
{
	Site.find().exec( function (err, sites) {

		if (err) return console.error(err);
		console.log('%s', sites );

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
		    title: 'Add new Feed',
		    error: "Couldn't save feed: " + e.message
	    });
	}

	// Passed validation try to save to DB //
	var mysite = new Site({
		url:req.param('url'),
		updated : new Date
	});

	mysite.save(function (err) {
		if( err ) {
			res.render('sites_add.jade', { 
			  title: 'Add new Feed',
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
	return Site.findById(req.params.id, function (err, site) {
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










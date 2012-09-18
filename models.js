
// var databaseUrl = "nnnooowww"; // "username:password@example.com/mydb"
// var collections = ["images", "sites" ];
// var db = require("mongojs").connect(databaseUrl, collections);

// var fs = require('fs')
  // , config = 	require( './config.js' );
  // , tt_image = 	require( './tt/tt_image.js');

// var mongoose = require('mongoose');
// var db = mongoose.createConnection('localhost', 'nnnooowww');

//------------------------------------------------------------------- Setup
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {

var Site;

//------------------------------------------------------------------- Models

function defineModels( mongoose, callback ) {

	var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;

	var Site = new Schema({
		url: {type:String, index: {unique: true} },
		updated: { type: Date, default: Date.now }
	});

	Site.virtual('id').get( function() {
    	return this._id.toHexString();
    });

	mongoose.model('Site', Site);

	callback();
};

exports.defineModels = defineModels; 

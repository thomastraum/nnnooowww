
//------------------------------------------------------------------- Models
function defineModels( mongoose, callback ) {

	var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;

    //--------------------------------------------------------------- SITE
	var Site = new Schema({
		url: {type:String, index: {unique: true} },
		updated: { type: Date, default: Date.now }
	});

	Site.virtual('id').get( function() {
    	return this._id.toHexString();
    });

	mongoose.model('Site', Site);

    //--------------------------------------------------------------- IMAGE
	var ImageModel = new Schema({
		url: {type:String, index: {unique: true} },
		updated: { type: Date, default: Date.now },
		width: {type:Number},
		height: {type:Number},
		thumb_width : {type:Number},
		thumb_height : {type:Number}
	});

	mongoose.model( 'ImageModel', ImageModel );

	callback();
};

exports.defineModels = defineModels; 

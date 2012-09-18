
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
}
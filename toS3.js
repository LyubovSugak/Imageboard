const knox = require('knox');
let secrets;

if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // secrets.json is in .gitignore
}
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'imageboard-lyuba'
});

function uploadToS3(req, res, next) {
	
	const s3Request = client.put(req.file.filename, { //The first argument to put is the name you want the file to have in the bucket
	    'Content-Type': req.file.mimetype,
	    'Content-Length': req.file.size,
	    'x-amz-acl': 'public-read'
	});
	const fs = require('fs');
	const readStream = fs.createReadStream(req.file.path);
	readStream.pipe(s3Request);

	s3Request.on('response', s3Response => {
	    const wasSuccessful = s3Response.statusCode == 200;
	    if (wasSuccessful) {
	    	next();
	    } else {
	    	res.sendStatus(500)
	    }
	      
	});
	s3Request.on('error', function(err) {
		console.log('error s3Request', err)
	})
}

exports.uploadToS3 = uploadToS3;


const moduleDataBase = require('./moduleDataBase.js');
const toS3 = require('./toS3.js');
const config = require('./config.json');
const host = config.s3Url;
const uploader = require('./uploader.js').uploader;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/uploads', uploader.single('file'), toS3.uploadToS3, function(req, res) {

	const {username, title, description} = req.body;
	if (req.file) {
		moduleDataBase.addImgToDb(req.file.filename, username, title, description)
		.then(function(result) {
			res.json({
				success: true,
				filename: host + req.file.filename,
				title: title,
				description: description,
				username: username
			})
		})
		.catch((err) => {
	        console.log('app.post(/uploads)', err.stack);
	    })
	} else {
		res.json({
			success: false
		})
	}
})

app.get('/images', function(req, res) {
	moduleDataBase.getImgFromDb()
	.then(function(imgArray) {
		for (var i = 0; i < imgArray.length; i++) {
			imgArray[i].image = host + imgArray[i].image;
		}
		res.json({
			images: imgArray
		})
	})
	.catch((err) => {
            console.log('app.get(/images)', err.stack);
    })
})

app.get('/get-image/:id', function(req, res) {
	return Promise.all([
			moduleDataBase.getSingleImg(req.params.id),
			moduleDataBase.getCommentsFromDb(req.params.id)
		])
	.then(function(imgData) {
		console.log(imgData[1])
		imgData[0].image = host + imgData[0].image;
		res.json({
			image: imgData[0],
			comments: imgData[1]
		})
	})
	.catch((err) => {
            console.log('app.get(/image + comments)', err.stack);
    })
})

app.post('/submit-comment', function(req, res) {
	console.log("req.body", req.body)
	const {id, comment, username} = req.body;
	moduleDataBase.addCommentToDb(comment, username, id)
	.then(function() {

	})
	.catch((err) => {
        console.log('app.post(/submit-comment)', err.stack);
    })

})



app.get('/', function(req, res) {
	res.redirect('/images')
})

app.listen(process.env.PORT || 8080, () => console.log('i`m listening'));
 
 //w




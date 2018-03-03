const spicedPg = require('spiced-pg');
const dbUrl = process.env.DATABASE_URL || `postgres:${require('./secrets').dbUser}:${require('./secrets').dbPass}@localhost:5432/imageboard`;
const db = spicedPg(dbUrl);


function addImgToDb(image, username, title, description) {
	return db.query(`INSERT INTO images (image, username, title, description) 
					VALUES ($1, $2, $3, $4) 
					RETURNING id`, [image, username, title, description])
	.then(function(result) {
		return result.rows[0];
	})
	.catch((err) => {
            console.log('addImgToDb', err.stack);
    })
}

function getImgFromDb() {
	return db.query(`SELECT * FROM images`)
	.then(function(result) {
		return result.rows;
	})
	.catch((err) => {
            console.log('getImgData', err.stack);
    })
}

function getSingleImg(id) {
	return db.query(`SELECT * FROM images WHERE id = $1`, [id])
	.then(function(result) {
		return result.rows[0];
	})
	.catch((err) => {
            console.log('getSingleImg', err.stack);
    })
}

function addCommentToDb(comment, username, image_id) {
	return db.query(`INSERT INTO comments (comment, username, image_id) 
					VALUES ($1, $2, $3) 
					RETURNING id`, [comment, username, image_id])
	.then(function(result) {
		
	})
	.catch((err) => {
            console.log('addCommentToDb', err.stack);
    })
}

function getCommentsFromDb(imgId) {
	return db.query(`SELECT * FROM comments WHERE image_id = $1`, [imgId])
	.then(function(result) {
		return result.rows;
	})
	.catch((err) => {
        console.log('getCommentsFromDb', err.stack);
    })
}

exports.getImgFromDb = getImgFromDb;
exports.addImgToDb = addImgToDb;
exports.getSingleImg = getSingleImg;
exports.addCommentToDb = addCommentToDb;
exports.getCommentsFromDb = getCommentsFromDb;



//w
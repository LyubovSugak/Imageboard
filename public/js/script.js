Vue.component('big-image-component', {
	props: ['imgId'],
	template: `#big-image-template`,
	data: function() {
		return {
			imgData: {},
			comments: {}
		}
	},
	mounted: function() {
		var self = this;
		axios.get('/get-image/' + this.imgId)
		.then(function(res) {
			if (res.data) {

			window.location.hash = res.data.image.id;

			self.imgData = res.data.image;
			self.comments = res.data.comments;
			} else {
				window.location.hash = '#';
				this.$parent.curImg = null;
			}
			
		})
	},
	methods: {
		uploadComment: function() {
			axios.post('/submit-comment', {
				"id": this.imgId,
				"comment": this.comments.comment,
				"username": this.comments.username,
				"created_at": this.comments.created_at
			})
			.catch((err) => {
	        	console.log('upload Comment', err.stack);
			})
			this.comments.comment = '';
			this.comments.username = '';
		},
		hide: function() {		
			this.$emit('changed', this.imgId);
			// window.location.hash = '#';
		}
	}
})	


var app = new Vue({
	el: '#main',
	data: {
		images: [],
		curImg: '', //id is here after click
		uploadData: {
			title: '',
			description: '',
			username: '',
			file: null
		}

	},
	mounted: function() {
		axios.get('/images')
		.then(function(res) {
			app.images = res.data.images.reverse();
			
		})
		.catch((err) => {
	        console.log('mounted function', err.stack);
		})
	},
	methods: {
		uploadFile: function() {
			const formData = new FormData() //upload image via ajax due to the FormData API, create a FormData instance and append the file to it 
			formData.append('file', this.uploadData.file);
			formData.append('title', this.uploadData.title);
			formData.append('description', this.uploadData.description);
			formData.append('username', this.uploadData.username);

			axios.post('/uploads', formData)
			.then((result) => {
				if (result.data.success == true) {
					app.images.unshift({
						image: result.data.filename,
						title: result.data.title,
						description: result.data.description,
						username: result.data.username
					})	
				}
			})
			.catch((err) => {
            	console.log("post formData", err.stack);
    		})
    		// this.images.title = '',
    		// this.images.description = '',
    		// this.images.username = ''

		},
		chooseFile: function(e) {
			this.uploadData.file = e.target.files[0];
		},
		getImgId: function(id) {
			this.curImg = id;
		},
		hideImage: function(curImg) {
			this.curImg = null;
			// window.location.hash = '#';
		}	
	}
})
window.addEventListener('hashchange', function() {
	app.curImg = location.hash.slice(1);
})

// var infScroll = false;
// if (location.search.indexOf('scroll=infinite') >= -1) {
// 	infScroll = true;
// }
// if (infScroll) {
// 	$('#moreButton').remove();
// 	checkScreen();
// 	}else {
// 		return;
// 	}
// function checkScreen() {
// 	if ($(window).height() + $(document).scrollTop() >= $(document).height()) {
// 		results();
// 	} 
// 	else {

// 		setTimeout(results(), 1000);	
// 	}
// }




	





//w


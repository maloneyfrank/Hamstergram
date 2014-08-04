var express = require('express');
var router = express.Router();
var fs  = require('fs');
var request = require('express-request');

router.get('/', function(req, res) {
  res.sendfile('./views/index.html');
});



router.get('/test', function(req, res){
	var db = req.db;
	var collection = db.get('users');
	collection.find({},{},function(err, data){
		if(err){throw err;}
		res.render('test', {"data": data});

	});
});

router.post('/new', function(req, res){
	 var db = req.db;

	 var username = req.body.user;
	 var password = req.body.password;

	if(username  && password){

  var collection = db.get('users');

	 collection.insert({"name": username, "password": password});

	 	res.location('test');
	 	res.redirect('test');
	 }else{
	 	res.send('Please enter a username and a password.');
	 }


});

router.post('/login', function(req, res){
	var db = req.db;

	 var username = req.body.user;
	 var password = req.body.password;

	 if(username && password){

	 var collection = db.get('users');

	collection.findOne({'name': username}, function(err, user){
		if(err){throw err;}

		if(!user){
			res.location('failure');
			res.redirect('failure');
		}


	if(user){
		if(user.password != password){
			res.location('failure');
			res.redirect('failure');
		}

		req.session.username = username;
		res.location('stream');
		res.redirect('stream');
}
	});
}
});

router.get('/success', function(req, res){
	res.sendfile('./views/success.html');
});


router.get('/new', function(req, res){
	res.sendfile('./views/new.html')
});


router.get('/login', function(req, res){
	res.sendfile('./views/login.html');
});



router.get('/stream', function(req, res){
	var db = req.db;
	var collection = db.get('posts');
	//var flickrPhotos;
	var Flickr = require("flickrapi"),
		    flickrOptions = {
		      api_key: "e4784df51e577f0c5420fb9fb3c07f97",
		      secret: "ebcc5710474adf3c"
		    };
		Flickr.tokenOnly(flickrOptions, function(error, flickr) {
		  flickr.photos.search({text: "hamster"}, function(err, result){
		  		if(err){throw err;}

		  			console.log(result.photos.photo);
				collection.find({},{},function(err, data){
					if(err){throw err;}
					res.render('stream', {"data": data, "flickrPhotos": result.photos.photo, "title": "Photos"});

				});
		  });
		})


});

router.get('/post', function(req, res){
	if(req.session.username){
		res.sendfile('./views/post.html');
	}else{
		res.location('login');
		res.redirect('login');
	}
});

router.post('/newPost', function(req, res){
	var db = req.db;
	var title = req.body.title;
	var description = req.body.description;
	var imageURL = req.body.image;

	var collection = db.get('posts');

	collection.insert({'title': title, 'description': description, 'imageURL': imageURL});
		res.location('stream');
	 	res.redirect('stream');

});

	








module.exports = router;

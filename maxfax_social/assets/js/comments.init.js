//app.on('pageInit', function(page) {

	
//$$(document).on('page:init', '.page[data-name="start"]', function(e) {});
if(isLogin){

(function(G,U) {
/*	
var getDataUsersURL	= apiURI +'/users/all/true';
var usersArray = null;
$.getJSON(getDataUsersURL, function(result) {
  usersArray = result;
  console.log(usersArray);
});	
*/


//console.log(sd.idCreator);

// формируем data для записи на db
var Comments = {};
Comments.requestData = function(go) {
		$(Object.keys(go.pings)).each(function(index, userId, username) {
			var fullname = go.pings[userId];
			var pingText = '@' + fullname;
			go.content = go.content.replace(new RegExp('@' + userId, 'g'), pingText);
		}),
		go.id_creator	= LS.user.idUser;
		go.id_area_this	= 10469;
		go.path_name	= pathName;
		go.path_hash	= pathHASH;
	return go;
}

// дублирует событие сразу после click и дописывает 
Comments.saveComment = function(data) {
	// Convert pings to human readable format
	$(Object.keys(data.pings)).each(function(index, userId) {
	    var fullname = data.pings[userId];
	    var pingText = '@' + fullname;
	    data.content = data.content.replace(new RegExp('@' + userId, 'g'), pingText);
	});
	return data;
}
//console.log(sd)


//###########################  PROCESSOR COMMENTS 
Comments.loadComments = function() {$('#appComments').comments({
	profilePictureURL: pathUSP + LS.user.spUser +'/'+  LS.user.avatar,
	youText: cropText(LS.user.nameUser, 22),
	currentUserId: LS.user.idUser,
	currentUserIsAdmin: isMaster,
	roundProfilePictures: true,
	textareaRows: 1,
	textareaRowsOnFocus: 1,
	textareaMaxRows: false,
	enableAttachments: false,
	enableHashtags: true,
	enablePinging: true,
	enableDeletingCommentWithReplies: true, // удалять ли те в которых уже есть ответы
	//readOnly: !statusLogin ? true : false, // true - если не Login скрыть textarea 
	readOnly: false, // true - если не Login скрыть textarea 
	//noCommentsIconURL: '/content/images/system/bagel_hole.png',
	textareaPlaceholderText: 'Write...',
	defaultNavigationSortKey: 'newest',//newest, oldest, popularity
	enableNavigation: false,
    hashtagClicked: function(hashtag) {
        //location.hash = 'tags/' + hashtag
		location.replace('tags/' + hashtag)
    },
    pingClicked: function(ping) {
        location.replace('users/' + ping)
    },

/*	
    searchUsers: function(term, success, error) {
			//requestGo('GET', apiURI +'/users/search/' + term, {})
			requestGo('GET', apiURI +'/users/all/' + term, {})
			  .then((userArray) => {
				//console.log(userArray);
				data = !userArray ? []: userArray;
				success(data);
			  });
    },
*/	
	searchUsers: function(term, success, error) {
	    setTimeout(function() {
	        success(usersArray.filter(function(user) {
	            var containsSearchTerm = user.name_user.toLowerCase().indexOf(term.toLowerCase()) != -1;
				var isNotSelf = user.id_user != 1;
				/**@todo спросить про то, нужно ли исправлять isNotSelf под текущего юзера */
	            return containsSearchTerm && isNotSelf;
	        }));
	    }, 10);
	},
	
	
	
	

    getComments: function(success, error) {
		let delay = 500;
		let timerId = setTimeout(function request() {
			
			requestGo('GET', apiURI +'/comments/get/' + pathHASH, {})
			  .then((data) => {
				//console.log(data);
				delay = 120000;
				data = !data ? []: data;
				success(data);
			  });

		
			timerId = setTimeout(request, delay);
			//console.log(delay);
		}, delay);
		
    },
	postComment: function(data, success, error) {
		requestGo('POST', apiURI +'/comments/add/true', requestData(data))
		  .then((d) => {
			console.log(d)
			console.log(data)
			data.id_comment = d.commentLastNewID//подставим полученый идентификатор нового коммента
			success(saveComment(data));//обработаем и покажем в докуменет
		  });
	},
	putComment: function(data, success, error) {
		requestGo('POST', apiURI +'/comments/put/true', requestData(data))
		  .then((data) => {
			console.log(data);
		  });
		setTimeout(function() {
			success(saveComment(data));
			console.log(saveComment(data));
			//console.log(saveComment(data.id_comment));
		}, 500);
	},
	deleteComment: function(data, success, error) {
		requestGo('POST', apiURI +'/comments/delete/true', requestData(data))
		  .then((data) => {
			console.log(data);
		  });
		setTimeout(function() {
			success();
		}, 500);
	},
    upvoteComment: function(data, success, error) {
		//upvoteId	= data.id_comment;
		//console.log(data);
        if(data.user_has_upvoted) {
			requestGo('POST', apiURI +'/comments/like/like', data)
			  .then((data) => {
				console.log(data);
			  });
        } else {
			requestGo('POST', apiURI +'/comments/like/disl', data)
			  .then((data) => {
				console.log(data);
			  });
        }
    },
	uploadAttachments: function(dataArray, success, error) {
		setTimeout(function() {
			success(dataArray);
		}, 500);
	},

});
}
G.Comments = Comments;
}

)

(this,undefined);
}


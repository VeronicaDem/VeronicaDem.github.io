$(function() {
/*	
var getDataUsersURL	= apiURI +'/users/all/true';
var usersArray = null;
$.getJSON(getDataUsersURL, function(result) {
  usersArray = result;
  console.log(usersArray);
});	
*/




// формируем data для записи на db
var requestData = function(go) {
		$(Object.keys(go.pings)).each(function(index, userId, username) {
			var fullname = go.pings[userId];
			var pingText = '@' + fullname;
			go.content = go.content.replace(new RegExp('@' + userId, 'g'), pingText);
		}),
		go.id_creator	= sd.idCreator;
		go.id_area_this	= sd.idAreaThis;
		go.path_name	= pathName;
		go.path_hash	= pathHASH;
	return go;
}

// дублирует событие сразу после click и дописывает 
var saveComment = function(data) {
	// Convert pings to human readable format
	$(Object.keys(data.pings)).each(function(index, userId) {
	    var fullname = data.pings[userId];
	    var pingText = '@' + fullname;
	    data.content = data.content.replace(new RegExp('@' + userId, 'g'), pingText);
	});
	return data;
}



//###########################  PROCESSOR COMMENTS 
$('#appComments').comments({
	profilePictureURL: sd['userAvatar'],
	youText: cropText(sd['userName'], 22),
	currentUserId: sd['idCreator'],
	currentUserIsAdmin: isMaster,
	roundProfilePictures: true,
	textareaRows: 1,
	textareaRowsOnFocus: 1,
	textareaMaxRows: false,
	enableAttachments: false,
	enableHashtags: true,
	enablePinging: true,
	enableDeletingCommentWithReplies: true, // удалять ли те в которых уже есть ответы
	readOnly: !statusLogin ? true : false, // true - если не Login скрыть textarea 
	//noCommentsIconURL: '/content/images/system/bagel_hole.png',
	textareaPlaceholderText: 'написать..',
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
	            return containsSearchTerm && isNotSelf;
	        }));
	    }, 10);
	},
	
	
	
	

    getComments: function(success, error) {
		setTimeout(function() {
			requestGo('GET', apiURI +'/comments/get/' + pathHASH, {})
			  .then((data) => {
				//console.log(data);
				data = !data ? []: data;
				success(data);
			  });
		}, 10)
    },
	postComment: function(data, success, error) {
		requestGo('POST', apiURI +'/comments/add/true', requestData(data))
		  .then((data) => {
			console.log(data);
		  });
		setTimeout(function() {
			success(saveComment(data));
			console.log(saveComment(data));
		}, 500);
	},
	putComment: function(data, success, error) {
		requestGo('POST', apiURI +'/comments/put/true', requestData(data))
		  .then((data) => {
			console.log(data);
		  });
		setTimeout(function() {
			success(saveComment(data));
			console.log(saveComment(data));
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
});
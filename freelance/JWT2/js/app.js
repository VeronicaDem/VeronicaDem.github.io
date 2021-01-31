$(function() {
/*	
var getDataUsersURL	= apiURI +'/users/all/true';
var usersArray = null;
$.getJSON(getDataUsersURL, function(result) {
  usersArray = result;
  console.log(usersArray);
});	
*/
// commentsUID - id страницы
// С„РѕСЂРјРёСЂСѓРµРј data РґР»СЏ Р·Р°РїРёСЃРё РЅР° db
var requestData = function(go) {
		$(Object.keys(go.pings)).each(function(index, userId) {
			var fullname = go.pings[userId];
			var pingText = '@' + fullname;
			go.content = go.content.replace(new RegExp('@' + userId, 'g'), pingText);
		}),
		go.creatorID	= sd.userCreatorID;
		go.areaThisID	= sd.areaThisID;
		go.pageNme		= pathName;
		go.pageNameHash	= pathHASH;
		//go.auth_token	= ls.authToken;
	return go;
}

// РґСѓР±Р»РёСЂСѓРµС‚ СЃРѕР±С‹С‚РёРµ СЃСЂР°Р·Сѓ РїРѕСЃР»Рµ click Рё РґРѕРїРёСЃС‹РІР°РµС‚ 
var saveComment = function(data) {
	// Convert pings to human readable format
	$(Object.keys(data.pings)).each(function(index, userId) {
	    var fullname = data.pings[userId];
	    var pingText = '@' + fullname;
	    data.content = data.content.replace(new RegExp('@' + userId, 'g'), pingText);
	});
	return data;
}



let commentsUID = pathHASH;
//###########################  PROCESSOR COMMENTS 
$('#appComments').comments({
	profilePictureURL: sd['userAvatar'],
	youText: sd['userName'],
	currentUserId: sd['userCreatorID'],
	currentUserIsAdmin: isMaster,
	roundProfilePictures: true,
	textareaRows: 1,
	textareaRowsOnFocus: 1,
	enableAttachments: false,
	enableHashtags: true,
	enablePinging: true,
	enableDeletingCommentWithReplies: true, // СѓРґР°Р»СЏС‚СЊ Р»Рё С‚Рµ РІ РєРѕС‚РѕСЂС‹С… СѓР¶Рµ РµСЃС‚СЊ РѕС‚РІРµС‚С‹
	readOnly: !statusLogin ? true : false, // true - РµСЃР»Рё РЅРµ Login СЃРєСЂС‹С‚СЊ textarea 
	//noCommentsIconURL: '/content/images/system/bagel_hole.png',
	textareaPlaceholderText: 'РџРёСЃР°С‚СЊ СЃСЋРґР°..',
	postCommentOnEnter: true,
	enableNavigation: false,
	searchUsers: function(term, success, error) {
	    setTimeout(function() {
	        success(usersArray.filter(function(user) {
	            var containsSearchTerm = user.fullname.toLowerCase().indexOf(term.toLowerCase()) != -1;
	            var isNotSelf = user.id != 1;
	            return containsSearchTerm && isNotSelf;
	        }));
	    }, 100);
	},

    getComments: function(success, error) {
		setTimeout(function() {
			requestGo('POST', apiURI +'/comments/get/' + commentsUID, {})
			  .then((data) => {
				//console.log(data);
				success(data);
			  });
		}, 10)
    },
	postComment: function(data, success, error) {
		



		
		requestGo('POST', apiURI +'/comments/add/true', requestData(data))
		  .then((data) => {
			//console.log(data);
			success(data);
		  });

		/*
		$.ajax({
			type: 'post',
			dataType: "json",
			url: apiURI +'/comments/add/true',
			data: requestData(data),
			success: function(comment) {
				success(comment);
				//console.log(data);
			},
			error: error
		}),
		*/
		setTimeout(function() {
			success(saveComment(data));
			//console.log(saveComment(data));
		}, 500);
	},
	putComment: function(data, success, error) {
		/**/
		$.ajax({
			type: 'post',
			dataType: "json",
			url: apiURI +'/comments/put',
			data: requestData(data),
			success: function(comment) {
				success(comment);
				//console.log(data.id);
			},
			error: error
		}),
		setTimeout(function() {
			success(saveComment(data));
		}, 500);
	},
	deleteComment: function(data, success, error) {
		$.ajax({
			type: 'post',
			dataType: "json",
			url: apiURI +'/comments/delete',
			data: (data),
			success: function(comment) {
				success(comment);
				console.log(data);
			},
			error: error
		}),
		setTimeout(function() {
			success();
		}, 500);
	},
	upvoteComment: function(data, success, error) {
		$.ajax({
			type: 'post',
			dataType: "json",
			url: apiURI +'/comments/upvote',
			data: (data),
			success: function(comment) {
				success(comment);
				console.log(data);
			},
			error: error
		}),
	/*
		var commentURL = '/ajax/comments/upvote/' + data.id;
		//var upvotesURL = commentURL + '/upvotes/';
		var upvotesURL = commentURL;

		if(data.userHasUpvoted) {
			$.ajax({
				type: 'post',
				url: upvotesURL,
				data: {
					comment: data.id
				},
				success: function() {
					success(data)
				},
				error: error
			});
		} else {
			$.ajax({
				type: 'delete',
				url: upvotesURL + upvoteId,
				success: function() {
					success(data)
				},
				error: error
			});
		}
	*/
		setTimeout(function() {
			success(data);
		}, 500);
	},
	uploadAttachments: function(dataArray, success, error) {
		setTimeout(function() {
			success(dataArray);
		}, 500);
	},

});
});
$(function() {
	
	
				// from DATA
				var serverData = [];
					serverData['userAvatar']    = "https://api.godialog.ru/content/storage/users/t/5/q5d/av_1581303980.jpg.s.jpg";
					serverData['userFirstName'] = "Вова ПУ";
					serverData['userFullName'] 	= "ВВП";
					serverData['userNickName']  = "vova_pu";
					serverData['userCreatorID'] = 12;
					serverData['pageNme'] 		= "pageNme";
					serverData['pageNameHash'] 	= "pageNameHash";
					serverData['loginStatus'] 	= true;
					serverData['authToken']		= "auth_token";
					
				if(serverData['loginStatus']){var loginProcessOffOn = false}else{var loginProcessOffOn = true}
				if(serverData['userNickName'] == 'bob'){var imAdmin = true}else{var imAdmin = false}
				
				var getDataCommentsURL = '/ajax/comments/getallpage/' + serverData['pageNameHash'];
				var getDataUsersURL = 'https://api.godialog.ru/api/v1/333/users/all/true';
				
				


				$.getJSON(getDataCommentsURL, function(result) {
				  //commentsArray = result;
				  if(result){ commentsArray = result; }else{ commentsArray = [];}
				  //commentsArray = comments;
				  console.log(commentsArray);
				});
								
				var usersArray = null;
				$.getJSON(getDataUsersURL, function(result) {
				  usersArray = result;
				  console.log(usersArray);
				});	
				
				// формируем data для записи на db
				var postData = function(go) {
						$(Object.keys(go.pings)).each(function(index, userId) {
							var fullname = go.pings[userId];
							var pingText = '@' + fullname;
							go.content = go.content.replace(new RegExp('@' + userId, 'g'), pingText);
						}),
						go['creatorID']	  = serverData['userCreatorID'];
						go['pageNme']	  = serverData['pageNme'];
						go['pageNameHash']= serverData['pageNameHash'];
						go['auth_token']  = serverData['authToken'];
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
	
	
	$('#appComments').comments({
		profilePictureURL: serverData['userAvatar'],
		youText: serverData['userFirstName'],
		currentUserId: serverData['userCreatorID'],
		currentUserIsAdmin: imAdmin,
		roundProfilePictures: true,
		textareaRows: 1,
		enableAttachments: false,
		enableHashtags: true,
		enablePinging: true,
		enableDeletingCommentWithReplies: true, // удалять ли те в которых уже есть ответы
		readOnly: loginProcessOffOn, // true - если не Login скрыть textarea
		noCommentsIconURL: '/content/images/system/bagel_hole.png',
		textareaPlaceholderText: 'Оставить мнение',
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
				success(commentsArray);
			}, 500);
		},
		postComment: function(data, success, error) {
			$.ajax({
				type: 'post',
				dataType: "json",
				url: '/ajax/comments/add',
				data: postData(data),
				success: function(comment) {
					success(comment);
					//console.log(data);
					
				},
				error: error
			}),
			setTimeout(function() {
				success(saveComment(data));
				console.log(saveComment(data));
			}, 500);
		},
		
		
		putComment: function(data, success, error) {
			/**/
			$.ajax({
				type: 'post',
				dataType: "json",
				url: '/ajax/comments/put',
				data: postData(data),
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
				url: '/ajax/comments/delete',
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
				url: '/ajax/comments/upvote',
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
		/*
		pingClicked: function(ping) {
			location.hash = 'users/' + ping
		},
		*/
		/*
		timeFormatter: function(time) {
			return moment(time).fromNow();
		},
		*/
		/*
		textFormatter: function(text) {
			return i18n.translate(text);
		},
		*/
					
// to Server

/*
					deleteComment: function(commentJSON, success, error) {
						$.ajax({
							type: 'delete',
							url: '/ajax/comments/delete/' + commentJSON.id,
							success: success,
							error: error
						});
					},
*/
































		
/*		
		//methods comment action
		getComments: function(success, error) {
			setTimeout(function() {
				success(commentsArray);
			}, 500);
		},
		postComment: function(data, success, error) {
			setTimeout(function() {
				success(saveComment(data));
			}, 500);
		},
		putComment: function(data, success, error) {
			setTimeout(function() {
				success(saveComment(data));
			}, 500);
		},
		deleteComment: function(data, success, error) {
			setTimeout(function() {
				success();
			}, 500);
		},
		upvoteComment: function(data, success, error) {
			setTimeout(function() {
				success(data);
			}, 500);
		},
		uploadAttachments: function(dataArray, success, error) {
			setTimeout(function() {
				success(dataArray);
			}, 500);
		},
*/		
		
		
	});
});
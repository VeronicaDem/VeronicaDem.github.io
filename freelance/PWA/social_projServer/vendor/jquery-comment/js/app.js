$(function() {
	
	
	var saveComment = function(data) {
		// Convert pings to human readable format
		$(Object.keys(data.pings)).each(function(index, userId) {
		    var fullname = data.pings[userId];
		    var pingText = '@' + fullname;
            
		    data.content = data.content.replace(new RegExp('@' + userId, 'g'), pingText);
		});
		return data;
	}
	
	var createComments = function () {
	$('#appComments').comments({
		profilePictureURL: 'https://api.godialog.ru/content/storage/users/t/5/q5d/av_1581303980.jpg.s.jpg',
		currentUserId: 1,
		roundProfilePictures: true,
		textareaRows: 1,
		enableAttachments: true,
		enableNavigation: false,
		enableHashtags: true,
		enablePinging: true,
		searchUsers: function(term, success, error) {
		    setTimeout(function() {
		        success(usersArray.filter(function(user) {
		            var containsSearchTerm = user.fullname.toLowerCase().indexOf(term.toLowerCase()) != -1;
		            var isNotSelf = user.id != 1;
		            return containsSearchTerm && isNotSelf;
		        }));
		    }, 500);
		},
		
		
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
		
	
		
	});
}
});
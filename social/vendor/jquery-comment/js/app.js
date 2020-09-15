$(function() {
	/*	
	var getDataUsersURL	= apiURI +'/users/all/true';
	var usersArray = null;
	$.getJSON(getDataUsersURL, function(result) {
	  usersArray = result;
	  console.log(usersArray);
	});	
	*/
		
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
})
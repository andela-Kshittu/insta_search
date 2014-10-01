var Finder = {
	allow: false,
	searchInput: null,
	invalidInput: null,
	connectButton: null,
	connectButton2: null,
	base: "https://api.instagram.com/v1",
	params: {client_id: '67856d71a07c42a78e7ef7675bf5afe5'},
	init:function()
		{
			Finder.searchInput = $('#searchInput').val();
			Finder.invalidInput = $('#invalidInput');
			Finder.connectButton = $('#connectButton');
			Finder.connectButton2 = $('#connectButton2');
			$('#videoLocation').hide();
			Finder.fetchItems("videos");
			$('#result').hide();
			$('.buttons').show();
			Finder.initEvent();
			Finder.switchTabs();
		},
	showAction: function()
		{
			$('#videoLocation').hide();
			$('#videoLocation').empty();
			$('#searchContainer').css("position","relative");
			$('#searchContainer').css("margin-left","0");
			Finder.validate();
		},
	initEvent:function()
		{
			Finder.connectButton.click(function(){
				// to know what to fetch media or people linked with test Input
				Finder.allow = true; 
				//*************************************************
				$('#infoLocation').hide();
				$('#imageLocation').empty();
				var itemDiv = '<img src="img/276.GIF" id="loading"></img>';
				$('#imageLocation').append(itemDiv);
				$('.buttons').show();
				$('#imageLocation').show();
				Finder.showAction();
				});
			Finder.connectButton2.click(function(){
				Finder.allow = false;
				$('#imageLocation').hide();
				$('.buttons').hide();
				$('#infoLocation').empty();
				var itemDiv = '<img src="img/276.GIF" id="infoloading"></img>';
				$('#infoLocation').append(itemDiv);
				$('#infoLocation').show();
				Finder.showAction();
				});
		},
	testInput: function(value)
		{
			Finder.invalidInput.empty();
			if((value.length>1)&&(/^[a-zA-Z0-9_]*$/.test(value) === true))
			{
				Finder.invalidInput.text("");
				if (Finder.allow === true)
				{Finder.fetchItems(value);}
				else{Finder.fetchUserId(value);}
			}
			else{
				Finder.invalidInput.append("<h3>Enter a Valid Input</h3>");
				$('#imageLocation').empty();
				$('#videoLocation').empty();
				$('#infoLocation').empty();
				$('#searchInput').val("");
				$('.buttons').hide();
			}
		},
	validate: function()
		{
			var userInput = $('#searchInput').val();
			userInput = userInput.trim();
			if (/^[#@]/.test(userInput)===true){
				var stopValue = userInput.length;
				userInput = userInput.substring(1,stopValue);
			}	
			Finder.testInput(userInput);
		},
	switchTabs:function(){
		$('#imageButton').click(function(){
			$('#videoLocation').hide();
			$('#imageLocation').show();
			$('#infoLocation').hide();
		});
		$('#videoButton').click(function(){
			if ($('#videoLocation').is(':empty')){
				var itemDiv = '<h1>No Result Found</h1><img src="img/397.GIF" id="mygif"></img>';
				$('#videoLocation').append(itemDiv);
			}
			$('#imageLocation').hide();
			$('#videoLocation').show();
			$('#infoLocation').hide();
		});
	},
	fetchItems: function(value) {
		$.getJSON(Finder.base+'/tags/'+value+'/media/recent?callback=?', Finder.params, function(response) {
	        		Finder.loadItems(response);
	        	});
	},
	fetchUserId: function(value) {
	 $.getJSON(Finder.base+'/users/search?callback=?&q='+value, Finder.params, function(response) {
			console.log(response);
	        		Finder.fetchInfoById(response);
	        	});
	},
	fetchUserfollowers: function(value) {
		$.getJSON(Finder.base+'/users/'+value+'/?callback=?', Finder.params, function(response) {
	        Finder.loadUserId(response);     
	    });
	},
	loadItems: function(response) {
		if (response.data.length>0)
		{
			var Result = '<div id="result">( '+response.data.length+' ) Media File(s) Available</div>';
				$('#imageLocation').append(Result);
			$.each(response.data, function() {
				var item = this;
				var filter = item.filter !== null ? item.filter : '';
				var caption = item.caption !== null ? item.caption.text : '';
				if (item.type === 'image')
				{
				var itemDiv = '<li class="items">'+ 
					'<img src="' + item.images.low_resolution.url + '" class="pic" width="100%" height="250"/>' +
					'<p class="caption">'+'Filter Used : '+filter+'</p>'
					'</li>';
				$('#imageLocation').append(itemDiv)	;
				$('#loading').fadeOut();
				}
				else if (item.type === 'video')
				{
				var itemDiv = '<li class="items">' + 
					'<video controls src="' + item.videos.low_resolution.url + '" class="vid" width="100%" height="300">' +
					'</video>'+'<p class="caption">'+caption+'</p>'+'</li>';
				$('#videoLocation').append(itemDiv)	;
				$('#loading').fadeOut();
				}
			});
		}
		else{
			var itemDiv = '<h1>No Result Found</h1><img src="img/397.GIF" id="mygif"></img>';
				$('#imageLocation').append(itemDiv);
				$('#videoLocation').empty();
				$('#videoLocation').append(itemDiv);
				$('#loading').fadeOut();
		}
		$('#searchInput').val("");
	},
	loadUserId: function(response) {
			var item = response.data;
			var itemDiv = '<li class="items">' + 
				'<img src="' + item.profile_picture + '" class="pic" width="100%"/>' +'<p class="caption2">'+'USER NAME : '+item.username+
				'</p>'+'<p class="caption2">'+'NAME : '+item.full_name+'</p>'+'<p class="caption2">'+'MEDIA POSTS : '
				+item.counts.media+'</p>'+'<p class="caption2">'+'<img src="img/214.GIF"></img> : '+item.counts.follows+"  "+
				'<img src="img/187.GIF"></img> : '+item.counts.followed_by+'</p>'+'<p class="caption2">'+'USER ID : '+item.id+'</p>'+
				'</li>';
			$('#infoLocation').append(itemDiv);
		$('#searchInput').val("");
	},
	fetchInfoById:function(response){
		if (response.data.length > 0){
			$('#infoloading').fadeOut();
			var Result = '<div id="result">( '+response.data.length+' ) Profile(s) Returned</div>';
			$('#infoLocation').append(Result);
			$.each(response.data,function(){
				var item = this;
				Finder.fetchUserfollowers(item.id);
			}
				);
		}
		else{
			var itemDiv = '<h1>No Result Found</h1><img src="img/397.GIF" id="mygif"></img>';
			$('#infoLocation').append(itemDiv);
			$('#loading').fadeOut();
			$('#searchInput').val("");
		}
	}
};
$(document).ready(Finder.init);
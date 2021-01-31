<template>
<div class="page image no-navbar no-toolbar" data-name="image">
    <div class="page-content">
        <a href="#" class="link back close-button  text-shadow"><i class="icon icon-back"></i></a>

			<img style="height:{{da.deltaH}}px; width:{{da.deltaW}}px" class="cover-image  lazy lazy-fade-in" data-src="{{da.coverIMG}}" alt="{{d.nameImage}}">

        
        <div class="block article">
            <div class="post-infos">
                <div class="post-category">Fashion</div>
                <div class="post-date">{{d.timeAgoImage}}</div>
                <div class="click-like icon fas fa-heart  {{#if d.triger.like}} color-red {{/if}}"
					data-object	= "image"
					data-owner	= "{{d.idImage}}"
					data-triger	= "{{da.triger}}"
					data-like	= "{{d.triger.like}}"
				></div>
				<div>Likes: <span class="likes-count" id="imageLikeCount{{d.idImage}}">{{d.likesImage}}</span></div>
            </div>
            <h1>{{d.titleImage}}</h1>
            <p>{{d.descriptionImage}}</p>

        </div>
        <div class="block">

            <div class="author-block">
                <a href="/user/{{d.username}}" class="link">
				  <img src="{{d.spu}}{{d.avatar}}" alt="#">
				  <div class="author-infos">
					<div class="author-name">{{d.nameUser}}</div>
					<div class="author-description">@{{#if d.usernameo}}{{d.usernameo}}{{else}}{{d.username}}{{/if}} : {{d.nameArea}}</div>
				  </div>
				</a>
            </div>
			<?/*
            <div class="title-medium-container">
                <h2>Share This Post</h2>
            </div>
            <div class="social-buttons">
                <a href="https://www.facebook.com/sharer/sharer.php?u=http%3A//themeforest.net" target="_blank" class="big-button link facebook external"><i class="icon ion-logo-facebook"></i>Facebook</a>
                <a href="http://twitter.com/share?text=Welcome%20To%20Yui&url=http://themeforest.net&hashtags=template,mobile" target="_blank" class="big-button link twitter external"><i class="icon ion-logo-twitter"></i>Twitter</a>
            </div>
			*/?>
			
            <div class="title-medium-container">
                <h2>Related Posts</h2>
            </div>
        </div>

		<div class="block">
			<button class="button button-big button-fill" @click="openPhotoBrowser">Open Photo Browser</button>
		</div>



		
    </div>
</div>
</template>
<script>
    return {
        methods: {
            openPhotoBrowser: function() {
                var self = this;
				var photos = [{
                        url: 'https://source.unsplash.com/Qo51KwK1dKg',
                        caption: 'Santorini, Greece'
                    },
                    {
                        url: 'https://source.unsplash.com/ZyotUjWek9g',
                        caption: 'Venice, Italy'
                    },
                    {
                        url: 'https://source.unsplash.com/hgyWonRntB8',
                        caption: 'Amsterdam, Netherlands'
                    },
                    {
                        url: 'https://source.unsplash.com/XkHK1VWIIx4',
                        caption: 'Antelope Canyon, Arizona, USA'
                    },
                    {
                        html: '<iframe src="https://www.youtube.com/embed/jNQXAC9IVRw"></iframe>',
                        caption: 'Me at the Zoo - The First Youtube Video'
                    },
                ];
				/**/
                var photoBrowser = app.photoBrowser.create({
                    photos: photos,
                    theme: localStorage.getItem("themeDark")
                    //theme: app.utils.ios
                });
                photoBrowser.open();
            }
        }
    }
</script>
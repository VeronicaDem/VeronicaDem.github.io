<template>
<div class="page user  no-toolbar" data-name="follows">
    <div class="navbar no-hairline">
        <div class="navbar-bg"></div>
        <div class="navbar-inner sliding">
            <div class="left">
                <a href="#" class="link back">
					<i class="icon icon-back"></i>
					<?/*<span>Back</span>*/?>
				</a>
            </div>
            <div class="title">{{d.username}}</div>
			<div class="right">
			  <a href="#"><i class="fas fa-ellipsis-v"></i></a>
			</div>
        </div>
    </div>



    <div class="page-content">
        <div class="block">
			<span class="title-date">{{da.L10.All}} {{d.countFollows}}</span>
            <div class="title-with-link category-title">
                <h1>{{da.L10.Follows}}</h1>
				<div class="chip">
					<a href="/user/{{d.username}}"><div class="chip-media"><img src="{{storage.user}}{{d.avatar}}.s.jpg"/></div></a>
					<div class="chip-label">{{d.nameUser}}</div>
				</div>
            </div>

            <div class="title-with-link   tabbar ">
			  
				<a href="#tab-followers"  class="tab-link tab-link-active">{{da.L10.Followers}} {{d.followers}}</a>
			  
			  {{#if d.following>0}}{{/if}}
				<a href="#tab-following" class="tab-link ">{{da.L10.Following}} {{d.following}}</a>
			  
            </div>

		 </div>
			<div class="tabs-animated-wrap" style="padding:10px 0px 10px 20px">
				<div class="tabs">
				
					<ul id="tab-followers" class="popular-authors  tab tab-active">
					{{#if d.followers>0}}
						{{#each d.follows.followers}}
							<li>
								<a href="/user/{{username}}">
									<div class="author-image"><img class="lazy " data-src="{{spu}}{{avatar}}" alt="{{username}}"></div>
									<div class="author-infos">
										<div class="author-name">{{nameUser}}</div>
										<div class="author-description">
										{{#if usernameo}}
											@{{usernameo}}
										{{else}}
											@{{username}}
										{{/if}}
										</div>
									</div>
								</a>
							</li>
						{{/each}}
					{{else}}
						<div class="no-eliments center">{{da.L10.noElements}}</div>
					{{/if}}
					</ul>
					
					<ul id="tab-following" class="popular-authors  tab">
					{{#if d.following>0}}
						{{#each d.follows.following}}
							<li>
								<a href="/user/{{username}}">
									<div class="author-image"><img class="lazy " data-src="{{spu}}{{avatar}}" alt="{{username}}"></div>
									<div class="author-infos">
										<div class="author-name">{{nameUser}}</div>
										<div class="author-description">
										{{#if usernameo}}
											@{{usernameo}}
										{{else}}
											@{{username}}
										{{/if}}
										</div>
									</div>
								</a>
							</li>
						{{/each}}
					{{else}}
						<div class="no-eliments center">{{da.L10.noElements}}</div>
					{{/if}}
					
					</ul>
					
				</div>
			</div>
       
    </div>

</div>
</template>
<script>
  return {

  }
</script>
<template>
<div class="page user  ">
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
			  <a href="#" class="link webshare color-orange" data-webshare-textref=".user h1" data-webshare-imgref="#shareLink img"><i class="icon fas fa-share-alt"></i></a>
			</div>
        </div>
    </div>
	
    <div class="page-content">
		<div class="title-container  block" style="margin-top:42px;">
			<?/*<h2>Dark Mode</h2>*/?>
		</div>
		
		<div class="" style="padding-top:0px">
			<div id="" class="card medium  profile">
				<img class="card-image" src="{{d.bg}}" alt="">

				<div class="app-counters-block">
					<div class="app-counters">
						<a href="/userallimages/{{d.username}}">
							<div class="count">{{d.imagesUser}}</div>
							<div class="title">{{da.L10.Media}}</div>
						</a>
					</div>
					<div class="app-counters">
						<?/*<a href="{{#if d.follows>0}}/follows/{{d.username}}	{{else}}#{{/if}}">*/?>
						<a href="/follows/{{d.username}}">
							<div class="count" id="userFollowCount{{d.idUser}}">{{d.follows}}</div>
							<div class="title">{{da.L10.Follows}}</div>
						</a>
					</div>
				</div>
				<a href="/area/{{d.idArea}}">
					<div class="block-area-name"><span class="area-name">{{d.nameArea}}</span></div>
				</a>
				<div class="bottom-info">
					<h1>{{d.nameUser}}</h1>
				</div>
				<div class="card-infos">
					<div class="card-author">
						<img class="card-user-profile-avatar" src="{{storage.user}}{{d.avatar}}">
					</div>
				</div>
			</div>
		</div>
		<div class="block" style="margin-top:2px; padding:0 10px;">
			<div class="user-action-click-block">
				{{#if da.iOwner}}{{else}}
					<div class="action-follow {{da.followON}}"
						data-object	= "user"
						data-owner	= "{{d.idUser}}"
						data-triger = "{{da.triger}}"
						data-follow  = "{{d.triger.follow}}"
					>{{da.followTEXT}}</div>
				{{/if}}
			</div>
		</div>
		<div class="block" style="margin-top:2px; padding:0 10px;">
			{{#if d.bio}}
				{{d.bio}}
			{{else}}
				&nbsp;
			{{/if}}
		</div>
		<div class="block" style="margin-top:2px; padding:0 10px;">
		
		
		
		
			{{#if d.imagesUser>0}}
				<div class="user-content-set-block">
					<div class="title-container">
						<span class="title-date">
							<!--{{da.L10.Total}} {{d.imagesUser}}-->
						</span>
						<div class="title-with-link">
							<h2>{{da.L10.Media}}</h2>
							<a href="/userallimages/{{d.username}}" class="col button button-small button-round button-fill">{{da.L10.SeeAll}}</a>
						</div>
					</div>
					<div class="two-columns-cards">
						{{#each d.images}}
						<a href="/image/{{this.idImage}}">
							<div class="anim-touchstart card">
								<img class="card-image lazy lazy-fade-in" data-src="{{this.spImage}}.th.{{this.extensionImage}}" alt="{{this.nameImage}}">
								<div class="card-infos">
									<h2 class="card-title">{{this.nameImage}}</h2>
								</div>
							</div>
						</a>
						{{/each}}
					</div>
				</div>
			{{/if}}



			{{#if d.images<1}}
				<div class="no-eliments center">{{da.L10.noElements}}</div>
			{{/if}}

			
		</div>
		
		
    </div>
	<div id="shareLink" style="display:none"><img src="{{da.shareLink}}"></div>
	
	
	
</div>
</template>
<script>
  return {

  }
</script>
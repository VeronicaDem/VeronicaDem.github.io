<template>
<div class="page user  no-toolbar">
    <div class="navbar no-hairline">
        <div class="navbar-bg"></div>
        <div class="navbar-inner sliding">
            <div class="left">
                <a href="#" class="link back">
					<i class="icon icon-back"></i>
					<?/*<span>Back</span>*/?>
				</a>
            </div>
            <div class="title"></div>
			<div class="right">
			  <a href="#"><i class="fas fa-ellipsis-v"></i></a>
			</div>
        </div>
    </div>
	
    <div class="page-content">
		<div class="title-container  block" style="margin-top:42px;">
			<?/*<h2>Dark Mode</h2>*/?>
		</div>

				<div class="block user-all-images-block">
					<div class="title-container">
						<span class="title-date">{{da.L10.All}} {{d.imagesUser}}</span>
						<div class="title-with-link">
							<h1>{{da.L10.Media}}</h1>
							  <div class="chip">
								<div class="chip-media"><img src="{{storage.user}}{{d.avatar}}.s.jpg"/></div>
								<div class="chip-label">{{d.nameUser}}</div>
							  </div>
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
		
		
    </div>

</div>
</template>
<script>
  return {

  }
</script>
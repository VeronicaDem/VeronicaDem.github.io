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
			<div class="title">{{da.L10.Area}} @{{da.nickCrop}}</div>
        </div>
    </div>
	
    <div class="page-content">
		<div class="title-container  " style="">
			<h1 class="area-name">{{d.areaName}}</h1><?/**/?>
		</div>
		<div class="" style="padding-top:0px">
			<div id="" class="card medium  area">
				<!--<img class="card-image" src="#" alt="">-->

				<div class="app-counters-block" style="top:10px">
				
					<div class="app-counters">
						<a href="/userallimages/">
							<div class="count" id="">1</div>
							<div class="title">{{da.L10.Media}}</div>
						</a>
					</div>
					<div class="app-counters">
						<a href="/follows/">
							<div class="count" id="">2</div>
							<div class="title">{{da.L10.Followw}}</div>
						</a>
					</div>
					<div class="app-counters">
						<a href="/follows/">
							<div class="count" id="">3</div>
							<div class="title">{{da.L10.Dialogs}}</div>
						</a>
					</div>
					<div class="app-counters">
						<a href="/follows/">
							<div class="count" id="">5</div>
							<div class="title">{{da.L10.Residents}}</div>
						</a>
					</div>
					<div class="app-counters">
						<a href="/follows/">
							<div class="count" id="">434</div>
							<div class="title">{{da.L10.Population}}</div>
						</a>
					</div>
					
				</div>

			</div>
		</div>
    </div>

</div>
</template>
<script>
  return {

  }
</script>
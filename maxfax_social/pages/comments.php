<template>
<div class="page user  no-toolbar" data-name="comments">
    <div class="navbar no-hairline">
        <div class="navbar-bg"></div>
        <div class="navbar-inner sliding">
            <div class="left">
                <a href="#" class="link back">
					<i class="icon icon-back"></i>
					<?/*<span>Back</span>*/?>
				</a>
            </div>
            <div class="title">1111</div>
			<div class="right">
			  <a href="#"><i class="fas fa-ellipsis-v"></i></a>
			</div>
        </div>
    </div>



    <div class="page-content">

		<div id="appComments" style="margin-top:46px"></div>
       
    </div>

</div>
</template>
<script>
  return {
     on : {
       pageInit: function() {
         Comments.loadComments();
       }
     }
  }
</script>
<?php require_once($_SERVER['DOCUMENT_ROOT']. '/inc/header.php'); ?>
<div class="page">
	<div class="navbar no-hairline">
	  <div class="navbar-bg"></div>
	  <div class="navbar-inner">
		<div class="left">
		  <span id="" class="user-id user-role ">&nbsp;</span>
		</div>
		<div class="title "></div>
		<div class="right">
		  <a href="#" class="click-logout   link color-orange"><div class="f7-icons"></div>&nbsp;</a>
		</div>
	  </div>
	</div>
			<div id="view-start" class="view-main"></div>
			<div id="view-categories"></div>
			<div id="view-discover"></div>
			<div id="view-notification"></div>
			<div id="view-pages"></div>



    <div class="page-content">

			
			<div id="formSignup" class="form-style">
				<div class="title-container  block" style="margin-top:52px;">
					<h2>Аутентификация</h2>
				</div>
			
				<div style="width:260px; margin:0 auto; padding-top:64px;">
					 <a href="#" id="areaSelectClick" class="item-link smart-select smart-select-init" data-open-in="sheet">
						<select id="f-area"> </select>

						<div class="item-content areas">
						  <div class="item-inner">
							<div class="button  item-title">Ваша площадка</div>
						  </div>
						</div>
					  </a>
				  
					<br />
					<div class="block">
						<span class="item-input-wrap"><input id="f-login" type="email" placeholder="Ваша почта или username" style="margin:0 auto"></span>
					</div>
					<br />
				</div>


				<!-- Policy start -->
					  <div class="block">
							<!-- Open About Popup -->
							<p style="text-align:center; margin:0 auto; width:300px;">
								<a style="display:inline" class="button popup-open " href="#" data-popup=".popup-about">
								Соглашение
									<label class="radio"><input type="radio" name="policy" checked /><i class="icon-radio color-green"></i></label>
								</a>
							</p>
					  </div>
					  <div class="popup popup-about">
						<div class="block">
						  <p>About</p>
						  <!-- Close Popup -->
						  <p><a class="link popup-close" href="#">Close popup</a></p>
						  <p>Lorem ipsum dolor sit amet...</p>
						</div>
					  </div>
				<!-- Policy end -->
 			

					<div class="block" style="margin-top:40px">
						<p><a id="clickAuth"  class="button link" >Отправить</a></p>
					</div>
				
			</div>



				<div id="" class="logo-pwa-rady ">
					<a class="popup-open " href="#" data-popup=".popup-about"><img width="120" src="https://api.godialog.ru/content/storage/system/logo-pwa-rady.png"></a>
				</div>


	
				<div id="codeSMS" class="display-none ">
				<? require_once($_SERVER['DOCUMENT_ROOT']. '/inc/snip_codeSMS.php');?>
				</div>

	</div>
</div>
<script>
const elem = document.querySelector("#html")
elem.classList.add("ok", "theme-dark");


</script>

<?php require_once($_SERVER['DOCUMENT_ROOT']. '/inc/footer.php'); ?>
<?php require_once($_SERVER['DOCUMENT_ROOT']. '/inc/header.php'); ?>
	
        <div class="views tabs">
            
			
			
			<!-- Tabbar -->
            <div class="toolbar tabbar tabbar-labels toolbar-bottom">
                <div class="toolbar-inner">
                    
					<a href="#view-start" class="tab-link tab-link-active">
						<i class="icon fas fa-house-user"><span class="badge color-orange"><b class="text-color-white">15</b></span></i>
						<span class="tabbar-label">Start</span>
					</a>
                    <a href="#view-today" class="tab-link">
						<i class="icon fab fa-phoenix-framework"></i>
						<span class="tabbar-label">Today</span>
					</a>
                    <a href="#view-categories" class="tab-link">
						<i class="icon fas fa-dice"></i>
						<span class="tabbar-label">Categories</span>
					</a>
                    <a href="#view-discover" class="tab-link">
						<i class="icon fab fa-battle-net"></i>
						<span class="tabbar-label">Discover</span>
					</a>
                    <a href="#view-notification" class="tab-link">
						<i class="icon fas fa-bell  ping-notification-noticount"></i>
						<span class="tabbar-label">Noti</span>
					</a>
                    <a href="#view-pages" class="tab-link">
						<i><img src="#" class="icon user-avatar-menu  dynamic--user--avatar-src"></i>
					</a>
					
                </div>
            </div>
			
			
			
			
			
			
			
			
<?/**/?>
            <!-- Start view -->
            <div id="view-start" class="view view-start tab tab-active">
                <div data-name="start" class="page ">
					<div class="navbar no-hairline">
					  <div class="navbar-bg"></div>
					  <div class="navbar-inner">
						<div class="left">
						  <span id="" class="user-id user-role "><b class="dynamic--user--idUser-html"></b> </span>
						</div>
						<div class="title  dynamic--user--username-html"> <code id="" style="color:#fff;"></code> </div>
						<div class="title  dynamic--user--nameArea-html"> <code id="" style="color:#fff;"></code> </div>
						<div class="right">
						  <a href="#" class="click-logout   link color-gray"><div class="icon fa fa-sign-out-alt"></div></a>
						</div>
					  </div>
					</div>
					
					<div class="page-content">

						<div class="send-content-block">

						  <div class="list media-list">
							<ul id="ul-prt">
							  
							  <li class="item-content">
								<div class="item-media"><img src="https://cdn.framework7.io/placeholder/abstract-88x88-1.jpg" width="44"/></div>
								<div class="item-inner">
								  <div class="item-title-row">
									<div class="item-title">Yellow Submarine</div>
								  </div>
								  <div class="item-subtitle">Beatles <b id="ddUser0nameUser"></b></div>
								</div>
							  </li>

							</ul>
						  </div>


						</div>



						


					  <div class="swiper-item swiper-users-stores"  style="margin-top:38px">
					  	<div id="userArray"></div>
					  </div>
					  
					  <div class="swiper-item swiper-users-stores"  style="margin-top:50px">
					  	<div id="imageArray"></div>
					  </div>

						<div class="block" id="" style="margin-top:140px"> </div>


									



						<div style="margin:6px;">
							<span>test block</span> 
							<?/*<a id="getToken" class="s-button button color-orange">Get Token</a>*/?>
							<a id="getLogin" class="s-button button color-orange"><i class="fas fa-camera"></i> Get UserData</a>
							<a id="getDataDOM" class="s-button button color-orange"><i class="fas fa-database"></i> Get getDataDOM</a>
							<a id="serverPing" class="s-button button color-orange">ping </a>
							<a id="getStories" class="s-button button color-orange">get stories </a>
							<a href="/user/bart" class="s-button button color-orange">user Bart </a>
							<a href="/login-screen/" class="s-button button color-orange">login-screen</a>
							<a href="/comments/3344" class="s-button button color-orange">comments</a>
						</div>

					  <div id="responseData" style="color:#fff;">ping data :</div>
					  <div id="responseToken" style="color:#fff;">JWT :</div>
					  <div id="viewToken" style="color:#fff;">Stat :</div>
					  <div id="idBro" style="color:#fff;">Bro :</div>
					  <div id="conterPlus" style="color:#fff;">conterPlus :</div>
					  <code id="consoleLog" style="color:#ddd;"></code> 
					  <code id="detectDeviceApp" style="color:#999;"></code> 
					  
					</div>
					
				</div>
			</div>
			

			
			
			
			
			
			
			
			
			
			
			
            <!-- Main view -->
            <div id="view-today" class="view view-main tab ">
                <div data-name="home" class="page no-navbar">
                    <!-- Scrollable page content -->
                    <div class="page-content ptr-content infinite-scroll-content" data-infinite-distance="70">
                        <div class="ptr-preloader">
                            <div class="preloader"></div>
                            <div class="ptr-arrow"></div>
                        </div>
						
                        <div class="block" id="today-content">
							<div id="discover-swiper5" class="" style="margin-top:15px">
								<div class="swiper-wrapper">
									<div class="swiper-slide">
										<a href="#" data-href="/login/">
											<div class="anim-touchstart card medium">
												<img class="card-image" src="https://godialog.ru/assets/img/thumb-28.jpg" alt="">
												<div class="card-infos">
													<div class="card-date"><i class="icon fas fa-history"></i>2 days ago</div>
													<h2 class="card-title">/login/  Edmond at the Royal Palace Theatre</h2>
													<div class="card-bottom">
														<div class="card-author">
															<img class="card-author-image" src="https://godialog.ru/assets/img/authors/author-7.jpg" alt="">
															<div>Elena Anka</div>
														</div>
														<div class="card-comments"><i class="icon far fa-comments"></i>22</div>
													</div>
												</div>
											</div>
										</a>
									</div>
									<div class="swiper-slide">
										<a href="#" data-href="/login-screen/">
											<div class="anim-touchstart card medium">
												<img class="card-image" src="https://godialog.ru/assets/img/thumb-10.jpg" alt="">
												<div class="card-infos">
													<div class="card-date"><i class="icon fas fa-history"></i>2 days ago</div>
													<h2 class="card-title">/login-screen/  Booba on Fire in His New Gotham Clip</h2>
													<div class="card-bottom">
														<div class="card-author">
															<img class="card-author-image" src="https://godialog.ru/assets/img/authors/author-1.jpg" alt="">
															<div>Elena Anka</div>
														</div>
														<div class="card-comments"><i class="icon far fa-comments"></i>223</div>
													</div>
												</div>
											</div>
										</a>
									</div>
									<div class="swiper-slide">
										<a href="#" data-href="/signup/">
											<div class="anim-touchstart card medium">
												<img class="card-image lazy lazy-fade-in" data-src="https://godialog.ru/assets/img/thumb-29.jpg" alt="">
												<div class="card-infos">
													<div class="card-date"><i class="f7-icons">clock</i></i>3 weeks ago</div>
													<h2 class="card-title">/signup/  15 Cheap Outing Ideas in London</h2>
													<div class="card-bottom">
														<div class="card-author">
															<img class="card-author-image lazy lazy-fade-in" data-src="https://godialog.ru/assets/img/authors/author-2.jpg" alt="">
															<div>Elena Anka</div>
														</div>
														<div class="card-comments"><i class="icon far fa-comments"></i>54</div>
													</div>
												</div>
											</div>
										</a>
									</div>
									<div class="swiper-slide">
										<a href="#" data-href="/single/">
											<div class="anim-touchstart card medium">
												<img class="card-image lazy lazy-fade-in" data-src="https://godialog.ru/assets/img/thumb-30.jpg" alt="">
												<div class="card-infos">
													<div class="card-date"><i class="f7-icons">clock</i></i>1 month ago</div>
													<h2 class="card-title">Ariana Grande Announces a New Fragrance</h2>
													<div class="card-bottom">
														<div class="card-author">
															<img class="card-author-image lazy lazy-fade-in" data-src="https://godialog.ru/assets/img/authors/author-3.jpg" alt="">
															<div>Elena Anka</div>
														</div>
														<div class="card-comments"><i class="icon far fa-comments"></i>12</div>
													</div>
												</div>
											</div>
										</a>
									</div>
								</div>
							</div>



                            <div class="title-container">
                                <span class="title-date">18 March</span>
                                <h1>Monday</h1>
                            </div>
                            <div class="two-columns-cards">
                                <a href="/single/">
                                    <div class="anim-touchstart card">
                                        <img class="card-image lazy lazy-fade-in" data-src="https://godialog.ru/assets/img/thumb-4.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">Nadal Wins at Roland Garros</h2>
                                        </div>
                                    </div>
                                </a>
                                <a href="/single/">
                                    <div class="card">
                                        <img class="card-image lazy lazy-fade-in" data-src="https://godialog.ru/assets/img/thumb-5.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">NASA Chooses Its Next Chief Scientist</h2>
                                        </div>
                                    </div>
                                </a>
                                <a href="/single/">
                                    <div class="card">
                                        <img class="card-image" src="https://godialog.ru/assets/img/thumb-6.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">Top Sunglasses Models for This Summer</h2>
                                        </div>
                                    </div>
                                </a>
                                <a href="/single/">
                                    <div class="card">
                                        <img class="card-image" src="https://godialog.ru/assets/img/thumb-7.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">Isabel Marant Launches into Makeup!</h2>
                                        </div>
                                    </div>
                                </a>
                                <a href="/single/">
                                    <div class="card">
                                        <img class="card-image" src="https://godialog.ru/assets/img/thumb-8.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">Moto-Cross: The Champions Made the Show</h2>
                                        </div>
                                    </div>
                                </a>
                                <a href="/single/">
                                    <div class="card">
                                        <img class="card-image" src="https://godialog.ru/assets/img/thumb-9.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">The Best Exotic Destinations</h2>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div class="title-container">
                                <span class="title-date">17 March</span>
                                <h1>Sunday</h1>
                            </div>
                            <a href="/single/">
                                <div class="card medium">
                                    <img class="card-image" src="https://godialog.ru/assets/img/thumb-10.jpg" alt="">
                                    <div class="card-infos">
                                        <div class="card-date"><i class="f7-icons">clock</i></i>2 days ago</div>
                                        <h2 class="card-title">Booba on Fire in His New Gotham Clip</h2>
                                    </div>
                                </div>
                            </a>
                            <ul class="list media-list post-list" id="infinite-content">
                                <li>
                                    <a href="/single/">
                                        <div class="item-content">
                                            <div class="item-media"><img src="https://godialog.ru/assets/img/thumb-11.jpg" alt=""></div>
                                            <div class="item-inner">
                                                <div class="item-subtitle">Fashion</div>
                                                <div class="item-title">The 6th Edition of the Body Painting Contest</div>
                                                <div class="item-subtitle bottom-subtitle"><img src="https://godialog.ru/assets/img/authors/author-7.jpg" alt="">Elena Anka</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="/single/">
                                        <div class="item-content">
                                            <div class="item-media"><img src="https://godialog.ru/assets/img/thumb-12.jpg" alt=""></div>
                                            <div class="item-inner">
                                                <div class="item-subtitle">Photography</div>
                                                <div class="item-title">20 Photography Tips for Taking Pictures</div>
                                                <div class="item-subtitle bottom-subtitle"><img src="https://godialog.ru/assets/img/authors/author-3.jpg" alt="">Jess Roxana</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="/single/">
                                        <div class="item-content">
                                            <div class="item-media"><img src="https://godialog.ru/assets/img/thumb-13.jpg" alt=""></div>
                                            <div class="item-inner">
                                                <div class="item-subtitle">Beatles</div>
                                                <div class="item-title">Tottenham: NFL Turf Is in Place!</div>
                                                <div class="item-subtitle bottom-subtitle"><img src="https://godialog.ru/assets/img/authors/author-1.jpg" alt="">Camille Aline</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                            <div class="preloader infinite-scroll-preloader"></div>
                        </div>
                    </div>
                </div>
            </div>
			
			
			
			
			
			
			
			
			
			
			
			
			
            <!-- Categories View -->
            <div id="view-categories" class="view tab">
                <div data-name="categories" class="page no-navbar">
                    <!-- Scrollable page content -->
                    <div class="page-content">
                        
						<div class="swiper-item swiper-users-stores"  style="">
							<div id="userArrayEE"></div>
						</div>						
						
						<div class="block">

                            <div class="title-container">
                                <h1>Categories</h1>
                            </div>
                            <div class="categories-container">
                                <a href="/category/">
                                    <div class="category card" style="background-image: url('https://godialog.ru/assets/img/categories/sports.jpg'); box-shadow: 0px 15px 20px -10px rgba(252, 186, 47, 0.5);">
                                        <h2>Sports</h2>
                                    </div>
                                </a>
                                <a href="/category/">
                                    <div class="category card" style="background-image: url('https://godialog.ru/assets/img/categories/travel.jpg'); box-shadow: 0px 15px 20px -10px rgba(128, 213, 250, 0.5);">
                                        <h2>Travel</h2>
                                    </div>
                                </a>
                                <a href="/category/">
                                    <div class="category card" style="background-image: url('https://godialog.ru/assets/img/categories/music.jpg'); box-shadow: 0px 15px 20px -10px rgba(231, 0, 70, 0.5);">
                                        <h2>Music</h2>
                                    </div>
                                </a>
                                <a href="/category/">
                                    <div class="category card" style="background-image: url('https://godialog.ru/assets/img/categories/gaming.jpg'); box-shadow: 0px 15px 20px -10px rgba(37, 57, 155, 0.5);">
                                        <h2>Gaming</h2>
                                    </div>
                                </a>
                                <a href="/category/">
                                    <div class="category card" style="background-image: url('https://godialog.ru/assets/img/categories/photography.jpg'); box-shadow: 0px 15px 20px -10px rgba(37, 227, 154, 0.5);">
                                        <h2>Photo</h2>
                                    </div>
                                </a>
                                <a href="/category/">
                                    <div class="category card" style="background-image: url('https://godialog.ru/assets/img/categories/food.jpg'); box-shadow: 0px 15px 20px -10px rgba(255, 128, 169, 0.5);">
                                        <h2>Food</h2>
                                    </div>
                                </a>
                            </div>
                            <div class="title-container">
                                <span class="title-date">Recent posts</span>
                                <div class="title-with-link">
                                    <h1>Sports</h1>
                                    <a href="/category/" class="col button button-small button-round button-fill">See All</a>
                                </div>
                            </div>
                            <div class="two-columns-cards">
                                <a href="/single/">
                                    <div class="card">
                                        <img class="card-image" src="https://godialog.ru/assets/img/thumb-4.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">Nadal Wins at Roland Garros</h2>
                                        </div>
                                    </div>
                                </a>
                                <a href="/single/">
                                    <div class="card">
                                        <img class="card-image" src="https://godialog.ru/assets/img/thumb-8.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">Moto-Cross: The Champions Made the Show</h2>
                                        </div>
                                    </div>
                                </a>
                                <a href="/single/">
                                    <div class="card">
                                        <img class="card-image" src="https://godialog.ru/assets/img/thumb-17.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">Will Conor Return to the UFC Octagon?</h2>
                                        </div>
                                    </div>
                                </a>
                                <a href="/single/">
                                    <div class="card">
                                        <img class="card-image" src="https://godialog.ru/assets/img/thumb-18.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">Anna Gasser's Snowboard Win</h2>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div class="title-container">
                                <span class="title-date">Recent posts</span>
                                <div class="title-with-link">
                                    <h1>Lifestyle</h1>
                                    <a href="/category/" class="col button button-small button-round button-fill">See All</a>
                                </div>
                            </div>
                            <div class="two-columns-cards">
                                <a href="/single/">
                                    <div class="card">
                                        <img class="card-image" src="https://godialog.ru/assets/img/thumb-9.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">The Best Exotic Destinations</h2>
                                        </div>
                                    </div>
                                </a>
                                <a href="/single/">
                                    <div class="card">
                                        <img class="card-image" src="https://godialog.ru/assets/img/thumb-6.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">Top Sunglasses Models for This Summer</h2>
                                        </div>
                                    </div>
                                </a>
                                <a href="/single/">
                                    <div class="card">
                                        <img class="card-image" src="https://godialog.ru/assets/img/thumb-11.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">Join the Paris Body Painting Contest</h2>
                                        </div>
                                    </div>
                                </a>
                                <a href="/single/">
                                    <div class="card">
                                        <img class="card-image" src="https://godialog.ru/assets/img/thumb-3.jpg" alt="">
                                        <div class="card-infos">
                                            <h2 class="card-title">Nicki Minaj in Featuring with Drake!</h2>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
			
			
			
			
			
            <!-- Discover View -->
            <div id="view-discover" class="view tab">
                <div data-name="discover" class="page no-navbar">
                    <!-- Scrollable page content -->
                    <div class="page-content">
                        <div class="discover-gradient">
                            <svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon fill="white" points="0,100 100,0 100,100"/></svg>
                        </div>
                        <div class="block">
                            <div class="title-container white">
                                <span class="title-date">This Week</span>
                                <div class="title-with-link">
                                    <h1>Discover</h1>
                                    <i class="f7-icons">star_fill</i>
                                </div>
                            </div>
                        </div>
                        <div id="discover-swiper" class="swiper-container">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-5.jpg" alt="">
                                            <div class="card-infos">
                                                <h2 class="card-title">NASA Chooses Its Next Chief Scientist</h2>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-19.jpg" alt="">
                                            <div class="card-infos">
                                                <h2 class="card-title">Jeffrey Campbell's New Shoes Models</h2>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-6.jpg" alt="">
                                            <div class="card-infos">
                                                <h2 class="card-title">The Best Models of Sunglasses to Go out This Summer</h2>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-1.jpg" alt="">
                                            <div class="card-infos">
                                                <h2 class="card-title">Soprano Announces His New Album</h2>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-17.jpg" alt="">
                                            <div class="card-infos">
                                                <h2 class="card-title">Will Conor Return to the UFC Octagon?</h2>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="title-medium-container title-with-link">
                                <h2>Popular Authors</h2>
                                <a href="/author-list/" class="col button button-small button-round button-fill">See All</a>
                            </div>
                            <ul class="popular-authors">
                                <li>
                                    <a href="/author/">
                                        <div class="author-image"><img src="https://godialog.ru/assets/img/authors/author-3.jpg" alt=""></div>
                                        <div class="author-infos">
                                            <div class="author-name">Jess Roxana</div>
                                            <div class="author-description">NBA & NFL Journalist</div>
                                        </div>
                                        <div class="author-star"><i class="f7-icons">star_fill</i></div>
                                    </a>
                                </li>
                                <li>
                                    <a href="/author/">
                                        <div class="author-image"><img src="https://godialog.ru/assets/img/authors/author-2.jpg" alt=""></div>
                                        <div class="author-infos">
                                            <div class="author-name">Zorka Ivka</div>
                                            <div class="author-description">Graphist and Webdesigner</div>
                                        </div>
                                        <div class="author-star"><i class="f7-icons">star_fill</i></div>
                                    </a>
                                </li>
                                <li>
                                    <a href="/author/">
                                        <div class="author-image"><img src="https://godialog.ru/assets/img/authors/author-1.jpg" alt=""></div>
                                        <div class="author-infos">
                                            <div class="author-name">Camille Aline</div>
                                            <div class="author-description">Fashion & Mode Worker</div>
                                        </div>
                                        <div class="author-star"><i class="f7-icons">star_fill</i></div>
                                    </a>
                                </li>
                            </ul>
                            <div class="title-medium-container">
                                <h2>The Fashion Week</h2>
                            </div>
                        </div>
                        <div id="discover-swiper2" class="swiper-container medium-card-slider style-2">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-20.jpg" alt="">
                                        </div>
                                        <div class="card-infos">
                                            <h2 class="card-title">Best Clothes Showed on Fashion Week</h2>
                                        </div>
                                    </a>
                                </div>
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-21.jpg" alt="">
                                        </div>
                                        <div class="card-infos">
                                            <h2 class="card-title">What Future for Milan Fashion Week?</h2>
                                        </div>
                                    </a>
                                </div>
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-22.jpg" alt="">
                                        </div>
                                        <div class="card-infos">
                                            <h2 class="card-title">10 Unusual Jewels Spotted at Fashion Week</h2>
                                        </div>
                                    </a>
                                </div>
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-23.jpg" alt="">
                                        </div>
                                        <div class="card-infos">
                                            <h2 class="card-title">Monica Bellucci Will Be Present This Year</h2>
                                        </div>
                                    </a>
                                </div>
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-24.jpg" alt="">
                                        </div>
                                        <div class="card-infos">
                                            <h2 class="card-title">Milan Fashion Week: Giorgio Armani Show</h2>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="title-medium-container title-with-link">
                                <h2>In Lifestyle</h2>
                                <a href="/category/" class="col button button-small button-round button-fill">See All</a>
                            </div>
                            <ul class="list media-list post-list">
                                <li>
                                    <a href="/single/">
                                        <div class="item-content">
                                            <div class="item-media"><img src="https://godialog.ru/assets/img/thumb-25.jpg" alt=""></div>
                                            <div class="item-inner">
                                                <div class="item-subtitle">Fashion</div>
                                                <div class="item-title">The Best Diet for a Flatter Belly</div>
                                                <div class="item-subtitle bottom-subtitle"><i class="f7-icons">clock</i></i>2 hours ago</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="/single/">
                                        <div class="item-content">
                                            <div class="item-media"><img src="https://godialog.ru/assets/img/thumb-26.jpg" alt=""></div>
                                            <div class="item-inner">
                                                <div class="item-subtitle">Science</div>
                                                <div class="item-title">Here Are the Five Best Fruits of the Summer</div>
                                                <div class="item-subtitle bottom-subtitle"><i class="f7-icons">clock</i></i>3 days ago</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="/single/">
                                        <div class="item-content">
                                            <div class="item-media"><img src="https://godialog.ru/assets/img/thumb-27.jpg" alt=""></div>
                                            <div class="item-inner">
                                                <div class="item-subtitle">Beatles</div>
                                                <div class="item-title">Were Vegetables Better Before?</div>
                                                <div class="item-subtitle bottom-subtitle"><i class="f7-icons">clock</i></i>Last week</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                            <div class="title-medium-container">
                                <h2>Must See</h2>
                            </div>
                        </div>
                        <div id="discover-swiper3" class="swiper-container">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card medium">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-28.jpg" alt="">
                                            <div class="card-infos">
                                                <div class="card-date"><i class="f7-icons">clock</i></i>2 days ago</div>
                                                <h2 class="card-title">Edmond at the Royal Palace Theatre</h2>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card medium">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-10.jpg" alt="">
                                            <div class="card-infos">
                                                <div class="card-date"><i class="f7-icons">clock</i></i>4 days ago</div>
                                                <h2 class="card-title">Booba on Fire in His New Gotham Clip</h2>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card medium">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-29.jpg" alt="">
                                            <div class="card-infos">
                                                <div class="card-date"><i class="f7-icons">clock</i></i>3 weeks ago</div>
                                                <h2 class="card-title">15 Cheap Outing Ideas in London</h2>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="swiper-slide">
                                    <a href="#" data-href="/single/">
                                        <div class="card medium">
                                            <img class="card-image" src="https://godialog.ru/assets/img/thumb-30.jpg" alt="">
                                            <div class="card-infos">
                                                <div class="card-date"><i class="f7-icons">clock</i></i>1 month ago</div>
                                                <h2 class="card-title">Ariana Grande Announces a New Fragrance</h2>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="title-medium-container">
                                <h2>Popular Last Week</h2>
                            </div>
                            <ul class="list media-list post-list">
                                <li>
                                    <a href="/single/">
                                        <div class="item-content">
                                            <div class="item-media"><img src="https://godialog.ru/assets/img/thumb-31.jpg" alt=""></div>
                                            <div class="item-inner">
                                                <div class="item-subtitle">Fashion</div>
                                                <div class="item-title">The Crocodile, Man's Best Friend?</div>
                                                <div class="item-subtitle bottom-subtitle"><i class="f7-icons">clock</i></i>4 hours ago</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="/single/">
                                        <div class="item-content">
                                            <div class="item-media"><img src="https://godialog.ru/assets/img/thumb-32.jpg" alt=""></div>
                                            <div class="item-inner">
                                                <div class="item-subtitle">Science</div>
                                                <div class="item-title">7 Accessories to Pack This Summer</div>
                                                <div class="item-subtitle bottom-subtitle"><i class="f7-icons">clock</i></i>6 days ago</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="/single/">
                                        <div class="item-content">
                                            <div class="item-media"><img src="https://godialog.ru/assets/img/thumb-33.jpg" alt=""></div>
                                            <div class="item-inner">
                                                <div class="item-subtitle">Beatles</div>
                                                <div class="item-title">Mylene Farmer Will Unveil Her New Single on Friday</div>
                                                <div class="item-subtitle bottom-subtitle"><i class="f7-icons">clock</i></i>Last week</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="/single/">
                                        <div class="item-content">
                                            <div class="item-media"><img src="https://godialog.ru/assets/img/thumb-34.jpg" alt=""></div>
                                            <div class="item-inner">
                                                <div class="item-subtitle">Fashion</div>
                                                <div class="item-title">Holidays Abroad: Leave Reassured!</div>
                                                <div class="item-subtitle bottom-subtitle"><i class="f7-icons">clock</i></i>Last month</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
			
			
			
			
<?/*

                                <li>
                                    <a href="/author/">
                                        <div class="author-image">
											<img src="https://api.godialog.ru/content/storage/users/t/p/5aQ/av_1582052385.png" alt="Lana Aminova">
										</div>
                                        <div class="author-infos">
                                            <div class="author-name">Lana Aminova</div>
                                            <div class="author-description">3 недели назад</div>
                                        </div>
                                        <div class="author-star"><i class="icon fas fa-comments"></i></div>
                                    </a>
                                </li>

*/?>		
            <!-- notification View -->
            <div id="view-notification" class="view tab">
                <div data-name="notification" class="page no-navbar">
                    <div class="page-content page-notification">
                        <div class="block">
							<div class="title-container">
								<h2>Звоночки</h2>
							</div>

                            <ul id="notificationsList"  class="popular-users"> </ul>
                        </div>

                    </div>
                </div>
            </div>
			
		


			
			
            <!-- Pages View -->
            <div id="view-pages" class="view tab">
                <div class="page" data-name="pages">
					<div class="navbar no-hairline">
					  <div class="navbar-bg"></div>
					  <div class="navbar-inner">
						<div class="left">
						  <span id="" class="user-id user-role ">left</span>
						</div>
						<div class="title   dynamic--user--usernameo-html">@Username</div>
						<div class="right">
						  <a href="#" class="click-logout   link color-orange"><div class="icon fa fa-sign-out-alt"></div></a>
						</div>
					  </div>
					</div>
                    <!-- Scrollable page content -->

                    <div class="page-content contacts-list settings">
                        <div class="title-container  block" style="margin-top:42px;">
                            <?/*<h2>Dark Mode</h2>*/?>
                        </div>

						<div class="" style="padding-top:0px">
							<div class="card medium  profile">
								<img class="card-image  dynamic--user--bg-md-src">
								<a href="#" data-trigger="user-avatar-upload" id="uploadAVATARimg" class="upload-click"><i class="fas fa-camera"></i></a>
								<a href="#" data-trigger="user-background-upload" id="uploadBGimg" class="upload-click"><i class="fas fa-camera"></i></a>

								<input id="user-avatar-upload" data-content="user-avatar-upload-input" class="hidden-visibility" type="file" accept="image/*">
								<input id="user-background-upload" data-content="user-background-upload-input" class="hidden-visibility" type="file" accept="image/*">

								<div class="block-area-name"><span id="my-area" class="area-name  dynamic--user--nameArea-html">my area name</span></div>
								<div class="bottom-info">
									<h1 class="dynamic--user--nameUser-html"></h1>
								</div>
								<div class="card-infos">
									<div class="card-author">
										<img class="card-user-profile-avatar    dynamic--user--avatar-src" src="#">
									</div>
								</div>
							</div>
						</div>


                        <div class="block" style="margin-bottom:15px">
                            <h2>Настройки</h2>
                        </div>
						<form method="POST" action="#" class="list no-hairlines form-store-data  form-ajax-submit-onchange" id="send--user--settings-email">
						  <ul>
							<li>
							  <div class="item-content item-input">
								<div class="item-inner">
								  <div class="item-title item-label">Почта</div>
								  <div class="item-input-wrap">
									<input class="dynamic--user--email-value" type="text" name="email" placeholder="">
								  </div>
								</div>
							  </div>
							</li>
						  </ul>
						</form>
						
						<form method="POST" action="#" class="list no-hairlines form-store-data  form-ajax-submit-onchange" id="send--user--settings-username">
						  <ul>
							<li>
							  <div class="item-content item-input">
								<div class="item-inner">
								  <div class="item-title item-label">@User.Name</div>
								  <div class="item-input-wrap">
									<input class="dynamic--user--usernameo-value  " type="text" name="username" placeholder="">
								  </div>
								</div>
							  </div>
							</li>
						  </ul>
						</form>

						<form method="POST" action="#" class="list no-hairlines no-hairlines-between form-store-data  form-ajax-submit-onchange" id="send--user--settings-rest">
						  <ul>
							<li>
							  <div class="item-content item-input">
								<div class="item-inner">
								  <div class="item-title item-label">Имя.Ф</div>
								  <div class="item-input-wrap">
									<input class="dynamic--user--nameUser-value" type="text" name="name" placeholder="">
								  </div>
								</div>
							  </div>
							</li>
							<li>
							  <div class="item-content item-input">
								<div class="item-inner">
								  <div class="item-title item-label">Телефон</div>
								  <div class="item-input-wrap">
									<input class="dynamic--user--phone-value" type="tel" name="phone" placeholder="">
								  </div>
								</div>
							  </div>
							</li>
							<li>
							  <div class="item-content item-input">
								<div class="item-inner">
								  <div class="item-title item-label">О себе</div>
								  <div class="item-input-wrap">
									<textarea class="dynamic--user--bio-html   resizable" name="bio" placeholder=""></textarea>
								  </div>
								</div>
							  </div>
							</li>
						  </ul>
						</form>




                        <div class="block">
                            <h2>Features</h2>
                        </div>
                        <div class="list pages-list">
                            <ul>
                                <li>
                                    <a href="/promo-banner/" class="item-link item-content">
                                        <div class="item-media bg-color-blue"><i class="icon far fa-star"></i></div>
                                        <div class="item-inner">
                                            <div class="item-title">Promo Banner</div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <div class="item-link item-content item-button">
                                        <div class="item-media bg-color-orange"><i class="icon fas fa-share-alt"></i></div>
                                        <div class="item-inner">
                                            <div class="item-title">Share Dialog</div>
                                            <a href="#" class="col button button-small button-round button-fill share-actions">Try It</a>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div class="item-link item-content item-button">
                                        <div class="item-media bg-color-green"><i class="icon far fa-bell"></i></div>
                                        <div class="item-inner">
                                            <div class="item-title">Notification</div>
                                            <a href="#" class="col button button-small button-round button-fill open-notification">Try It</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
						

                        <div class="block">
                            <a href="/category/" class="col button button-small button-round button-fill">Цвет настроения</a>
                        </div>
                        <div class="list pages-list">
                            <ul>
                                <li>
                                    <div class="item-content item-the  block">

                           <label class="radio color-white"><input type="radio" name="radio-color-theme" id="color-theme-blue" ><i class="icon-radio bg-color-blue"></i></label>
                           <label class="radio color-white"><input type="radio" name="radio-color-theme" id="color-theme-pink" ><i class="icon-radio bg-color-pink"></i></label>
                           <label class="radio color-white"><input type="radio" name="radio-color-theme" id="color-theme-yellow"><i class="icon-radio bg-color-yellow"></i></label>
                           <label class="radio color-white"><input type="radio" name="radio-color-theme" id="color-theme-orange"><i class="icon-radio bg-color-orange"></i></label>
                           <label class="radio color-white"><input type="radio" name="radio-color-theme" id="color-theme-gray"><i class="icon-radio bg-color-gray"></i></label>
                           <label class="radio color-black"><input type="radio" name="radio-color-theme" id="color-theme-white"><i class="icon-radio bg-color-white"></i></label>

                                    </div>
                                </li>

                                <li>
                                    <div class="item-link item-content item-button">
                                        <div class=""><i class="icon far fa-moon"></i></div>
                                        <div class="item-inner">
                                            <div class="item-title"><?/* Темная сторона */?></div>
                                            <label class="toggle toggle-init color-green toggle-theme">
												<input type="checkbox" checked>
												<span class="toggle-icon"></span>
											</label>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
						
						
                        <div class="block" style="text-align:center">
                            <code>Version(beta) : 000</code>
                        </div>
						
                    </div>
                </div>
            </div>
			
			
			
			
			
        </div>

<?php require_once($_SERVER['DOCUMENT_ROOT']. '/inc/footer.php'); ?>
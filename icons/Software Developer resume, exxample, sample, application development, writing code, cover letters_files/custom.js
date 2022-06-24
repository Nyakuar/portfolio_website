"use strict";

jQuery(function($){

	if(!$.browser)
		$.browser=browser_detect();
	
	if($.browser.msie && parseInt($.browser.version) < 8)
		return;
	
	if($.browser.webkit || $.browser.chrome || $.browser.safari)
		$('html').addClass('webkit');
	else if($.browser.msie) {
		$('html').addClass('msie');
		if(parseInt($.browser.version) == 8)
			$('html').addClass('msie8');
		else if(parseInt($.browser.version) >= 10)
			$('html').addClass('msie10');
	}
	else if($.browser.mozilla)
		$('html').addClass('mozilla');
		
	if($('html').hasClass('msie8'))
		$('img').removeAttr('width').removeAttr('height');
		
	if(!!('ontouchstart' in window))
		$('html').addClass('touch');
	else
		$('html').addClass('no-touch');
	
	/*-------------------------*/
	
	if($.browser.safari && $('html').hasClass('touch')) {
		$('body').removeClass('uncovering-footer');
	}
	
	/*-------------------------*/
	
	header_transparent_height_fix();
	
	responsiveListener_init();
	
	retina_images_init();
	
	fix_placeholders();
		
	menu_init();
	
	search_popup_init();
	
	parallax_title_init();
	
	sliced_gallery_init();
	
	lazyload_init();
	
	masonry_gallery_init();
	
	responsive_embed_init();
	
	blog_grid_init();

	gallery_init(); // important to init after all isotope initializations
	
	video_bg_container_init();
	
	portfolio_init();	
	
	uncovering_footer_init();
	
	/***********************************/

	function browser_detect() {
		
		var matched, browser;
	
		var ua = navigator.userAgent.toLowerCase();
	
		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			[];
	
		matched = {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	
		browser = {};
	
		if ( matched.browser ) {
			browser[ matched.browser ] = true;
			browser.version = matched.version;
		}
	
		if ( browser.webkit ) {
			browser.safari = true;
		}
	
		return browser;
	}
	
	/***********************************/
		
	function responsiveListener_init(){

		var lastWindowSize=$(window).width();
		$(window).data('mobile-view',(lastWindowSize<768));
		
		$(window).resize(function(){
			var w=$(this).width();
			if(
				(w>=768 && lastWindowSize < 768) ||
				(w<=767 && lastWindowSize > 767)
			){
				$(window).data('mobile-view',(w<768));
			}
			lastWindowSize=w;
		});
		
	}
	
	/***********************************/
	
	function retina_images_init() {
		if(window.devicePixelRatio > 1.8) {
			$('img[data-src-retina]').each(function(){
				if($(this).data('src-retina'))
					this.src=$(this).data('src-retina');
			})
		}
	}
	
	/***********************************/
	
	function fix_placeholders() {
		
		var input = document.createElement("input");
	  if(('placeholder' in input)==false) { 
			$('[placeholder]').focus(function() {
				var i = $(this);
				if(i.val() == i.attr('placeholder')) {
					i.val('').removeClass('placeholder');
					if(i.hasClass('password')) {
						i.removeClass('password');
						this.type='password';
					}			
				}
			}).blur(function() {
				var i = $(this);	
				if(i.val() == '' || i.val() == i.attr('placeholder')) {
					if(this.type=='password') {
						i.addClass('password');
						this.type='text';
					}
					i.addClass('placeholder').val(i.attr('placeholder'));
				}
			}).blur().parents('form').submit(function() {
				$(this).find('[placeholder]').each(function() {
					var i = $(this);
					i.addClass('placeholder-submitting');
					if(i.val() == i.attr('placeholder'))
						i.val('');
				})
			});
		}
	}
	
	/***********************************/

	function header_transparent_height_fix() {
		
		if($('body').hasClass('custom-header-bg-transparent') && $('body').hasClass('custom-header-bg-merge-title')) {
			
			var adminbar=0;
			if($('body').hasClass('admin-bar'))
				adminbar+=32;
			
			var interval=setInterval(function(){
				$('.page-title-inner').css('paddingTop', ( $('.header').height() + adminbar ) + 'px');
			}, 20);
			
			$(window).load(function(){
				setTimeout(function(){
					clearInterval(interval);
				}, 500);
			});
		} 
	}
	
	/***********************************/
	
	function menu_init() {

		// Primary Menu
		
		$('ul.primary-menu-fallback.show-dropdown-symbol li').each(function(){
			if($(this).children('ul').length)
				$(this).addClass('menu-item-has-children');
		});
		
		$('ul.primary-menu > li > a').prepend('<span class="primary-menu-line"></span>');
		
		$('.primary-menu li.megamenu-enable ul ul').addClass('megamenu-sub');

		var args={
			popUpSelector: 'ul:not(.megamenu-sub)',
			autoArrows: false,
			delay: 200,
			animation: {opacity: 'show', height: 'show'},
			animationOut: {},
			speed: 0,
			speedOut: 200,
			disableHI: true,
			onBeforeHide: function(){
				$(this).parent().removeClass('omHover');
			},
			onShow: function(){
				$(this).parent().addClass('omHover');
			}
		};
	
		$('ul.primary-menu').superfish(args);

		// Mobile menu		
		
		$('ul.header-menu-mobile').superfish({
			autoArrows: false,
			delay: 500,
			animation: {opacity: 'show', height: 'show'},
			animationOut: {opacity: 'hide', height: 'hide'},
			speed: 150,
			speedOut: 200
		});
		
		$('.mobile-header-menu-control').click(function(){
			$(this).toggleClass('active');
			$('.mobile-header-menu-container').slideToggle(300);
		});

		// one page navigation
		if(jQuery().onePageNavOm) {
			$('ul.primary-menu').onePageNavOm({
				currentClass: 'current-menu-item',
				changeHash: false,
				scrollSpeed: 350,
				scrollThreshold: 0.5,
				filter: '[href*="#"]',
				offset: 0
			});

			$('ul.header-menu-mobile').onePageNavOm({
				currentClass: 'current-menu-item',
				changeHash: false,
				scrollSpeed: 350,
				scrollThreshold: 0.5,
				filter: '[href*="#"]',
				offset: 0,
				begin: function(){
					$('.mobile-header-menu-control').click();
				}
			});
		}

		// Sticky menu

		if(( $('body').hasClass('menu-position-top_fixed') || $('body').hasClass('menu-position-top_fixed_fully') ) && $.waypoints) { /* !$('html').hasClass('touch') &&  */
			
			var $menuStickyNode=$('.menu-sticky-node');
			if($menuStickyNode.length) {

				// waypoints
				var offset=$menuStickyNode.height();
				if(!offset)
					offset=75;
				$menuStickyNode.wrap('<div class="menu-sticky-node-wrapper" />');
				var $wrapper=$menuStickyNode.parent();
				
				$wrapper.waypoint(function(direction){
						if(direction == 'down') {
							$wrapper.css('height',$menuStickyNode.height());
							$menuStickyNode.addClass('menu-stuck');
						} else {
							$wrapper.css('height','auto');
							$menuStickyNode.removeClass('menu-stuck');
						}
					},{
						offset:-offset
				});
                if($('body').hasClass('menu-position-top_fixed_fully')) {
                	if($menuStickyNode.hasClass('menu-stuck')) {
                        $menuStickyNode.addClass('moving-down');
					}
                }
	
				// add class to the bar on scrolling top the top
				$(window).scroll(function(){
					
					var last=$(window).data('last-scrollTop');
					var current=$(window).scrollTop();
					$(window).data('last-scrollTop', current);
	
					if($menuStickyNode.hasClass('menu-stuck')) {
						var d=last - current;
						if(d > 0) {
							$menuStickyNode.addClass('moving-top');
							$menuStickyNode.removeClass('moving-down');
						} else if (d < 0) {
							$menuStickyNode.addClass('moving-down');
							$menuStickyNode.removeClass('moving-top');
						}
					} else {
						$menuStickyNode.removeClass('moving-down');
						$menuStickyNode.removeClass('moving-top');
					}
				});
				
			}

		}
		
		
	}
	
	/***********************************/
	
	function search_popup_init() {
		
		var $menubox=$('.header-logo-menu .menu-box');
		if(!$menubox.length)
			$menubox=false;
		var $menu=$('.primary-menu');
		
		$('.search-popup-link').click(function(e){
			e.preventDefault();
			var $popup=$(this).next('.search-popup');
			var $this=$(this);
			if(!$this.hasClass('active')) {
				if($menubox)
					$popup.css('max-width',$menubox.width()+'px');
				$menu.css('pointer-events','none');

				$this.addClass('active');
				$popup.addClass('active');
				setTimeout(function(){
					$popup.find('#s').focus();
				},100); // delay for transition animation
			} else {
				$menu.css('pointer-events','auto');
				
				$this.removeClass('active');
				$popup.removeClass('active');
			}
		});
		
	}
	
	/************************************/
	
	function parallax_title_init() {

		var $title=$('.page-title-wrapper.tpl-parallax');

		if($('html').hasClass('no-touch') && $title.length) {
			var $inner=$title.find('.page-title-inner');
			
			var pw=$(window).width();
			$('body').mousemove(function(e){
				var k=e.pageX/pw-0.5;
				var bx=Math.round(k*600);
				var sx=Math.round(k*300);
				$title.stop(true).animate({backgroundPosition: bx+'px 0'}, 1000);
				$inner.stop(true).animate({backgroundPosition: sx+'px 0'}, 1000);
			});
		}
		
	}
	
	/*************************************/
	
	function gallery_init() {
		if($().omSlider) {
			$('.custom-gallery').each(function(){
				var $items=$(this).find('.items');
				var num=$items.find('.item').length;
				if(num > 1) {
					
					var active=0;
					var hash=document.location.hash.replace('#','');
					if(hash != '') {
						var $active=$items.find('.item[rel='+hash+']');
						if($active.length)
							active=$active.index();
					}
					$(this).append('<div class="controls"><div class="control-prev"><a href="#" class="prev"></a></div><div class="control-next"><a href="#" class="next"></a></div><div class="control-progress"><div class="progress"></div></div></div>');
					var $controls=$(this).find('.controls');
					$controls.find('.total').html(num);
					var args={
						speed: 400,
						next: $controls.find('.next'),
						prev: $controls.find('.prev'),
						active: active,
						before: function(currSlide, nextSlide, currSlideNum, nextSlideNum){
							$controls.find('.progress').css('width',Math.round(nextSlideNum/(num-1)*100)+'%');
						}
					};
					
					
					var $blog=$(this).parents('.blogroll.layout-grid-masonry');
					if($blog.length && $().isotopeOm ) {
						var $iso=$blog.find('section');
						args.after=function(){
							$iso.isotopeOm('layout');
						};
					}
					$items.omSlider(args);
	
				}
			});
		}
	}
	
	
	/*************************************/
	
	function sliced_gallery_init() {
		
		$(window).bind('resize load', function(){
			sliced_gallery_resize();
		});
		sliced_gallery_resize();
		
	}
	
	function sliced_gallery_resize(){
		
		$('.gallery-sliced').each(function(){
			var $cont=$(this);
			var w=$cont.width();
			
			var mar=Math.floor(w*0.01);

			//2
			var $box=$cont.find('.gallery-sliced-box-2');
			if($box.length) {
				var h1=Math.floor(w*0.66*0.66579634464751958224543080939948);
				$box.find('.img-1, .img-2').css('height',h1+'px');
			}
			
			//3
			var $box=$cont.find('.gallery-sliced-box-3');
			if($box.length) {
				$box.find('.img-2').css('margin-bottom',mar+'px');
				var h2=Math.floor(w*0.33*0.65274151436031331592689295039164);
				var h1 = h2*2+mar;
				$box.find('.img-1').css('height',h1+'px');
				$box.find('.img-2, .img-3').css('height',h2+'px');
			}
						
			//4
			var $box=$cont.find('.gallery-sliced-box-4');
			if($box.length) {
				$box.find('.img-2, .img-3').css('margin-bottom',mar+'px');
				var h2=Math.floor(w*0.33*0.56396866840731070496083550913838);
				var h1 = h2*3+mar*2;
				$box.find('.img-1').css('height',h1+'px');
				$box.find('.img-2, .img-3, .img-4').css('height',h2+'px');
			}
			
			//5
			var $box=$cont.find('.gallery-sliced-box-5');
			if($box.length) {
				var h1 = Math.floor(w*0.3266*0.6649076517150);
				var h2 = Math.floor(w*0.495*0.66550522648083);
				$box.find('.img-1, .img-2, .img-3').css('height',h1+'px');
				$box.find('.img-4, .img-5').css('height',h2+'px');
			}
		});
		
	}
	
	/******************************/
	
	function lazyload_init(context) {
		if($().lazyload) {

			$('.wpb_animate_when_almost_visible .lazyload', context).add('.om-animation .lazyload', context).each(function(){
				var original=$(this).data('original');
				if(original) {
					$(this).removeClass('lazyload');
					$(this).attr('src',$(this).data('original'));
				}
			});
			
			var args={
				effect : "fadeIn",
				failure_limit: 1000,
				threshold : 200,
				placeholder : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=",
				skip_invisible : false
			};
			
			var $lazyload=$('img.lazyload', context);
			$lazyload.filter('.lazyload-hidden').lazyload(args);
			args.skip_invisible = true;
			$lazyload.not('.lazyload-hidden').lazyload(args);
			
			if($.waypoints) {
				$lazyload.load(function(){
					$.waypoints('refresh');
				});
			}
			
		}
	}
	
	/******************************/
	
	function masonry_gallery_init() {

		if($().isotopeOm) {

			$('.gallery-masonry').each(function() {
				
				var $container=$(this).find('.items');
				
		    var args={ 
			    itemSelector: '.item',
			    layoutMode: 'masonry'
			  };
			  
				$container.isotopeOm(args);
				
				$container.find('img').load(function(){
					$container.isotopeOm('layout');
				});

	    });
		}
	}
	
	/********************************/
	
	function responsive_embed_init() {
		$('.responsive-embed').each(function(){
			var $obj=$(this).children(':first');
			if($obj.length) {
				var w=parseInt($obj.attr('width'));
				var h=parseInt($obj.attr('height'));
				if(!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
					var r=h/w;
					$(this).css('padding-bottom',(r*100)+'%');
				}
			}
		});
	}
	
	/*********************************/
	
	function blog_grid_init() {
		if($().isotopeOm) {
			$('.blogroll.layout-grid-masonry').each(function() {
				
				var $container=$(this).find('section');
				
		    var args={ 
			    itemSelector: '.post',
			    layoutMode: 'masonry'
			  };
  
				$container.isotopeOm(args);
				
				$container.find('img').load(function(){
					$container.isotopeOm('layout');
				});
	
	    });
		}
	}
	
	/*********************************/
	
	function video_bg_container_init() {
		
		function video_bg_container_fit($obj) {

			var $tmp;
			if($obj)
				$tmp=$obj;
			else
				$tmp=$('.om-video-bg-container');
			$tmp.each(function(){
				
				var $video=$(this).find('video');
				if($video.length) {
					var w = $(this).width();
					var h = $(this).height();

					var r = w/h;
					var vr = $video.data('wh-ratio');
	
					if (r < vr) {
						$video
							.width(h*vr)
							.height(h);
						$video
							.css('top',0)
							.css('left',-(h*vr-w)/2)
							.css('height',h);
	
					} else {
						$video
							.width(w)
							.height(w/vr);
						$video
							.css('top',-(w/vr-h)/2)
							.css('left',0)
							.css('height',w/vr);
					}
				}
				
			});
			
		}
		
		
		$('.om-video-bg-container').each(function(){
			
			var $container=$(this);
			var $video=$container.find('video');
			if($video.length) {
				
				$video.get(0).volume=0;
				
				$video.data('wh-ratio', 16/9 );

				$video.on('loadedmetadata', function(data) {

					var videoWidth =0;
					var videoHeight=0;
					
					if(this.videoWidth)
						videoWidth=this.videoWidth;
					if(this.videoHeight)
						videoHeight=this.videoHeight;

					if(videoWidth && videoHeight) {
						var ratio = videoWidth / videoHeight;
						$video.data('wh-ratio', ratio);
					}
					
					video_bg_container_fit($container);
					
				});

			}
			
		});
		
		
		$(window).bind('resize load', function(){
			var timer=$(this).data('video_bg_container_fit_timer');
			if(timer)	{
				clearTimeout(timer);
				timer=false;
			}
			
			timer=setTimeout(video_bg_container_fit, 200);
			$(this).data('video_bg_container_fit_timer', timer);
		});
		
	}
	
	/*******************************/
	
	function portfolio_init() {

		var getDirection = function (ev, obj) {
			var offset=$(obj).offset();
			var width=$(obj).width();
			var height=$(obj).height();
			var darr=[
				Math.abs(ev.pageY - offset.top),
				Math.abs(ev.pageX - offset.left - width),
				Math.abs(ev.pageY - offset.top - height),
				Math.abs(ev.pageX - offset.left)
			];
			var d=darr.indexOf(Math.min.apply(Math, darr));

	    return d;
		};

		var addClass = function ( ev, obj, state ) {
		    var direction = getDirection( ev, obj ),
		        class_suffix = "";
		    
		    obj.className = "";
		    
		    switch ( direction ) {
		        case 0 : class_suffix = '-top';    break;
		        case 1 : class_suffix = '-right';  break;
		        case 2 : class_suffix = '-bottom'; break;
		        case 3 : class_suffix = '-left';   break;
		    }
		    
		    obj.classList.add( state + class_suffix );
		};
		
		var hoverInit=function(elems) {
			$(elems).find('a').each(function () {
				$(this).mouseenter( function (ev) {
					addClass( ev, this, 'in' );
				});
				
				$(this).mouseleave( function (ev) {
					addClass( ev, this, 'out' );
				});
			});	
		}
		
		var lazyloadInit=function(elems){
			lazyload_init($(elems));
		}

		$('.ompf-portfolio').each(function(){
			
			var $container=$(this);
			
			var callbacks=$container.data('appenedElemsCallbacks');
			if(!callbacks)
				callbacks=[];
				
			if($container.hasClass('ompf-preview-layout-full-hover-2')) {
				
				var $nodes  = $container.find('.ompf-portfolio-thumb');

				hoverInit($nodes);
	
				callbacks.push(hoverInit);
				
			}
				
			callbacks.push(lazyloadInit);
	
			$container.data('appenedElemsCallbacks',callbacks);
			
			
			var layoutCompleteCallbacks=$container.data('layoutCompleteCallbacks');
			if(!layoutCompleteCallbacks)
				layoutCompleteCallbacks=[];
				
			if($container.hasClass('ompf-pagination-no')) {
				
				layoutCompleteCallbacks.push(function(){
					$container.trigger('scroll');
				});
				
			}
	
			$container.data('layoutCompleteCallbacks',layoutCompleteCallbacks);
		});

	}
	
	/*******************************/
	
	function uncovering_footer_init() 	{

		function uncovering_footer_set() {
			$('.hc-wrapper').css('margin-bottom',$('footer').height()+'px');
		}


		if($('body').hasClass('uncovering-footer')) {
			
			uncovering_footer_set();
			$(window).bind('resize load', function(){
				uncovering_footer_set();
			});
			
		}
	}

	
});

/***********************************/

function lightbox_init(args_) {
	var args={
		deeplinking: false,
		overlay_gallery: false,
		opacity: 0.98,
		theme: 'om_theme',
		horizontal_padding: 0,
		markup: '<div class="pp_pic_holder">'+
						'<div class="pp_content_container">'+
							'<div class="pp_content">'+
								'<div class="pp_loaderIcon"></div>'+
								'<div class="pp_details">'+
									'<div class="pp_nav">'+
										'<a href="#" class="pp_arrow_previous">Previous</a>'+
										'<p class="currentTextHolder">0/0</p>'+
										'<a href="#" class="pp_arrow_next">Next</a>'+
									'</div>'+
									'{pp_social}'+
									'<a href="#" class="pp_expand" title="Expand the image">Expand</a>'+
									'<a class="pp_close" href="#">Close</a>'+
								'</div>'+
								'<div class="pp_fade">'+
									'<div class="pp_hoverContainer">'+
										'<a class="pp_next" href="#">next</a>'+
										'<a class="pp_previous" href="#">previous</a>'+
									'</div>'+
									'<div id="pp_full_res"></div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="ppt">&nbsp;</div>'+
					'</div>'+
					'<div class="pp_overlay"></div>'
	};
	if(args_)
		jQuery.extend(args, args_);
	
	//prettyPhoto
	if(jQuery().prettyPhoto) {
		jQuery('a[rel^=prettyPhoto]').addClass('pp_worked_up').prettyPhoto(args);
		jQuery('a[data-rel^=prettyPhoto]').addClass('pp_worked_up').prettyPhoto(jQuery.extend(args, {hook: 'data-rel'}));
		var $tmp=jQuery('a').filter(function(){ return /\.(jpe?g|png|gif|bmp)$/i.test(jQuery(this).attr('href')); }).not('.pp_worked_up');
		$tmp.each(function(){
			if(typeof(jQuery(this).attr('title')) == 'undefined')
				jQuery(this).attr('title',''); 
		});
		$tmp.prettyPhoto(args); 
	}
}

/***********************************/

function sidebar_slide_init() {
	var $sidebar=jQuery('.content-column-sidebar');
	var $content=jQuery('.content-column-content');
	var menu_fixed=jQuery('body').hasClass('menu-position-top_fixed') || jQuery('body').hasClass('menu-position-top_fixed_fully');
	var admin_bar=jQuery('body').hasClass('admin-bar');
	if(menu_fixed)
		var $top_area=jQuery('.menu-sticky-node');
	var move_delay=1200;
	if($sidebar.data('move-delay') || $sidebar.data('move-delay') == '0') {
		var tmp=parseInt($sidebar.data('move-delay'));
		if(!isNaN(tmp))
			move_delay=tmp;
	}
		
	if($sidebar.length) {

		$sidebar.mouseenter(function(){
			/*
			if($sidebar.is(':animated'))
				$sidebar.stop(true).fadeTo(300,1);
			*/
			$sidebar.addClass('hovered');
		}).mouseleave(function(){
			$sidebar.removeClass('hovered');
		});			

		var sidebar_timer=false;
		var ie8=jQuery.browser.msie && (jQuery.browser.version == 8);
		
		jQuery(window).scroll(function(){
			
			if(sidebar_timer)
				clearTimeout(sidebar_timer);				

			if(jQuery(window).data('mobile-view')) {
				$sidebar.stop(true).css({marginTop: 0, opacity: 1});
				return;
			}

			sidebar_timer=setTimeout(function(){
				//if($sidebar.hasClass('hovered'))
				//	return false;

				$sidebar.stop(true);
				
				var ch=$content.height();
				var ws=jQuery(window).scrollTop();
				var wh=jQuery(window).height();
				var top=$sidebar.offset();
		
				var sidebarh=$sidebar.height();
				if(ch > sidebarh)
				{
					var cur_mar=parseInt($sidebar.css('margin-top'));
					var max=ch-sidebarh;
					var new_mar=cur_mar;
					var gap=0;
					if(admin_bar)
						gap+=32;
					if(menu_fixed && $top_area.hasClass('menu-stuck')) {
						gap+=$top_area.height();
					}
					
					if( top.top - ws - gap > 0 ) {
						new_mar=ws-(top.top-cur_mar) + gap;
							
						if(new_mar > max)
							new_mar = max;
						if(new_mar < 0)
							new_mar = 0;
					} else if( top.top + sidebarh - ws - gap < wh ) {
						if(sidebarh < wh) {
							new_mar=ws-(top.top-cur_mar) + gap;
						}	else {
							new_mar=ws-(top.top-cur_mar) - (sidebarh - wh);
						}
						if(new_mar > max)
							new_mar = max;
						if(new_mar < 0)
							new_mar = 0;
					}

					if(new_mar != cur_mar) {
						$sidebar.fadeTo(600,0.2).fadeTo(400,1);
						$sidebar.animate({marginTop: new_mar+'px'}, {
							duration: 1000,
							easing: 'easeInOutExpo',
							queue: false
						});
					} else {
						$sidebar.fadeTo(400,1);
					}
				}
				
				
			}, move_delay);
							
		});
	}
}

/********************************/

function page_out_init() {
	
	if(navigator.userAgent.toLowerCase().indexOf('safari') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1) {
		return false;
	}

	jQuery(window).on('pageshow',function(event){
		if(event.originalEvent.persisted){
			jQuery('.om-closing-inner').stop(true);
			jQuery('.om-closing').remove();
			jQuery('.om-closing-ajaxloading').remove();
		}
	});
	
	jQuery(window).click(function(e){
		if(e.target && e.target.tagName == 'A' && e.target.href.toLowerCase().indexOf('mailto:') == 0) {
			jQuery(window).data('om-last-click',false);
		} else {
			var date=new Date();
			jQuery(window).data('om-last-click',{x: e.clientX, y: e.clientY, time: date.getTime()});
		}
	});
	
	jQuery(window).on('beforeunload', function() {
		var data=jQuery(window).data('om-last-click');
		if(data) {
			var date=new Date();
			if( data.time + 100 > date.getTime() ) {
				
				var $closing=jQuery('<div class="om-closing"></div>');
				var $inner=jQuery('<div class="om-closing-inner"></div>').css({left: data.x+'px', top: data.y+'px'}).appendTo($closing);
				jQuery('body').append($closing);
				$inner.animate({width: '0', height: '0', borderWidth: '3000px'}, 300, 'easeOutExpo', function(){
					jQuery('<div class="ompf-ajaxloading om-closing-ajaxloading"></div>').appendTo('body').css('z-index','100001').fadeIn(300);
				});
				
			}
		}
	});

}
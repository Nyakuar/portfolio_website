jQuery(function($){
	
	$('.wpb_gallery_slides a.prettyphoto').add('.vc_images_carousel a.prettyphoto').removeClass('prettyphoto'); // Remove this class to abort prettyPhoto implementing by WPB Composer
	
	/*******************************/
	
	tabs_init();
	
	buttons_init();
	
	cta_buttom_init();
	
	parallax_init();
	
	counters_init();
	
	testimonials_init();
	
	/*******************************/
	
	function parallax_init() {
		
		if(jQuery().omParallax) {
			$('.om-parallax').omParallax();
		}
		
	}
	
	/*******************************/
	
	function tabs_init() {
		$('.wpb_tabs').add('.wpb_tour').each(function(){
			var $wrap=$(this);
			$('.wpb_tabs_nav a',$wrap).add('.wpb_tour_next_prev_nav a', $wrap).click(function(){
				$wrap.css('height',$wrap.height());
				setTimeout(function(){
					var h=$wrap.find('.wpb_wrapper').height();
					$wrap.animate({height: h+'px'},300,function(){
						$(this).css('height','auto');
					})
				},50);
			});
		});
	}
	
	/******************************/
	
	function buttons_init() {

		jQuery('.vc_btn3, .vc_om-click-box').each(function(){
			var bgcolor=jQuery(this).data('hover-bg-color');
			var textcolor=jQuery(this).data('hover-color');
			var bordercolor=jQuery(this).data('hover-border-color');
			if(bgcolor || textcolor || bordercolor) {
				jQuery(this).data('def-style',jQuery(this).attr('style'));
				jQuery(this).hover(function(){
					if(bgcolor)
						jQuery(this).css('background-color',bgcolor);
					if(textcolor)
						jQuery(this).attr('style', function(i,s) { return s + ';color:'+textcolor+' !important;' }); //jQuery(this).css('color',textcolor);
					if(bordercolor)
						jQuery(this).css('border-color',bordercolor);
				}, function(){
					var s=jQuery(this).data('def-style');
					jQuery(this).attr('style', (typeof s != 'undefined' ? s : '') );
				})
			}
		});
		
		jQuery('.vc_om_a_button').each(function(){
			var bordercolor=jQuery(this).data('hover-border-color');
			if(bordercolor) {
				var $obj=jQuery('.vc_om-brd',this);
				$obj.data('def-style',$obj.attr('style'));
				
				jQuery(this).hover(function(){
					if(bordercolor)
						$obj.css('border-color',bordercolor);
				}, function(){
					var s=$obj.data('def-style');
					$obj.attr('style', (typeof s != 'undefined' ? s : '') );
				})
			}
		});
		
	}
	
	/******************************/
	
	function cta_buttom_init() {
		$('.vc_call_to_action .vc_btn3').mouseenter(function(){
			$(this).parents('.vc_call_to_action').addClass('button_hover');
		});
		$('.vc_call_to_action .vc_btn3').mouseleave(function(){
			$(this).parents('.vc_call_to_action').removeClass('button_hover');
		});
	}
	
	/******************************/
	
	function counters_init() {

		var interval=30;
		
		function om_tick(args) {
			args.obj.html([args.prefix, args.current, args.suffix].join(''));
			if(args.current < args.count) {
				args.current+=args.step;
				if(args.current > args.count)
					args.current=args.count;
					
				setTimeout(function(){
					om_tick(args);
				}, args.interval);
			}
		}
		
		function om_start_item(obj) {
			var $this=jQuery(obj);
			var count=$this.data('count');
			var duration=$this.data('duration');
			if(count && duration) {
				if(duration > interval) {
					
					var step=Math.ceil( count / (duration/interval) );
					if(step < 1)
						step=1;
					om_tick({
						obj: $this.find('.vc_om-counter-number'),
						current: 0,
						count: count,
						step: step,
						interval: interval,
						prefix: $this.data('prefix'),
						suffix: $this.data('suffix')
					});

				}
			}
		}
		
		
		if(jQuery.waypoints) {
			jQuery('.vc_om-counter').each(function(){

				jQuery(this).waypoint(function(){
					om_start_item(this);
				},{
					offset: '100%',
					triggerOnce: true
				});			
				
			});
		} else {
			jQuery('.vc_om-counter').each(function(){

				om_start_item(this);
				
			});
		}
		
	}
	
	/*******************************/
	
	function testimonials_init() 	{
		jQuery('.vc_om-testimonials.vc_om-mode-box').each(function(){
			
			var $items=jQuery(this).find('.vc_om-testimonials-items');
			if($items.find('.om-item').length > 1) {
	
				var args={
					speed: 200,
					next: jQuery(this).find('.vc_om-testimonials-controls .om-next'),
					prev: jQuery(this).find('.vc_om-testimonials-controls .om-prev'),
					fadePrev: true
				};
				if(jQuery(this).data('timeout') > 0)
					args.timeout = jQuery(this).data('timeout');
				if(jQuery(this).data('pause') == 1)
					args.pause = 1;
	
				$items.omSlider(args);
			
			} else {
				jQuery(this).find('.vc_om-testimonials-controls').remove();
			}
			
		});
	}
	
});

/* Toggle/FAQ
 ---------------------------------------------------------- */
if (typeof window['vc_toggleBehaviour'] !== 'function') {
    window.vc_toggleBehaviour = function($el) {
	    var event = function(e) {
		    e && e.preventDefault && e.preventDefault();
		    var title = jQuery(this);
		    var element = title.closest('.vc_toggle');
		    var content = element.find('.vc_toggle_content');
		    if (element.hasClass('vc_toggle_active')) {
			    content.slideUp({
				    duration: 300
			    });
			    element.removeClass('vc_toggle_active');
		    } else {
			    content.slideDown({
				    duration: 300
			    });
			    element.addClass('vc_toggle_active');
		    }
	    };
	    if($el) {
		    if($el.hasClass('vc_toggle_title')) {
			    $el.unbind('click').click(event);
		    } else {
			    $el.find(".vc_toggle_title").unbind('click').click(event);
		    }
	    } else {
		    jQuery(".vc_toggle_title").unbind('click').on('click', event);
	    }
    }
}

/* Waypoints magic (animation)
 ---------------------------------------------------------- */
if (typeof window['vc_waypoints'] !== 'function') {
	window.vc_waypoints = function () {

		var animation_enabled=true;
		if(jQuery('html').hasClass('touch') && jQuery('body').hasClass('om-no-animation-on-touch')) {
			jQuery('.wpb_animate_when_almost_visible:not(.wpb_start_animation)').addClass('om-disable-wpb-animation').removeClass('wpb_animate_when_almost_visible');
		} else {
			if ("undefined" != typeof jQuery.fn.waypoint) {
				jQuery('.wpb_animate_when_almost_visible:not(.wpb_start_animation)').each(function () {
					var delay = parseInt(jQuery(this).data('animation-delay'));
					var $this = jQuery(this);
					jQuery(this).waypoint(function () {
						if (delay) {
							setTimeout(function () {
								$this.addClass('wpb_start_animation animated');
							}, delay);
						} else {
							$this.addClass('wpb_start_animation animated');
						}
					}, {
						/*offset: 'bottom-in-view',*/
						offset: '83%',
						triggerOnce: true
					});
				});
			}
		}
	}
}
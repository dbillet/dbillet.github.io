var AJL = AJL || {};

var mouse = {x: 0, y: 0};

AJL.variables = {
	AJLColumns: [],
	ticking: false
}

AJL.helpers = {};

(function($) {
	$.fn.AJLCol = function(options) {
		var self = this,
		content = this.find('.content'),
		reverse = self.hasClass('reverse'),
		scrollPosition = 0,
		prevScrollVal = 0;

		var defaultOpts = {
			maxScrollDelta: 40,
			scrollMultiplier: 6
		}

		this.init = function() {
			options = $.extend({}, defaultOpts, options);

			if (reverse) {
				self.scroll(content.height() - self.height());
			} else {
				self.scroll(0);
			}

			setTimeout(function(){
				$("body").removeClass("preload");
				loadImages();
			}, 500);

		};

		this.updateScroll = function(){
			content.css('top', scrollPosition + 'px');
		};

		this.scroll = function(by) {
			//console.log('scrolling!'+by);
			var maxTop, minTop;
			if( reverse ) {
				maxTop = $(window).height();
				minTop = (content.height() * -1) + self.height();
			} else {
				maxTop = 0;
				minTop = ((content.height()+$(window).height()+200) * -1) + self.height();
			}


			// Sometimes the mousewheel event returns an invalid number in Safari.
			// This tries to fix that.

			if(isNaN(by)){
				if(isNaN(prevScrollVal)){
					by = 0;
				} else {
					by = prevScrollVal;
				}
			}


			if (reverse) {
				scrollPosition -= by;
				if (scrollPosition > maxTop && by < 0) {
					scrollPosition = maxTop;
				}

				if (scrollPosition < minTop && by > 0) {
					scrollPosition = minTop;
				}

			} else {
				scrollPosition += by;
				if (scrollPosition > maxTop && by > 0) {
					scrollPosition = maxTop;
				}

				if (scrollPosition < minTop && by < 0) {
					scrollPosition = minTop;

					$('.name').fadeOut('slow', function(){
						$('.credits').fadeIn('slow', function(){
							hijackScroll.deactivate();
							initScrolling();

							var resetTimer;
							$('.credits').on('mousemove', function(){
								window.clearTimeout(resetTimer);
								resetTimer = setTimeout(function(){
									$('.credits').fadeOut();
									$('.name').fadeIn();
								}, 2000);
							}).one( 'DOMMouseScroll mousewheel', function ( event ) {
							  window.clearTimeout(resetTimer);
							  $('.credits').fadeOut();
							  $('.name').fadeIn();
							  return false;
							});
						});



					});

				}

			}

			content.css('top', scrollPosition + 'px');

			prevScrollVal = by;
			AJL.variables.ticking = false;
		}

		self.init();

		return this.each(function() {});
	};
})(jQuery);



AJL.helpers.constrain = function(val, min, max) {
	if (val < min) {
		val = min;
	}
	if (val > max) {
		val = max;
	}
	return val;
}

$(document).ready(function(){
	if( isTouchDevice() == false ) {
		$('.mobile').remove();
		$('.col').imagesLoaded(function(){
			initScrolling();
		});
	} else {
		$('.stage').remove();
		initMobile();
	}

});

var initScrolling = function() {

	var cols = $('.col');
	AJL.variables.AJLColumns = [];
	for (var i = 0; i < cols.length; i++) {
		var col = $(cols[i]);
		AJL.variables.AJLColumns.push(col.AJLCol());
	}

	initHijack();
}

var initMobile = function() {
	$('body').addClass('is-mobile');
	setTimeout(function(){
		$("body").removeClass("preload");
		loadImages();
	}, 500);

	$(window)
	  .on("scrollstart", function() {
	    $('body').addClass('scrolling');
	  })
	  .on("scrollstop", function() {
	    $('body').removeClass('scrolling');
	  });

	$(window).scroll(function() {
	   if($(window).scrollTop() + $(window).height() > $(document).height() - 500) {
	      $.get('/mobile-content.php', function(response){
	      	$('.mobile .content').append(response);
	      	loadImages();
	      });
	   }
	});

	$('.show-credits').on('touchstart click', function(e){
		e.preventDefault();
		$('.credits').fadeIn();
	});

	$('.close-credits').on('touchstart click', function(e){
		e.preventDefault();
		$('.credits').fadeOut();
	});

	$('.content a').on('click', function(e){
		e.preventDefault();
		$('body').append('<div class="mobile-image-viewer"><img src="'+$(this).attr('href')+'" /><a class="close-btn">CLOSE</a></div>');

		$('.mobile-image-viewer').imagesLoaded(function(){
			$('.mobile-image-viewer').addClass('visible');

			$('.mobile-image-viewer .close-btn').on('click', function(e){
				e.preventDefault();
				$('.mobile-image-viewer').fadeOut(function(){
					$('.mobile-image-viewer').remove();
				});
			})
		});
	})
}
var nameTimeout;
var initHijack = function() {
	hijackScroll.activate(function(offset){

		window.clearTimeout(nameTimeout);

		$.each(AJL.variables.AJLColumns, function(key, val) {
			val.scroll(AJL.helpers.constrain(offset, -175, 175));
		});

		if(!AJL.variables.ticking) {
			requestAnimationFrame(function(){
				$.each(AJL.variables.AJLColumns, function(key, val) {
					val.updateScroll();
				});
			});
			AJL.variables.ticking = true;
		}

		$('body').addClass("scrolling");

		nameTimeout = setTimeout(function(){
			$('body').removeClass('scrolling');
		}, 100);

	});
}

function isTouchDevice(){
	try{
		document.createEvent("TouchEvent");
		return true;
	}catch(e){
		return false;
	}
}


$(document).ready(function(){

	if( isTouchDevice() ) {
		$('body').addClass('is-touch');
	}

	$(window).on('mousemove', function(event){
		mouse.x = event.clientX;
    mouse.y = event.clientY;
	}).trigger('mousemove');

	$('.col a').hover(function(){
		$('.col a').not($(this)).find('img').css({
			opacity: 0.5
		});
	}, function(){
		$('.col a img').css({
			opacity: 1
		});
	})

	if( isTouchDevice() == false ) {
		$('.col a').on('click', function(e){
			e.preventDefault();
			$('body').append('<div class="image-viewer"><img src="'+$(this).attr('href')+'" /></div>');

			$('.image-viewer').imagesLoaded(function(){
				mousemoveFullscreen();
				$('.image-viewer').addClass('visible');
				$('.image-viewer').bind('mousemove', mousemoveFullscreen);

			}).on('click', function(e){
				e.preventDefault();
				$('.image-viewer').removeClass('visible');
				setTimeout(function(){
					$('.image-viewer').remove();
				}, 500);
			});

		});
	}


});


function loadImages() {
	var $divs = $(".content > a");
	var interval = setInterval(function () {
		var $ds = $divs.not(".visible");
		$ds.eq(Math.floor(Math.random() * $ds.length)).addClass('visible');
		if ($ds.length == 1) {
			clearInterval(interval);
		}
	}, 50);
}


function mousemoveFullscreen(event,imgHeight){
	// Container Data
	var $section = $('.image-viewer'),
	 $object = $('.image-viewer');

	if(typeof event != "undefined") {
		var posY = event.clientY;
	}
	else {
		var posY = mouse.y;
	}
	if(imgHeight != undefined) {
		var midY = $section.height() / 2;
	}
	else {
		var midY = $object.height() / 2;
	}

	var percY = 0;

	// Image Data
	var $img = $('img', $object);
	if(imgHeight != undefined) {
		var extraY = (imgHeight - $section.height()) / 2;
	} else {
		var extraY = ($img.height() - $object.height()) / 2;
	}
	var posTop = 0;

	// Top

	if(posY < midY){
		percY = (midY - posY) / midY;
		posTop = - extraY + (percY * extraY);
	}
	// Bottom
	else {
		percY = - ((posY - midY) / midY);
		posTop = - extraY + (percY * extraY);
	}


	if(event != '') $('img', $object).css('top', posTop+'px');
	else return posTop;
}

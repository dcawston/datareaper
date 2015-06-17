$(document).ready(function() {
	
	function showControls($_, $elem) {
		
		_top = $('.reaper-viewport').offset().top + 
				$('.reaper-viewport').outerHeight() + 4;
		_left = $('.reaper-viewport').offset().left + 
				$('.reaper-viewport').outerWidth()/2 - 
				$('.reaper-controls').outerWidth()/2;
		
		$('.reaper-controls').css('top', _top).css('left', _left);
		
	}
	
	$('.reaper-header form').submit(function(e) {
		$('.reaper-dyn-content').attr('src', '/' + $(this).find('.reaper-url').val());
		
		setTimeout(function() { 
			subDocument = document.getElementsByClassName('reaper-dyn-content')[0].contentDocument;
		
			$(subDocument).ready(function() {
				
				$_ = $(subDocument);
			
				$_.mousemove(function(e) {
					$_.find('.reaper-hover-elem').removeClass('reaper-hover-elem').css('outline', 'none');
					elem = subDocument.elementFromPoint(e.clientX, e.clientY);
					$(elem).addClass('reaper-hover-elem').css('outline', '4px solid green');
				});
				
				$_.find('body *').mouseleave(function() {
					$_.find('.reaper-hover-elem').removeClass('reaper-hover-elem').css('outline', 'none');
				});
				
				$(subDocument).find('body *').click(function(e) {
					$_.find('.reaper-hover-elem').removeClass('reaper-hover-elem').css('outline', 'none');
					
					elem = subDocument.elementFromPoint(e.clientX, e.clientY);
					
					_top = $(elem).offset().top +
							$('.reaper-header').outerHeight() -
							$_.scrollTop();
					_left = $(elem).offset().left;
					
					$('.reaper-viewport').css('top', _top).css('left', _left);
					$('.reaper-viewport').css('width', $(elem).outerWidth()).css('height', $(elem).outerHeight());
					$('.reaper-overlay').fadeIn();
					
					showControls($_, $(elem));
					
					e.preventDefault();
					return false;
				});
				
			});
		}, 500);
		
		return false;
	});
	
	$('.reaper-overlay-trigger').click(function() {
		$('.reaper-overlay').fadeOut();
	});
	
	$('.reaper-controls .reaper-add').click(function() {
		if ( $('.reaper-sidebar').hasClass('open') ) {
			$('.reaper-sidebar').css('right', '-450px').removeClass('open');
		} else {
			$('.reaper-sidebar').css('right', '0px').addClass('open');
		}
	});
	
	__parts = window.location.href.split('?');
	if ( __parts.length == 2 ) {
		$('.reaper-url').val(__parts[1]);
		$('.reaper-header form').submit();
	}
	__parts = void(0);
	
});
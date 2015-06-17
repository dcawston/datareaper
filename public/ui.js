$(document).ready(function() {
	
	$('.reaper-header form').submit(function(e) {
		$('.reaper-dyn-content').attr('src', '/' + $(this).find('.reaper-url').val());
		
		setTimeout(function() { 
			subDocument = document.getElementsByClassName('reaper-dyn-content')[0].contentDocument;
		
			$(subDocument).ready(function() {
				
				$_ = $(subDocument);
			
				$_.mousemove(function(e) {
					$_.find('.reaper-hover-elem').removeClass('reaper-hover-elem').css('outline', 'none');
					elem = subDocument.elementFromPoint(e.clientX, e.clientY);
					$(elem).addClass('reaper-hover-elem').css('outline', '1px dashed black');
				});
				
				$_.find('body *').mouseleave(function() {
					$_.find('.reaper-hover-elem').removeClass('reaper-hover-elem').css('outline', 'none');
				});
				
				$(subDocument).find('body *').click(function(e) {
					$_.find('.reaper-hover-elem').removeClass('reaper-hover-elem').css('outline', 'none');
					
					elem = subDocument.elementFromPoint(e.clientX, e.clientY);
					
					_top = $(elem).offset().top +
							$('.reaper-header').outerHeight() -
							$_.scrollTop() - 2;
					_left = $(elem).offset().left - 2;
					
					$('#overlay #viewport').css('top', _top).css('left', _left);
					$('#overlay #viewport').css('width', $(elem).outerWidth()).css('height', $(elem).outerHeight());
					$('#overlay').fadeIn();
					
					e.preventDefault();
					return false;
				});
				
			});
		}, 500);
		
		return false;
	});
	
	$('#overlay').click(function() {
		$(this).fadeOut();
	});
	
	__parts = window.location.href.split('?');
	if ( __parts.length == 2 ) {
		$('.reaper-url').val(__parts[1]);
		$('.reaper-header form').submit();
	}
	__parts = void(0);
	
});
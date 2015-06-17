$(document).ready(function() {
	
	
	$('.reaper-header form').submit(function(e) {
		$('.reaper-dyn-content').attr('src', '/' + $(this).find('.reaper-url').val());
		
		setTimeout(function() { 
			subDocument = document.getElementsByClassName('reaper-dyn-content')[0].contentDocument;
		
			$(subDocument).ready(function() {
			
				console.log(subDocument);
				
				$(subDocument).find('*').click(function(e) {
					$(subDocument).find('.reaper-hover-elem').removeClass('reaper-hover-elem');
					elem = subDocument.elementFromPoint(e.clientX, e.clientY);
					$('#overlay #viewport').css('top', $(elem).offset().top - 2).css('left', $(elem).offset().left - 2);
					$('#overlay #viewport').css('width', $(elem).outerWidth()).css('height', $(elem).outerHeight());
					$('#overlay').fadeIn();
					e.preventDefault();
					return false;
				});
				
				$(subDocument).mousemove(function(e) {
					$(subDocument).find('.reaper-hover-elem').removeClass('reaper-hover-elem');
					elem = subDocument.elementFromPoint(e.clientX, e.clientY);
					$(elem).addClass('reaper-hover-elem').css('outline', '1px dashed black');
				});
				
				$(subDocument).find('*').mouseleave(function() {
					$(subDocument).find('.reaper-hover-elem').removeClass('reaper-hover-elem').css('outline', '0');
				});
				
			});
		}, 500);
		
		return false;
	});
	
	$('#overlay').click(function() {
		$(this).fadeOut();
	});
	
});
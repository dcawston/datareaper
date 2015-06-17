$(document).ready(function() {
	
	$('.reaper-header form').submit(function(e) {
		$('.reaper-dyn-page iframe').attr('src', $(this).find('.reaper-url').val());
		return false;
	});
	
	$('.wrapper').click(function(e) {
		$('.reaper-hover-elem').removeClass('reaper-hover-elem');
		elem = document.elementFromPoint(e.clientX, e.clientY);
		$('#overlay #viewport').css('top', $(elem).offset().top - 2).css('left', $(elem).offset().left - 2);
		$('#overlay #viewport').css('width', $(elem).outerWidth()).css('height', $(elem).outerHeight());
		$('#overlay').fadeIn();
		return false;
	});
	$('.wrapper').mousemove(function(e) {
		$('.reaper-hover-elem').removeClass('reaper-hover-elem');
		elem = document.elementFromPoint(e.clientX, e.clientY);
		$(elem).addClass('reaper-hover-elem');
	});
	$('.wrapper').mouseleave(function() {
		$('.reaper-hover-elem').removeClass('reaper-hover-elem');
	})
	$('#overlay').click(function() {
		$(this).fadeOut();
	});
	
});
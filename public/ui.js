var elementsToCompare = [];
var tmpGuess;

String.prototype.replaceAt=function(index, character) {
	return this.substr(0, index) + character + this.substr(index+character.length);
}

function newGuess(first, second) {
	txt = strDiff(first, second);
	var el;
  
	if (first.charAt(parseInt(txt)-1) == '[') {
		el = first.replaceAt(parseInt(txt),"*");
	} else {
		el = first;
	}
	return el;
}

function strDiff(first, second) {
	if(first==second)
		return -1;
	first  = first.toString();
	second = second.toString();
	var minLen = Math.min(first.length,second.length);
	for(var i = 0; i<minLen; i++) {
		if(first.charAt(i) != second.charAt(i)) {
			return i;
		}
	}
	return minLen;
}

function getPathTo(element) {
	if (element.id !== '') {
		return "//*[@id='" + element.id + "']";
	}
	if (element === document.body) {
		return element.tagName.toLowerCase();
	}
	var ix = 0;
	var siblings = element.parentNode.childNodes;
	for (var i = 0; i < siblings.length; i++) {
		var sibling = siblings[i];
		
		if (sibling === element) return getPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
		
		if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
			ix++;
		}
	}
}

$(document).ready(function() {
	
	var $columnClone = {};
	
	function toggleSideBar(state) {
		
		var $sidebar = $('.reaper-sidebar');
		
		if ( state == 1 && !$sidebar.hasClass('open') ) {
			$sidebar.css('right', '0').addClass('open');
			
		} else if ( state == 0 && $sidebar.hasClass('open') ) {
			$sidebar.css('right', '-450px').removeClass('open');
			
		} else {
			if ( !$sidebar.hasClass('open') ) {
				$sidebar.css('right', '0').addClass('open');
			} else {
				$sidebar.css('right', '-450px').removeClass('open');
			}
		}
		
	}
	
	function injectXPathDetails(path) {
		
		var $container = $('.reaper-sidebar .reaper-collapse.current');
		
		$container.find('.reaper-xpath-constituent').last().find('input').val(path);
		
		var result = '';
		$container.find('.reaper-xpath-constituent input').each(function() {
			
			if ( result === '' ) {
				result = $(this).val();
			} else {
				result = newGuess(result, $(this).val());
			}
			
		});
		
		$container.find('.reaper-xpath-display input').val(result);
		
	}
	
	$('.reaper-dyn-content').load(function() {
		subDocument = document.getElementsByClassName('reaper-dyn-content')[0].contentDocument;
		$_ = $(subDocument);
		
		$_.find('a').unbind('click');
		
		$_.mousemove(function(e) {
			$_.find('.reaper-hover-elem').removeClass('reaper-hover-elem').css('outline', 'none');
			elem = subDocument.elementFromPoint(e.clientX, e.clientY);
			$(elem).addClass('reaper-hover-elem').css('outline', '4px solid green');
		});
		
		$_.find('body *').mouseleave(function() {
			$_.find('.reaper-hover-elem').removeClass('reaper-hover-elem').css('outline', 'none');
		});
		
		$_.find('body *').click(function(e) {
			try {
				
				$_.find('.reaper-hover-elem').removeClass('reaper-hover-elem').css('outline', 'none');
				
				elem = subDocument.elementFromPoint(e.clientX, e.clientY);
				
				_top = $(elem).offset().top +
						$('.reaper-header').outerHeight() -
						$_.scrollTop();
				_left = $(elem).offset().left;
				
				$('.reaper-viewport').css('top', _top).css('left', _left);
				$('.reaper-viewport').css('width', $(elem).outerWidth()).css('height', $(elem).outerHeight());
				$('.reaper-overlay').fadeIn();
				
				toggleSideBar(1);
				
				var root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
				var path = getPathTo(elem);
				
				injectXPathDetails(path);
				
			} catch(e) {
				console.error(e);
			}
			
			e.preventDefault();
			return false;
		});
		
	});
	
	$('.reaper-header form').submit(function(e) {
		$('.reaper-dyn-content').attr('src', '/' + $(this).find('.reaper-url').val());
		return false;
	});
	
	$('.reaper-overlay-trigger').click(function() {
		$('.reaper-overlay').fadeOut();
		toggleSideBar();
	});
	
	$('.reaper-collapse-header .icon.toggle').click(function() {
		if ( $(this).parent().hasClass('up') ) {
			$(this).css('transform', '');
			$(this).parent().removeClass('up');
			$(this).parentsUntil('.reaper-collapse').next().slideDown();
		} else {
			$(this).css('transform', 'rotate(180deg)');
			$(this).parent().addClass('up');
			$(this).parentsUntil('.reaper-collapse').next().slideUp();
		}
	});
	
	$('.reaper-collapse-body .icon.reaper-new-constituent').click(function() {
		$new = $columnClone.find('.reaper-xpath-constituent').clone(true);
		$(this).before($new);
	});
	
	$('.reaper-collapse-body .reaper-xpath-constituent .icon.reaper-constituent-reselect').click(function() {
		console.log("reselect not implemented yet");
	});
	$('.reaper-collapse-body .reaper-xpath-constituent .icon.reaper-constituent-delete').click(function() {
		$(this).parent().remove();
	});
	
	$columnClone = $('.reaper-collapse.current').clone(true);
	
	/**
	 * Magical method to dynamically load
	 * a page upon request
	 */
	var __i = window.location.href.indexOf('?');
	if ( __i != -1 ) {
		$('.reaper-url').val( window.location.href.substr(++__i) );
		$('.reaper-header form').submit();
	}
	
});
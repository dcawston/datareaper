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
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        
        if (sibling===element) return getPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        
        if (sibling.nodeType===1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

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
					
					var root= document.compatMode==='CSS1Compat' ? document.documentElement : document.body;
                    var path= getPathTo(elem);
                    var message = 'You clicked the element ' + path;
					elementsToCompare.push(path);
					if (elementsToCompare.length == 2) {
						tmpGuess = newGuess(elementsToCompare[0],elementsToCompare[1]);
						message = tmpGuess;
					}
					if (elementsToCompare.length > 2) {
						var tmpGuess2 = newGuess(elementsToCompare[elementsToCompare.length - 1], tmpGuess);
						tmpGuess = newGuess(tmpGuess2, tmpGuess);
						message = tmpGuess;
					}
                    $('.reaper-panel').html(message);

					
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
if(document.getElementsByClassName) {
	getElementsByClass = function(classList, node) {    
		return (node || document).getElementsByClassName(classList)
	}
} else {
	getElementsByClass = function(classList, node) {			
		var node = node || document,
		list = node.getElementsByTagName('*'), 
		length = list.length,  
		classArray = classList.split(/\s+/), 
		classes = classArray.length, 
		result = [], i,j
		for(i = 0; i < length; i++) {
			for(j = 0; j < classes; j++)  {
				if(list[i].className.search('\\b' + classArray[j] + '\\b') != -1) {
					result.push(list[i])
					break
				}
			}
		}
		return result;
	}
}

pos=0;

function move(side, type, cnt){
	var div = document.getElementById("ban"+type),
	elements = getElementsByClass('adv', div);
	for(var i=0; i<elements.length; i++) {
		if(elements[i].parentNode.tagName=="TD") {
			(type==2)?elements[i].parentNode.style.display="none":elements[i].parentNode.setAttribute('class', 'hideAdv');
		} else {
			(type==2)?elements[i].style.display="none":elements[i].setAttribute('class', 'hideAdv');
		}
	}
	if(side=='right'){
		(window.pos!=elements.length-1)?window.pos=window.pos+1:window.pos=0;
		if(window.pos==elements.length-cnt+1) {
			window.pos=0;
		}
	} else {
		if(window.pos!=0) {
			window.pos=window.pos-1;
		} else {
			window.pos=elements.length-cnt;
		}
	}
	if(type==2) {
		elements[window.pos].style.display="block";
	} else {
		elements[window.pos].parentNode.removeAttribute('class');
		elements[window.pos].parentNode.style.display="";
	}
	for(var x=0; x<cnt; x++){
		if(type==2) {
			elements[window.pos+x].style.display="block";
		} else {
			elements[window.pos+x].parentNode.removeAttribute('class');
			elements[window.pos+x].parentNode.style.display="";
		}
	}
}
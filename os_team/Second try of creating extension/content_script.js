
browser.runtime.sendMessage({type: 'getUA'}, function(response) {
	var code = "if(navigator.__defineGetter__){navigator.__defineGetter__('userAgent',function(){return "+JSON.stringify(response)+";});}";
	var textNode = document.createTextNode(code);

	var script = document.createElement('script');
	script.appendChild(textNode);
	script.remove();
	var parentNode = document.head||document.documentElement;
	parentNode.appendChild(script);
	parentNode.removeChild(script);

	
});
browser.runtime.sendMessage({type: 'getOS'}, function(response) {
var code1 = "if(navigator.__defineGetter__){navigator.__defineGetter__('OS',function(){return "+JSON.stringify(response)+";});}";
	var textNode = document.createTextNode(code1);
var script1 = document.createElement('script1');
	script1.appendChild(textNode);
	script1.remove();
	var parentNode = document.head||document.documentElement;
	parentNode.appendChild(script1);
	parentNode.removeChild(script1);

});

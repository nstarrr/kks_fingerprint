
let userAgents = {
	'Windows': [
		{ name: 'Edge', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134' },
		{ name: 'Firefox ', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0' },
		{ name: 'Chrome 68', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36' },
		{ name: 'Opera 52', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.64' }
	],
};
let os ={
	'Windows': [
		{name: 'Windows Vista', value:'Windows NT 6.0'},
		{name: 'Windows XP', value:'Windows NT 5.1|Windows XP'},
	],
	'linux': [
	{name: 'Linux', value:'Linux|X11'},
	],
};

function setUA(ua) {
    browser.runtime.sendMessage({
        type: 'setUA',
        ua: ua
    });
    window.close();
}

function resetUA() {
    browser.runtime.sendMessage({
        type: 'resetUA'
    });
    window.close();
}

function setOS(os) {
	browser.runtime.sendMessage({
		type: 'setOS',
		os:os
	});
	window.close();
}

function bindButtons() {
	document.getElementById('submit-ua-predefined').onclick = function() {
	    setUA(document.getElementById('ua-predefined').value);
	}

	document.getElementById('submit-ua-custom').onclick = function() {
	    setUA(document.getElementById('ua-custom').value);
	}

	document.getElementById('submit-ua-reset').onclick = resetUA;
	
	document.getElementById('submit-os-predefined').onclick = function() {
	    setOS(document.getElementById('os-predefined').value);
	}
}

function init() {
	bindButtons();
	populatePopupContent();
}

function populatePopupContent() {
	browser.runtime.sendMessage({
	    type: 'getUA'
	}, ua => {
		populateUserAgentSelect(ua);
			populateCurrentUA(ua);
	});
	browser.runtime.sendMessage({
	    type: 'getOS'
	}, os => {
		populateOSSelect(os);
			populateCurrentOS(os);
	});
}

function populateCurrentUA(ua) {
    document.getElementById('current-ua').innerText = ua;
}

function populateCurrentOS(os) {
    document.getElementById('current-os').innerText = os;
}

function populateUserAgentSelect(ua) {
	let selectBox = document.getElementById('ua-predefined');
	let keys = Object.keys(userAgents).sort();
	for(key of keys) {
		let optGroup = document.createElement('optgroup');
		optGroup.label = key;
		let uaGroup = userAgents[key];
		for(let i = 0; i < uaGroup.length; i++) {
			let agent = uaGroup[i];
			let option = document.createElement('option');
			option.text = agent.name;
			option.value = agent.value;
			if(option.value === ua) {
				option.selected = true;
			}
			optGroup.appendChild(option);
		}
		selectBox.appendChild(optGroup);
	};
}
function populateOSSelect(os) {
	let selectBox = document.getElementById('os-predefined');
	let keys = Object.keys(OS).sort();
	for(key of keys) {
		let optGroup = document.createElement('optgroup');
		optGroup.label = key;
		let osGroup= OS[key];
		for(let i = 0; i < osGroup.length; i++) {
			let agent = osGroup[i];
			let option = document.createElement('option');
			option.text = os.name;
			option.value = os.value;
			if(option.value === os) {
				option.selected = true;
			}
			optGroup.appendChild(option);
		}
		selectBox.appendChild(optGroup);
	};
}


init();

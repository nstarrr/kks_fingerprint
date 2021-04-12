let DEFAULT_UA = navigator.userAgent;
let CUSTOM_UA = DEFAULT_UA;
let DEFAULT_OS = navigator.oscpu;
let CUSTOM_OS = DEFAULT_OS;
function init() {
    bindOnBeforeSendHeaders();
    bindOnMessage();
}

function onBeforeSendHeadersCallback(details) {
    if (CUSTOM_UA === DEFAULT_UA) {
        return;
    }
    if (CUSTOM_OS === DEFAULT_OS){
		return;
	}

    for (let i = 0; i < details.requestHeaders.length; i++) {
        if (details.requestHeaders[i].name !== 'User-Agent') {
            continue;
        }
        details.requestHeaders[i].value = CUSTOM_UA;
        break;
    }
      for (let i = 0; i < details1.requestHeaders.length; i++) {
        if (details1.requestHeaders1[i].name !== 'OS') {
            continue;
        }
        details1.requestHeaders1[i].value = CUSTOM_OS;
        break;
    }

    return {
        requestHeaders: details.requestHeaders,
        requestHeaders1: details1.requestHeaders1
    };
}

function bindOnBeforeSendHeaders() {
    browser.webRequest.onBeforeSendHeaders.addListener(
        onBeforeSendHeadersCallback,
        { urls: ["<all_urls>"] },
        ["blocking", "requestHeaders"]
    );
}

function bindOnMessage() {
    browser.runtime.onMessage.addListener(function(msg, sender, callback) {
        if (msg.type === 'getUA') {
            callback(CUSTOM_UA);
        } else if (msg.type === 'setUA') {
            gotMessageSetUA(msg.ua);
        } else if (msg.type === 'resetUA') {
            gotMessageResetUA();
        }
        if (msg.type === 'getOS') {
			callback(CUSTOM_OS);
		} else if (msg.type === 'setOS'){
			gotMessageSetOS(msg.os);
		}
    });
}

function gotMessageSetUA(ua) {
    if (ua === '') {
        CUSTOM_UA = DEFAULT_UA;
    } else {
        CUSTOM_UA = ua;
    }
}

function gotMessageResetUA() {
    CUSTOM_UA = DEFAULT_UA;
}

function isString(input) {
    return input !== undefined && input !== null && typeof(input) === 'string';
}
function gotMessageSetOS(os) {
    if (os === '') {
        CUSTOM_OS = DEFAULT_OS;
    } else {
        CUSTOM_OS = os;
    }
}

init();

'use strict';

const value = JSON.parse(data)['ua'];

chrome.storage.local.set(
    { ua: value }
);

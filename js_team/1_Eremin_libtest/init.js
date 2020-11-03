let data;
function initFingerprintJS() {
    FingerprintJS.load()
    .then(fp => fp.get())
    .then((result) => {
        data=result;
        load('./script.js')
    })
    }

function load(src){
    let script = document.createElement('script');
    script.src=src;
    document.head.append(script);
}
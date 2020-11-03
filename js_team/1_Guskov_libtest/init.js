var fpromise, statsPromise;
function initFingerprintJS() {
    fpromise = FingerprintJS.load()
    .then(fp => {return new Promise ((resolve, reject) => resolve(fp.get()));})
}

async function start() {
	let data = await fpromise;
	
	if (getCookie('beenHere5')==null) {
		setCookie('beenHere5', '1');
		data.visitor = "new";
		greet_new.classList.remove('none');
	}
	else {
		data.visitor = "old";
		greet_old.classList.remove('none');
	}
	
	sendToServer(data);
    setData(data);
}

function sendToServer (data) {
	const request = new XMLHttpRequest();	
	const url = "ajax.php";
	let params = data;
	statsPromise = new Promise ((resolve, reject) => {
		request.open("POST", url, true);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.addEventListener("readystatechange", () => {
			if(request.readyState === 4 && request.status === 200) {       
				resolve(request.responseText);
			}
		});
		
		params = JSON.stringify(params);
		request.send(params);
	});
}

async function setData(data) {
    console.log(data)
    if(data){
		let stats = JSON.parse(await statsPromise);
		for (entry_name in data.components) {
			let mod;
			if (stats[entry_name]*100 < 5) 
				mod = 'red'
			else if (stats[entry_name]*100 < 30) 
				mod = 'yel'
			else mod = 'green';
			
			data_holder.innerHTML += 	'<tr class="entry"> <td class="entry_name">' + entry_name + '</td><td class="entry_value"><div>' + JSON.stringify(data.components[entry_name].value) +
										'</div></td><td class="entry_percents ' + mod + '">' + (stats[entry_name]*100).toFixed(4) + '%</td></tr>';
		}
    }
}
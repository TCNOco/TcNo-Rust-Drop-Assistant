//CHROME VERSION
/*Other versions:"
	Chrome Web Store: https://chrome.google.com/webstore/detail/tbd
	Firefox Add-ons: https://addons.mozilla.org/en-US/firefox/addon/tbd

Developed by: Wesley Pyburn
Bug reports and business enquiries: TechNobo@tcno.co
Website: https://tcno.co/
View this project on GitHub: https://github.com/TcNobo/TcNo-Rust-Drop-Assistant
*/
var storageProtocol = (window.chrome) ? chrome : browser;

var console_info = ["%c TcNo Rust Drop Assistant %cby TechNobo (Wesley Pyburn) %chttps://tcno.co/ ", 'background: #222; color: white','background: #222; color: #bada55','background: #222; color: lightblue'];
console.log.apply(console, console_info);

window.addEventListener('load', function () {
	if (window.location.href.includes("inventory")){ // Twitch 
		addStylesheet();
		callSnackbar("Loaded");
		TcNo_RDA_Twitch();
	}
	if (window.location.href.includes("facepunch")){ // Twitch 
		addStylesheet();
		callSnackbar("Loaded");
		TcNo_RDA_Fp();
	}
});
function addStylesheet(){
	var s = document.createElement('link');
	s.type = "text/css";
	s.rel = "stylesheet";
	s.href = chrome.extension.getURL('TcNo_snackbar.css');
	s.onload = function() {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(s);
	
	var d = document.createElement('div');
	d.id = "snackbar";
	d.innerHTML = "TcNo Rust Drop Assistant Loaded!";
	(document.body).appendChild(d);
}
var fadeout;
function callSnackbar(text, length = 3000) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  x.innerHTML = "<h1 class='title'>TcNo Rust Drop Assistant</h1><span>"+text+"</span>";
  clearTimeout(fadeout);
  fadeout = setTimeout(()=>{ x.className = "show fadeout"; setTimeout(()=>{x.className = x.className = "";}, 500); }, length);
}

async function TcNo_RDA_Twitch(){
	var init_timeout = 0;
	var claimedItems = []; 
	if (window.location.href.indexOf("TcNo_update" > -1))callSnackbar("Tab closing after item collection");
	while (init_timeout < 10){
		try{
			var claimedItemList = document.querySelector('[data-test-selector=drops-list__wrapper]').getElementsByClassName("tw-tower")[0];
			[].forEach.call(claimedItemList.querySelectorAll('.tw-semibold'), (el)=>{claimedItems.push(escape(el.innerHTML.toLowerCase()))});
			if (claimedItems.length <= 1)throw '';
			
			await storageProtocol.storage.local.set({claimedItems: claimedItems.join(","), lastChecked: new Date().toString()});
			
			console.log("Saved info to claimedItems in chrome.storage.local");
			console.log(claimedItems);
			callSnackbar("Saved claimed items");
			
			init_timeout = 10; // Success
			
			if (window.location.href.indexOf("TcNo_update" > -1))window.close();
		}catch (er){
			init_timeout++;
			await new Promise(r => setTimeout(r, 2000));
		}
	}
}
function getData_Chrome(sKey) {
  return new Promise(function(resolve, reject) {
    storageProtocol.storage.local.get(sKey, function(items) {
      if (storageProtocol.runtime.lastError) {
        console.error(storageProtocol.runtime.lastError.message);
        reject(storageProtocol.runtime.lastError.message);
      } else {
        resolve(items[sKey]);
      }
    });
  });
}

toHHMMSS = function (seconds) {
    var sec_num = parseInt(seconds/1000, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return (hours>0?hours+'h ':"")+(minutes>0?minutes+'m ':"")+(seconds>0?seconds+'s':"");
}

async function TcNo_RDA_Fp(){
	var init_timeout = 0;
	
	claimedItems = await getData_Chrome('claimedItems');
	var lc = await getData_Chrome('lastChecked');
	console.log("Last checked: " + lc);
	
	var lc_now = new Date().getTime();
	var lc_d = Date.parse(lc);
	var timeSince = toHHMMSS(lc_now - lc_d);
	
	callSnackbar("Time since last check: " + timeSince+"<br><p style='margin:0;font-size:0.6em'>Last check: " + lc + "</p><a target='_blank' href='https://www.twitch.tv/drops/inventory?TcNo_update'>Update now</a>", 7500);
	
	while (init_timeout < 10){
		try{
			var eComplete = [];
			var eIncomplete = [];
			[].forEach.call(document.getElementsByClassName("drop-item__title"), (el)=>{
				if (claimedItems.includes(escape(el.innerHTML.toLowerCase()))){ // Element is an item that has been recieved.
					el.parentElement.setAttribute("style", "background-color:#090E00;outline-offset: -6px;outline:solid 1px #718F41");
					
					// If the item does not belong to the second list of items, and is a streamer drop, not a Twitch drop:
					if (el.parentElement.parentElement.parentElement.classList.contains('streamer'))
						eComplete.push(el.parentElement);
				}else{
					if (el.parentElement.parentElement.parentElement.classList.contains('streamer'))
						eIncomplete.push(el.parentElement);
				}
			});
			
			// Rearrange:
			var rowCount = 0;
			[].forEach.call(document.getElementsByClassName('rust-drops__body'), (row)=>{
				for (let i=0; i < 3; i++){
					//console.log(i);
					if (rowCount < 3){
						if (eIncomplete.length > 0){
							row.appendChild(eIncomplete[0]);
							eIncomplete.shift();
						}else if (eComplete.length > 0){
							row.appendChild(eComplete[0]);
							eComplete.shift();
						}
					}
					rowCount++;
				}
				rowCount = 0;
			});
			
			
			init_timeout = 10;
		}catch{
			init_timeout++;
			await new Promise(r => setTimeout(r, 2000));
		}
	}
}
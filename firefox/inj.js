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

var console_info = ["%c TcNo Rust Twitch Drop Assistant %cby TechNobo (Wesley Pyburn) %chttps://tcno.co/ ", 'background: #222; color: white','background: #222; color: #bada55','background: #222; color: lightblue'];
console.log.apply(console, console_info);

window.addEventListener('load', function () {
	if (window.location.href.includes("inventory")){ // Twitch 
		// var s = document.createElement('script');
		// s.src = chrome.extension.getURL('TcNo_RDA_Twitch.js');
		// s.onload = function() {
			// this.remove();
		// };
		// (document.head || document.documentElement).appendChild(s);
		TcNo_RDA_Twitch();
	}
	if (window.location.href.includes("facepunch")){ // Twitch 
		// var s = document.createElement('script');
		// s.src = chrome.extension.getURL('TcNo_RDA_Twitch.js');
		// s.onload = function() {
			// this.remove();
		// };
		// (document.head || document.documentElement).appendChild(s);
		TcNo_RDA_Fp();
	}
});


async function TcNo_RDA_Twitch(){
	var init_timeout = 0;
	var claimedItems = []; 
	while (init_timeout < 10){
		try{
			[].forEach.call(document.getElementsByClassName("tw-tower")[this.length-1].querySelectorAll('.tw-semibold'), (el)=>{claimedItems.push(escape(el.innerHTML.toLowerCase()))});
			if (claimedItems.length <= 1){
				[].forEach.call(document.getElementsByClassName("tw-tower")[this.length].querySelectorAll('.tw-semibold'), (el)=>{claimedItems.push(escape(el.innerHTML.toLowerCase()))});
				if (claimedItems.length <= 1)throw '';
			}
			//console.log("var claimedItems =[\"" + claimedItems.join("\",\"") + "\"]");
			//copy("var claimedItems =[\"" + claimedItems.join("\",\"") + "\"]");
			
			await storageProtocol.storage.local.set({claimedItems: claimedItems.join(",")});
			
			
			// if (window.chrome){
				// chrome.storage.local.set({claimedItems: claimedItems}, ()=>{console.log("Set in Chrome")});
			// }else{
				// // let claimedItemsFirefox = {
				  // // name: "Moggy",
				  // // speak: function() {console.log("Miaow")},
				  // // birthday: new Date(2006, 7, 12)
				// // }
				// // // store the objects
				// // let setting = browser.storage.local.set({claimedItemsFirefox});
				// // // just check for errors
				// // setting.then(null, onError);
				// storageProtocol.storage.local.set({claimedItems: claimedItems}, ()=>{console.log("Set in Firefox")});
			// }
			
			console.log("Saved info to claimedItems in <chrome/browser>.storage.local");
			
			init_timeout = 10;
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

async function TcNo_RDA_Fp(){
	var init_timeout = 0;
	
	//(window.chrome) ? chrome.storage.local.get(['claimedItems'], (e)=>{claimedItems = e.split(",")}) : console.log("FIREFOX");
	claimedItems = await getData_Chrome('claimedItems');
	
	// console.log("Saved: " + window.localStorage.getItem('claimedItems'))
	// var claimedItems = browser.localStorage.getItem('claimedItems').split(",");
	// console.log("Got info from claimedItems in LocalStorage");
	//console.log("Val: " + claimedItems[0]);
	
	
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
			//[].forEach.call(toRemove, (el)=>{el.remove()}); // Remove elements
			//[].forEach.call(toRemove, (el)=>{el.setAttribute("style", "background-color:#090E00;outline-offset: -10px;outline:solid 1px #718F41");el.parentElement.appendChild(el)}); // Do something else with elements
			
			// Rearrange:
			var rowCount = 0;
			[].forEach.call(document.getElementsByClassName('rust-drops__body'), (row)=>{
				for (let i=0; i < 3; i++){
					console.log(i);
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
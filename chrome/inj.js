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

var console_info = ["%c TcNo RDA (TcNo Rust Drop Assistant) %cby TechNobo (Wesley Pyburn) %chttps://tcno.co/ ", 'background: #222; color: white','background: #222; color: #bada55','background: #222; color: lightblue'];
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
var style = (function() {
	var style = document.createElement("style");
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
	return style;
})();
function addStylesheet(){
	var css = document.createElement('style'); 
	css.type = 'text/css'; 
  
	var snackbar_styles =`#snackbar{visibility:hidden;min-width:250px;background-color:#230B16;color:#fff;text-align:center;border:solid 4px #DE2A2A;padding:16px;position:fixed;z-index:1;left:50%;transform:translateX(-50%);bottom:30px;-webkit-box-shadow: 0px 0px 20px 5px #230B16;-moz-box-shadow: 0px 0px 20px 5px #230B16;box-shadow: 0px 0px 20px 5px #230B16;}#snackbar.show{visibility:visible;-webkit-animation:fadein 0.5s,fadeout .5s 2.5s;animation:fadein 0.5s}#snackbar.fadeout{bottom:0;opacity:0;animation:fadeout .5s 0s}@-webkit-keyframes fadein{from{bottom:0;opacity:0}to{bottom:30px;opacity:1}}@keyframes fadein{from{bottom:0;opacity:0}to{bottom:30px;opacity:1}}@-webkit-keyframes fadeout{from{bottom:30px;opacity:1}to{bottom:0;opacity:0}}@keyframes fadeout{from{bottom:30px;opacity:1}to{bottom:0;opacity:0}}#snackbar h1{color:#9146ff;font-size:2em}#snackbar span{color:#efebe0;font-size:1.3em}#snackbar a{color:#aa4734!important;font-size:1.5em;text-decoration:underline}`;
	
	if (css.styleSheet)  
		css.styleSheet.cssText = snackbar_styles;
	else  
		css.appendChild(document.createTextNode(snackbar_styles));
	document.getElementsByTagName("head")[0].appendChild(css); 
				
	var d = document.createElement('div');
	d.id = "snackbar";
	d.innerHTML = "TcNo RDA Loaded!";
	(document.body).appendChild(d);
}
var fadeout;
function callSnackbar(text, length = 3000) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  x.innerHTML = "<h1 class='title'><svg width='0.72em' height='0.72em' viewBox='0 0 240 322' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xml:space='preserve' xmlns:serif='http://www.serif.com/' style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;'><rect id='font_TCNO' x='0' y='0' width='240' height='321.6' style='fill:none;'/><clipPath id='_clip1'><rect x='0' y='0' width='240' height='321.6'/></clipPath><g clip-path='url(#_clip1)'><path d='M-0,145.566l-0,160.801l37.346,-0l-0,-67.666l78.868,82.899l0,-160.8l-37.349,-0l0,67.691l-78.865,-82.925Zm129.753,131.249l28.436,29.551l-28.436,0l-0,-29.551Zm-0,-20.586l-0,-95.429l110.247,-0l-0,145.566l-62.001,0l-48.246,-50.137Zm72.797,-58.08l-35.347,-0l-0,70.868l35.347,0l-0,-70.868Zm-171.496,-37.349l34.068,35.545l0,-35.545l-34.068,-0Zm98.699,-160.8l-0,146.413l110.247,-0l-0,-36.381l-72.919,0l-0,-71.957l72.919,-0l-0,-38.075l-110.247,-0Zm-129.753,-0l-0,37.268l39.322,0l-0,109.145l37.314,-0l-0,-109.145l39.72,-0l0,-37.268l-116.356,-0Z' style='fill:#9146ff;'/></g></svg> Rust Drop Assistant</h1><span>"+text+"</span>";
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
			
			
			// Get progress
			var progressItemList = document.querySelector('[data-test-selector=DropsCampaignsInProgressPresentation-main-layout]').getElementsByClassName("tw-mg-t-2");
			[].forEach.call(progressItemList, (el)=>{
				if (el.querySelector('[data-test-selector=DropsCampaignInProgressRewardPresentation-claim-button]') !== null){ // THIS ITEM HAS A CLAIM Button
					//console.log(escape(el.querySelectorAll('.tw-semibold')[0].innerHTML.toLowerCase()) + "||100"); // Eg. buddha%20mask||100 == Claim button visible
					claimedItems.push(escape(el.querySelectorAll('.tw-semibold')[0].innerHTML.toLowerCase()) + "||100"); // Eg. buddha%20mask||100 == Claim button visible
				}else if (el.querySelector('[role=progressbar]') !== null){
					var val = el.querySelector('[role=progressbar]').attributes["aria-valuenow"].value;
					if (val != 0){
					//console.log(escape(el.querySelectorAll('.tw-semibold')[0].innerHTML.toLowerCase()) + "||" + el.querySelector('[role=progressbar]').attributes["aria-valuenow"].value);
					claimedItems.push(escape(el.querySelectorAll('.tw-semibold')[0].innerHTML.toLowerCase()) + "||" + el.querySelector('[role=progressbar]').attributes["aria-valuenow"].value);
					}
				}
			});
			
			
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
	claimedItems = claimedItems.split(",");
	var items_Progess = []; 
	var lc = await getData_Chrome('lastChecked');
	console.log("Last checked: " + lc);
	
	var lc_now = new Date().getTime();
	var lc_d = Date.parse(lc);
	var timeSince = toHHMMSS(lc_now - lc_d);
	
	callSnackbar("Time since last check: " + timeSince+"<br><p style='margin:0;font-size:0.6em'>Last check: " + lc + "</p><a target='_blank' href='https://www.twitch.tv/drops/inventory?TcNo_update'>Update now</a>", 7500);
	
	// Move items with progress into a new list, clean it up for the next loop
	//console.log(claimedItems);
	for (i = 0; i < claimedItems.length; ++i) {
		var claimedItem = claimedItems[i];
		if (claimedItem.indexOf("||") != -1){items_Progess.push(claimedItem);}
		claimedItems[i] = claimedItem.split("||")[0];
	}
		
	while (init_timeout < 10){
		try{
			var eComplete = [];
			var ePartial = [];
			var eIncomplete = [];
			[].forEach.call(document.getElementsByClassName("drop-item__title"), (el)=>{
				var currentItemName = escape(el.innerHTML.toLowerCase());
				// Alternative item names included here. Will add as time goes on...
				var altItemName = "";
				if (currentItemName.indexOf("metal%20facemask")!=-1){
					altItemName = currentItemName.replace("metal%20facemask", "mask")
				}
				if (claimedItems.includes(currentItemName) || (altItemName != "" && claimedItems.includes(altItemName))){ // Element is an item that has been recieved.
					el.parentElement.setAttribute("style", "background-color:#090E00;outline-offset: -6px;outline:solid 1px #718F41;padding:16px");
					
					var hasSomeProgression = false;
						
					// If item has progression, show the bar
					[].forEach.call(items_Progess, (item)=>{
						if (item.indexOf(currentItemName) != -1 || (altItemName != "" && item.indexOf(altItemName) != -1)){
							var progress = (item.indexOf("||") != -1 ? item.split("||")[1] : 100);
							var cln = el.parentElement.getElementsByClassName("drop-item__subtitle")[0].cloneNode(true);
							var prog = document.createElement("div");
							prog.className = "ProgressBar";
							var prog_inner = document.createElement("div");
							prog_inner.style.cssText = "width:" + progress + "%";
							prog.appendChild(prog_inner);
							el.parentElement.getElementsByClassName("drop-item__subtitle")[0].appendChild(prog);
							el.parentElement.getElementsByClassName("drop-item__subtitle")[0].querySelector("span").innerHTML += " (" + progress + "%)";
							
							el.parentElement.setAttribute("style", "background-color:#1f0021;outline-offset: -6px;outline:dashed 1px #8b418f;padding:16px;");
							hasSomeProgression = true;
						}
					});
					
					// If the item does not belong to the second list of items, and is a streamer drop, not a Twitch drop:
					if (el.parentElement.parentElement.parentElement.classList.contains('streamer')){
						console.log(el.parentElement);
						if (hasSomeProgression) ePartial.push(el.parentElement);
						else eComplete.push(el.parentElement);
					}
				}else{
					if (el.parentElement.parentElement.parentElement.classList.contains('streamer'))
						eIncomplete.push(el.parentElement);
				}
			});
			
			style.sheet.insertRule('.drop-item{padding: 16px;}', 0);
			style.sheet.insertRule('.ProgressBar{width: 100%;height: .5rem;background-color:#222;margin-top:0.5rem}', 0);
			style.sheet.insertRule('.ProgressBar div{height: .25rem;background-color:#9147ff;}', 0);
			style.sheet.insertRule('video{-webkit-box-shadow: 0px 0px 6px 3px rgba(0,0,0,0.75);-moz-box-shadow: 0px 0px 6px 3px rgba(0,0,0,0.75);box-shadow: 0px 0px 6px 3px rgba(0,0,0,0.75);}', 0);
			
			// Rearrange:
			var rowCount = 0;
			[].forEach.call(document.getElementsByClassName('rust-drops__body'), (row)=>{
				for (let i=0; i < 3; i++){
					//console.log(i);
					if (rowCount < 3){
						if (eIncomplete.length > 0){
							row.appendChild(eIncomplete[0]);
							eIncomplete.shift();
						}else if (ePartial.length > 0){
							row.appendChild(ePartial[0]);
							ePartial.shift();
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
		}catch(e){
			console.log(e);
			init_timeout++;
			await new Promise(r => setTimeout(r, 2000));
		}
	}
}
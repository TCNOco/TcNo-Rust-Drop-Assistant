//CHROME VERSION
/*Other versions:
	Chrome Web Store: https://chrome.google.com/webstore/detail/tcno-rust-twitch-drop-ass/hflmhkgipblnfcplmdlkcknmenjmnedp
	Firefox Add-ons: https://addons.mozilla.org/en-US/firefox/addon/tcno-rda/
	Opera Addons: https://addons.opera.com/en/extensions/details/tcno-rust-drop-assistant/
	Edge Addons: https://microsoftedge.microsoft.com/addons/detail/clmoikdedmelmfjknlmcmmafiinmdgao

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
  
	var snackbar_styles =`#snackbar{z-index: 50;visibility:hidden;min-width:250px;background-color:#230B16;color:#fff;text-align:center;border:solid 4px #DE2A2A;padding:16px;position:fixed;left:50%;transform:translateX(-50%);bottom:30px;-webkit-box-shadow: 0px 0px 20px 5px #230B16;-moz-box-shadow: 0px 0px 20px 5px #230B16;box-shadow: 0px 0px 20px 5px #230B16;}#snackbar.show{visibility:visible;-webkit-animation:fadein 0.5s,fadeout .5s 2.5s;animation:fadein 0.5s}#snackbar.fadeout{bottom:0;opacity:0;animation:fadeout .5s 0s}@-webkit-keyframes fadein{from{bottom:0;opacity:0}to{bottom:30px;opacity:1}}@keyframes fadein{from{bottom:0;opacity:0}to{bottom:30px;opacity:1}}@-webkit-keyframes fadeout{from{bottom:30px;opacity:1}to{bottom:0;opacity:0}}@keyframes fadeout{from{bottom:30px;opacity:1}to{bottom:0;opacity:0}}#snackbar h1{color:#9146ff;font-size:2em}#snackbar span{color:#efebe0;font-size:1.3em}#snackbar a{color:#aa4734!important;font-size:1.5em;text-decoration:underline}`;
	
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
	let monthsText = ["months", "måneder", "Monaten", "meses", "mois", "mesi", "hónappal", "maanden", "miesiące", "luni", "mesiacmi", "kuukautta", "månader", "tháng", " ay ", "měsíci", "месеца", "μήνες", "месяца", "เดือน", "个月", "個月", "か月", "개월"];
	let isAMonth = false;
	var init_timeout = 0;
	var claimedItems = []; 
	if (window.location.href.indexOf("TcNo_update") > -1) callSnackbar("Tab closing after item collection");
	while (init_timeout < 10){
		try{
			console.log("Getting claimed items");
			for (i of document.querySelector('[data-test-selector=drops-list__wrapper]').getElementsByClassName("tw-tower")[0].children)
				if (i.classList[0].indexOf("Placeholder") == -1){
					// check to see if not older than a month -- not dropping anymore. To prevent duplicates.
					isAMonth = false;
					monthsText.forEach(m => {
						if (i.getElementsByTagName("p")[0].innerHTML.includes(m)) isAMonth = true;
					});
					if (isAMonth) break; // No further items will be newer.
                    claimedItems.push(escape(i.getElementsByTagName("p")[1].innerHTML.toLowerCase().split(" ")[0]));
				}
			
			// Get progress
			let elm = document.querySelectorAll('[data-test-selector="DropsCampaignInProgressRewards-container"]');
			for (let i = 0; i < elm.length; i++){
				let el = elm[i];
				if (el.querySelector('[data-test-selector=DropsCampaignInProgressRewardPresentation-claim-button]') !== null){ // THIS ITEM HAS A CLAIM Button
					claimedItems.push(escape(el.querySelectorAll('p')[0].innerHTML.toLowerCase().split(" ")[0]) + "||100"); // Eg. buddha%20mask||100 == Claim button visible
				}else if (el.querySelector('[role=progressbar]') !== null){
					var val = el.querySelector('[role=progressbar]').attributes["aria-valuenow"].value;
					if (val != 0)
						claimedItems.push(escape(el.querySelectorAll('p')[0].innerHTML.toLowerCase().split(" ")[0]) + "||" + val);
				}
			}
			
			await storageProtocol.storage.local.set({claimedItems: claimedItems.join(","), lastChecked: new Date().toString()});
			console.log("Saved info to claimedItems in chrome.storage.local");			
			callSnackbar("Saved claimed items");
			init_timeout = 10; // Success
			if (window.location.href.indexOf("TcNo_update") > -1) window.close();
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
	//console.log("Last checked: " + lc);
	
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
			// Change max width of the container for new width
			style.sheet.insertRule('.container{max-width: 1220px;}', 0);
			style.sheet.insertRule('.drop-footer{width: 100%;}', 0);
			style.sheet.insertRule('.drop-footer .drop-time{width: 100%;text-align:center}', 0);
			
			[].forEach.call(document.getElementsByClassName("drop-name"), (el)=>{
				el.parentElement.parentElement.setAttribute("progress","0");
				
				
				var currentItemName = escape(el.innerHTML.toLowerCase().split(" ")[0]); // Take only the first word
				var drop_footer = el.parentElement;
				var drop = drop_footer.parentElement;
				var drop_table_section = drop_footer.parentElement.parentElement.parentElement.parentElement;
				drop.setAttribute("style", "margin-bottom: 32px;");
				
				if (claimedItems.includes(currentItemName)){ // Element is an item that has been recieved.
					drop.setAttribute("style", "background-color:#090E00;outline-offset: -6px;outline:solid 1px #718F41;padding:16px;margin-bottom: 32px;");
					el.parentElement.parentElement.setAttribute("progress",101);
											
					// If item has progression, show the bar
					[].forEach.call(items_Progess, (item)=>{
						if (item.indexOf(currentItemName) != -1){
							var progress = (item.indexOf("||") != -1 ? item.split("||")[1] : 100);
							var cln = drop_footer.getElementsByClassName("drop-time")[0].cloneNode(true);
							var prog = document.createElement("div");
							prog.className = "ProgressBar";
							var prog_inner = document.createElement("div");
							prog_inner.style.cssText = "width:" + progress + "%";
							el.parentElement.parentElement.setAttribute("progress",progress);
							prog.appendChild(prog_inner);
							drop_footer.getElementsByClassName("drop-time")[0].appendChild(prog);
							drop_footer.getElementsByClassName("drop-time")[0].querySelector("span").innerHTML += " (" + progress + "%)";
							
							drop.setAttribute("style", "background-color:#1f0021;outline-offset: -6px;outline:dashed 1px #8b418f;padding:16px;");
						}
					});
				}
			});
			
			style.sheet.insertRule('.drop-item{padding: 16px;}', 0);
			style.sheet.insertRule('.ProgressBar{width: 100%;height: .5rem;background-color:#222;margin-top:0.5rem}', 0);
			style.sheet.insertRule('.ProgressBar div{height: .25rem;background-color:#9147ff;}', 0);
			style.sheet.insertRule('video{-webkit-box-shadow: 0px 0px 6px 3px rgba(0,0,0,0.75);-moz-box-shadow: 0px 0px 6px 3px rgba(0,0,0,0.75);box-shadow: 0px 0px 6px 3px rgba(0,0,0,0.75);}', 0);
			
			var streamer_drops = document.getElementsByClassName("streamer-drops")[0].getElementsByClassName("drops-group")[0];
			var categoryItems = streamer_drops.querySelectorAll("[progress]");
			var categoryItemsArray = Array.from(categoryItems);

			function sorter(a,b) {
				if(parseInt(a.getAttribute("progress")) < parseInt(b.getAttribute("progress"))) return -1;
				if(parseInt(a.getAttribute("progress")) > parseInt(b.getAttribute("progress"))) return 1;
				return 0;
			}
			let sorted = categoryItemsArray.sort(sorter);

			sorted.forEach(e => streamer_drops.appendChild(e));

			
			init_timeout = 10;
		}catch(e){
			console.log(e);
			init_timeout++;
			await new Promise(r => setTimeout(r, 2000));
		}
	}
}
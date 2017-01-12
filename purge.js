//==UserScript==
// @name Purge
// @namespace https://csgolounge.com/
// @author Saša Marjanović <sasa.marjanovic1994@gmail.com>
// @description Automated userscript which removes comments from CSGOLounge trades.
// @version 1.0
// @include https://csgolounge.com/mytrades
// @include http://csgolounge.com/mytrades
// @include https://csgolounge.com/trade?t=*
// @include http://csgolounge.com/trade?t=*
// @grant none
// ==/UserScript==

var url = [
    "https://csgolounge.com/mytrades",
    "http://csgolounge.com/mytrades",
    "https://www.csgolounge.com/mytrades",
    "http://www.csgolounge.com/mytrades"
];

if (window.location.href.match(url[0] || url[1] || url[2] || url[3])) {
    
    purgeBtn = document.createElement("a");
    purgeBtn.id = "menu";
    purgeBtn.addEventListener("click", purge);
    document.querySelector("#menu").appendChild(purgeBtn);
    purgeBtn.innerHTML = "<img src='http://csgolounge.com/img/trash.png'>PURGE</a>";

    function purge() {
        var prg = "#purge";
        var trades = document.querySelectorAll('.tradeheader');
        var i = 0;
        var loop = setInterval(function () {
            var tradeID = trades[i].children[0].href;
            if (tradeID === undefined) {
                window.open(trades[i].children[1].href + prg);
            } else {
            window.open(tradeID + prg);
            }
            i++;
            if (trades[i] === undefined) {
                window.location.reload();
            }
        }, 7000);
    }
} else if (window.location.href.match(/https:\/\/csgolounge\.com\/trade\?t=[0-9]*#purge/)) {

    var trashCan = document.querySelectorAll("#messages img");
    var img = "http://csgolounge.com/img/trash.png";
    var clean = document.querySelectorAll('.half')[1].children[0];
    var msg = document.querySelectorAll('.message');

    if (trashCan.length > 1) {
        for (i = 0; i < trashCan.length; i++) {
            if (trashCan[i].src == img) {
                trashCan[i].click();
                setTimeout(function () {
                    clean.click();
                }, 1500);
            } else if (msg.length > 2) {
                setTimeout(function () {
                    clean.click();
                }, 1500);
            }
        }
    } else {
        setTimeout(function () {
            window.close();
        }, 800);
    }
}
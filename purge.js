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

function save(arr) {
    var str = JSON.stringify(arr);
    sessionStorage.setItem('KEY', str);
}

if (window.location.href.match(url[0] || url[1] || url[2] || url[3])) {
    purgeBtn = document.createElement("a");
    purgeBtn.id = "menu";
    purgeBtn.addEventListener("click", purge);
    document.querySelector("#menu").appendChild(purgeBtn);
    purgeBtn.innerHTML = "<img src='http://csgolounge.com/img/trash.png'>PURGE</a>";

    function purge() {
        linksArr = [];
        var prg = "#purge";
        var trades = document.querySelectorAll('.tradeheader');
        for (i = 0; i < trades.length; i++) {
            if (trades[i].children[0].href === undefined) {
                linksArr.push(trades[i].children[1].href + prg);
            } else {
                linksArr.push(trades[i].children[0].href + prg);
            }
        }
        var init = linksArr.shift();
        save(linksArr);
        setTimeout(function () {
            window.location.replace(init);
        }, 500);
    }
} else if (window.location.href.match(/https:\/\/csgolounge\.com\/trade\?t=[0-9]*#purge/)) {
    var trashCan = document.querySelectorAll("#messages img");
    var img = "http://csgolounge.com/img/trash.png";
    var clean = document.querySelectorAll('.half')[1].children[0];
    var msg = document.querySelectorAll('.message');
    var myArr = JSON.parse(sessionStorage.KEY);
    var link = myArr.shift();

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
        save(myArr);
        setTimeout(function () {
            if (link === undefined) {
                sessionStorage.removeItem('KEY');
                window.location.replace('https://csgolounge.com/mytrades');
            } else {
                window.location.replace(link);
            }
        }, 800);
    }
}
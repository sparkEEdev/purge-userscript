//==UserScript==
// @name Purge
// @namespace https://csgolounge.com/
// @author Saša Marjanović <sasa.marjanovic1994@gmail.com>
// @description Automated userscript which removes comments from CSGOLounge trades.
// @version 2.1
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
    "http://www.csgolounge.com/mytrades",
    "http://csgolounge.com/img/trash.png",
    "http://csgolounge.com/img/ban.png"
];

function save(arr) {
    var str = JSON.stringify(arr);
    sessionStorage.setItem('KEY', str);
}

if (window.location.href.match(url[0] || url[1] || url[2] || url[3])) {
    purgeBtn = document.createElement("a");
    purgeBtn.id = "menu";
    document.querySelector("#menu").appendChild(purgeBtn);
    purgeBtn.innerHTML = "<img src='http://csgolounge.com/img/trash.png'>PURGE</a>";
    purgeBtn.addEventListener("click", function () {
        linksArr = [];
        var prg = "#purge";
        var trades = document.querySelectorAll('.tradeheader');
        for (i = 0; i < trades.length; i++) {
            if (!trades[i].children[0].href) linksArr.push(trades[i].children[1].href + prg);
            else linksArr.push(trades[i].children[0].href + prg);
        }
        var init = linksArr.shift();
        save(linksArr);
        window.location.replace(init);
    });
} else if (window.location.href.match(/https:\/\/csgolounge\.com\/trade\?t=[0-9]*#purge/)) {
    var msgOpts = document.querySelectorAll('.opts');
    var clean = document.querySelectorAll('.half')[1].children[0];
    var msg = document.querySelectorAll('.message');
    var linksArr2 = JSON.parse(sessionStorage.KEY);
    var link = linksArr2.shift();

    if (msg.length > 2) {
        msgOpts.forEach(function (val) {
            var remove = val.children[0];
            var block = val.children[1];
            if (val.parentElement.children[2].innerText.match(/http/i)) {
                if ((remove.firstChild.src == url[4]) && (block.firstChild.src == url[5])) {
                    block.click();
                    remove.click();
                } else if (remove.firstChild.src == url[5]) remove.click();
            } else remove.click();
        });
        setTimeout(function () {
            clean.click();
        }, 1000);
    } else {
        save(linksArr2);
        if (!link) {
            sessionStorage.removeItem('KEY');
            window.location.replace('https://csgolounge.com/mytrades');
        } else window.location.replace(link);
    }
}

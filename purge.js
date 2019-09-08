//==UserScript==
// @name Purge
// @namespace https://csgolounge.com/
// @author Saša Marjanović <sasa.marjanovic1994@gmail.com>
// @description Automated userscript which removes comments from CSGOLounge trades.
// @version 2.0
// @include https://csgolounge.com/mytrades
// @include http://csgolounge.com/mytrades
// @include https://csgolounge.com/trade?t=*
// @include http://csgolounge.com/trade?t=*
// @grant none
// ==/UserScript==

async function processComments(comments, headers) {
    for (const comment of comments) {
        if (!comment.deleted) await fetch(`https://csgolounge.com/v1/trades/250749140/replies/${comment.reply_id}/delete`, { method: 'DELETE', headers: headers });
    };
};

async function processTrades(trades, headers) {
    for (const trade of trades) {
        let data = await fetch(`https://csgolounge.com/v1/trades/${trade.trade_id}/`, { method: 'GET', headers: headers }).then(res => res.json());
        let comments = await data.replies;
        processComments(comments, headers);
    };
    document.querySelector('#purge').innerText = 'Done';
};

window.addEventListener("load", () => {

    let jwt = JSON.parse(window.localStorage.state).userInfo.session.token;

    let headers = new Headers({
        'Authorization': `JWT ${jwt}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    });

    let purgeBtn = document.createElement("button");
    purgeBtn.setAttribute('class', "btn___1hJZ9 btn-lg-extra___1fNLo btn-shadow___3x5BG btn-add-trade___3ZALd");
    purgeBtn.setAttribute('id', 'purge');
    purgeBtn.style = "margin-bottom: 10px";
    purgeBtn.innerText = "PURGE";
    document.querySelector(".main-column-left___1NKUB").prepend(purgeBtn);

    purgeBtn.addEventListener('click', e => {
        e.srcElement.innerText = 'Purging...';
        fetch('https://csgolounge.com/v1/trades/my', { method: 'GET', headers: headers})
            .then(res => res.json())
            .then(data => processTrades(data.items.trades, headers));
    });
});
/**
 * @Filename:     results_liveUpdate.js
 * @Date:         Xevolab <francesco> @ 2019-11-27 15:25:44
 * @Last edit by: francesco
 * @Last edit at: 2020-03-22 21:29:17
 * @Copyright:    (c) 2019
 */

var pollID = document.querySelector("body").attributes["id"].value;

// Show result bars
function makeBars() {
	var pollData = JSON.parse(document.querySelector("script#data").innerText);

	var total = 0, maxVotes = 0;
	for (var i = 0; i < pollData.length; i++) {
		total += parseInt(pollData[i].votes);
		if (parseInt(pollData[i].votes) > maxVotes)
			maxVotes = parseInt(pollData[i].votes);
	}

	var barsTable = document.querySelector("table.results");
	barsTable.innerHTML = "";

	for (var i = 0; i < pollData.length; i++) {
		var r = pollData[i];

		var choiceObj = document.createElement("tr");
    choiceObj.attributes.choiceI = r.id;
    choiceObj.attributes.delta = (maxVotes == 0 ? -1 : maxVotes-r.votes);
    choiceObj.id = `choice_${ r.id }`;

		choiceObj.innerHTML = `<td class="value">
			<div class="ch">
				<div class="accent-bg" style="width: ${ (total != 0 ? Math.floor((r.votes/total)/(maxVotes/total)*100) : 0) }%;"></div>
				<div class="text">
					<div class="card hidden"></div>
					<span class="_card-small-text">${ r.value }</span>
				</div>
			</div>
		</td>
		<td class="votes" onclick="swapNumberPerc()" title="${ language.swap_number_percentage }">
			<span class="votes-number">
				<span class="n">${ r.votes }</span>
					${ (r.metadata.limitAnswers != 0) ? " / "+r.metadata.limitAnswers : "" }
			</span>
			<span class="votes-percentage">
				${ (total != 0 ? Math.floor(r.votes/total*100) : 0) }%
			</span>
		</td>`

		createCards(barsTable.appendChild(choiceObj), r.value);
	}
}

makeBars();

// Socket.io & live updates

var socket = io(window.location.origin+"?pollID="+encodeURIComponent(pollID));

socket.on('vote', function(vdata){

	var pollData = JSON.parse(document.querySelector("script#data").innerText);

	for (var i = 0; i < pollData.length; i++) {
		if (vdata.plus.find((e) => e==pollData[i].id)) {
			pollData[i].votes = parseInt(pollData[i].votes) + 1;
		}
	}
	pollData.sort(function (a, b) {return b.votes - a.votes});
	document.querySelector("script#data").innerText = JSON.stringify(pollData)
	makeBars();

});

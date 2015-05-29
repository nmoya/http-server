function createCharts(JSONData, yourName, contactName) {
	console.log(JSONData === statsObject);
	console.log(yourName === "Nikolas Moya");
	console.log(contactName === "Thiago Jaruga Della Bianca");
	plotInitiations(JSONData, yourName, contactName);
	plotRatios(JSONData);
}
a = null;

function plotInitiations(JSONData, yourName, contactName) {
	var ctx = document.getElementById("bar-initiations").getContext("2d");
	console.log(JSONData.initiations[yourName]);
	console.log(JSONData.initiations[contactName]);
	var data = {
		labels: ["You", contactName],
		datasets: [{
			label: "Initiations",
			fillColor: "#00C8F8",
			strokeColor: "rgba(220,220,220,1)",
			pointColor: "rgba(220,220,220,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(220,220,220,1)",
			data: [JSONData.initiations[yourName], JSONData.initiations[contactName]]
		}]
	};
	var chart = new Chart(ctx).Bar(data);
}

function plotRatios(JSONData) {
	var ctx = document.getElementById("bar-ratios").getContext("2d");
	a = JSONData
	var data = {
		labels: ["Initiation", "Response time", "Bursts", "Messages", "Message length", "Question marks", "Exclamation points"],
		datasets: [{
			label: "Ratios",
			fillColor: "#00C8F8",
			strokeColor: "rgba(220,220,220,1)",
			pointColor: "rgba(220,220,220,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(220,220,220,1)",
			data: [JSONData.initiations["root_initiation_ratio"],
				JSONData["avg_response_time"].ratio,
				JSONData["nbr_bursts"].ratio,
				JSONData.proportions.messages.ratio,
				JSONData.proportions["avg_words"].ratio,
				JSONData.proportions.qmarks.ratio,
				JSONData.proportions.exclams.ratio
			]
		}]
	};
	var chart = new Chart(ctx).Bar(data, {
		scaleGridLineWidth: 1, //Number - Width of the grid lines
		scaleShowHorizontalLines: true, //Boolean - Whether to show horizontal lines (except X axis)
	});
}
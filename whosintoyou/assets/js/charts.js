a = null;
google.load('visualization', '1', {
	packages: ['corechart', 'bar']
});

function createCharts(JSONData, yourName, contactName) {
	console.log("plotting data");
	plotInitiations(JSONData, yourName, contactName);
	plotRatios(JSONData);

}

function plotInitiations(JSONData, yourName, contactName) {
	var data = google.visualization.arrayToDataTable([
		['Person', 'Initiations', {
			role: 'style'
		}],
		['You', JSONData.initiations[yourName], 'color: #00C8F8'],
		[contactName, JSONData.initiations[contactName], 'color: #00C8F8']
	]);
	var view = new google.visualization.DataView(data);
	var options = {
		title: "Initiations",
		width: 400,
		height: 400,
		bar: {
			groupWidth: "95%"
		},
		legend: {
			position: "none"
		},
	};
	var chart = new google.visualization.ColumnChart(document.getElementById("bar-initiations"));
	chart.draw(view, options);
}

function plotRatios(JSONData) {
	var data = google.visualization.arrayToDataTable([
		['Metric', 'Value', {
			role: 'style'
		}],
		['Inititation', JSONData.initiations["root_initiation_ratio"], 'color: #00C8F8'],
		['Response time', JSONData["avg_response_time"].ratio, 'color: #00C8F8'],
		['Bursts', JSONData["nbr_bursts"].ratio, 'color: #00C8F8'],
		['Messages', JSONData.proportions.messages.ratio, 'color: #00C8F8'],
		['Message length', JSONData.proportions["avg_words"].ratio, 'color: #00C8F8'],
		['Question marks', JSONData.proportions.qmarks.ratio, 'color: #00C8F8'],
		['Exclamation marks Length', JSONData.proportions.exclams.ratio, 'color: #00C8F8'],
	]);
	var view = new google.visualization.DataView(data);
	var options = {
		title: "Ratios",
		width: 400,
		height: 400,
		bar: {
			groupWidth: "95%"
		},
		legend: {
			position: "none"
		},
	};
	var chart = new google.visualization.ColumnChart(document.getElementById("bar-ratios"));
	chart.draw(view, options);
}
a = null;
google.load('visualization', '1', {
	packages: ['corechart', 'bar']
});

function createCharts(JSONData, yourName, contactName) {
	console.log("plotting data");
	a = JSONData;
	plotInitiations(JSONData, yourName, contactName);
	plotQuestions(JSONData, yourName, contactName);
	plotAvgResponseTime(JSONData, yourName, contactName);
	plotWeekdays(JSONData);
	plotShifts(JSONData);
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
		title: "Initiations (# of times)",
		width: 600,
		height: 400,
		vAxis: {
			minValue: 0
		},
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

function plotAvgResponseTime(JSONData, yourName, contactName) {
	var data = google.visualization.arrayToDataTable([
		['Person', 'Avg. Response Time (s)', {
			role: 'style'
		}],
		['You', JSONData.avg_response_time[yourName], 'color: #00C8F8'],
		[contactName, JSONData.avg_response_time[contactName], 'color: #00C8F8']
	]);
	var view = new google.visualization.DataView(data);
	var options = {
		title: "Avg. Response Time (s)",
		width: 600,
		height: 400,
		bar: {
			groupWidth: "95%"
		},
		legend: {
			position: "none"
		},
	};
	var chart = new google.visualization.ColumnChart(document.getElementById("bar-avg-response-time"));
	chart.draw(view, options);
}

function plotQuestions(JSONData, yourName, contactName) {
	var data = google.visualization.arrayToDataTable([
		['Person', 'Questions', {
			role: 'style'
		}],
		['You', JSONData.proportions.qmarks[yourName], 'color: #00C8F8'],
		[contactName, JSONData.proportions.qmarks[contactName], 'color: #00C8F8']
	]);
	var view = new google.visualization.DataView(data);
	var options = {
		title: "Questions (# of occurences of \"?\")",
		width: 600,
		height: 400,
		vAxis: {
			minValue: 0
		},
		bar: {
			groupWidth: "95%"
		},
		legend: {
			position: "none"
		},
	};
	var chart = new google.visualization.ColumnChart(document.getElementById("bar-questions"));
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
		width: 600,
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

function plotWeekdays(JSONData) {
	var data = google.visualization.arrayToDataTable([
		['Frequency', 'Weekday', {
			role: 'style'
		}],
		['Sunday', JSONData.weekdays["Sunday"], 'color: #00C8F8'],
		['Monday', JSONData.weekdays["Monday"], 'color: #00C8F8'],
		['Tuesday', JSONData.weekdays["Tuesday"], 'color: #00C8F8'],
		['Wednesday', JSONData.weekdays["Wednesday"], 'color: #00C8F8'],
		['Thursday', JSONData.weekdays["Thursday"], 'color: #00C8F8'],
		['Friday', JSONData.weekdays["Friday"], 'color: #00C8F8'],
		['Saturday', JSONData.weekdays["Saturday"], 'color: #00C8F8'],
	]);
	var view = new google.visualization.DataView(data);
	var options = {
		title: "Weekdays",
		width: 600,
		height: 400,
		vAxis: {
			minValue: 0
		},
		bar: {
			groupWidth: "95%"
		},
		legend: {
			position: "none"
		},
	};
	var chart = new google.visualization.ColumnChart(document.getElementById("bar-weekdays"));
	chart.draw(view, options);
}

function plotShifts(JSONData) {
	var data = google.visualization.arrayToDataTable([
		['Frequency', 'Shifts', {
			role: 'style'
		}],
		['Latenight', JSONData.shifts.latenight, 'color: #00C8F8'],
		['Morning', JSONData.shifts.morning, 'color: #00C8F8'],
		['Afternoon', JSONData.shifts.afternoon, 'color: #00C8F8'],
		['Evening', JSONData.shifts.evening, 'color: #00C8F8'],
	]);
	var view = new google.visualization.DataView(data);
	var options = {
		title: "Shifts",
		width: 600,
		height: 400,
		vAxis: {
			minValue: 0
		},
		bar: {
			groupWidth: "95%"
		},
		legend: {
			position: "none"
		},
	};
	var chart = new google.visualization.ColumnChart(document.getElementById("bar-shifts"));
	chart.draw(view, options);
}
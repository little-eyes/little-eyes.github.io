$(document).ready(function () {
  var config = {
    delimiter: "",	// auto-detect
    newline: "",	// auto-detect
    header: true,
    dynamicTyping: false,
    preview: 0,
    encoding: "",
    worker: false,
    comments: false,
    step: undefined,
    complete: undefined,
    error: undefined,
    download: false,
    skipEmptyLines: false,
    chunk: undefined,
    fastMode: undefined,
    beforeFirstChunk: undefined,
    withCredentials: undefined
  };
  var routes;
  var ajax1 = $.ajax({
    url: "/downloads/data/route_popularity.csv"
  }).done(function (data) {
    routes = Papa.parse(data, config);
    var cities = routes.data.map(function (d) {
      return d.ORIGIN;
    });
    routes.data.forEach(function (d) {
      if (cities.indexOf(d.DEST) < 0) {
        cities.push(d.DEST);
      }
    });
    var matrix = [];
    cities.forEach(function (c) {
      var line = [], i;
      for (i = 0; i < cities.length; i++) {
        line.push(0);
      }
      matrix.push(line);
    });
    routes.data.forEach(function (d) {
      matrix[cities.indexOf(d.ORIGIN)][cities.indexOf(d.DEST)] = Number(d.Popularity);
    });

    // d3.js code
    var width = 700,
    height = 700,
    outerRadius = Math.min(width, height) / 2 - 10,
    innerRadius = outerRadius - 24,
    colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1',
                  '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a',
                  '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'];

    var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

    var layout = d3.layout.chord()
    .padding(.04)
    .sortSubgroups(d3.descending)
    .sortChords(d3.ascending);

    var path = d3.svg.chord()
    .radius(innerRadius);

    var svg = d3.select("#routeChord").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("id", "circle")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("circle")
    .attr("r", outerRadius);

    // Compute the chord layout.
    layout.matrix(matrix);

    // Add a group per neighborhood.
    var group = svg.selectAll(".group")
    .data(layout.groups)
    .enter().append("g")
    .attr("class", "group")
    .on("mouseover", mouseover);

    // Add a mouseover title.
    group.append("title").text(function(d, i) {
      return cities[i];
    });

    // Add the group arc.
    var groupPath = group.append("path")
    .attr("id", function(d, i) { return "group" + i; })
    .attr("d", arc)
    .style("fill", function(d, i) { return colors[i]; });

    // Add a text label.
    var groupText = group.append("text")
    .attr("x", 6)
    .attr("dy", 15);

    groupText.append("textPath")
    .attr("xlink:href", function(d, i) { return "#group" + i; })
    .text(function(d, i) { return cities[i]; });

    // Remove the labels that don't fit. :(
    groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
    .remove();

    // Add the chords.
    var chord = svg.selectAll(".chord")
    .data(layout.chords)
    .enter().append("path")
    .attr("class", "chord")
    .style("fill", function(d) { return colors[d.source.index]; })
    .attr("d", path);

    // Add an elaborate mouseover title for each chord.
    chord.append("title").text(function(d) {
      return cities[d.source.index]
      + " → " + cities[d.target.index]
      + ": " + d.source.value
      + "\n" + cities[d.target.index]
      + " → " + cities[d.source.index]
      + ": " + d.target.value;
    });

    function mouseover(d, i) {
      chord.classed("fade", function(p) {
        return p.source.index != i
        && p.target.index != i;
      });
    }
  });

  var departureDelay, arrivalDelay;
  var ajax3 = $.ajax({
    url: "/downloads/data/route_departure_delay.csv"
  }).done(function (data) {
    departureDelay = Papa.parse(data, config);
  });

  var ajax4 = $.ajax({
    url: "/downloads/data/route_arrival_delay.csv"
  }).done(function (data) {
    arrivalDelay = Papa.parse(data, config);
  });

  $.when(ajax3, ajax4).done(function () {
    // data merge.
    var dataset = {}, i;
    for (i = 0; i < departureDelay.data.length; i++) {
      dataset[departureDelay.data[i].ORIGIN + "-" + departureDelay.data[i].DEST] = dataset[departureDelay.data[i].ORIGIN + "-" + departureDelay.data[i].DEST] || {};
      dataset[arrivalDelay.data[i].ORIGIN + "-" + arrivalDelay.data[i].DEST] = dataset[arrivalDelay.data[i].ORIGIN + "-" + arrivalDelay.data[i].DEST] || {};

      dataset[departureDelay.data[i].ORIGIN + "-" + departureDelay.data[i].DEST].departure = departureDelay.data[i];
      dataset[arrivalDelay.data[i].ORIGIN + "-" + arrivalDelay.data[i].DEST].arrival = arrivalDelay.data[i];
    }

    new Highcharts.Chart({
      chart: {
        type: 'bar',
        renderTo: 'routeDelay'
      },
      title: {
        text: 'Top 20 Route\'s Departure and Arrival Delay Ratio'
      },
      xAxis: {
        categories: Object.keys(dataset)
      },
      yAxis: {
        min: 0
      },
      legend: {
        reversed: true
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      series: [{
        name: 'Departure Delay Ratio',
        data: Object.keys(dataset).map(function (d) { return Number(dataset[d].departure.Ratio); })
      }, {
        name: 'Arrival Delay Ratio',
        data: Object.keys(dataset).map(function (d) { return Number(dataset[d].arrival.Ratio); })
      }]
    });

    new Highcharts.Chart({
      chart: {
        type: 'column',
        renderTo: 'routeDepDelayBreakdown'
      },
      title: {
        text: 'Top 20 Route Departure Delay Breakdown'
      },
      xAxis: {
        categories: Object.keys(dataset)
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Delay percentage'
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'percent'
        }
      },
      series: [{
        name: 'Weather',
        data: Object.keys(dataset).map(function (d) { return Number(dataset[d].departure.WeatherDelayRatio); })
      }, {
        name: 'NAS',
        data: Object.keys(dataset).map(function (d) { return Number(dataset[d].departure.NasDelayRatio); })
      }, {
        name: 'Security',
        data: Object.keys(dataset).map(function (d) { return Number(dataset[d].departure.SecurityDelayRatio); })
      }, {
        name: 'Late Aircraft',
        data: Object.keys(dataset).map(function (d) { return Number(dataset[d].departure.LateAircraftDelayRatio); })
      }]
    });

    new Highcharts.Chart({
      chart: {
        type: 'column',
        renderTo: 'routeArrDelayBreakdown'
      },
      title: {
        text: 'Top 20 Route Arrival Delay Breakdown'
      },
      xAxis: {
        categories: Object.keys(dataset)
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Delay percentage'
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'percent'
        }
      },
      series: [{
        name: 'Weather',
        data: Object.keys(dataset).map(function (d) { return Number(dataset[d].arrival.WeatherDelayRatio); })
      }, {
        name: 'NAS',
        data: Object.keys(dataset).map(function (d) { return Number(dataset[d].arrival.NasDelayRatio); })
      }, {
        name: 'Security',
        data: Object.keys(dataset).map(function (d) { return Number(dataset[d].arrival.SecurityDelayRatio); })
      }, {
        name: 'Late Aircraft',
        data: Object.keys(dataset).map(function (d) { return Number(dataset[d].arrival.LateAircraftDelayRatio); })
      }]
    });
  });

  var monthlyAirlineDepDelay, monthlyAirlineArrDelay;
  var ajax5 = $.ajax({
    url: "/downloads/data/monthly_route_departure_delay.csv"
  }).done(function (data) {
    monthlyAirlineDepDelay = Papa.parse(data, config);
  });
  var ajax6 = $.ajax({
    url: "/downloads/data/monthly_route_arrival_delay.csv"
  }).done(function (data) {
    monthlyAirlineArrDelay = Papa.parse(data, config);
  });

  $.when(ajax5, ajax6).done(function () {
    var ratios = [], totals = [], i, d, key;
    var colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1',
                  '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a',
                  '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'];
    // departure
    d = monthlyAirlineDepDelay.data.map(function (item) {
      return { x: new Date(item.YEAR, item.MONTH - 1).getTime(), ORIGIN: item.ORIGIN, DEST: item.DEST, Ratio: Number(item.Ratio), Total: Number(item.Total) };
    }).sort(function (a, b) {
      return a.x - b.x;
    }).reduce(function (aggregate, current, i) {
      if (aggregate[current.ORIGIN + "-" + current.DEST] == null) {
        aggregate[current.ORIGIN + "-" + current.DEST] = {
          ratio: { name: current.ORIGIN + "-" + current.DEST + ' Departure Delay Ratio', data: [], type: 'line', color: colors[i], visible: false },
          total: { name: current.ORIGIN + "-" + current.DEST + 'Total Flights', data: [], type: 'column', yAxis: 1, color: colors[i], visible: false }
        };
      }

      aggregate[current.ORIGIN + "-" + current.DEST].ratio.data.push([current.x, current.Ratio]);
      aggregate[current.ORIGIN + "-" + current.DEST].total.data.push([current.x, current.Total]);

      return aggregate;
    }, {});
    for (key in d) {
      ratios.push(d[key].ratio);
      totals.push(d[key].total);
    }

    // arrival
    d = monthlyAirlineArrDelay.data.map(function (item) {
      return { x: new Date(item.YEAR, item.MONTH - 1).getTime(), ORIGIN: item.ORIGIN, DEST: item.DEST, Ratio: Number(item.Ratio), Total: Number(item.Total) };
    }).sort(function (a, b) {
      return a.x - b.x;
    }).reduce(function (aggregate, current, i) {
      if (aggregate[current.ORIGIN + "-" + current.DEST] == null) {
        aggregate[current.ORIGIN + "-" + current.DEST] = {
          ratio: { name: current.ORIGIN + "-" + current.DEST + ' Arrival Delay Ratio', data: [], type: 'line', color: colors[i + 15], visible: false },
        };
      }

      aggregate[current.ORIGIN + "-" + current.DEST].ratio.data.push([current.x, current.Ratio]);

      return aggregate;
    }, {});
    for (key in d) {
      ratios.push(d[key].ratio);
    }

    // default visibility
    ratios[0].visible = true;
    ratios[1].visible = true;
    totals[0].visible = true;
    totals[1].visible = true;
    function drawTimeSeriesChart(domId, ratios, totals) {

      new Highcharts.StockChart({
        chart: {
          renderTo: domId
        },

        legend: {
          align: 'right',
          verticalAlign: 'top',
          layout: 'vertical',
          x: 0,
          y: 25,
          enabled: true
        },

        rangeSelector: {
          selected: 5
        },

        yAxis: [{
          title: { text: "Ratio" },
          height: "60%"
        }, {
          title: { text: "Volume" },
          top: "65%",
          height: "35%",
          offset: 0
        }],

        tooltip: {
          valueDecimals: 2
        },

        series: ratios.concat(totals)
      });
    };

    drawTimeSeriesChart("routeDelayRatioTimeline", ratios, totals);
  });
});
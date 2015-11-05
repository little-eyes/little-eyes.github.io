// airport popularity plot.
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

  var ajax1 = $.ajax({
    url: "/downloads/data/airline_popularity.csv"
  }).done(function (data) {
    popularity = Papa.parse(data, config);
    new Highcharts.Chart({
      chart: {
        type: 'bar',
        renderTo: 'airlinePopularity'
      },
      title: {
        text: 'Top 10 Airlines'
      },
      xAxis: {
        categories: popularity.data.map(function (d) { return d.CARRIER; })
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
        name: 'Flights',
        data: popularity.data.map(function (d) { return Number(d.Popularity); })
      }]
    });
  });

  var departureDelay, arrivalDelay;
  var ajax3 = $.ajax({
    url: "/downloads/data/airline_departure_delay.csv"
  }).done(function (data) {
    departureDelay = Papa.parse(data, config);
  });

  var ajax4 = $.ajax({
    url: "/downloads/data/airline_arrival_delay.csv"
  }).done(function (data) {
    arrivalDelay = Papa.parse(data, config);
  });

  $.when(ajax3, ajax4).done(function () {
    // data merge.
    var dataset = {}, i;
    for (i = 0; i < departureDelay.data.length; i++) {
      dataset[departureDelay.data[i].CARRIER] = dataset[departureDelay.data[i].CARRIER] || {};
      dataset[arrivalDelay.data[i].CARRIER] = dataset[arrivalDelay.data[i].CARRIER] || {};

      dataset[departureDelay.data[i].CARRIER].departure = departureDelay.data[i];
      dataset[arrivalDelay.data[i].CARRIER].arrival = arrivalDelay.data[i];
    }

    new Highcharts.Chart({
      chart: {
        type: 'bar',
        renderTo: 'airlineDelay'
      },
      title: {
        text: 'Top 10 Airline\'s Departure and Arrival Delay Ratio'
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
        renderTo: 'airlineDepDelayBreakdown'
      },
      title: {
        text: 'Airline Departure Delay Breakdown'
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
        renderTo: 'airlineArrDelayBreakdown'
      },
      title: {
        text: 'Airline Arrival Delay Breakdown'
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
    url: "/downloads/data/monthly_airline_departure_delay.csv"
  }).done(function (data) {
    monthlyAirlineDepDelay = Papa.parse(data, config);
  });
  var ajax6 = $.ajax({
    url: "/downloads/data/monthly_airline_arrival_delay.csv"
  }).done(function (data) {
    monthlyAirlineArrDelay = Papa.parse(data, config);
  });

  var colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1',
                '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a',
                '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'];
  $.when(ajax5, ajax6).done(function () {
    var ratios = [], totals = [], i, d, key;
    // departure
    d = monthlyAirlineDepDelay.data.map(function (item) {
      return { x: new Date(item.YEAR, item.MONTH - 1).getTime(), CARRIER: item.CARRIER, Ratio: Number(item.Ratio), Total: Number(item.Total) };
    }).sort(function (a, b) {
      return a.x - b.x;
    }).reduce(function (aggregate, current, i) {
      if (aggregate[current.CARRIER] == null) {
        aggregate[current.CARRIER] = {
          ratio: { name: current.CARRIER + ' Departure Delay Ratio', data: [], type: 'line', color: colors[i], visible: false },
          total: { name: current.CARRIER + 'Total Flights', data: [], type: 'column', yAxis: 1, color: colors[i], visible: false }
        };
      }

      aggregate[current.CARRIER].ratio.data.push([current.x, current.Ratio]);
      aggregate[current.CARRIER].total.data.push([current.x, current.Total]);

      return aggregate;
    }, {});
    for (key in d) {
      ratios.push(d[key].ratio);
      totals.push(d[key].total);
    }

    // arrival
    d = monthlyAirlineArrDelay.data.map(function (item) {
      return { x: new Date(item.YEAR, item.MONTH - 1).getTime(), CARRIER: item.CARRIER, Ratio: Number(item.Ratio), Total: Number(item.Total) };
    }).sort(function (a, b) {
      return a.x - b.x;
    }).reduce(function (aggregate, current, i) {
      if (aggregate[current.CARRIER] == null) {
        aggregate[current.CARRIER] = {
          ratio: { name: current.CARRIER + ' Arrival Delay Ratio', data: [], type: 'line', color: colors[i + 15], visible: false },
        };
      }

      aggregate[current.CARRIER].ratio.data.push([current.x, current.Ratio]);

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

    drawTimeSeriesChart("airlineDelayRatioTimeline", ratios, totals);
  });
});
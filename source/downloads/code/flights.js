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

  var departurePopularity, arrivalPopularity;
  var ajax1 = $.ajax({
    url: "/downloads/data/airport_depature_popularity.csv"
  }).done(function (data) {
    departurePopularity = Papa.parse(data, config);
  });

  var ajax2 = $.ajax({
    url: "/downloads/data/airport_arrival_popularity.csv"
  }).done(function (data) {
    arrivalPopularity = Papa.parse(data, config);
  });

  $.when(ajax1, ajax2).done(function () {
    new Highcharts.Chart({
      chart: {
        type: 'bar',
        renderTo: 'airportPopularity'
      },
      title: {
        text: 'Top 15 Departure and Arrival Airports'
      },
      xAxis: {
        categories: departurePopularity.data.map(function (d) { return d.ORIGIN; })
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total fruit consumption'
        }
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
        name: 'Departure Flights',
        data: departurePopularity.data.map(function (d) { return Number(d.Popularity); })
      }, {
        name: 'Arrival Flights',
        data: arrivalPopularity.data.map(function (d) { return Number(d.Popularity); })
      }]
    });
  });

  var departureDelay, arrivalDelay;
  var ajax3 = $.ajax({
    url: "/downloads/data/airport_depature_delay.csv"
  }).done(function (data) {
    departureDelay = Papa.parse(data, config);
  });

  var ajax4 = $.ajax({
    url: "/downloads/data/airport_arrival_delay.csv"
  }).done(function (data) {
    arrivalDelay = Papa.parse(data, config);
  });

  $.when(ajax3, ajax4).done(function () {
    new Highcharts.Chart({
      chart: {
        type: 'bar',
        renderTo: 'airportDelay'
      },
      title: {
        text: 'Top 15 Departure and Arrival Airports\'s Delay Ratio'
      },
      xAxis: {
        categories: departureDelay.data.map(function (d) { return d.ORIGIN; })
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total fruit consumption'
        }
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
        data: departureDelay.data.map(function (d) { return Number(d.Ratio); })
      }, {
        name: 'Arrival Delay Ratio',
        data: arrivalDelay.data.map(function (d) { return Number(d.Ratio); })
      }]
    });

    new Highcharts.Chart({
      chart: {
        type: 'column',
        renderTo: 'airportDepDelayBreakdown'
      },
      title: {
        text: 'Airport Departure Delay Breakdown'
      },
      xAxis: {
        categories: departureDelay.data.map(function (d) { return d.ORIGIN; })
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
        data: departureDelay.data.map(function (d) { return Number(d.WeatherDelayRatio); })
      }, {
        name: 'NAS',
        data: departureDelay.data.map(function (d) { return Number(d.NasDelayRatio); })
      }, {
        name: 'Security',
        data: departureDelay.data.map(function (d) { return Number(d.SecurityDelayRatio); })
      }, {
        name: 'Late Aircraft',
        data: departureDelay.data.map(function (d) { return Number(d.LateAircraftDelayRatio); })
      }]
    });

    new Highcharts.Chart({
      chart: {
        type: 'column',
        renderTo: 'airportArrDelayBreakdown'
      },
      title: {
        text: 'Airport Arrival Delay Breakdown'
      },
      xAxis: {
        categories: arrivalDelay.data.map(function (d) { return d.DEST; })
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
        data: arrivalDelay.data.map(function (d) { return Number(d.WeatherDelayRatio); })
      }, {
        name: 'NAS',
        data: arrivalDelay.data.map(function (d) { return Number(d.NasDelayRatio); })
      }, {
        name: 'Security',
        data: arrivalDelay.data.map(function (d) { return Number(d.SecurityDelayRatio); })
      }, {
        name: 'Late Aircraft',
        data: arrivalDelay.data.map(function (d) { return Number(d.LateAircraftDelayRatio); })
      }]
    });
  });

  $('#airportDelayTimeline').bind('mousemove touchmove', function (e) {
    var chart,
    point,
    i;

    for (i = 0; i < Highcharts.charts.length; i = i + 1) {
      chart = Highcharts.charts[i];
      e = chart.pointer.normalize(e); // Find coordinates within the chart
      point = chart.series[0].searchPoint(e, true); // Get the hovered point

      if (point) {
        point.onMouseOver(); // Show the hover marker
        chart.tooltip.refresh(point); // Show the tooltip
        chart.xAxis[0].drawCrosshair(e, point); // Show the crosshair
      }
    }
  });

  function syncExtremes(e) {
    var thisChart = this.chart;

    Highcharts.each(Highcharts.charts, function (chart) {
      if (chart !== thisChart) {
        if (chart.xAxis[0].setExtremes) { // It is null while updating
          chart.xAxis[0].setExtremes(e.min, e.max);
        }
      }
    });
  };

  var monthlyAirportDepDelay, monthlyAirportArrDelay;
  var ajax5 = $.ajax({
    url: "/downloads/data/monthly_airport_departure_delay.csv"
  }).done(function (data) {
    monthlyAirportDepDelay = Papa.parse(data, config);
  });
  var ajax6 = $.ajax({
    url: "/downloads/data/monthly_airport_arrival_delay.csv"
  }).done(function (data) {
    monthlyAirportArrDelay = Papa.parse(data, config);
  });

  var colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1',
                '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a',
                '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'];
  $.when(ajax5, ajax6).done(function () {
    var ratios = [], totals = [], i, d, key;
    // departure
    d = monthlyAirportDepDelay.data.map(function (item) {
      return { x: new Date(item.YEAR, item.MONTH - 1).getTime(), ORIGIN: item.ORIGIN, Ratio: Number(item.Ratio), Total: Number(item.Total) };
    }).sort(function (a, b) {
      return a.x - b.x;
    }).reduce(function (aggregate, current, i) {
      if (aggregate[current.ORIGIN] == null) {
        aggregate[current.ORIGIN] = {
          ratio: { name: current.ORIGIN + ' Departure Delay Ratio', data: [], type: 'line', color: colors[i], visible: false },
          total: { name: current.ORIGIN + 'Total Flights', data: [], type: 'column', yAxis: 1, color: colors[i], visible: false }
        };
      }

      aggregate[current.ORIGIN].ratio.data.push([current.x, current.Ratio]);
      aggregate[current.ORIGIN].total.data.push([current.x, current.Total]);

      return aggregate;
    }, {});
    for (key in d) {
      ratios.push(d[key].ratio);
      totals.push(d[key].total);
    }

    // arrival
    d = monthlyAirportArrDelay.data.map(function (item) {
      return { x: new Date(item.YEAR, item.MONTH - 1).getTime(), DEST: item.DEST, Ratio: Number(item.Ratio), Total: Number(item.Total) };
    }).sort(function (a, b) {
      return a.x - b.x;
    }).reduce(function (aggregate, current, i) {
      if (aggregate[current.DEST] == null) {
        aggregate[current.DEST] = {
          ratio: { name: current.DEST + ' Arrival Delay Ratio', data: [], type: 'line', color: colors[i + 15], visible: false },
        };
      }

      aggregate[current.DEST].ratio.data.push([current.x, current.Ratio]);

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

    drawTimeSeriesChart("airportDelayRatioTimeline", ratios, totals);
  });
});
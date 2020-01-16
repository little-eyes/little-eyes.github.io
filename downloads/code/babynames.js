var config = {
  delimiter: "",	// auto-detect
  newline: "",	// auto-detect
  header: true,
  dynamicTyping: false,
  preview: 0,
  encoding: "",
  worker: false,
  comments: false,
  download: false,
  skipEmptyLines: false
};

// timeline.
(function () {
  var drawTimeline = function (id, url, title) {
    $.ajax({ url: url }).done(function (content) {
      var data = Papa.parse(content, config).data.sort(function (a, b) { return Number(a.Year) - Number(b.Year); });
      // prepare series.
      var nameIndex = data.reduce(function (aggregation, item) {
        aggregation[item.Name] = { name: item.Name, data: []};
        return aggregation;
      }, {});

      var i, start = Date.UTC(Number(data[0].Year), 1, 0, 0, 0, 0), movingName = data[0].Name;
      for (i = 1; i < data.length; i++) {
        if (data[i].Name !== movingName) {
          nameIndex[movingName].data.push({
            x: 0,
            low: start,
            high: Date.UTC(Number(data[i].Year), 1, 0, 0, 0, 0)
          });
          start = Date.UTC(Number(data[i].Year), 1, 0, 0, 0, 0);
          movingName = data[i].Name;
        }
      }
      // add last one.
      nameIndex[movingName].data.push({
        x: 0,
        low: start,
        high: Date.UTC(2014, 1, 0, 0, 0)
      });
      var series = Object.keys(nameIndex).map(function (name) { return nameIndex[name]; });
      new Highcharts.Chart({
        chart: {
          type: 'columnrange',
          inverted: true,
          renderTo: id
        },
        title: {
          text: title
        },
        scrollbar: {
          enabled: true
        },
        xAxis: {
          categories: ['Names']
        },
        yAxis: {
          type: 'datetime',
          title: {
            text: 'Timespan'
          }
        },
        plotOptions: {
          columnrange: {
            grouping: false
          }
        },
        legend: {
          enabled: true
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y', this.point.low) +
            ' - ' + Highcharts.dateFormat('%Y', this.point.high) + '<br/>';
          }
        },
        series: series
      });
    });
  }
  // male.
  drawTimeline("boytimeline", "/downloads/data/male.csv", "Most Popular Boys' Name Winner over Time (1880 - 2014)");
  drawTimeline("girltimeline", "/downloads/data/female.csv", "Most Popular Girls' Name Winner over Time (1880 - 2014)");
  // female.
})();

(function () {
  var ajax1 = $.ajax({ url: "/downloads/data/population_male.csv" });
  var ajax2 = $.ajax({ url: "/downloads/data/population_female.csv" });
  $.when(ajax1, ajax2).done(function (male, female) {
    male = Papa.parse(male[0], config).data.sort(function (a, b) { return Number(a.Year) - Number(b.Year); });
    female = Papa.parse(female[0], config).data.sort(function (a, b) { return Number(a.Year) - Number(b.Year); });
    var series = [{
      name: "Male",
      data: male.map(function (d) { return Number(d.Count); })
    }, {
      name: "Female",
      data: female.map(function (d) { return Number(d.Count); })
    }];
    new Highcharts.Chart({
      chart: {
        renderTo: "population",
        type: "area"
      },
      title: {
        text: "U.S. Children Born Since 1880"
      },
      xAxis: {
        categories: male.map(function (d) { return Number(d.Year); }),
        tickmarkPlacement: 'on',
        title: {
          enabled: false
        }
      },
      yAxis: {
        title: {
          text: "Baby born"
        }
      },
      tooltip: {
        shared: true,
        crosshairs: true
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1
        }
      },
      series: series
    });
  });
})();

(function () {
  $.ajax({ url: "/downloads/data/names.csv" }).done(function (data) {
    data = Papa.parse(data, config).data.sort(function (a, b) { return Number(a.Year) - Number(b.Year); });
    var t = [], i;
    for (i = 0; i < (2014 - 1880 + 1); i++) {
      t.push(0);
    }
    var names = data.reduce(function (aggregation, item) {
      aggregation[item.Name] = aggregation[item.Name] || { name: item.Name, data: $.extend(true, [], t) };
      aggregation[item.Name].data[Number(item.Year) - 1880] = Number(item.Count);
      return aggregation;
    }, {});
    var series = Object.keys(names).map(function (name) { return names[name]; });
    new Highcharts.Chart({
      chart: {
        renderTo: "popular-names",
        type: "area"
      },
      title: {
        text: "Popular names counts over time"
      },
      xAxis: {
        categories: data.filter(function (d) { return d.Name === "Mary"; }).map(function (d) { return Number(d.Year); }),
        tickmarkPlacement: 'on',
        title: {
          enabled: false
        }
      },
      yAxis: {
        title: {
          text: "Baby born"
        }
      },
      tooltip: {
        shared: true,
        crosshairs: true
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1
        }
      },
      series: series
    });
  });
})();

(function () {
  $.ajax({ url: "/downloads/data/neutral.csv" }).done(function (data) {
    data = Papa.parse(data, config).data.sort(function (a, b) { return Number(a.Year) - Number(b.Year); });
    var t = [], i, y = [];
    for (i = 0; i < (2014 - 1880 + 1); i++) {
      t.push(0);
      y.push(i + 1880);
    }
    var names = data.reduce(function (aggregation, item) {
      var key = item.Name + "-" + item.Gender;
      aggregation[key] = aggregation[key] || { name: key, data: $.extend(true, [], t) };
      aggregation[key].data[Number(item.Year) - 1880] = Number(item.Count);
      return aggregation;
    }, {});
    var series = Object.keys(names).map(function (name) { return names[name]; });
    new Highcharts.Chart({
      chart: {
        renderTo: "neutral-names",
        type: "area"
      },
      title: {
        text: "Popular neutral names counts over time"
      },
      xAxis: {
        categories: y,
        tickmarkPlacement: 'on',
        title: {
          enabled: false
        }
      },
      yAxis: {
        title: {
          text: "Baby born"
        }
      },
      tooltip: {
        shared: true,
        crosshairs: true
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1
        }
      },
      series: series
    });
  });
})();

(function () {
  $.ajax({ url: "/downloads/data/diversity.csv" }).done(function (data) {
    data = Papa.parse(data, config).data.sort(function (a, b) { return Number(a.Year) - Number(b.Year); }).slice(1);
    var series = [
      { name: "Male", data: []},
      { name: "Female", data: []}
    ];

    var y = [];
    for (i = 0; i < (2014 - 1880 + 1); i++) {
      y.push(i + 1880);
    }

    data.forEach(function (d) {
      series.filter(function (s) { return s.name[0] === d.Gender; })[0].data.push(Number(d.Count));
    });

    new Highcharts.Chart({
      chart: {
        renderTo: "diversity",
        type: "area"
      },
      title: {
        text: "Name diversity over time"
      },
      xAxis: {
        categories: y,
        tickmarkPlacement: 'on',
        title: {
          enabled: false
        }
      },
      yAxis: {
        title: {
          text: "Distinct Names"
        }
      },
      tooltip: {
        shared: true,
        crosshairs: true
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1
        }
      },
      series: series
    });
  });
})();
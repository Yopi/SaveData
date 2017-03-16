path = window.location.pathname + ".json"
var coords = []
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 18,
      center: {lat: coords[0].lat, lng: coords[0].lng},
      mapTypeId: 'terrain'
    });
    console.log(coords);
    var drive = new google.maps.Polyline({
      path: coords,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    drive.setMap(map);
}

$(document).ready(function() {
    $('#container').bind('mousemove touchmove touchstart', function (e) {
        var chart, point, i, event;

        for (i = 0; i < Highcharts.charts.length; i = i + 1) {
            chart = Highcharts.charts[i];
            event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
            point = chart.series[0].searchPoint(event, true); // Get the hovered point

            if (point) {
                point.highlight(e);
            }
        }
    });
    /**
     * Override the reset function, we don't need to hide the tooltips and crosshairs.
     */
    Highcharts.Pointer.prototype.reset = function () {
        return undefined;
    };

    /**
     * Highlight a point by showing tooltip, setting hover state and draw crosshair
     */
    Highcharts.Point.prototype.highlight = function (event) {
        this.onMouseOver(); // Show the hover marker
        this.series.chart.tooltip.refresh(this); // Show the tooltip
        this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
    };

    /**
     * Synchronize zooming through the setExtremes event handler.
     */
    function syncExtremes(e) {
        var thisChart = this.chart;

        if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
            Highcharts.each(Highcharts.charts, function (chart) {
                if (chart !== thisChart) {
                    if (chart.xAxis[0].setExtremes) { // It is null while updating
                        chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
                    }
                }
            });
        }
    }

    // Get the data. The contents of the data file can be viewed at
    // https://github.com/highcharts/highcharts/blob/master/samples/data/data.json
    $.getJSON(path, function (data) {
        dataSetNames = Object.keys(data.data_points[0]);
        dataSetNames.shift();
        timeIndex = dataSetNames.indexOf('time')

        // "accelerometerX", 1: "accelerometerY", 2: "accelerometerZ", 3: "gravityX", 4: "gravityY", 5: "gravityZ", 6: "gyroscopeX", 7: "gyroscopeY", 8: "gyroscopeZ", 9: "latitude", 10: "longitude", 11: "magneticFieldX", 12: "magneticFieldY", 13: "magneticFieldZ", 14: "magnetometerX", 15: "magnetometerY", 16: "magnetometerZ", 17: "phone_udid", 18: "pitch", 19: "roll", 20: "rotationX", 21: "rotationY", 22: "rotationZ", 23: "speed", 24: "time", 25: "userAccelerationX", 26: "userAccelerationY", 27: "userAccelerationZ", 28: "yaw"

        speed = [{
            data: data.data_points.map(function(val) { return val['speed'] }),
            name: "Speed",
            type: "line",
            color: Highcharts.getOptions().colors[0],
            fillOpacity: 0.3
        }]

        accelerometer = [{
                            data: data.data_points.map(function(val) { return val['accelerometerX'] }),
                            name: "Accelerometer X",
                            type: "line",
                            color: Highcharts.getOptions().colors[0],
                            fillOpacity: 0.3
                        }, {
                            data: data.data_points.map(function(val) { return val['accelerometerY'] }),
                            name: "Accelerometer Y",
                            type: "line",
                            color: Highcharts.getOptions().colors[1],
                            fillOpacity: 0.3
                        }, {
                            data: data.data_points.map(function(val) { return val['accelerometerZ'] }),
                            name: "Accelerometer Z",
                            type: "line",
                            color: Highcharts.getOptions().colors[2],
                            fillOpacity: 0.3
                        }]
        gravity = [{
                    data: data.data_points.map(function(val) { return val['gravityX'] }),
                    name: "Gravity X",
                    type: "line",
                    color: Highcharts.getOptions().colors[0],
                    fillOpacity: 0.3
                }, {
                    data: data.data_points.map(function(val) { return val['gravityY'] }),
                    name: "Gravity Y",
                    type: "line",
                    color: Highcharts.getOptions().colors[1],
                    fillOpacity: 0.3
                }, {
                    data: data.data_points.map(function(val) { return val['gravityZ'] }),
                    name: "Gravity Z",
                    type: "line",
                    color: Highcharts.getOptions().colors[2],
                    fillOpacity: 0.3
                }]

        gyroscope = [{
                    data: data.data_points.map(function(val) { return val['gyroscopeX'] }),
                    name: "Gyroscope X",
                    type: "line",
                    color: Highcharts.getOptions().colors[0],
                    fillOpacity: 0.3
                }, {
                    data: data.data_points.map(function(val) { return val['gyroscopeY'] }),
                    name: "Gyroscope Y",
                    type: "line",
                    color: Highcharts.getOptions().colors[1],
                    fillOpacity: 0.3
                }, {
                    data: data.data_points.map(function(val) { return val['gyroscopeZ'] }),
                    name: "Gyroscope Z",
                    type: "line",
                    color: Highcharts.getOptions().colors[2],
                    fillOpacity: 0.3
                }]


        euler = [{
                    data: data.data_points.map(function(val) { return val['pitch'] }),
                    name: "Pitch",
                    type: "line",
                    color: Highcharts.getOptions().colors[0],
                    fillOpacity: 0.3
                }, {
                    data: data.data_points.map(function(val) { return val['roll'] }),
                    name: "Roll",
                    type: "line",
                    color: Highcharts.getOptions().colors[1],
                    fillOpacity: 0.3
                }, {
                    data: data.data_points.map(function(val) { return val['yaw'] }),
                    name: "Yaw",
                    type: "line",
                    color: Highcharts.getOptions().colors[2],
                    fillOpacity: 0.3
                }]

        rotation = [{
                    data: data.data_points.map(function(val) { return val['rotationX'] }),
                    name: "Rotation X",
                    type: "line",
                    color: Highcharts.getOptions().colors[0],
                    fillOpacity: 0.3
                }, {
                    data: data.data_points.map(function(val) { return val['rotationY'] }),
                    name: "Rotation Y",
                    type: "line",
                    color: Highcharts.getOptions().colors[1],
                    fillOpacity: 0.3
                }, {
                    data: data.data_points.map(function(val) { return val['rotationZ'] }),
                    name: "Rotation Z",
                    type: "line",
                    color: Highcharts.getOptions().colors[2],
                    fillOpacity: 0.3
                }]

        user_acceleration = [{
                    data: data.data_points.map(function(val) { return val['userAccelerationX'] }),
                    name: "User acc X",
                    type: "line",
                    color: Highcharts.getOptions().colors[0],
                    fillOpacity: 0.3
                }, {
                    data: data.data_points.map(function(val) { return val['userAccelerationY'] }),
                    name: "User acc Y",
                    type: "line",
                    color: Highcharts.getOptions().colors[1],
                    fillOpacity: 0.3
                }, {
                    data: data.data_points.map(function(val) { return val['userAccelerationZ'] }),
                    name: "User acc Z",
                    type: "line",
                    color: Highcharts.getOptions().colors[2],
                    fillOpacity: 0.3
                }]


        coords = data.data_points.map(function(val) { return {lat: val['latitude'], lng: val['longitude'] }});
        $('#container').after('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB4MHBHDoRerKr0vpVTz2X6ucFbbn-cElU&callback=initMap"></script>')

        datasets = [{name: 'Speed', data: speed}, {name: 'Accelerometer', data: accelerometer}, {name: 'Gravity', data: gravity}, {name: 'Gyroscope', data: gyroscope}, {name: 'Euler angles', data: euler}, {name: 'User acceleration', data: user_acceleration}];
        geo = []

        // $.each(dataSetNames, function(i, name) {
        //     dataSets << {
        //         name: name,
        //         data:
        //     };
        // });

        $.each(datasets, function (i, dataset) {
            // if(i == 0) continue;
                // Add X values
                // dataset.data = Highcharts.map(dataset.data, function (val, j) {
                //     return [data.xData[j], val];
                // });

            $('<div class="chart">')
                .appendTo('#container')
                .highcharts({
                    chart: {
                        marginLeft: 40, // Keep all charts left aligned
                        spacingTop: 20,
                        spacingBottom: 20,
                        zoomType: 'x'
                    },
                    title: {
                        text: dataset.name,
                        align: 'left',
                        margin: 0,
                        x: 30
                    },
                    credits: { enabled: false },
                    legend: { enabled: false },
                    xAxis: {
                        crosshair: true,
                        events: { setExtremes: syncExtremes },
                        formatter: function() { return this.value * 100 }
                        // labels: { format: '{value} ms' }
                    },
                    yAxis: {
                        title: { text: null }
                    },
                    tooltip: {
                        positioner: function () {
                            return {
                                x: this.chart.chartWidth - this.label.width, // right aligned
                                y: -1 // align to title
                            };
                        },
                        borderWidth: 0,
                        backgroundColor: 'none',
                        pointFormat: '{point.y}',
                        headerFormat: '',
                        shadow: false,
                        style: {
                            fontSize: '18px'
                        },
                        valueDecimals: dataset.valueDecimals
                    },
                    series: dataset.data
                });
        });
    });
});

function type(d, _, columns) {
  d.date = parseTime(d.date);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}

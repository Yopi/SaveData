path = window.location.pathname + ".json"
var coords = []
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 18,
      center: {lat: coords[0].lat, lng: coords[0].lng},
      mapTypeId: 'terrain'
    });
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
    // Get the data
    $.getJSON(path, function (data) {
        dataSetNames = Object.keys(data.data_points[0]);
        dataSetNames.shift();
        timeIndex = dataSetNames.indexOf('time')

        // "accelerometerX", 1: "accelerometerY", 2: "accelerometerZ", 3: "gravityX", 4: "gravityY", 5: "gravityZ", 6: "gyroscopeX", 7: "gyroscopeY", 8: "gyroscopeZ", 9: "latitude", 10: "longitude", 11: "magneticFieldX", 12: "magneticFieldY", 13: "magneticFieldZ", 14: "magnetometerX", 15: "magnetometerY", 16: "magnetometerZ", 17: "phone_udid", 18: "pitch", 19: "roll", 20: "rotationX", 21: "rotationY", 22: "rotationZ", 23: "speed", 24: "time", 25: "userAccelerationX", 26: "userAccelerationY", 27: "userAccelerationZ", 28: "yaw"

        speed = {
            data: data.data_points.map(function(val) { return [new Date(val['time']), val['speed']] }),
            labels: ["Time", "Speed"],
            type: "line",
            fillOpacity: 0.3
        }

        accelerometer = {
          data: data.data_points.map(function(val) { return [new Date(val['time']), val['accelerometerX'], val['accelerometerY'], val['accelerometerZ']] }),
          labels: ["Time", "Accelerometer X", "Accelerometer Y", "Accelerometer Z"],
          type: "line",
          fillOpacity: 0.3
        }
        // gravity = [{
        //             data: data.data_points.map(function(val) { return val['gravityX'] }),
        //             name: "Gravity X",
        //             type: "line",
        //             fillOpacity: 0.3
        //         }, {
        //             data: data.data_points.map(function(val) { return val['gravityY'] }),
        //             name: "Gravity Y",
        //             type: "line",
        //             fillOpacity: 0.3
        //         }, {
        //             data: data.data_points.map(function(val) { return val['gravityZ'] }),
        //             name: "Gravity Z",
        //             type: "line",
        //             fillOpacity: 0.3
        //         }]
        //
        // gyroscope = [{
        //             data: data.data_points.map(function(val) { return val['gyroscopeX'] }),
        //             name: "Gyroscope X",
        //             type: "line",
        //             fillOpacity: 0.3
        //         }, {
        //             data: data.data_points.map(function(val) { return val['gyroscopeY'] }),
        //             name: "Gyroscope Y",
        //             type: "line",
        //             fillOpacity: 0.3
        //         }, {
        //             data: data.data_points.map(function(val) { return val['gyroscopeZ'] }),
        //             name: "Gyroscope Z",
        //             type: "line",
        //             fillOpacity: 0.3
        //         }]
        //
        //
        // euler = [{
        //             data: data.data_points.map(function(val) { return val['pitch'] }),
        //             name: "Pitch",
        //             type: "line",
        //             fillOpacity: 0.3
        //         }, {
        //             data: data.data_points.map(function(val) { return val['roll'] }),
        //             name: "Roll",
        //             type: "line",
        //             fillOpacity: 0.3
        //         }, {
        //             data: data.data_points.map(function(val) { return val['yaw'] }),
        //             name: "Yaw",
        //             type: "line",
        //             fillOpacity: 0.3
        //         }]
        //
        // rotation = [{
        //             data: data.data_points.map(function(val) { return val['rotationX'] }),
        //             name: "Rotation X",
        //             type: "line",
        //             fillOpacity: 0.3
        //         }, {
        //             data: data.data_points.map(function(val) { return val['rotationY'] }),
        //             name: "Rotation Y",
        //             type: "line",
        //             fillOpacity: 0.3
        //         }, {
        //             data: data.data_points.map(function(val) { return val['rotationZ'] }),
        //             name: "Rotation Z",
        //             type: "line",
        //             fillOpacity: 0.3
        //         }]
        //
        // user_acceleration = [{
        //             data: data.data_points.map(function(val) { return [val['userAccelerationX'], val['userAccelerationY'], val['userAccelerationZ']] }),
        //             labels: ["User acc X", "User acc Y", "User acc Z"],
        //             type: "line",
        //             fillOpacity: 0.3
        //         }]


        coords = data.data_points.map(function(val) { return {lat: val['latitude'], lng: val['longitude'] }});
        $('#container').after('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB4MHBHDoRerKr0vpVTz2X6ucFbbn-cElU&callback=initMap"></script>')

        datasets = [speed, accelerometer] //, gravity, gyroscope, euler, user_acceleration];

        $.each(datasets, function (i, dataset) {
          $('<div class="chart">').appendTo('#container')
          new Dygraph(document.getElementsByClassName("chart")[document.getElementsByClassName("chart").length - 1],
             dataset.data,
             {
               labels: dataset.labels
             });

        });
    });
});

const apiKey = "k6GvgDfPB3/haJq6qHggvg==gjElcs1uP9qnDapp";
$(document).ready(function(){
    var countryDatalist = document.getElementById("countries");
    // debugger;
    $('#countryinput').focus(function(){
        $.ajax({
            method: 'GET',
            url: 'https://restcountries.com/v3.1/all',
            headers: { 'X-Api-Key': apiKey},
            contentType: 'application/json',
            success: function(result) {
                // debugger;
                result.sort(function(a, b){
                    const nameA = a.name.common.toUpperCase();
                    const nameB = b.name.common.toUpperCase();
                    if (nameA > nameB){
                        return 1;
                    }
                    else if(nameA < nameB){
                        return -1;
                    }
                    else{
                        return 0;
                    }
                });
                result.forEach(function(item){
                    var option =document.createElement('option');
                    option.value = item.name.common;
                    countryDatalist.appendChild(option);
                });
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    });

    $('#cityinput').focus(function(){
        var countryInput = document.getElementById('countryinput'),
            country = countryInput.value;
        var request_data = '{"country": "' + country.toLowerCase() +'"}';
        var cityDatalist = document.getElementById("cities");
        $.ajax({
            method: 'POST',
            url: 'https://countriesnow.space/api/v0.1/countries/cities',
            headers: { 'X-Api-Key': apiKey},
            contentType: 'application/json',
            // dataType: 'jsonp',
            data: request_data,
            success: function(result) {
                // debugger;
                result.data.sort(function(a, b){
                    if (a > b){
                        return 1;
                    }
                    else if(a < b){
                        return -1;
                    }
                    else{
                        return 0;
                    }
                });
                result.data.forEach(function(item){
                    var option =document.createElement('option');
                    option.value = item;
                    cityDatalist.appendChild(option);
                });
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    });
    $('#add').click(function(){
        // debugger;
        var cityInput = document.getElementById('cityinput'),
            city = cityInput.value,
            countryInput = document.getElementById('countryinput');
            
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/city?name=' + city,
            headers: { 'X-Api-Key': apiKey},
            contentType: 'application/json',
            success: function(result) {
                // debugger;
                if(result.length == 0){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'We cannot find weather data of this location',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        cityInput.value = '';
                        countryInput.value = '';
                    });

                }
                else{
                    var latitude = result[0].latitude,
                        longitude = result[0].longitude;
                    $.ajax({
                        method: 'GET',
                        url: 'https://api.api-ninjas.com/v1/weather?lat=' + latitude + '&lon=' + longitude,
                        headers: { 'X-Api-Key': apiKey},
                        contentType: 'application/json',
                        success: function(result) {
                            // debugger;
                            var temp = document.getElementById('temp'),
                                humidity = document.getElementById('humidity'),
                                wind = document.getElementById('wind'),
                                cityOutput = document.getElementById('cityoutput');
                            temp.innerHTML = 'Temperature: ' + '<span>' + result.temp + '°C </span>';
                            humidity.innerHTML = 'Humidity: ' + '<span>' + result.humidity + '% </span>';
                            wind.innerHTML = 'Wind Speed: ' + '<span>' + result.wind_speed + ' km/h </span>';
                            cityOutput.innerHTML = '<span>' + city + '</span>';
                        },
                        error: function ajaxError(jqXHR) {
                            console.error('Error: ', jqXHR.responseText);
                        }
                    });
                }
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    });
});

var model = {
    "weather" : " ",
    "cityName" : " ",
    "introText" : " ",
     "high" : [0,0,0,0,0],
    "low" : [0,0,0,0,0],
    "forecast" : ["", "", "", "", ""],
    "weekday" : ["", "", "", "", ""],
    "date" : ["", "", "", "", ""],


    getWeather : function(woei)
    {
        var script = document.createElement('script');
        script.src = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid='"+woei+"' & format=json&callback=model.setWeather";
        document.body.appendChild(script); 
    },
  

    setWeather : function(data)//Gets the needed data from weather API
    {   
        model.cityName = data.query.results.channel.location.city + ", " + data.query.results.channel.location.region +", " + data.query.results.channel.location.country;
        model.weather = data.query.results.channel.item.forecast;//Forecasts
        model.condition = data.query.results.channel.item.condition;//Current weather
        model.introText = data.query.results.channel.item.title;
        model.getWeatherData();
        view.changeWeatherDisplay(this);//Changes on screen visuals to new location
    },


    getWeatherData : function()
    {

        var i = 0;
 
        for (i = 0; i < 5; i++)
            model.forecast[i] = model.weather[i].text;//Gets condition for next 5 days
        for (i = 0; i < 5; i++)//gets Highs for next 5 days
            model.high[i] = model.weather[i].high;
        for (i = 0; i < 5; i++)//gets lows for next 5 days
            model.low[i] = model.weather[i].low;
        for (i = 0; i < 5; i++)//gets days for next 5 days
            model.weekday[i] = model.weather[i].day;
        for (i = 0; i < 5; i++)//gets dates for next 5 days
            model.date[i] = model.weather[i].date;

        model.weekday[0] = "Today";
        model.weekday[1] = "Tomorrow";


    }//Gets needed info from weather API
    

}//Holds all the data to be displayed; end model







var view = {

    
    getImage: function(code)
    {
        if (code < 10)
            return "thunder.png";
        else if (code < 16)
            return "rain.png";
        else if (code < 25)
            return "windy.png";
        else if (code < 30)
            return "cloudy.png";
        else if (code < 35)
            return "sunny.png";
        else if (code < 48)
            return "thunder.png";


        else return "cloudy.png";
    },//Checks condition and returns respective image


    changeWeatherDisplay : function(model)
    {
        console.log(model);  
        var k = 0;

        for (k = 0; k< 5; k++)//places in document
        {
            var day = document.getElementById(k+"days");//Current High/ low
            day.children[2].textContent = model.forecast[k];//sets Condition 
            day.children[3].textContent = "High: " + model.high[k]; 
            day.children[4].textContent = "Low: " + model.low[k];
            day.children[1].src = view.getImage(model.weather[k].code);    
            day.children[0].textContent = model.weekday[k];
         }
        
        var fahrenheit = document.getElementById("currentWeather");//current weather
        var celsius = document.getElementById("celsiusWeather");//current weather
        var cityName = document.getElementById("cityName");//Location P element
        var currentTemp = model.condition.temp + "\xB0" +"F";//Today's current temp
        var celsiusTemp =Math.round((model.condition.temp - 32) * 5/9) + "\xB0" +"C";//current temp in Celsius
        celsius.textContent = celsiusTemp;
        fahrenheit.textContent =  currentTemp;
        cityName.textContent = model.cityName;

    }//Changes text for new city




}//end view



var control={

    initialize: function()
    {
       model.getWeather(2389646); 
    },//Initializes weather to Davis, CA


    /* called when submit button is pushed */
    lookupWoeid: function() 
    {
        var searchText = document.getElementById("zip").value;
        control.getNewPlace(searchText);
    },       


    /* function to get new woeid and place by forcing the browser to make a 
    query, in the form of asking Yahoo to download a Javascript file.  */ 
    getNewPlace: function(place)
    {
    	var script = document.createElement('script');
	script.src = "https://query.yahooapis.com/v1/public/yql?q=select woeid,name,admin1,country  from   geo.places where text='"+place+"' & format=json & callback=control.placeCallback";
	document.body.appendChild(script);
    },      

    /* called when Yahoo returns a new place result */
    placeCallback: function(data) 
    {
        // did it find it?
    
        // console.log(data.query.results); 
        if (data.query.results == null) 
        {
	    var woeid = "not found";
	    var name = "not found";
        } // was it unique? 
        else 
        {
	    if (data.query.results.place[0] == undefined) 
            {
	        place = data.query.results.place;
	    } // multiple ones - pick the first one
	    
            else 
            {
	        place = data.query.results.place[0];
	    }
	    var woeid = place.woeid;
	    var name = place.name+", "+
            place.admin1.content+", "+ place.country.content;
        }

        model.getWeather(woeid); //Gets weather



    }

}//end control

















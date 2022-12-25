	var watchID;
	var geoLoc;
	var svg;
	var x_px;
    var y_px;
    var view_box = {x:0,y:0,w:960,h:1260};
    //Границы изображения
    var img = {left:0,right:0,top:0,bottom:0};
	//Example for calculating number of tiles within given extent and zoom-level:
    var zoom        = 14;
    north_edge = coords[0].lat;
    west_edge = coords[0].lon;
    south_edge = coords[2].lat;
    east_edge = coords[1].lon;
    top_tile    = lat2tile(north_edge, zoom); // eg.lat2tile(34.422, 9);
    left_tile   = lon2tile(west_edge, zoom);
    bottom_tile = lat2tile(south_edge, zoom);
    right_tile  = lon2tile(east_edge, zoom);
    var map_width       = Math.abs(left_tile - right_tile) + 1;
    var map_height      = Math.abs(top_tile - bottom_tile) + 1;
    north_edge = tile2lat(top_tile, zoom);
    west_edge =  tile2long(left_tile, zoom);
    south_edge = tile2lat(bottom_tile + 1, zoom);
    east_edge =  tile2long(right_tile + 1, zoom);

    // total tiles
    var total_tiles = map_width * map_height; // -> eg. 377
    console.log("top_tile: " + top_tile);
    console.log("left_tile: " + left_tile);
    console.log("bottom_tile: " + bottom_tile);
    console.log("right_tile: " + right_tile);
    console.log("map_width: " + map_width);
    console.log("map_height: " + map_height);
    console.log("total_tiles: " + total_tiles);
    console.log("north_edge: " + north_edge);
    console.log("west_edge: " + west_edge);
    console.log("south_edge: " + south_edge);
    console.log("east_edge: " + east_edge);

    var n = 0;

    x_px = map_width * 256;
    y_px = map_height * 256;
    img.left = 0;
    img.right = map_width * 256;
    img.top = 0;
    img.bottom = map_height * 256;


    function lon2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
    function lat2tile(lat,zoom)  {
        return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) +
        1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
    }

    //Inverse process:

     function tile2long(x,z) {
         return (x/Math.pow(2,z)*360-180);
     }
     function tile2lat(y,z) {
         var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
         return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
     }


	 window.onload = function()
	{
    try
    {
        svg = document.getElementById('svg');
        getLocationUpdate();
        set_viewbox();
    }
    catch(e)
    {
        alert(e);
    }
	}

    function set_viewbox()
    {
        svg.setAttribute("width", String(document.documentElement.clientWidth));
			svg.setAttribute("height", String(document.documentElement.clientHeight));
			view_box.w = document.documentElement.clientWidth;
			view_box.h = document.documentElement.clientHeight;
			svg.setAttribute("viewBox", String(view_box.x) + " " + String(view_box.y) + " " +
					String(view_box.w) + " " + String(view_box.h));
    }
	function setPosition()
	{
	    /*n += 0.0005;
	    current_pos.lon = 30.271 + n;
	    current_pos.lat = 59.29 + n;*/
		// Координата x
		var x_current = Math.round((current_pos.lon - west_edge) * x_px / (east_edge - west_edge));

		// Координата y
		var y_current = Math.round((north_edge - current_pos.lat) * y_px / (north_edge - south_edge));

		var pos = document.getElementById("position");
		var cx = x_current + ""
		pos.setAttribute("cx", cx);
		var cy = y_current + ""
		pos.setAttribute("cy", cy);
		if((x_current - img.left) < view_box.w / 2)
		{
			view_box.x = img.left;
		}
		else 
		{
			if((img.right - x_current) < view_box.w / 2)
				{
					view_box.x = img.right - view_box.w;
				}
				else
				{
					view_box.x = x_current - view_box.w / 2;
				}
		}
		
		if((y_current - img.top) < view_box.h / 2)
		{
			view_box.y = img.top;
		}
		else 
		{
			if((img.bottom - y_current) < view_box.h / 2)
				{
					view_box.y = img.bottom - view_box.h;
				}
				else
				{
					view_box.y = y_current - view_box.h / 2;
				}
		}
		set_viewbox();
	}
	 
	function showLocation(position) 
	{
		current_pos.lat = position.coords.latitude;
		current_pos.lon = position.coords.longitude;
		setPosition();
	}

	function errorHandler(err) 
	{
		if(err.code == 1) 
		{
			alert("Error: Access is denied!");
		} else if( err.code == 2) 
			{
				console.log("Error: Position is unavailable!");
				setPosition();
			}
	}

	function getLocationUpdate()
	{
		if(navigator.geolocation)
		{
			// timeout at 2000 milliseconds (2 seconds)
			var options = {maximumAge: 0, enableHighAccuracy: true};
			geoLoc = navigator.geolocation;
			watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
		} else 
			{
				alert("Sorry, browser does not support geolocation!");
			}
	}



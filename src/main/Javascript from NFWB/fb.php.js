var shareauto=0;
var mouseonfeature = null;
var acode=1;
var lsearchday="";
var rsortmode=1;
var sn=0;
var sys_nearby=0;
var sys_nearby_radius=250;
var lastlat=0.0;
var lastlon=0.0;
var bmlat=0.0;
var bmlon=0.0;
var sysseq=0;
var errorcnt=0;
var v_ustatus="";
var hadjust=0;
var ppresult='';
var ppresult2='';
var ppresult3='';
var kmblink='';
var nwfblink='';
var map;
var view;
var layerLines;
var trafficSource = new ol.source.Vector({});
var ptSource = new ol.source.Vector({});
var vectorSource = new ol.source.Vector({});
var stopSource = new ol.source.Vector({});
var circleSource = new ol.source.Vector({});
var walkSource = new ol.source.Vector({style: styleFunction});
var lineSource = new ol.source.Vector({});
var popup;
var markerpopup;
var mappopupelement;
var hotspotpopup;
var hotspotpopupelement;
var popupposition=null;
var startname="";
var startlat=0.0;
var startlon=0.0;
var endname="";
var endlat=0.0;
var endlon=0.0;
var lastname="";
var lastlat=0.0;
var lastlon=0.0;
var markers = new Array(1000);
var markercodes = new Array(1000);
var markerlat = new Array(1000);
var markercount=0;
var stopNearbyMarkers = new Array(1000); // nearby markers for route detail's selected stop
var stopNearbyMarkercodes = new Array(1000);
var stopNearbyMarkerlat = new Array(1000);
var stopNearbyMarkercount=0;
var circle = new ol.geom.Circle(ol.proj.transform([114.173, 22.3], 'EPSG:4326', 'EPSG:3857'), 1000);
var CircleFeature = new ol.Feature(circle);
var circleC = new ol.geom.Point(ol.proj.transform([114.173, 22.3], 'EPSG:4326', 'EPSG:3857'));
var CircleFeatureC = new ol.Feature(circleC);
var CircleLayer
var linecount = 0;
var maxlinecount = 0;
var mapLayerPtStr = "";
var mapLayerPtLat = 0.0;
var mapLayerPtLon = 0.0;
var mapLayerRadius = 0.0;
var layerCenterMap2 = "";
var layermark1 = [0,0,0,0,0,0,0,0,0,0];
var layermark2 = [0,0,0,0,0,0,0,0,0,0];
var layerpt = [1,2,81,7,4,5,80];
var bookmarkmode=0;
var bookmarkno=0;
var skipmapclick=0;
var sys_audio=0;

var lastP2PResultListScrollY = 0;
var lastP2PResultListPopUpScrollY = 0;
var lastP2PResultListViewMode = 0; //0=normal list, 1=popup list


var autoRouteSearch_info = "";
var autoRouteSearch_rdv = "";
var autoRouteSearch_r = "";
var autoRouteSearch_d = "";
var autoRouteSearch_v = "";
var autoRouteSearch_bound = "";
var autoRouteSearch_stopid = "";

var hihi = "hihi 2";

var recaptcha_rendered = false;
var recaptchaId = "";

var recaptcha_type = "";
var recaptcha_value = "";

var recaptcha_check_called = false;
var recaptcha_key = "";


function gosearchclick(){
	lastP2PResultListScrollY = 0;
	lastP2PResultListPopUpScrollY = 0;
	lastP2PResultListViewMode =	0; //0=normal list, 1=popup list
	lsearchday=document.getElementById('search_day').innerHTML;
	ppsearch_p3(document.ppsearch.slat.value,document.ppsearch.slon.value,document.ppsearch.elat.value,document.ppsearch.elon.value ,document.getElementById('walkingspeed').value,document.getElementById('leg').value, getselectloc(), getselectdate());
	goresize();
}

function initmap(){
}

var trafficInfoObject = {
        init : true,
        drawjourney :false,
        drawspeedmap : false,
        drawcctv : false,
        drawsmp : false,
        timer : null,
        journey : [],
        journeydata : [],
        speedmap : [],
        cctv : [],
        smp : [],
        cctvCallbackCloseMarkers :  false,
        drawSpeedMap : function drawSpeedMap(){ godrawspeedmap(); },
        drawCCTVMarker : function drawCCTVMarker(){ godrawcctvmarker(); },
        drawJourneyMarker : function drawJourneyMarker(){ godrawjourneymarker(); },
        drawSMPMarker : function drawSMPMarker(){ godrawsmpmarker();}
}

var styleFunction = function(feature) {
  var geometry = feature.getGeometry();
  var styles = [
    // linestring
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2
      })
    })
  ];

  geometry.forEachSegment(function(start, end) {
    var dx = end[0] - start[0];
    var dy = end[1] - start[1];
    var rotation = Math.atan2(dy, dx);
    // arrows
    styles.push(new ol.style.Style({
      geometry: new ol.geom.Point(end),
      image: new ol.style.Icon({
        src: 'icons/barrow.png',
        anchor: [0.75, 0.5],
        rotateWithView: true,
        rotation: -rotation
      })
    }));
  });

  return styles;
};

function setdiv(dname,str){
  document.getElementById(dname).innerHTML=str;
}

function initsystem(){
}

function sortclick(no){
  var glist = "s_clock.png|s_price.png|s_work.png";
  var aaa = glist.split("|");
  for(var i=1; i<=3; i++){
    var tobj = document.getElementById("rsort"+i);
    var iobj = document.getElementById("rsortimg"+i);
    if(tobj){
    	if(i==no){
      		tobj.style.backgroundColor="#6c3f98";
      		iobj.src="w_"+aaa[i-1];
      		tobj.style.color="#FFFFFF";
    	}else{
      		tobj.style.backgroundColor="";
      		iobj.src="b_"+aaa[i-1];
     		 tobj.style.color="#444444";
    	}
    }
  }
  rsortmode=no;
}

function getlatlon_td(key, route, stopid, appcall){
  makeRequest('getlatlon_td.php?key='+key+'&route='+route+'&stopid='+stopid+'&appcall='+appcall+'&l='+lang,'dummydiv');
}

function geteta_td(route, stopid, lon, lat, key, appcall){
  if(lon=="" || lat==""){
    alert("Invalid TD ETA Call!");
    return;
  }
  tlon = parseFloat(lon);
  tlat = parseFloat(lat);
  var coord = ol.proj.transform([tlon, tlat], 'EPSG:4326', 'EPSG:3857');
  markerpopup.setPosition(coord);
  //showmarkerpopupinfo(undefined)
  var z = Math.floor(map.getView().getZoom());
  if(z>=10 && z<=18){
    var coord2 = ol.proj.transform([tlon+difflon[z], tlat-difflat[z]], 'EPSG:4326', 'EPSG:3857');
    mappantoxy(coord2);
  }
  ajaxindex++;
  makeRequestref('getrouteinstop_o.php?callfrom=td&route='+route+'&stopid='+stopid+'&lat='+lat+'&lon='+lon+'&key='+key+'&appcall='+appcall+'&l='+lang,'popupcontent',ajaxindex);
  document.getElementById('redcross').style.visibility='hidden';
  currentlist=0;
}


function showtraffic(){
  cleartraffic();
  if(layermark1[0]==1) makeRequest('loadsmp.php','*jscode*');
  if(layermark1[1]==1) makeRequest('loadjtime.php','*jscode*');
  if(layermark1[2]==1) makeRequest('loadspeedmap.php','*jscode*');
  if(layermark1[3]==1) makeRequest('loadcctv.php','*jscode*');
  loadptstop();
}

function loadptstop(){
  var plist="";
  for(var i=0; i<7; i++){
    if(layermark2[i]==1) plist +=","+layerpt[i];
  }
  if(plist!=""){
    plist = plist.substring(1);
    var coord = ol.proj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
    var lon = coord[0]+alon;
    var lat = coord[1]+alat;
    calldummy('loadptstop.php?type='+plist+'&lat='+lat+'&lon='+lon);
  }
}

function cleartraffic(){
  lineSource.clear();
  trafficSource.clear();
  ptSource.clear();
}

function removeMarkersByType(type,layer){
  ptSource.clear();
}

function buildPtMarker(){
  var aaa = mapLayerPtStr.split("|*|");
  for(var i=0; i<aaa.length; i++){
    var rec = aaa[i];
    if(rec.length>10){
      var bbb = rec.split("||");
      var lon = parseFloat(bbb[0]);
      var lat = parseFloat(bbb[1]);
      var type = parseInt(bbb[3]);
      var name = bbb[2];
      var link = bbb[5];
      var code='b';
      if(type==1) code='b';
      if(type==2) code='g';
      if(type==3) code='m';
      if(type==4) code='t';
      if(type==5) code='p';
      if(type==6) code='l';
      if(type==7) code='f';
      if(type==13) code='m';
      if(type==15) code='a';
      if(type==20) code='r';
      if(type==80) code='a';
      if(type==81) code='m';
      trafficmarker(code, lat, lon, name, link);
    }
  }
}


function removeline() {
  linecount=0;
  cleartraffic();
}

function godrawsmpmarker(){
  $.each( trafficInfoObject.smp, function( key, value ) {
    trafficmarker('S', value.lat, value.lon, value.name, value.link);
  });
}

function godrawjourneymarker(){
  $.each( trafficInfoObject.journey, function( key, value ) {
    var name = value.tc_name;
    if(lang==1) name = value.en_name;
    if(lang==2) name = value.sc_name;
    trafficmarker('J', value.lat, value.lon, value.loc_id+": "+name, "");
  });
}

function godrawcctvmarker(){
  $.each( trafficInfoObject.cctv, function( key, value ) {
    trafficmarker('C', value.lat, value.lon, value.id+": "+value.name, value.url);
  });
}

function godrawspeedmap(){
  lineSource.clear();
  var lineStyle = [];
  for(var i=0; i<3; i++){
    if(i==0) color='#00FF00';
    if(i==1) color='#FF0000';
    if(i==2) color='#FFFF00';
    lineStyle[i] = new ol.style.Style({
      stroke: new ol.style.Stroke(({
        color: color,
        width: 3
      }))
    });
  }

  var pointsgreen = [];
  var pointsred = [];
  var pointsblue = [];

  $.each( trafficInfoObject.speedmap, function( key, value ) {
    var i=0;
    if(value.color=='G') i=0;
    if(value.color=='R') i=1;
    if(value.color=='Y') i=2;
    var segment = [];
    $.each( this.lines, function( key2, value2 ) {
      segment.push(ol.proj.transform( [value2.lon+alon, value2.lat+alat], 'EPSG:4326', 'EPSG:3857'));
    });
    if(i==0) pointsgreen.push(segment);
    if(i==1) pointsred.push(segment);
    if(i==2) pointsblue.push(segment);
  });

  var greenline = new ol.Feature({
      geometry: new ol.geom.MultiLineString(pointsgreen),
      name: "Line"
  });
  greenline.setStyle(lineStyle[0]);
  var redline = new ol.Feature({
      geometry: new ol.geom.MultiLineString(pointsred),
      name: "Line"
  });
  redline.setStyle(lineStyle[1]);
  var blueline = new ol.Feature({
      geometry: new ol.geom.MultiLineString(pointsblue),
      name: "Line"
  });
  blueline.setStyle(lineStyle[2]);

  lineSource.addFeature(greenline);
  lineSource.addFeature(redline);
  lineSource.addFeature(blueline);
}


function clearwalkline(){
  walkSource.clear();
}

function drawwalkline(slat,slon,elat,elon){
  var dist = getDistanceFromLatLonInKm(slat,slon,elat,elon);
  var step = Math.ceil(dist/0.1);

  var lineStyle = new ol.style.Style({
      stroke: new ol.style.Stroke(({
        color: '#0000FF',
        lineDash: [.1, 5],
        width: 3
      }))
    });

  var dx = slon - elon;
  var dy = slat - elat;
  var rotation = Math.atan2(dy, dx);
  for(var i=0; i<step; i++){
    var tlat = slat-(i+1)*(dy/step);
    var tlon = slon-(i+1)*(dx/step);
    var arrowpoint = new ol.geom.Point(ol.proj.transform([tlon+alon, tlat+alat], 'EPSG:4326', 'EPSG:3857'));
    var arrowFeature = new ol.Feature(arrowpoint);
    var arrowStyle = new ol.style.Style({
          image: new ol.style.Icon(({
            scale: 0.2,
            anchor: [0.0, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'icons/barrow.png',
            rotateWithView: true,
            rotation: -rotation
        }))
      });
    arrowFeature.setStyle(arrowStyle);
    walkSource.addFeature(arrowFeature);
  }

  var points = [];
  var segment = [];
  segment.push(ol.proj.transform( [slon+alon, slat+alat], 'EPSG:4326', 'EPSG:3857'));
  segment.push(ol.proj.transform( [elon+alon, elat+alat], 'EPSG:4326', 'EPSG:3857'));
  points.push(segment);
  var workline = new ol.Feature({
      geometry: new ol.geom.MultiLineString(points),
      name: "Line"
  });
  workline.setStyle(lineStyle);
  walkSource.addFeature(workline);
}

var circleStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 0, 0, 0.5)',
        width: 1
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255, 0, 0, 0.07)'
      })
    });

var circleStyleC = new ol.style.Style({
      image: new ol.style.Icon(({
          scale: 0.2,
          anchor: [0.5,0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 0.8,
          src: 'icons/centercross.png'
      }))
    });


CircleFeature.setStyle(circleStyle);
CircleFeatureC.setStyle(circleStyleC);

circleSource.addFeature(CircleFeature);
circleSource.addFeature(CircleFeatureC);
CircleLayer = new ol.layer.Vector({ source: circleSource  });

CircleLayer.setVisible(false);

$(function(){
  $('.sidebar-left .slide-submenu').on('click',function() {
    var thisEl = $(this);
    thisEl.closest('.sidebar-body').fadeOut('slide',function(){
      $('.mini-submenu-left').fadeIn();
      applyMargins();
    });
  });

  $('.mini-submenu-left').on('click',function() {
    var thisEl = $(this);
    $('.sidebar-left .sidebar-body').toggle('slide');
    thisEl.hide();
    //applyMargins();
  });

  //$(window).on("resize", applyMargins);
  var tooltip = document.getElementById('tipbox');

  var maxExtent = ol.proj.transformExtent([113.60,22.20,114.50
    ,22.60], 'EPSG:4326', 'EPSG:3857');
  var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false});
  var scaleLineControl = new ol.control.ScaleLine();
  scaleLineControl.setUnits("metric");

  view = new ol.View({
      center: ol.proj.transform([114.173, 22.3], 'EPSG:4326', 'EPSG:3857'),
      zoom: 13,
      minZoom: 10,
      maxZoom: 18,
      extent: maxExtent
    });

  goresize();

  function displayTooltip(evt) {
    var pixel = evt.pixel;
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
      return feature;
    });
    var name = "";
    if(!feature) {
      mouseonfeature = null;
      overlay.setPosition(undefined);
    }else{
      mouseonfeature = feature;
      name = feature.get('name');
      if(name!=undefined)
        name = name.split("^").join("'");
      else
        name = "";
    }
    if(feature==CircleFeature || feature==CircleFeatureC || name=="Line"){
      overlay.setPosition(undefined);
      return;
    }

    var tooltip = document.getElementById('tipbox');
    if(tooltip){
    tooltip.style.display = feature ? '' : 'none';
    }
    if(feature) {
      var info = name;
      if(info.length>1 && info.substring(0,1)=="*") info=info.substring(1);
      overlay.setPosition(evt.coordinate);
      var aaa = info.split("{");
      if(info.indexOf("|*")>0){
        aaa = info.split("|*");
      }
      if(aaa.length==1) aaa = info.split("||");
      tooltip.innerHTML = aaa[0];
      debug(tooltip.innerHTML);
    }else{
      overlay.setPosition(undefined);
    }
  }


  map = new ol.Map({
    interactions: interactions, //Block Rotation
    controls : ol.control.defaults({
      attribution : false,
      zoom : true,
    }).extend([
          scaleLineControl
    ]),
    target: "map",
    layers: [
      new ol.layer.Tile({
         source: new ol.source.XYZ({
            tilePixelRatio: 1,
            url: 'http://map.nwstbus.com.hk/map/SJP/EN{z}/{x}-{y}.jpg',
            //url: 'http://mobile.nwstbus.com.hk/map/HJP/TC13/6690-3572.jpg',
            wrapX: false
         })
      }),
      CircleLayer,
      new ol.layer.Vector({
          source: lineSource
      }),
      new ol.layer.Vector({
          source: walkSource
      }),
      new ol.layer.Vector({
          source: trafficSource
      }),
      new ol.layer.Vector({
          source: ptSource
      }),
      new ol.layer.Vector({
          source: stopSource
      }),
      new ol.layer.Vector({
          source: vectorSource
      }),
      new ol.layer.Vector({
          source: tramRailSource
      }),
      new ol.layer.Vector({
          source: csNearByStopSource
      })
    ],
    view: view
  });
  //applyInitialUIState();
  //applyMargins();

  mappopupelement = document.getElementById('markerpopup');
  hotspotpopupelement = document.getElementById('hotspotpopup');

  var overlay = new ol.Overlay({
    element: tooltip,
    offset: [10, 0],
    positioning: 'bottom-left'
  });
  map.addOverlay(overlay);

  popup = new ol.Overlay({
    element: document.getElementById('popup'),
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });
  map.addOverlay(popup);

  markerpopup = new ol.Overlay({
    element: mappopupelement,
    positioning: 'bottom-center',
    stopEvent: true
  });
  map.addOverlay(markerpopup);

  hotspotpopup = new ol.Overlay({
    element: hotspotpopupelement,
    positioning: 'bottom-center',
    stopEvent: true
  });
  map.addOverlay(hotspotpopup);


  map.getViewport().addEventListener('contextmenu', function (evt) {
    closeautocom();
    mapstandclick(evt);
    downmark=0;
  });

  map.getViewport().addEventListener('click', function (evt) {
    closeautocom();
    if(downmark==2 && mouseonfeature==null){
    }else{
      mapstandclick(evt);
    }
    downmark=0;
  });

  var downmark=0;
  var mousex=0;
  var mousey=0;
  map.getViewport().addEventListener('mousedown', function (evt) {
    downmark=1;
    mousex=evt.layerX;
    mousey=evt.layerY;
  });

  map.getViewport().addEventListener('mousemove', function (evt) {
    if( (Math.abs(mousex-evt.layerX)>3 || Math.abs(mousey-evt.layerY)>3) && downmark==1) downmark=2;
  });


  function mapstandclick(evt){
    redrawMarkerIcon();
    mouseonfeature = null;

    evt.preventDefault();
    var location = map.getCoordinateFromPixel([evt.layerX, evt.layerY]);
    var coord = ol.proj.transform(location, 'EPSG:3857', 'EPSG:4326');
    var lon = coord[0];
    var lat = coord[1];
    for(var i=markercount-1; i>=0; i--){
      var tempfeature = markers[i];
      var geometry = tempfeature.getGeometry();
      var flocation = geometry.getCoordinates();
      var pix = map.getPixelFromCoordinate(flocation);
      var pix = map.getPixelFromCoordinate(flocation);
      var sizex = markersize[i][0]/2;
      var sizey = markersize[i][1]/2;
      var offx = markersize[i][2]/2;
      var offy = markersize[i][3]/2;
      if(markersize[i][1]<70 && Math.abs(evt.layerX-pix[0]-offx)<sizex && Math.abs(evt.layerY-pix[1]-offy)<sizey){
        mouseonfeature = tempfeature;

	break;
      }
    }

    for(var i=stopNearbyMarkercount-1; i>=0; i--){
      var tempfeature = stopNearbyMarkers[i];
      var geometry = tempfeature.getGeometry();
      var flocation = geometry.getCoordinates();
      var pix = map.getPixelFromCoordinate(flocation);
      var pix = map.getPixelFromCoordinate(flocation);
      var sizex = stopNearbyMarkersize[i][0]/2;
      var sizey = stopNearbyMarkersize[i][1]/2;
      var offx = stopNearbyMarkersize[i][2]/2;
      var offy = stopNearbyMarkersize[i][3]/2;
      if(stopNearbyMarkersize[i][1]<70 && Math.abs(evt.layerX-pix[0]-offx)<sizex && Math.abs(evt.layerY-pix[1]-offy)<sizey){
        mouseonfeature = tempfeature;

        break;
      }
    }

//alert(markers[0].get('name'));



    if(mouseonfeature!=null){
      var feature = mouseonfeature;
      if (feature && !(feature==CircleFeature || feature==CircleFeatureC)) {
        popup.setPosition(undefined);
        var s = feature.get('name');
        if(s.indexOf("[")>0){
          nnn1 = s.split("[");
          nnn2 = nnn1[1].split("]");
          var temp = '||0||0||0';
          var etainfo = nnn2.concat(temp);

          makeRequest('auto_e9d160cd20d8446e98433148b2dc0cad.php?info='+etainfo,'dummydiv');

/* ???  */
	var infos = s.split("||");

	var newImg = infos[4];
	if (infos[4] == "stop3.png")
		newImg = "stop3b.png";

	offx = infos[7];
	offy = infos[8];

	amode='pixels';
        ax=(-offx)*2;
        ay=(-offy);
        if(sizex==15){
          ax=0.5;
          ay=0.5;
          amode='fraction';
        }

	var iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                        scale: 1,
                        anchor: [ax,ay],
                        anchorXUnits: amode,
                        anchorYUnits: amode,
                        opacity: 1,
                        src: newImg
                }))
        });

        mouseonfeature.setStyle(iconStyle);

        }

        if(s.length>1 && s.indexOf("|*|")>0)
          nearbyclickpopup(feature);
        else if(s.length>1 && s.substring(0,1)=="*")
          hotspotclickpopup(feature)
        else
          markerclickpopup(feature)
        return;
      }
    }else{
      if(hotspotpopup.getPosition()!=undefined)
        hotspotpopup.setPosition(undefined);
      else if(markerpopup.getPosition()!=undefined)
        markerpopup.setPosition(undefined);
      else if (CircleLayer.getVisible()){
	// do nothing
      }
      else
        maparepopup(location,lat,lon);
    }
  }

  //map.on('singleclick', function(evt) {
  //   mapclickaction(evt,evt.coordinate);
  //});



  function mapclickaction(evt,location){
      if(skipmapclick==1){
        skipmapclick=0;
        return;
      }
      var coord = ol.proj.transform(location, 'EPSG:3857', 'EPSG:4326');
      var lon = coord[0];
      var lat = coord[1];
      var feature = map.forEachFeatureAtPixel(evt.pixel,
              function(feature, layer) {
                  return feature;
              });
      if (feature && !(feature==CircleFeature || feature==CircleFeatureC)) {
        popup.setPosition(undefined);
        var s = feature.get('name');
        if(s.indexOf("[")>0){
          nnn1 = s.split("[");
          nnn2 = nnn1[1].split("]");
          var temp = '||0||0||0';
          var etainfo = nnn2.concat(temp);
          makeRequest('auto_e9d160cd20d8446e98433148b2dc0cad.php?info='+etainfo,'dummydiv');
        }

        if(s.length>1 && s.indexOf("|*|")>0)
          nearbyclickpopup(feature);
        else if(s.length>1 && s.substring(0,1)=="*")
          hotspotclickpopup(feature)
        else
          markerclickpopup(feature)
        return;
      }
      lastlat = (lat-alat);
      lastlon = (lon-alon);
      debug("ll="+lastlat+","+lastlon);
      if(markerpopup.getPosition()==undefined ){
        /*
        mappanto(lon,lat);
        markerpopup.setPosition(evt.coordinate);
        showmarkerpopupinfo(undefined);
        //makeRequest("getPoiByLoc.php?lng="+lastlon+"&lat="+lastlat+"&lang="+lcode+"&mode=2","*popup*");
        lastname = "--";
        */
      }else{
        //hidemappop();
      }
      /*
      if(document.getElementById("sloc") && linecount==0 && markerpopup.getPosition()==undefined && hotspotpopup.getPosition()==undefined){
          maparepopup(evt.coordinate,lat,lon);
      }
      */
      maparepopup(evt.coordinate,lat,lon);
      /*
      if(markerpopup.getPosition()==undefined)
        maparepopup(evt.coordinate,lat,lon);
      markerpopup.setPosition(undefined);
      */
      //Show popup
  }


  map.on('pointermove', displayTooltip);
  map.on('moveend', onMoveEnd);

  map.panTo = function(ll) {
    mappanto(ll[0],ll[1]);
  }

  map.zoomTo = function(z){
    mapzoom(z);
  }

  map.zoomIn= function(){
    var z = map.getView().getZoom();
    if(z<18) mapzoom(z+1);
  }

  map.zoomOut = function(){
    var z = map.getView().getZoom();
    if(z>10) mapzoom(z-1);
  }

  map.getZoom = function(){
    return map.getView().getZoom();
  }

});

function redrawMarkerIcon()
{
//alert('in redrawMarkerIcon() ' + markercount);
	for(var i=markercount-1; i>=0; i--){
		redrawMarkerIconProcess(markers[i]);

	}

	if (stopNearbyMarkercount > 0)
	{
		for(var i=stopNearbyMarkercount-1; i>=0; i--){
			//alert(stopNearbyMarkers[i].get('name'));
			redrawMarkerIconProcess(stopNearbyMarkers[i]);
			//i = 0;

		}
	}
}

function redrawMarkerIconProcess(feature)
{
	var s = feature.get('name');
//alert(s);
	if(s.indexOf("[")>0){

		var infosCat = s.split("|*|");

		/* ???  */
		var infos = infosCat[3].split("||");
		//alert(infos[4]);

		offx = infos[7];
		offy = infos[8];

		if(infos[5]==15){
				ax=0.5;
				ay=0.5;
				amode='fraction';
		}
		ax = 4;
		ay = 40;
		amode = "pixels";

		var iconStyle = new ol.style.Style({
				image: new ol.style.Icon(({
						scale: 1,
						anchor: [ax,ay],
						anchorXUnits: amode,
						anchorYUnits: amode,
						opacity: 1,
						src: infos[4]
						}))
				});
		feature.setStyle(iconStyle);
	}
}



function hidemappop(){
  markerpopup.setPosition(undefined);
  hotspotpopup.setPosition(undefined);
  redrawMarkerIcon();
}

function onMoveEnd(evt){
  onMoveEndAction('');
}

function onMoveEndAction(fromQr)
{
  if(markerpopup.getPosition()!=undefined && fromQr!='') return;
  var coord = ol.proj.transform( map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
  var tlon = coord[0];
  var tlat = coord[1];
  if(CircleLayer.getVisible()){
    setcirclecenter(tlat,tlon);
    ajaxindex++;
    makeRequestref('getnearbyroute.php?lat='+tlat+'&lon='+tlon+'&l='+lang,'sysitembox',ajaxindex);
    setTimeout(function(){ makeRequestref('getnearbystop.php?lat='+tlat+'&lon='+tlon+'&l='+lang,'dummydiv',ajaxindex);}, 200);
  }
  loadptstop();

}



function calldummy(url){
    makeRequest(url,'dummydiv');
}

function hotspotclickpopup(feature){
  var info = feature.get('name');
  var aaa = info.split("{");
  if(aaa.length==1) return;
  var geometry = feature.getGeometry();
  var coord = geometry.getCoordinates();
  hotspotpopup.setPosition(coord);
  var bbb = aaa[1].split("}");
  var ccc = bbb[0].split("^");
  var id = ccc[0];
  var lat = parseFloat(ccc[1]);
  var lon = parseFloat(ccc[2]);
  makeRequest('gethotspotresult.php?id='+id+'&lat='+lat+'&lon='+lon+'&l='+lang,'hpopupcontent');
  var z = Math.floor(map.getView().getZoom());
  if(z>=10 && z<=18){
    var coord2 = ol.proj.transform([lon, lat-difflat[z]], 'EPSG:4326', 'EPSG:3857');
    mappantoxy(coord2);
  }
}

function nearbyclickpopup(feature){
//alert('in nearbyclickpopup');
  var info = feature.get('name');
  var aaa = info.split("|*|");
  if(aaa.length==1) return;
  var bbb = aaa[1].split("||");
  var altXY = aaa[2].split("||");
  var geometry = feature.getGeometry();
  var coord = geometry.getCoordinates();
  markerpopup.setPosition(coord);
  var nnn1 = bbb[0].split("[");
  var nnn2 = nnn1[1].split("]");
  makeRequest('getrouteinstop_nearby.php?id='+nnn2[0]+'&lat='+bbb[2]+'&lon='+bbb[3]+'&l='+lang+'&altLon='+altXY[0]+'&altLat='+altXY[1],'popupcontent');
  var coord2 = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
  var tlon = coord2[0];
  var tlat = coord2[1];
  var z = Math.floor(map.getView().getZoom());
  if(z>=10 && z<=18){
    var coord2 = ol.proj.transform([tlon+difflon[z], tlat-difflat[z]], 'EPSG:4326', 'EPSG:3857');
    mappantoxy(coord2);
  }
}


function markerclickpopup(feature){
  var info = feature.get('name');
  var aaa = info.split("{");
  if(aaa.length==1) return;
  var geometry = feature.getGeometry();
  var coord = geometry.getCoordinates();
  markerpopup.setPosition(coord);
  showmarkerpopupinfo(feature);
}


var lsetstart = 'Set as origin';
var lsetend = 'Set as destination';
var lnewbookmark = 'Add Bookmark';
var lclose = 'Close';




function maparepopup(coord,lat,lon){
  var element = popup.getElement();
  var coordinate = coord;
  var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
  $(element).popover('destroy');
  popupposition=coordinate;
  popup.setPosition(coordinate);
  mappantoxy(coordinate);
  var tlat = lat-alat;
  var tlon = lon-alon;
  makeRequest("get_rgeocode.php?lon="+tlon+"&lat="+tlat+"&l="+lcode+"","*popup*");
  var name=". . .";
  lastname = name;
  lastlat = tlat;
  lastlon = tlon;
  name = '<img src="icons/Loading_icon.gif" alt="Loading" title="loading" width="45" height="30">';
  var popupcontent = '<p><a onclick="closepopup();" class="mapsmallclose"><img src="r_close.png" alt="'+lclose+'" title="'+lclose+'" width="14" height="14"></a>'+
    '<div id="popupname" class="popupname">'+name+'</div></p>'+
    '<div class="setstartbut" onclick="setstartend(0);">'+lsetstart+'</div>'+
    '<div class="setendbut" onclick="setstartend(1);">'+lsetend+'</div>'+
    '<div class="addbookmark" onclick="addbookmark(lastlat,lastlon, lastname);">'+lnewbookmark+'<div>';
  $(element).popover({
    'placement': 'top',
    'animation': false,
    'html': true,
    'content': popupcontent
  });
  $(element).popover('show');
}

function screensize(mode){
  if (self.innerHeight){
          x = self.innerWidth;
          y = self.innerHeight;
  }else if (document.documentElement && document.documentElement.clientHeight){
          x = document.documentElement.clientWidth;
          y = document.documentElement.clientHeight;
  }else if (document.body){
          x = document.body.clientWidth;
          y = document.body.clientHeight;
  }
  if(mode=="W")
    return x;
  else
    return x;
}

function goresize(){
  var x = screensize("W");
  var adjust=0;
  var logobar = document.getElementById('fb_logo');
  var dmap = document.getElementById('map');
  if(x<768){
    adjust=44;
    dmap.style.marginLeft="0px";
    logobar.align="left";
  }else{
    dmap.style.marginLeft="380px";
    logobar.align="center";
    showleftpanel();
  }
  adjust+=0;
  var dmenu1box = document.getElementById('menu1box');
  if(dmenu1box){
    dmenu1box.style.height="calc(100% - "+(255-adjust)+"px)";
  }
  var dgocatbox = document.getElementById('gocatbox');
  if(dgocatbox){
    dgocatbox.style.height="calc(100% - "+(113-adjust)+"px)";
  }
  var dgocatitembox = document.getElementById('gocatitembox');
  if(dgocatitembox){
    dgocatitembox.style.height="calc(100% - "+(113-adjust)+"px)";
  }
  var dstoplistbox = document.getElementById('stoplistbox');
  if(dstoplistbox){
    dstoplistbox.style.height="calc(100% - "+(85-adjust)+"px)";
  }
  var dfullbox = document.getElementById('fullbox');
  if(dfullbox){
    dfullbox.style.height="calc(100% - "+(43-adjust)+"px)";
  }
  var dferrylist = document.getElementById('ferrylistbox');
  if(dferrylist){
    dferrylist.style.height="calc(100% - "+(288-adjust)+"px)";
  }
  var dtranlistbox = document.getElementById('tranlistbox');
  if(dtranlistbox){
    dtranlistbox.style.height="calc(100% - "+(175-adjust)+"px)";
  }
  var dppresultlist = document.getElementById('ppresultlist');
  if(dppresultlist){
    dppresultlist.style.height="calc(100% - "+(115-adjust)+"px)";
  }
  var dnearbylist = document.getElementById('nearbylist');
  if(dnearbylist){
    dnearbylist.style.height="calc(100% - "+(133-adjust)+"px)";
  }

  var droutelist2 = document.getElementById('routelist2');
  if(droutelist2){
    droutelist2.style.height="calc(100% - "+(133-adjust)+"px)";
  }

  goresizex();
}

function ppbookmark(no){

}

var lpath = 'Routes Observed';
var laddbm = 'Bookmark';
var lstreetview = 'Street View';
var lmin = 'Mins';

function showmarkerpopupinfo(feature){
  var obj = document.getElementById('popupcontent');
  if(obj){
    if(feature!=undefined){
      var data = feature.get('name');
      var aaa = data.split("{");
      if(aaa.length==2){
        var bbb = aaa[1].split("}");
        var ccc = bbb[0].split("^");
        stopclick1(ccc[0],ccc[1],ccc[2],ccc[3],ccc[4],ccc[5],ccc[6],ccc[7],ccc[8]);
      }
    }
  }
}

function elastic(t) {
  return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
}

function closepopup(){
  popup.setPosition(undefined);
}

function gosetstartend(mode,name,lat,lon){
  if(mode<0){
    if(startname==""){
      mode=0;
    }else{
      mode=1;
    }
  }
  lastname = name;
  //lastlat = parseFloat(lat)-(2*alat);
  //lastlon = parseFloat(lon)-(2*alon);
  lastlat = parseFloat(lat)-(alat);
  lastlon = parseFloat(lon)-(alon);
  setstartend(mode,name,lastlat,lastlon);
  //panto(lastlon,lastlat);
}


function setstartend(mode,name,lat,lon){
  if(mode==0){
    startname = lastname;
    startlat = lastlat;
    startlon = lastlon;
  }else{
    endname = lastname;
    endlat = lastlat;
    endlon = lastlon;
  }
  gomenu(2,1);
  closepopup();
  //addhistory("LOCATIONHISTORY",lastname+'~'+lastlat+'~'+lastlon);
}

function setstart(){
  setstartend(0,lastname,lastlat,lastlon);
  hidepopup();
  panto(lastlon,lastlat);
}

function setend(){
  setstartend(1,lastname,lastlat,lastlon);
  hidepopup();
  panto(lastlon,lastlat);
}


function disabledEventPropagation(event)
{
   if (event.stopPropagation){
       event.stopPropagation();
   }
   else if(window.event){
      window.event.cancelBubble=true;
   }
}

function clearmarkers(){
  clearmaproute();
}

function clearmaproute(){
  clearwalkline();
  clearallstop();
  clearallmarker();
  //showstartendmarker();
  showstartendpoints();
}

function clearallstop(){
  stopSource.clear();
}

function trafficmarker(code,lat,lng,name,extra){
  var info = name+"||"+code+"||"+lat+"||"+lng+"||"+extra;
  var traffic = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform([lng+alon,lat+alat],'EPSG:4326', 'EPSG:3857')),
      name: info
  });
  var png = 'icons/cctvdot.png';
  var xoff=0.5;
  var yoff=1;
  if(code=='C'){
    png = 'icons/cctvdot.png';
    yoff=0.5;
    xoff=0.5
  }
  if(code=='J'){
    png = 'icons/jtime.png';
    yoff=1.0;
    xoff=0.24
  }
  if(code=='S'){
    png = 'icons/smpanel.png';
    yoff=1.0;
    xoff=0.24
  }
  if(code=='b'){
    png = 'icons/m_bus.png';
  }
  if(code=='t'){
    png = 'icons/m_tram.png';
  }
  if(code=='p'){
    png = 'icons/m_ptram.png';
  }
  if(code=='a'){
    png = 'icons/m_taxi.png';
  }
  if(code=='f'){
    png = 'icons/m_ferry.png';
  }
  if(code=='m'){
    png = 'icons/m_mtr.png';
  }
  if(code=='l'){
    png = 'icons/m_lrt.png';
  }
  if(code=='g'){
    png = 'icons/m_gvan.png';
  }
  if(code=='r'){
    png = 'icons/m_rvan.png';
  }
  var iconStyle = new ol.style.Style({
      image: new ol.style.Icon(({
          scale: 0.5,
          anchor: [xoff,yoff],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 0.8,
          src: png
      }))
  });
  traffic.setStyle(iconStyle);
  if(code=='C' || code=='S' || code=='J'){
    trafficSource.addFeature(traffic);
  }else{
    ptSource.addFeature(traffic);
  }
}

function stopmarker(leg,lat,lng,name){
  var info = name+"||"+leg+"||"+lat+"||"+lng;
  var stop = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform([lng+alon,lat+alat],'EPSG:4326', 'EPSG:3857')),
      name: info
  });
  var png = 'icons/gdot.png';
  if(leg==1) png = 'icons/rdot.png';
  if(leg==2) png = 'icons/bdot.png';
  var iconStyle = new ol.style.Style({
      image: new ol.style.Icon(({
          scale: 0.5,
          anchor: [0.5,0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 0.8,
          src: png
      }))
  });
  stop.setStyle(iconStyle);
  stopSource.addFeature(stop);
}

function clearallmarker(){
  for(var i=0; i<1000; i++){
    markers[i]=null;
    markercodes[i]='';
    markerlat[i]=0.0;
  }
  markercount=0;
}

var mstart = 'Start';
var mend = 'End';
var mupcar = 'On';
var mdowncar = 'Off';
var mupboat = 'On';
var mdownboat = 'Off';
var mchange = 'CH';

function etmarker(code,lat,lng,name){
  if(true) return;
  var increment = 1;
  var lastpoint = -1;
  var info = name+"||"+(code=="S"?"O":code)+"||"+lat+"||"+lng;

  if(code=="S" || code=="E"){
    for(i=0;i<markercount;i++){
      if(markercodes[i]==code){
        lastpoint=i;
        increment=0;
      }
    }
  }
  if(lastpoint==-1) lastpoint=markercount;
  markercodes[lastpoint] = code;
  markerlat[lastpoint] = lat;
  markers[lastpoint] = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform([lng+alon,lat+alat],'EPSG:4326', 'EPSG:3857')),
      name: info
  });

  var iconStyle;
  var xoff = 0.5;
  var png = 'icons/et_start_'+syslang+'.png';
  if(code=="S" ){ png = 'drawmarker.php?i=S&s='+mstart; }
  if(code=="E" ){ png = 'drawmarker.php?i=E&s='+mend; }
  if(code=="RU" ){ png = 'drawmarker.php?i=R&s='+mupcar; xoff = 0.81;}
  if(code=="RD" ){ png = 'drawmarker.php?i=R&s='+mdowncar; xoff = 0.81;}
  if(code=="LU" ){ png = 'drawmarker.php?i=L&s='+mupcar; xoff = 0.19;}
  if(code=="LD" ){ png = 'drawmarker.php?i=L&s='+mdowncar; xoff = 0.19;}
  if(code=="RX" ){ png = 'drawmarker.php?i=R&s='+mchange; xoff = 0.81;}
  if(code=="LX" ){ png = 'drawmarker.php?i=L&s='+mchange; xoff = 0.19;}
  if(code=="RXB" ){ png = 'drawmarker.php?i=R&s='+mchange; xoff = 0.81;}
  if(code=="LXB" ){ png = 'drawmarker.php?i=L&s='+mchange; xoff = 0.19;}
  if(code=="RUB" ){ png = 'drawmarker.php?i=R&s='+mupboat; xoff = 0.81;}
  if(code=="RDB" ){ png = 'drawmarker.php?i=R&s='+mdownboat; xoff = 0.81;}
  if(code=="LDB" ){ png = 'drawmarker.php?i=L&s='+mupboat; xoff = 0.19;}
  if(code=="LDB" ){ png = 'drawmarker.php?i=L&s='+mdownboat; xoff = 0.19;}
  var iconStyle = new ol.style.Style({
      image: new ol.style.Icon(({
          scale: 0.5,
          anchor: [xoff,90],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.8,
          src: png
      }))
  });
  markers[lastpoint].setStyle(iconStyle);
  markercount+=increment;
}

function showmarker(){
  var tempindex = new Array(markercount);
  for(var i=0; i<markercount; i++) tempindex[i]=i;

  var needsort = 1;
  while(needsort){
    needsort = 0;
    for(var i=0; i<markercount-1; i++){
      if(markerlat[tempindex[i]]>markerlat[tempindex[i+1]]){
        var t = tempindex[i+1];
        tempindex[i+1] = tempindex[i];
        tempindex[i] = t;
        needsort = 1;
      }
    }
  }

  stopSource.clear;
  vectorSource.clear();
  for(var i=0; i<markercount; i++){
    if(markercodes[tempindex[i]]=="P")
      stopSource.addFeature(markers[tempindex[i]]);
    else
      vectorSource.addFeature(markers[tempindex[i]]);
  }
}

function showcircle(dist){
  sys_nearby_radius=dist*1.1;
  setcirclecenter(lastlat,lastlon);
}

function setcirclecenter(lat,lng){
  lastlat=lat;
  lastlon=lng;
  var ll = new ol.geom.Circle(ol.proj.transform([lng,lat], 'EPSG:4326', 'EPSG:3857'), sys_nearby_radius);
  var lc = new ol.geom.Point(ol.proj.transform([lng,lat],'EPSG:4326', 'EPSG:3857'));
  CircleFeature.set('geometry', ll);
  CircleFeatureC.set('geometry', lc);
}


function addline(url){
  linecount=0;
  lineSource.clear();
  addlinecolor(url,0);
  linecount++;
}

function appendline(url){
  if(linecount==1)
    addlinecolor(url,1);
  else
    addlinecolor(url,2);
  linecount++;
}

function addlinecolor(url,col){
  var s=callweb(url);

  var lineStyle = [];
  for(var i=0; i<3; i++){
    if(i==0) color='rgba(0,128,0,0.6)';
    if(i==1) color='rgba(255,0,0,0.6)';
    if(i==2) color='rgba(0,0,255,0.6)';
    lineStyle[i] = new ol.style.Style({
      stroke: new ol.style.Stroke(({
        color: color,
        width: 4
      }))
    });
  }

    var pointsgreen = [];
    var pointsred = [];
    var pointsblue = [];

  var linepoint = s.split("\n");
  var segment = [];
  for(var i=0; i<linepoint.length; i++){
    if(linepoint[i].length>5){
      var aaa = linepoint[i].split(",");
      var lon = parseFloat(aaa[2]);
      var lat = parseFloat(aaa[1]);
      segment.push(ol.proj.transform( [lon, lat], 'EPSG:4326', 'EPSG:3857'));
    }
  }
  if(col==0)
    pointsred.push(segment);
  else if(col==1)
    pointsgreen.push(segment);
  else if(col==2)
    pointsblue.push(segment);

  var greenline = new ol.Feature({
      geometry: new ol.geom.MultiLineString(pointsgreen),
      name: "Line"
  });
  greenline.setStyle(lineStyle[0]);
  var redline = new ol.Feature({
      geometry: new ol.geom.MultiLineString(pointsred),
      name: "Line"
  });
  redline.setStyle(lineStyle[1]);
  var blueline = new ol.Feature({
      geometry: new ol.geom.MultiLineString(pointsblue),
      name: "Line"
  });
  blueline.setStyle(lineStyle[2]);

  lineSource.addFeature(greenline);
  lineSource.addFeature(redline);
  lineSource.addFeature(blueline);
}

function showhidemenu(){
  var left = $('#sidebar').offset().left;
  if(left>-100)
    $("#sidebar").css({left:left}).animate({"left":"-340px"}, "fast");
  else
    $("#sidebar").css({left:left}).animate({"left":"0px"}, "fast");
}

function checkshowlayer(){
  var obj = document.getElementById('tranlayer');
  if(obj && (obj.style.display=="" || obj.style.display=="none")){
    obj.style.right="-300px";
    obj.style.display="block";
  }
}

function checkhidelayer(){
  var obj = document.getElementById('tranlayer');
  if(obj){
    obj.style.right="0px";
    obj.style.display="none";
  }
}

function showhidelayer(){
  checkshowlayer();
  var right = parseInt($('#tranlayer').css('right'));
  if(right==0){
    $("#tranlayer").css({right:right}).animate({"right":"-300px"}, "fast");
    setTimeout("checkhidelayer();",500);
  }else{
    makeRequest('layer.php','tranlayer')
    $("#tranlayer").css({right:right}).animate({"right":"0px"}, "fast");
  }
}

function showhidelegend(){
  checkshowlayer();
  var right = parseInt($('#tranlayer').css('right'));
  debug(right);
  if(right==0){
    $("#tranlayer").css({right:right}).animate({"right":"-300px"}, "fast");
    setTimeout("checkhidelayer();",500);
  }else{
    makeRequest('legend.php','tranlayer')
    $("#tranlayer").css({right:right}).animate({"right":"0px"}, "fast");
  }
}

function smenu(mno){
  showhidemenu();
}

function infoboxloadaction(){
  hideppoption();
}

/*
function makeRequest(urlx,id) {
  if(id=="infobox"){
    infoboxloadaction();
  }
  sn++;
  var url="";
  if(urlx.indexOf("?")>0)
    url=urlx+'&sysid='+sn;
  else
    url=urlx+'?sysid='+sn;
  var http_request = false;
  var ts1 = "";
  var ts2 = "";
  var p=0;
  if (window.XMLHttpRequest) { // Mozilla, Safari,...
    http_request = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE
    try {
      http_request = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
            http_request = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {}
    }
  }

  if (!http_request) {
    alert('Giving up :( Cannot create an XMLHTTP instance');
    return false;
  }
  http_request.onreadystatechange = function() {
  alertContents(http_request,id); };
  http_request.open('GET', url, true);
  http_request.send(null);
}

function alertContents(http_request,id) {
  if (http_request.readyState == 4) {
    if (http_request.status == 200) {
      var mesg = http_request.responseText;
      if(id=="*popup*"){
        popup_request(mesg);
      }else if(id=="*jscode*"){
        eval(mesg);
      }else if(id=="v_ustatus"){
        v_ustatus=mesg;
      }else{
        if(id.substring(0,4)=='txt_'){
          document.getElementById(id).value=mesg;
        }else{
          var checkcnt=0;
          while(document.getElementById(id) && checkcnt<5){
            setTimeout('',500);
            checkcnt=checkcnt+1;
          }
          document.getElementById(id).innerHTML=mesg;
          if(id=="infobox") goresize();
          if(id=="autocom" || id=="autocom2"){
            if(mesg.length<10){
              document.getElementById(id).style.display ="none";
            }
          }
        }
        window.scrollTo(0,0);
      }
    }else{
      errorcnt++;
    }
  }
}
*/

var unknownname = 'Unknown Location';

function popup_request(s){
  var aaa = s.split("||");
  var name = aaa[0];
  if(name==undefined) name = unknownname;
  lastname = name;
  document.getElementById("popupname").innerHTML = name;
}

function showinfobox(url){
  makeRequest(url,"infobox");
}

function showmenu(no){
  if(sys_nearby==1) togglenearby();
  showleftpanel();
  showinfobox("menu"+no+".php");
}

function callweb(weburl){
  var url = weburl;
  var result = "";
  $.ajax({
      url: url,
      type: 'GET',
      async: false,
      cache: false,
      timeout: 30000,
      error: function(){
        debug("Error to connect server!");
      },
      success: function(msg){
        result = msg;
      }
  });
  return result;
}

function debug(s){
  var obj=document.getElementById("debug");
  if(obj) obj.innerHTML=s;
}

function swapppinfo(){
  lastname="";
  lastlat=0.0;
  lastlon=0.0;
  var tstr = startname;
  startname = endname
  endname = tstr;
  var tlat = startlat;
  var tlon = startlon;
  startlat = endlat;
  startlon = endlon;
  endlat = tlat;
  endlon = tlon;
  showppinfo();
}

function clearppinfo(){
  startname="";
  endname="";
  startlat=startlon=0.0;
  endlat=endlon=0.0;
  document.getElementById("fstartpo").value = "";
  document.getElementById("fendpo").value = "";
  vectorSource.clear();
}

var lstartpo = 'Start';
var lendpo = 'End';

function showppinfo(){
  var lcnt=0;
  if(startname!=""){
    document.getElementById("fstartpo").value = startname;
    etmarker("S",startlat,startlon,lstartpo+": "+startname);
    lcnt++;
  }
  if(endname!=""){
    document.getElementById("fendpo").value = endname;
    etmarker("E",endlat,endlon,lendpo+": "+endname);
    lcnt++;
  }
  if(lcnt==2){
    //clearwalkline();
    //drawwalkline(startlat,startlon,endlat,endlon);
  }
  showmarker();
}

function showstartendmarker(){
  etmarker("S",startlat,startlon,lstartpo+": "+startname);
  etmarker("E",endlat,endlon,lendpo+": "+endname);
  showmarker();
}

var timeint;
var newpoint = new Array(2);
var newzoom=0;

function goanimate(zoom,point){
  newzoom = zoom;
  newpoint = point;
  timeint =  setInterval(function(){ mapTimer() }, 100);
}

function mapTimer(){
  var z = map.getView().getZoom();
  var p = map.getView().getCenter();
  var zdiff=1;
  var pdiff=1;
  if(newzoom==undefined || Math.abs(z-newzoom)<0.1){
    view.setZoom(newzoom);
    z=newzoom;
    zdiff=0;
  }
  if(Math.abs(p[0]-newpoint[0])<3 &&  Math.abs(p[1]-newpoint[1])<3){
    view.setCenter(newpoint);
    p=newpoint;
    pdiff=0;
  }
  console.log(p[0]+" "+newpoint[0]+" "+Math.abs(p[0]-newpoint[0])+" "+Math.abs(p[1]-newpoint[1])+" : "+z+" "+newzoom);
  if(zdiff==0 && pdiff==0){
    clearInterval(timeint);
  }else{
    var tempp = new Array(2);
    var tempz = (z+newzoom)/2;
    tempp[0] = (p[0]+newpoint[0])/2;
    tempp[1] = (p[1]+newpoint[1])/2;
    view.setCenter(tempp);
    view.setZoom(tempz);
  }
}

function mappanto(lon,lat){
  if(lon>0 && lat>0){
    var tpoint = ol.proj.fromLonLat([lon+alon, lat+alat]);
    var z = map.getView().getZoom();
    //goanimate(z,tpoint);
    //view.setCenter(tpoint);
    //view.animate({ center: tpoint, duration: 500});
    gopanTo(tpoint);
  }
}

function mappantoxy(tpoint){
  //view.setCenter(tpoint);
  //var z = map.getView().getZoom();
  //goanimate(z,tpoint);
  //view.animate({ center: tpoint, duration: 500});
  gopanTo(tpoint);
}


function mapzoom(z){
  gozoom(z);
  //var tpoint = map.getView().getCenter();
  //goanimate(z,tpoint);
  //view.setZoom(z);
  //view.animate({ zoom: z, duration: 500});
}


function gozoom(zoom_level) {
  if(acode==1){
    var zoom = ol.animation.zoom({
      resolution: view.getResolution(),
      duration: 300
    });

    map.beforeRender(zoom);
  }
  view.setZoom(zoom_level);
}

function gopanTo(location){
  if(acode==1){
    var pan = ol.animation.pan({
      source: map.getView().getCenter(),
      duration: 300
    });
    map.beforeRender(pan);
  }
  view.setCenter(location);
}


function keysearch(mode){
  showinfobox("keysearch.php?m="+mode);
}

function goback(){
  showmenu(1);
}



function gofocus(dname){
  var obj = document.getElementById(dname);
  if(obj) obj.focus();
}

function timestr(expires_seconds){
  var d = new Date();
  d = new Date(d.getTime() + 1000 * expires_seconds);
  //return d.toGMTString();
  return  moment().format("YYYY-MM-DD HH:mm:ss");
}

function showlocation(dname){
  var hdata='<table class="table tablefont" style="margin-bottom:0px;">';
  var oldlist = getCookie("LOCATIONHISTORY");
  var aaa = oldlist.split("||");
  for(var i=0; i<aaa.length; i++){
    if(aaa[i]!=''){
      var bbb = aaa[i].split("~");
      //var lat = parseFloat(bbb[1])+(2*alat);
      //var lon = parseFloat(bbb[2])+(2*alon);
      var lat = parseFloat(bbb[1]);
      var lon = parseFloat(bbb[2]);
      hdata+='<tr class="tablerow" onclick="promptstartend(\''+bbb[0]+'\','+lat+','+lon+')">';
      hdata+='<th scope="row" class="tablecell" style="width:30px"><img src="icons/g.php?p=g_w_loc4.png" width="28" height="30"></th><td class="tablecell">'+bbb[0]+'</td>';
      hdata+=speechbut("H"+i,bbb[0])+'</tr>';
    }
  }
  hdata+='  </table>';
  hdata+='<div  style="background-color:#E0E0E0; height:1px;"></div>';
  var obj = document.getElementById(dname);
  if(obj) obj.innerHTML=hdata;
}

function showhistory(mode,dname){
  var hdata='<table class="table tablefont" style="margin-bottom:0px;">';
  var oldlist = getCookie("SEARCH_A");
  var aaa = oldlist.split("||");
  for(var i=0; i<aaa.length; i++){
    if(aaa[i]!=''){
      var k = '*'+aaa[i];
      hdata+='<tr class="tablerow" onclick="gokeysearch(\''+mode+'\',\''+k+'\');">';
      hdata+='<th scope="row" class="tablecell" style="width:30px"><img src="icons/g.php?p=g_w_loc4.png" width="28" height="30"></th><td class="tablecell">'+aaa[i]+'</td></tr>';
    }
  }
  hdata+='  </table>';
  hdata+='<div  style="background-color:#E0E0E0; height:1px;"></div>';
  var obj = document.getElementById(dname);
  if(obj) obj.innerHTML=hdata;
}

function gokeysearch(mode,dname){
  ppresult = document.getElementById("infobox").innerHTML;
  if(dname.length>0 && dname.substring(0,1)=="*"){
    showinfobox("gosearch.php?m="+mode+"&k="+dname.substring(1));
  }else{
    var obj = document.getElementById(dname);
    if(obj.value=="") return;
    addhistory("SEARCH_A",obj.value);
    showinfobox("gosearch.php?m="+mode+"&k="+obj.value);
  }
}

function addhistory(code,kword){
  addrecord(code,kword,10);
}

function addrecord(code,kword,limit){
  var oldlist = getCookie(code);
  var aaa = oldlist.split("||");
  var newlist = kword+"||";
  var cnt=0;
  var ss1 = kword.split("~");
  for(var i=0; i<aaa.length; i++){
    if(aaa[i]!=""){
      var ss2 = aaa[i].split("~");
      if(ss1[0]!=ss2[0]){
        newlist += aaa[i]+"||";
        cnt++;
        if(cnt>limit) break;
      }
    }
  }
  setCookie(code,newlist,1000000000);
}

function setCookie(variable, value, expires_seconds) {
    document.cookie = variable + '=' + value + '; expires=' + timestr(expires_seconds) + ';';
    callweb("setcookie.php?c="+variable+"&v="+encodeURI(value));
}

function getCookie(cname) {
  return callweb("getcookie.php?c="+cname);
}

function deleterecord(code,kword){
  var oldlist = getCookie(code);
  var aaa = oldlist.split("||");
  var newlist = "";
  var cnt=0;
  var ss1 = kword.split("~");
  for(var i=0; i<aaa.length; i++){
    if(aaa[i]!=""){
      var ss2 = aaa[i].split("~");
      if(ss1[0]!=ss2[0]){
        newlist += aaa[i]+"||";
        cnt++;
      }
    }
  }
  setCookie(code,newlist,1000000000);
}

var lsearching = 'Searching';

function showloading(){
  document.getElementById("infobox").innerHTML = '<div class="visible-sm-block visible-md-block visible-lg-block topspacer">&nbsp;</div><div class="loadingbox"><br><br><br>'+lsearching+'<br><img src="icons/searching.gif" width="220" height="145"></div>';
}

function goppsearch(){
  if(startname!="" && endname!=""){
    showloading();
    showinfobox("goppsearch.php?slat="+startlat+"&slon="+startlon+"&elat="+endlat+"&elon="+endlon+"&sname="+startname+"&ename="+endname);
  }
}

function backtoppresult(){
  document.getElementById("infobox").innerHTML = ppresult;
}

function goppresult(i,m){
  if(m=='S'){
    ppresult = document.getElementById("infobox").innerHTML;
    showloading();
  }
  showinfobox("goppresult.php?i="+i+"&m="+m);
}

function showstartendname(sdiv,ediv){
  document.getElementById(sdiv).innerHTML=startname;
  document.getElementById(ediv).innerHTML=endname;
}

function pantostartend(code){
  if(code=="S")
    panto(startlon,startlat);
  else
    panto(endlon,endlat);
}

function setcolor(c){
  callweb("setcolor.php?c="+c);
  document.location.href = "index.php";
}

var startlab='Start';
var endlab='End';
var laddbookmark='Add Bookmark';
var markmarkname='Bookmark Name';
var selectas='Select this location as';
var select='Please Select';
var lsave='Save';
var ldelete='';
var lkmb='KMB';
var lnwst='NWFB/CityBus';

function setpopupcontent(mode){
  var c1='<table align="center"><tr>'+
          '<td width="30%"><button type="submit" class="btn btn-default buttoncolorc" style="width:130px; height:38px; font-size:12pt;" onclick="setstart();">'+startlab+'</button></td>'+
          '<td width="30%"><button type="submit" class="btn btn-default buttoncolorc" style="width:130px; height:38px; font-size:12pt;" onclick="setend();">'+endlab+'</button></td>'+
          '<td width="30%"><button type="submit" class="btn btn-default buttoncolorc" style="width:130px; height:38px; font-size:12pt;" onclick="setbookmark();">'+laddbookmark+'</button></td>'+
          '</tr></table>';
  var c2='<table align="center"><tr>'+
          '<td width="50%"><input id="fbookmark" type="text" class="form-control inputbox" placeholder="'+markmarkname+'"></td>'+
          '<td width="10%">&nbsp;</td>'+
          '<td width="30%"><button type="submit" class="btn btn-default buttoncolorc" style="width:130px; height:38px; font-size:12pt;" onclick="savebookmark();">'+lsave+'</button></td>'+
          '</tr></table>';
  var c3='<table align="center"><tr>'+
          '<td width="40%"><button type="submit" class="btn btn-default buttoncolorc" style="width:130px; height:38px; font-size:12pt;" onclick="setstart();">'+startlab+'</button></td>'+
          '<td width="40%"><button type="submit" class="btn btn-default buttoncolorc" style="width:130px; height:38px; font-size:12pt;" onclick="setend();">'+endlab+'</button></td>'+
          '</tr></table>';
  var c4='<table align="center"><tr>'+
          '<td width="40%"><button type="submit" class="btn btn-default buttoncolorc" style="width:130px; height:38px; font-size:12pt;" onclick="showlink(0);">'+lkmb+'</button></td>'+
          '<td width="40%"><button type="submit" class="btn btn-default buttoncolorc" style="width:130px; height:38px; font-size:12pt;" onclick="showlink(1);">'+lnwst+'</button></td>'+
          '</tr></table>';
  var c5='<table align="center" cellpadding="5"><tr>'+
          '<td width="90%" colspan="3"><input id="fbookmark" type="text" class="form-control inputbox" placeholder="'+markmarkname+'"></td></tr>'+
          '<tr height="5px"><tdcolspan="3"></td></tr>'+
          '<td width="40%" align="left"><button type="submit" class="btn btn-default buttoncolorc" style="width:130px; height:38px; font-size:12pt; background-color:#FF4040;" onclick="deletebookmark();">'+ldelete+'</button></td>'+
          '<td width="40%" align="right"><button type="submit" class="btn btn-default buttoncolorc" style="width:130px; height:38px; font-size:12pt;" onclick="updatebookmark();">'+lsave+'</button></td>'+
          '</tr></table>';
  if(mode==2){
    setpopupcontentstr(laddbookmark+" :",c2);
    document.getElementById("fbookmark").value=lastname;
  }else if(mode==3){
    setpopupcontentstr(selectas+" :",c3);
  }else if(mode==4){
    setpopupcontentstr(select+" :",c4);
  }else if(mode==5){
    setpopupcontentstr(markmarkname+" :",c5);
    document.getElementById("fbookmark").value=lastname;
  }else{
    setpopupcontentstr(selectas+" :",c1);
  }
}

function tdalert(title,content){
  setpopupcontentstr(title,content);
  showpopup();
}

function setpopupcontentstr(title,content){
    document.getElementById("popupcontent").innerHTML=content;
    document.getElementById("popuptitle").innerHTML=title;
}

function newbookmark(tname,tlat,tlon){
  var aaa = tname.split(": ");
  if(aaa.length>0) tname=aaa[1];
  bookmarkmode=0;
  bmlat=tlat;
  bmlon=tlon;
  lastname=tname;
  setpopupcontent(2);
  showpopup();
}

function savebookmark(){
  var bmname = document.getElementById("fbookmark").value;
  if(bmname=="") return;
  if(bookmarkmode==0){
    savebookmarkwithinfo(bmname,bmlat,bmlon);
  }else if(bookmarkmode==1){
    calldummy("routebookmark.php?no="+bookmarkno+"&name="+encodeURI(bmname));
    hidepopup();
  }else if(bookmarkmode==2){
    calldummy("ppbookmark.php?no="+bookmarkno+"&name="+encodeURI(bmname));
    hidepopup();
  }
}

function savebookmarkwithinfo(tname,tlat,tlon){
  var newbm = tname+"~"+tlat+"~"+tlon+"~"+timestr(0);
  addrecord("BOOKMARK",newbm,500);
  hidepopup();
  deleterecord("LOCATIONHISTORY",newbm);
  showmenu(1)
}



function hideoverlay(){
  $('#fulloverlay').modal('hide');
}

function hideoverlay_p2p_result_detailed_list(){
  $('#fulloverlay_p2p_result_detailed_list').modal('hide');
}

function showpopup(){
  $('#tddailog').modal('show');
}


function hidepopup(){
  $('#tddailog').modal('hide');
}

function promptstartend_bm(name,lat,lon){
  lastname=name;
  lastlat=lat;
  lastlon=lon;
  setpopupcontent(3);
  showpopup();
}

function promptstartend(name,lat,lon){
  lastname=name;
  lastlat=lat;
  lastlon=lon;
  bmlat=lat;
  bmlon=lon;
  setpopupcontent(1);
  showpopup();
}

function setbookmark(){
  bookmarkmode=0;
  setpopupcontent(2);
  showpopup();
}

function speechbut($code,$text){
  if(sys_audio==0)
    return  '<td width="30"><div class="buttonbox" onclick="showaudiobardirect(\''+$text+'\',event);"><img src="icons/b_w_speech.png" width="26" height="26" style="margin-top:5px;margin-left:3px;"></div></td>';
  else
    return  '<td width="5"></td>';
}

function showbookmark(dname){
  var hdata='<table class="table tablefont" style="margin-bottom:0px;">';
  var oldlist = getCookie("BOOKMARK");
  var aaa = oldlist.split("||");
  for(var i=0; i<aaa.length; i++){
    if(aaa[i]!=''){
      var bbb = aaa[i].split("~");
      //var lat = parseFloat(bbb[1])+(2*alat);
      //var lon = parseFloat(bbb[2])+(2*alon);
      var lat = parseFloat(bbb[1]);
      var lon = parseFloat(bbb[2]);
      hdata+='<tr class="tablerow" onclick="promptstartend_bm(\''+bbb[0]+'\','+lat+','+lon+')">';
      hdata+='<th scope="row" style="width:30px" class="tablecell"><img src="icons/g.php?p=g_w_loc3.png" width="28" height="30"></th><td class="tablecell">'+bbb[0]+'</td>';
      hdata+=speechbut("H"+i,bbb[0])+'</tr>';
    }
  }
  hdata+='  </table>';
  hdata+='<div  style="background-color:#E0E0E0; height:1px;"></div>';
  var obj = document.getElementById(dname);
  if(obj) obj.innerHTML=hdata;
}

function streetview(lat,lon){
var url = 'http://maps.google.com/maps?q=&layer=c&cbll='+lat+','+lon;

        // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var w = width * 0.6;
    var h = height * 0.7;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;

    var newWindow = window.open(url, '_blank', 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
        //window.open(url, '_blank', 'width=400,height=400');


  /*$('#fulloverlay').modal('show');
  $('#fulloverlay_title').html('Street View');
  googlemap_initialize(lat,lon);
  //showoverlay('街景','http://app1.hketransport.td.gov.hk/et/streetview_iphone.php?lat='+lat+'&lon='+lon+'&lang=TC&p=iphone');
        */
}

function showfulloverlay(title, content){
  $('#fulloverlay').modal('show');
  $('#fulloverlay_title').html(title);
  var d = content.split("---").join('"');
  d = d.split("===").join('<br>');

  $('#streetLayer').html(d);

  //document.getElementById('streetLayer').innerHtml = content;
}

function showfulloverlay_p2p_result_detailed_list(content){
  $('#fulloverlay_p2p_result_detailed_list').modal('show');
  var d = content.split("---").join('"');
  d = d.split("===").join('<br>');

  $('#fulloverlay_p2p_result_detailed_list_content').html(d);

  //document.getElementById('streetLayer').innerHtml = content;
}




function showoverlay(title,url){
  return;
  //document.getElementById("overlayframe").innerHTML="";
  //document.getElementById("overlaytitle").innerHTML=title;
  //document.getElementById("overlayframe").src=url;
  //$('#fulloverlay').modal('show');
}

function showweb(link){
    window.open(link,'_blank');
}


function showlink(b){
  if(b==0)
    window.open(kmblink,'_blank');
  else
    window.open(nwfblink,'_blank');
  hidepopup();
}

function showheadway(i){
  url=callweb("getheadway.php?i="+i);
  var aaa = url.split("|");
  debug(url);
  if(aaa.length>1){
    kmblink=aaa[0];
    nwfblink=aaa[1];
    setpopupcontent(4);
    showpopup();
  }else{
    window.open(url,'_blank');
  }
}

function showppcctv(){
  ppresult3 = document.getElementById("infobox").innerHTML;
  showinfobox("ppcctv.php");
}

function backtoppresult3(){
  document.getElementById("infobox").innerHTML = ppresult3;
}

function backtoppresult2(){
  document.getElementById("infobox").innerHTML = ppresult2;
}


function googlemap_initialize(lat, lon) {
  var latlng = new google.maps.LatLng(lat, lon);

  var objRequest = {
    travelMode: google.maps.TravelMode.DRIVING,
    origin: latlng,
    destination: latlng,
    unitSystem: google.maps.UnitSystem.METRIC
  };
  var objDS = new google.maps.DirectionsService();
  objDS.route(objRequest, function (objResult, intStatus) {
    if (intStatus == google.maps.DirectionsStatus.OK) {
      if (google.maps.geometry.spherical.computeDistanceBetween(latlng, objResult.routes[0].legs[0].steps[0].path[0]) <= 100){
        gsm_core(objResult.routes[0].legs[0].steps[0].path[0], latlng);
      }else{
        gsm_core(latlng, latlng);
      }
    }
  });
}

function gsm_core(latlng, targetPovLatlon) {
  var streetViewService = new google.maps.StreetViewService();
  var STREETVIEW_MAX_DISTANCE = 100;
  streetViewService.getPanoramaByLocation(latlng, STREETVIEW_MAX_DISTANCE, function (streetViewPanoramaData, status) {
    if (status === google.maps.StreetViewStatus.ZERO_RESULTS) {
      if (lang==0){
        alert("對不起，選取的地點100米範圍內無街景資料。");
      }else if(lang==1){
        alert("Sorry, the chosen location does not contains any street view data within proximity of 100 meters.");
      }else{
        alert("对不起，选取的地点100米范围内无街景资料。");
      }
      return -1;
    }
    if (status === google.maps.StreetViewStatus.OK) {
      var myOptions = {
        zoom: 8,
        center: streetViewPanoramaData.location.latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var gmap = new google.maps.Map(document.getElementById("streetLayer"),
      myOptions);

      var panoramaOptions = {
        position: latlng,
        imageDateControl: true,
        pov: {
          heading: google.maps.geometry.spherical.computeHeading(latlng, targetPovLatlon), pitch: 0, zoom: 1
        }
      };
      var panorama = new  google.maps.StreetViewPanorama(document.getElementById("streetLayer"), panoramaOptions);
      gmap.setStreetView(panorama);

      var svlayer =  document.getElementById('streetLayer');
      svlayer.style.visibility = "visible";
      //svlayer.style.width = "80%";
      $.ajax({
        url: "increment-street-view-counter.php",
        contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
        tryCount : 0,
        retryLimit : 3,
        error : function(xhr, textStatus, errorThrown ) {
          this.tryCount++;
          if (this.tryCount <= this.retryLimit) {
            $.ajax(this);
            return;
            } else {
            if (errorThrown.indexOf("data-error") > -1) {
              if (console)
                showlog("Something wrong with SQL");
            }
          }
        },
        success: function( data , textStatus, xhr) {
          if (data.indexOf("success") == -1) {
            this.error(xhr, textStatus, "data-error");
          }
        }
      });
    }else{
      alert('Google Street View not available');
    }
  });
}

function layerclick(layer,item,event){
  disabledEventPropagation(event);
  var id = "layer"+layer+"_"+item;
  var obj = document.getElementById(id);
  if(obj){
    var info = obj.innerHTML;
    if(info=='<i class="fa fa-square-o font20"></i>'){
      obj.innerHTML='<i class="fa fa-check-square-o font20"></i>';
      if(layer==1)
        layermark1[item]=1;
      else
        layermark2[item]=1;
    }else{
      obj.innerHTML='<i class="fa fa-square-o font20"></i>';
      if(layer==1)
        layermark1[item]=0;
      else
        layermark2[item]=0;    }
  }
  showtraffic();
}

function getrafficinfo(mode){
  makeRequest("loadtrafficinfo.php?mode="+mode+"&lang=TC&color="+colorcode,'gocatbox');
}

function play(link1,link2){
  var twoMinuteMessage = "為了讓更多使用者能使用此項網上直播服務，每名使用者進入本頁兩分鐘後，交通直播便會自動停止。此時，使用者可再次選擇所需的網上直播。";
  if (PluginDetect.getVersion("Flash") != null){
    $( "#player" ).html('');
    var flash=link2;
    var params='src='+flash+'&streamType=live&loop=false&autoPlay=true&playButtonOverlay=false&controlBarAutoHide=true&poster=images/play.png&clipEndTime=60';
    $( "#player" ).append(' <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="360" height="270"> <param name="movie" value="StrobeMediaPlayback.swf"></param> <param name="flashvars" value="'+params+'"></param> <param name="allowFullScreen" value="true"></param> <embed src="StrobeMediaPlayback.swf" type="application/x-shockwave-flash" allowfullscreen="true" width="360" height="270" flashvars="'+params+'"></embed> </object> ');
    setTimeout(function(){ $( "#player" ).html(twoMinuteMessage); }, 120000);
  }else{
    $( "#player" ).html('<video id="videolink" width="240" height="180" poster="images/play.png" autoplay="autoplay"> <source src="'+decodeURIComponent(link1)+'" type="video/mp4"> 請安裝 Real Player 或 Flash Player 外掛程式 或使用支援 html5 的瀏覽器 </video>');
    var video = document.getElementById('videolink');
    video.addEventListener('click',function() {
            video.play();
            setTimeout(function(){ $( "#player" ).html(twoMinuteMessage); }, 120000);
    },false);
  }
}

function traninfo(no){
  if(no==1){
    showinfobox("tranmtr.php");
  }else if(no==2){
    showroutelistsearch('BALL');
  }else if(no==3){
    showinfobox("tranlrt.php");
  }else if(no==4){
    showroutelistsearch('GBUS');
  }else if(no==5){
    showinfobox("tranferry.php");
  }else if(no==6){
    showtranweb("TRAM");
  }else if(no==7){
    showinfobox("trantaxi.php");
  }else if(no==8){
    showinfobox("tranrmb.php");
  }
}

function showtranweb(code){
  var s = callweb("trandata.txt");
  var aaa = s.split("\n");
  for(var i=0; i<aaa.length; i++){
    var bbb = aaa[i].split("||");
    if(bbb[0]==code){
        if(lcode==0) showweb(bbb[5]);
        if(lcode==1) showweb(bbb[4]);
        if(lcode==2) showweb(bbb[6]);
    }
  }
}

function mtrclick(no){
    if(no==1) showweb("http://app1.hketransport.td.gov.hk/et/mtrredirect.php?m=mtrgeneral&lang="+syslang);
    if(no==2) showweb("http://app1.hketransport.td.gov.hk/et/mtrredirect.php?m=mtrairport&lang="+syslang);
    if(no==3) showweb("http://app1.hketransport.td.gov.hk/et/mtrredirect.php?m=mtrpassenger&lang="+syslang);
    if(no==4) showweb("http://app1.hketransport.td.gov.hk/et/mtrredirect.php?m=lrtgeneral&lang="+syslang);
    if(no==5) showweb("http://app1.hketransport.td.gov.hk/et/mtrredirect.php?m=mtrfare&lang="+syslang);
    if(no==6) showweb("http://app1.hketransport.td.gov.hk/et/mtrredirect.php?m=mtrbus&lang="+syslang);
    if(no==7) showweb("http://app1.hketransport.td.gov.hk/et/mtrredirect.php?m=mtraireshuttle&lang="+syslang);
}

function taxiclick(no){
  if(no==1) showweb("http://api1.hketransport.td.gov.hk/API/RouteInfo/RouteInfoTaxi.aspx?lang="+lcode);
  if(no==2) showinfobox("trantaxistop.php");
}

function showtranhistory(id,type){
  var obj = document.getElementById(id);
  obj.innerHTML="History";
}

function ferryclick(no){
    if(no==1) showroutelist("FINN");
    if(no==2) showroutelist("FOUT");
    if(no==3) showroutelist("FKAI");
}

function showroutelistsearch(code){
  ppresult = document.getElementById("infobox").innerHTML;
  showinfobox("tranroutelistsearch.php?mode="+code);
}

function showroutelist(code){
  ppresult = document.getElementById("infobox").innerHTML;
  showinfobox("tranroutelist.php?mode="+code);
}

function showtranroute(no){
  showinfobox("tranroutestop.php?n="+no);
}

var lwarning = 'Note';
var lneedinput = 'Please input information to search.';

function transearch(code,field){
  var obj = document.getElementById(field);
  if(obj.value==""){
    tdalert(lwarning,lneedinput);
  }else{
    ppresult = document.getElementById("infobox").innerHTML;
    showinfobox("tranroutelist.php?mode="+code+"&route="+obj.value);
  }
}

function gofocus(field){
  var obj = document.getElementById(field);
  if(obj) obj.focus();
}

function showtranroutestop(no,mode){
  ppresult2 = document.getElementById("infobox").innerHTML;
  showinfobox("singleroutestop.php?no="+no+"&m="+mode);
}

function routebookmark(no,name){
  bookmarkmode=1;
  gobookmark(no,name);
}

function ppbookmark(no,name){
  bookmarkmode=2;
  var bname = startname+" - "+endname;
  gobookmark(no,bname);
}

function gobookmark(no,name){
  bookmarkno=no;
  lastname=name;
  setpopupcontent(2);
  showpopup();
}

function tranfocus(mode){
  if(mode=="BALL"){
    showinfobox("selectbustype.php?mode="+mode);
  }else{
    document.getElementById("ftranname").focus();
  }
}


var lmap = "Map";
var lback = "Back";

function toggleleftpanel(){
  var x = screensize("W");
  if(x>768) return;
  var obj=document.getElementById("leftpanel");
  var tbut=document.getElementById("showmapbuttotton");
  if(obj.style.display=="none"){
    tbut.innerHTML=lmap;
    obj.style.display="block";
  }else{
    tbut.innerHTML=lback;
    obj.style.display="none";
  }
  goresizex();
}


function hideleftpanel(){
  var obj=document.getElementById("leftpanel");
  var x = screensize("W");
  if(x<768){
    obj.style.display="none";
    var tbut=document.getElementById("showmapbuttotton");
    tbut.innerHTML=lback;
  }
}

function showleftpanel(){
  var obj=document.getElementById("leftpanel");
  obj.style.display="block";
  var tbut=document.getElementById("showmapbuttotton");
  tbut.innerHTML=lmap;
}

function fitmap(){
  var extent = stopSource.getExtent();
  //map.getView().fit(extent, { duration: 1000 });
  map.getView().fit(extent, map.getSize(), { duration: 250 });
}

function fitmapSE(){
  var extent = vectorSource.getExtent();
  //map.getView().fit(extent, { duration: 1000 });
  map.getView().fit(extent, map.getSize(), { duration: 250});
}

var pplist = [];

function showoption(no){
  var obj = document.getElementById("ppoption"+no);
  var box = document.getElementById("optionbox");
  box.innerHTML = "..";
  debug(jQuery(obj).offset().left);
  var pos=jQuery(obj).offset().left;
  box.style.left=(pos+2)+"px";
  box.style.display="block";
  if(pplist[no]==undefined){
    pplist[no] = callweb("ppoption.php?n="+no);
  }
  box.innerHTML = pplist[no];
}

function hideppoption(){
  var box = document.getElementById("optionbox");
  box.style.display="none";
}

function ppitemselect(no,option,str){
  hideppoption();
  var obj = document.getElementById("ppoption"+(no+1));
  obj.innerHTML = str+'<div class="pull-right"><i class="fa fa-caret-square-o-down font20" ></i></div>';
  if(no==0) setCookie("PPDIST",option);
  if(no==1) setCookie("PPSERV",option);
  if(no==2) setCookie("PPFARE",option);
  if(no==3){
    setCookie("PPTRAN",option);
    showinfobox("goppsearch.php?sort=0")
  }
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function showaudiobardirect(str,event){
  var url="getmp3.php?s="+encodeURI(str)+"&r"+sysseq;
  playaudio("D",event,url);
  sysseq++;
}

function showaudiobar(code,event){
  var url="getmp3.php?c="+code+"&r"+sysseq;
  playaudio(code,event,url);
  sysseq++;
}

function playaudio(code,event,url){
  var obj = document.getElementById('audiobar');
  obj.style.display="block";
  var audioEl = document.getElementById("audioTag");
  var src = document.getElementById("audiosrc");
  audioEl.controls=false;
  audioEl.addEventListener('ended', hideaudiobar);
  src.src=url;
  audioEl.load();
  audioEl.play();
  disabledEventPropagation(event);
}

function audioctrl(code,event){
  var audioEl = document.getElementById("audioTag");
  if(code=='P')
    audioEl.pause();
  if(code=='S'){
    hideaudiobar();
    audioEl.pause();
  }
  if(code=='A'){
    audioEl.play();
  }
}

function hideaudiobar(){
  document.getElementById('audiobar').style.display="none";
}

function dummygosetting(code,option){
}

function gosetting(code,option){
  if(code.substring(0,1)=="*"){
    if(code=="*FONT"){
      document.location.href="index.php?fsize="+option;
    }
    if(code=="*LANG"){
      if(option==0) document.location.href="index.php?golang=EN";
      if(option==1) document.location.href="index.php?golang=TC";
      if(option==2) document.location.href="index.php?golang=SC";
    }
  }else{
    setCookie(code,option);
    if(code=="PPSERV" && option==1) setCookie("PPTRAN",0);
    showmenu(5);
  }
}

function startnearby(fromQr){
  cleartraffic();
  sys_nearby=1;

  if (fromQr!='Y'){
    CircleLayer.setVisible(true);
    onMoveEnd(null);
  }
}

function stopnearby(){
    sys_nearby=0;
    CircleLayer.setVisible(false);
}

function togglenearby(){
  var obj = document.getElementById('nearbybut');
  if(sys_nearby==0){
    startnearby('');
  }else{
    stopnearby();
  }
}

function gonearby(dist){
  sys_nearby_radius=dist;
  onMoveEnd(null);
}

var bmcode="";
function editbookmark(code,str,event){
  bmcode=code;
  lastname=str;
  setpopupcontent(5);
  showpopup();
  disabledEventPropagation(event);
}

function deletebookmark(){
  makeRequest("godeletebookmark.php?c="+bmcode,"dummydiv");
}

function updatebookmark(){
  var bmname = document.getElementById("fbookmark").value;
  if(bmname=="") return;
  makeRequest("goupdatebookmark.php?c="+bmcode+"&n="+encodeURI(bmname),"dummydiv");
}

//old js


      var actioncode = ' ';
      var p2pbookmark_info = ' ';
      var searchcount=1;
      var stack = new Array(); //record search result
      var tmpsmaker="";
      var tmpemaker="";
      var mapstartlat=0.0;
      var mapstartlon=0.0;
      var mapendlat=0.0;
      var mapendlon=0.0;
      var mapstartname = "";
      var mapendname = "";
      var inforoutenumber1 = "";
      var inforoutenumber2 = "";
      var tmpstr1="";
      var tmpstr2="";
      var abl=false;
      var abl2=false;
      var abl3=false;
      var abl6=false;
      var tabfromfield=false;
      var lasttab=0;
      var bookmode=0;
      var hotspottype = [];
      var refreshIntervalId = null;
      var topboxheight = 0;
      var currentlist=0;
      var ssmar="startpoint-f.png";
      var eemar="endpoint-f.png";
      var oldpdf="";
      var selectdate="";
      var selectdatelab="";
      var selectdateindex=0;
      var processingnearby=0;
      var nearbystop="";
      var stopselect="";
      var tstopselect="";
      var shareinfo="";
      var variantcount=0;
      var pdfid=0;
      var pdfroute="";
      var locbookmark = "";
      var nearbymode=true;
      var currentloc="";
      var currentloc_mode="";
      var selectedcell="";


      var currentmenu=2;
      var pdfname='';
      var pdfnamex='';

      function showpoi(){
        if(true) return;
        clearmarkerswithttl('xxxxxx');
        var s="";
        if(hotspottype[1]==1)
        s=s+"Leisure";
        if(hotspottype[2]==1)
        s=s+"Shopping";
        if(hotspottype[3]==1)
        s=s+"Exhibitions";
        makeRequest('gethotspotmap.php?t='+s+'&c=1','dummydiv');
      }

      function googlemap_initialize(lat, lon){
        var latlng = new google.maps.LatLng(lat, lon);
        //alert(lat + ', ' + lon);

        var streetViewService = new google.maps.StreetViewService();
        var STREETVIEW_MAX_DISTANCE = 100;

        streetViewService.getPanorama({location: latlng, radius: STREETVIEW_MAX_DISTANCE, source: google.maps.StreetViewSource.OUTDOOR},  function (streetViewPanoramaData,status) {
                    if (status === google.maps.StreetViewStatus.OK)
                    {
                            // ok
                            //alert('existed');
                            var myOptions = {
                                    zoom: 8,
                                    center: latlng,
                                    mapTypeId: google.maps.MapTypeId.ROADMAP
                            };
                            var gmap = new google.maps.Map(document.getElementById("streetLayer"),
                            myOptions);

                            var panoramaOptions = {
                                    position: latlng,
                                    pov: {
                                            heading: 34,
                                            pitch: 10,
                                            zoom: 1
                                    }
                            };
                            var panorama = new  google.maps.StreetViewPanorama(document.getElementById("streetLayer"), panoramaOptions);
                            panorama.setPano(streetViewPanoramaData.location.pano);
                            gmap.setStreetView(panorama);

                            document.getElementById('streetLayerBackground').style.visibility = "visible";
                            var svlayer =  document.getElementById('streetLayer');
                            svlayer.style.visibility = "visible";
                            svlayer.style.width = "80%";
                            document.getElementById('streetLayerClose').style.visibility = "visible";
                    }
                    else
                    {
                            alert('Google Street View not available');
                    }

              });
      }

      function showGoogleStreeView(){
        //document.getElementById('streetFrame').reload(true);
        document.getElementById('streetLayerBackground').style.visibility = "visible";
        document.getElementById('streetLayer').style.visibility = "visible";
      }

      function closeGoogleStreeView(){
        //document.getElementById('streetFrame').reload(true);
        document.getElementById('streetLayerBackground').style.visibility = "hidden";
        var svlayer =  document.getElementById('streetLayer');
        svlayer.style.visibility = "hidden";
        svlayer.style.width = "0%";

        document.getElementById('streetLayerClose').style.visibility = "hidden";
      }


      var geteta_ref = 0;
      function showeta_bak(stopid, rdv, seq, bound){
        ajaxindex++;
        makeRequestref('auto_8feba05d2378403aace93d05bbf36c55.php?stopid='+stopid+'&rdv='+rdv+'&seq='+seq+'&bound='+bound+'&l='+lang,'popupboxlist', ajaxindex);
      }

      function showeta(){
	//-----Check call recaptcha or not------
        if (recaptcha_check_called == false) {
                makeRequest("checkCall.php?type=eta", "dummydiv");
                return;
        }

        recaptcha_check_called = false;


        //-----Origin code-----
        var tmpref = ++ajaxindex;
        geteta_ref = tmpref;
        makeRequestref('auto_8feba05d2378403aace93d05bbf36c55.php?l='+lang,'popupboxlist', tmpref);
      }

      function showprintout(code){
        document.getElementById('printout').style.visibility = "visible";
        makeRequest('printout.php?code='+code+'&l='+lang,'printout');
      }

      function hideprintout(){
        document.getElementById('printout').style.visibility = "hidden";
      }

      function shownotice_stop(stopid){
        makeRequest('getnotice_stop.php?stopid='+stopid+'&l='+lang+'&ltab='+lasttab,'popupboxlist');
      }

      function showroute_eta_extra_bak(stopid){
        makeRequest('auto_a3b09dbaacf2466e961775f5254cefe8.php?stopid='+stopid+'&l='+lang,'popupboxlist');
      }

      function showroute_eta_extra(stopid){
	//-----Check call recaptcha or not------
        if (recaptcha_check_called == false) {
                makeRequest("checkCall.php?type=route&stopid=" + stopid, "dummydiv");
                return;
        }

        recaptcha_check_called = false;


        //-----Origin code-----
        makeRequest('auto_a3b09dbaacf2466e961775f5254cefe8.php?l='+lang,'popupboxlist');
      }

      function showblank(){
	 makeRequest('blank.php','popupboxlist');
      }

      function restartPopupboxlist()
      {
        document.getElementById('popupboxlist').style.backgroundColor  = '#6d28aa';
        document.getElementById('popupboxlist').style.overflow="auto";
      }

      function shownotice(r){
        loadbox2("boxtitle2.php?t=notice&l="+lang,"custnotice.php?l="+lang+"&route="+r+"&route2="+r2+"&syscode=2543608933e6e1859912863c1bbb7e9e3b46f989a0");
      }

      function shownotice2(r,r2){
        loadbox2("boxtitle2.php?t=notice&l="+lang,"custnotice.php?l="+lang+"&route="+r+"&route2="+r2+"&syscode=2543601442f45135493638cd240028c6a000e729a9");
      }

      // function popupNotice(r)
      // {

      // makeRequest("specialNotice.php?l="+lang+"&route="+r,'dummydiv');
      // }


      function popupNotice()
      {
        var r = arguments[0];
        var r2 = arguments[1];
        var click = arguments[2] == 1 ? 1 : 0;

        if (r2 == '' || r2 === undefined)
        {
          makeRequest("specialNotice.php?click="+click+"&l="+lang+"&route="+r+"&syscode=254360921930a3eb7f8213007fce5c15b8cfec96dd",'dummydiv');
        }
        else
        {
          makeRequest("specialNotice.php?click="+click+"&l="+lang+"&route="+r+"&route2="+r2+"&syscode=2543608789f5fcb6d84be7b08b51364fb8254d5778",'dummydiv');
        }
      }

      function hotspotselect(n){
        if(hotspottype[n]==0)
        hotspottype[n]=1;
        else
        hotspottype[n]=0;
        if(hotspottype[1]==0)
        document.getElementById('hot1').src='tdummy.png';
        else
        document.getElementById('hot1').src='Ok-icon.png';
        if(hotspottype[2]==0)
        document.getElementById('hot2').src='tdummy.png';
        else
        document.getElementById('hot2').src='Ok-icon.png';
        if(hotspottype[3]==0)
        document.getElementById('hot3').src='tdummy.png';
        else
        document.getElementById('hot3').src='Ok-icon.png';
        showpoi();
      }

      function zoomclick(event){
        pos_x = event.clientX;
        pos_y = event.clientY;
        //alert(pos_x+" "+pos_y);
        if(pos_x>405 && pos_x<425 && pos_y>120 && pos_y<216){
          z = 18 - Math.round((pos_y -120 - 5) / 11);
          map.zoomTo(z);
        }
      }

      function stopauto(e,input,div){
        var keynum;
        var skey;
        var tmpstr="";
        var type="";
        var i=0;
        if(window.event) // IE
        {
          keynum = e.keyCode;
        }
        else if(e.which) // Netscape/Firefox/Opera
        {
          keynum = e.which;
        }
        if(keynum==8||keynum==46){
          if(input=="sloc"){
            var arr=tmpstr1.split('|*|');
            $('#sloc').unautocomplete();
          }
          else if(input=="eloc"){
            var arr=tmpstr2.split('|*|');
            $('#eloc').unautocomplete();
          }
          else{
            var arr=tmpstr1.split('|*|');
            $('#skey').unautocomplete();
          }
          skey=document.getElementById(input);
          if(countchar(skey.value,':')==4&&skey.value.charAt(skey.value.length-1)!=":"){
            skey.value=skey.value.substring(0,skey.value.lastIndexOf(":")+1);
            for(i=0;i<arr.length-1;i++){
              tmpstr+=arr[i]+"|*|";
            }
          }
          else{
            skey.value=skey.value.substring(0,skey.value.lastIndexOf(":"));
            skey.value=skey.value.substring(0,skey.value.lastIndexOf(":")+1);
            for(i=0;i<arr.length-2;i++){
              tmpstr+=arr[i]+"|*|";
            }
          }
          if(input=="sloc"){
            tmpstr1=tmpstr;
            type="s";
          }
          else if(input=="eloc"){
            tmpstr2=tmpstr;
            type="e";
          }
          else{
            tmpstr1=tmpstr;
            type="";
          }
          //document.getElementById('testing').value=tmpstr;
          //alert("1:"+abl6);
          autooff(div);
          getautodata(type,div);
          abl6=false;

        }
        else{
          //alert("2:"+abl6);
          //document.getElementById('test333').value=abl2;
          abl6=true;
        }
      }

      function getautodata3(){
        //var x=document.getElementsByName("stype2");
        $('#eloc').unautocomplete();
        var link;
        link="bsearch_p3.php?l="+lang;
        $("#eloc").autocomplete(link, {
          width: 280,
          highlight: false,
          scroll: true,
          scrollHeight: 300,
          matchContains: true,
          max: 100,
          minChars:2
          }).result(function(event, data, formatted) {
          var result1=document.getElementById("eloc");
          result1.value=data[1];
          mapendname=data[1];
          var result2=document.getElementById("elat");
          result2.value=data[2];
          var result3=document.getElementById("elon");
          result3.value=data[3];
          var ll=getlonlat(data[3],data[2]);
          mapendlat=parseFloat(data[2]);
          mapendlon=parseFloat(data[3]);
          endlat=mapendlat;
          endlon=mapendlon;
          endname=mapendname;
          mappanto(endlon,endlat);
          gomenu(2,1);
          /*
          clearmarkers();
	  clearCsNearbyMarker();
          addcustommarker(ll,eemar,36,80,-20,-80);
          if(mapstartlat>0.0&&mapstartlon>0.0){
            addcustommarker(getlonlat(mapstartlon,mapstartlat),ssmar,36,80,-20,-80);
            document.getElementById("slat").value=mapstartlat;
            document.getElementById("slon").value=mapstartlon;
          }
          reordermarker();
          map.panTo(ll);
          */
          abl3=false;
        });
      }
      function getautodata2(){
        //var x=document.getElementsByName("stype");
        $('#sloc').unautocomplete();
        var link;
        link="bsearch_p3.php?l="+lang;
        $("#sloc").autocomplete(link, {
          width: 280,
          highlight: false,
          scroll: true,
          scrollHeight: 300,
          matchContains: true,
          max: 100,
          minChars:2
        }).result(function(event, data, formatted) {
          var result1=document.getElementById("sloc");
          result1.value=data[1];
          mapstartname=data[1];
          var result2=document.getElementById("slat");
          result2.value=data[2];
          var result3=document.getElementById("slon");
          result3.value=data[3];
          mapstartlat=parseFloat(data[2]);
          mapstartlon=parseFloat(data[3]);
          startlat=mapstartlat;
          startlon=mapstartlon;
          startname=mapstartname;
          gomenu(2,1);
          mappanto(startlon,startlat);
          /*
          alert(mapstartlat+" "+mapstartlon);
          clearmarkers();
	  clearCsNearbyMarker();
          addcustommarker(ll,ssmar,36,80,-20,-80);
          if(mapendlat>0.0&&mapendlon>0.0){
            addcustommarker(getlonlat(mapendlon,mapendlat),eemar,36,80,-20,-80);
            document.getElementById("elat").value=mapendlat;
            document.getElementById("elon").value=mapendlon;
          }
          reordermarker();
          map.panTo(ll);
          */
          abl2=false;
        });
      }
      function getautodata1(){
        //var x=document.getElementsByName("stype");
        $('#skey').unautocomplete();
        var link;
        link="bsearch_p3.php?l="+lang;
        $("#skey").autocomplete(link, {
          width: 280,
          highlight: false,
          scroll: true,
          scrollHeight: 300,
          matchContains: true,
          max: 100,
          minChars:2
          }).result(function(event, data, formatted) {
          var result1=document.getElementById("skey");
          result1.value=data[1];
          var result2=document.getElementById("lat");
          result2.value=data[2];
          var result3=document.getElementById("lon");
          result3.value=data[3];
          var tlat=parseFloat(data[2]);
          var tlon=parseFloat(data[3]);
          mappanto(tlon,tlat);
          abl2=false;
        });
      }

      function getautodata(type,div) {
        if(div=="autocom"){
          if(document.getElementById("autocom2")){
            autooff("autocom2");
          }
        }
        else{
          if(document.getElementById("autocom")){
            autooff("autocom");
          }
        }
        var skey="";
        var cnt;
        var tmpstr;
        var arr;
        var ibottom = 0;
        if(type=="s"){
          skey =document.getElementById('sloc').value;
          arr=tmpstr1.split('|*|');
          tmpstr=arr[arr.length-2];
          ibottom = findPosY(document.getElementById('ppstart'))+38;
        }else if(type=="e"){
          skey =document.getElementById('eloc').value;
          arr=tmpstr2.split('|*|');
          tmpstr=arr[arr.length-2];
          ibottom = findPosY(document.getElementById('ppend'))+38;
        }else{
          skey =document.getElementById('skey').value;
          arr=tmpstr1.split('|*|');
          tmpstr=arr[arr.length-2];
          ibottom = findPosY(document.getElementById('nearbybox'))+34;
        }
        if(skey!=""){
          if(!tmpstr){
            tmpstr="";
          }
          if(tmpstr.indexOf("|n")<=-1){
            tmpstr+="|n";
          }
          if(tmpstr.length>2){
            //document.getElementById('testing').value="IN";
            c_autolist(tmpstr,div,true);
            var list = document.getElementById(div);
            list.style.top = ibottom+'px';
            list.style.display = "block";
          }
          }else{
          if(type=="s"){
            tmpstr1="";
            }else if(type=="e"){
            tmpstr2="";
            }else{
            tmpstr1="";
          }
          //document.getElementById('test333').value=2;
          var list = document.getElementById(div);
          list.innerHTML = '...';
          makeRequest("getlocation.php?k="+skey+"&t="+type+"&div="+div+"&lang="+lang+"&ltab="+lasttab,div);
          list.style.top = ibottom+'px';
          list.style.display = "block";
        }
      }

      function findPosY(obj)
      {
        var curtop = 0;
        if(obj.offsetParent)
        while(1)
        {
          curtop += obj.offsetTop;
          if(!obj.offsetParent)
          break;
          obj = obj.offsetParent;
        }
        else if(obj.y)
        curtop += obj.y;
        return curtop;
      }

      function countchar(str,sec){
        var arr=str.split(sec);
        return arr.length;
      }
      function autooff(div){
        var list = document.getElementById(div);
        list.style.display="none";
        list.innerHTML ='';
      }
      function clearstr(i,div,type){
        var input=document.getElementById(i);
        var str1;
        var str2;
        if(i=="sloc"){
          str1="請選擇或輸入起點";
          if(lang==1){
            str1="Please select or input the origin";
          }
          if(lang==2){
            str1="请选择或输入起点";
          }
          input.value=str1;
          input.style.color='#707070';
          mapstartlat=0.0;
          mapstartlon=0.0;
          mapstartname="";
          document.getElementById('slat').value="";
          document.getElementById('slon').value="";
          clearmarkers();
	  clearCsNearbyMarker();
          tmpstr1="";
          if(mapendlat>0.0&&mapendlon>0.0){
            addcustommarker(getlonlat(mapendlon,mapendlat),eemar,36,80,-20,-80);
            document.getElementById("elat").value=mapendlat;
            document.getElementById("elon").value=mapendlon;
          }
        }
        else if(i=="eloc"){
          str2="請選擇或輸入終點";
          if(lang==1){
            str2="Please select or input the destination";
          }
          if(lang==2){
            str2="请选择或输入终点";
          }
          input.value=str2;
          input.style.color='#707070';
          mapendlat=0.0;
          mapendlon=0.0;
          mapendname="";
          document.getElementById('elat').value="";
          document.getElementById('elon').value="";
          tmpstr2="";
          clearmarkers();
	  clearCsNearbyMarker();
          if(mapstartlat>0.0&&mapstartlon>0.0){
            addcustommarker(getlonlat(mapstartlon,mapstartlat),ssmar,36,80,-20,-80);
            document.getElementById("slat").value=mapstartlat;
            document.getElementById("slon").value=mapstartlon;
          }
        }
        else{
          str1="請選擇或輸入地點";
          if(lang==1){
            str1="Please select or input the location";
          }
          if(lang==2){
            str1="请选择或输入地点";
          }
          input.value=str1;
          input.style.color='#707070';
          tmpstr1="";
        }
        abl=false;
        abl2=false;
        abl3=false;
        abl6=false;
      }
      function c_autolist(str,div,adstr){
        var list = document.getElementById(div);
        var arr=str.split('|');
        var arr2;
        var skey;
        var tmpstr;
        if(arr[5]=="s"){
          skey =document.getElementById('sloc');
          tmpstr=tmpstr1;
        }
        else if(arr[5]=="e"){
          skey =document.getElementById('eloc');
          tmpstr=tmpstr2;
        }
        else{
          skey =document.getElementById('skey');
          tmpstr=tmpstr1;
          //document.getElementById('testing').value=tmpstr;

        }
        if(arr[2]<5){
          if(arr[6]!="n"){
        //    skey.value+=arr[0]+":";
            skey.value = arr[0];
            //skey.focus();
          }
          if(arr[5]=="s"&&adstr==false){
            tmpstr1+=str+"|*|";
          }
          else if(arr[5]=="e"&&adstr==false){
            tmpstr2+=str+"|*|";
          }
          else{
            if(adstr==false){
              tmpstr1+=str+"|*|";
            }
            //document.getElementById('test333').value=tmpstr1;
          }
          //document.getElementById('test333').value=tmpstr;
          list.innerHTML = '...';
          //document.getElementById('testing2').value=str;
          makeRequest("getlocation.php?k="+arr[1]+"&l="+arr[2]+"&t="+arr[5]+"&div="+div+'&lang='+lang+'&ltab='+lasttab,div);
        }
        else if(arr[2]>=5){
          if((countchar(tmpstr,'|'))>6){
        //    skey.value=skey.value.substring(0,skey.value.lastIndexOf(":")+1)+arr[0];
            skey.value = arr[0];
            //alert(skey.value.lastIndexOf(":"));
          }
          else{
        //    skey.value+=arr[0];
            skey.value = arr[0];
            if(arr[5]=="s"){
              tmpstr1+="";
            }
            else if(arr[5]=="e"){
              tmpstr2+="";
            }
            else{
              tmpstr1+="";
            }
            //document.getElementById('test333').value=tmpstr;
          }
          //document.getElementById('tempstr').value=tmpstr;
        }
        if(arr[5]=="s"){
          mapstartname=skey.value;
          document.getElementById('slat').value=arr[3];
          document.getElementById('slon').value=arr[4];
          if(arr[2]==5){
            mapstartlat=parseFloat(arr[3]);
            mapstartlon=parseFloat(arr[4]);
            startlat=mapstartlat;
            startlon=mapstartlon;
            startname=mapstartname;
            gomenu(2,1);
            mappanto(startlon,startlat);
            list.style.display = "none";
            abl=false;
          }
        }else if(arr[5]=="e"){
          mapendname=skey.value;
          document.getElementById('elat').value=arr[3];
          document.getElementById('elon').value=arr[4];
          if(arr[2]==5){
            mapendlat=parseFloat(arr[3]);
            mapendlon=parseFloat(arr[4]);
            endlat=mapendlat;
            endlon=mapendlon;
            endname=mapendname;
            gomenu(2,1);
            mappanto(endlon,endlat);
            list.style.display = "none";
            abl=false;
          }
        }else{
          if(arr[2]==5){
            clearmarkers();
	    clearCsNearbyMarker();
            map.zoomTo(16);
            var lon = parseFloat(arr[4]);
            var lat = parseFloat(arr[3]);
            mappanto(lon,lat);
            document.getElementById("lat").value=arr[3];
            document.getElementById("lon").value=arr[4];
            document.getElementById("autocom").style.display="none";
            abl=false;
          }
        }
      }

      var lat=22.290000
var lon=114.1800
var zoom=10
      var map; //complex object of type OpenLayers.Map
      var alat=-0.0001935197;
      var alon=0.0000697374;
      var layerCenterMap;
      //var markersize = new OpenLayers.Size(49,32);
      //var markeroffset = new OpenLayers.Pixel(-17, -markersize.h);
      var checkcnt=0;
      var sysmode=-1;
      var errorcnt=0;
      var ajaxindex=0;
      var mapclicklat=0.0;
      var mapclicklon=0.0;
      var templocname="";
      var chmenumode=0;
      var controls;
      var movingmarker = null;
      var smarker = null;
      var emarker = null;
      var sn=0;
      var hlstop="";
      var lastnearbylat = "";
      var lastnearbylon = "";
      var ssid = "5e6dcd6cd8e0d";
      //var lang=0;


      //Initialise the 'map' object
      function init() {
        alert("hello");
        mapinit();
        map.events.register("click", map, function(e) {
          hiderightclickbox();
          var ll1= map.getLonLatFromViewPortPx(e.xy);
          if(syspopup=="A"){
            map.panTo(ll1);
            var ll2= ll1.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
            tlat=ll2.lat-alat;
            tlon=ll2.lon-alon;
          }else{
            mwypopupremove();
            map.panTo(ll1);
            var ositem=document.getElementById(hlstop);
            if(ositem){
              ositem.style.backgroundColor='';
              hlstop='';
            }
          }
        });


        map.events.register("mousemove", map, function(e) {
          //hiderightclickbox();
          if(emarker!=null && movingmarker==emarker){
            var opx = map.getLayerPxFromViewPortPx(e.xy) ;
            emarker.moveTo(opx) ;
          }
        });

        map.events.register("moveend",map,function(e){
          if(sysmode==0 && syspopup=="A"){
            nearby();
            hidep2pmenu();
          }
        });

        map.events.register("movestart", map, function(e) {
          if(sysmode==0 && syspopup=="A"){
            //document.getElementById('redcross').style.visibility = "visible";
          }
        });

        map.div.oncontextmenu = function noContextMenu(evt) {
          var str,str1,str2;
          if (true || OpenLayers.Event.isRightClick(evt)){
            var mx=0; var my=0;
            if(document.all){
              mx=window.event.clientX;
              my=window.event.clientY;
              }else{
              mx= evt.pageX;
              my= evt.pageY;
            }
            var posx = (mx-4)+"px"; var posy = (my-4)+"px";
            var atts = document.getElementById("rightclickoption");

            var ll1= map.getLonLatFromViewPortPx(new OpenLayers.Pixel(mx-386,my-24));
            var ll2= ll1.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
            mapclicklat=ll2.lat-alat;
            mapclicklon=ll2.lon-alon;
            atts.oncontextmenu=function(){return false;};
            if (lang==0){
              str="設為起點";
              str1="設為終點";
              str2="加至我的書籤";
            }
            else if(lang==1){
              str="Set Origin";
              str1="Set Destination";
              str2="Add Bookmark";
            }
            else{
              str="设为起点";
              str1="设为终点";
              str2="加至我的书签";
            }

            var s = '';
            s+='<table width="120" border="0" cellpadding="2" cellspacing="0" bgcolor="#FFF5C0" id="rightclick">';
            s+='<tr><td onmouseover="style.backgroundColor=\'#FFA500\'" onmouseout="style.backgroundColor=\'#FFFFD0\'" '+
            'style="cursor:pointer; border-bottom:1px solid #C0C0C0;" onclick="gorightclick(0);">&nbsp;'+str+'&nbsp;</td></tr>';
            s+='<tr><td onmouseover="style.backgroundColor=\'#FFA500\'" onmouseout="style.backgroundColor=\'#FFFFD0\'" '+
            'style="cursor:pointer; border-bottom:1px solid #C0C0C0;" onclick="gorightclick(1);">&nbsp;'+str1+'&nbsp;</td></tr>';
            s+='<tr><td onmouseover="style.backgroundColor=\'#FFA500\'" onmouseout="style.backgroundColor=\'#FFFFD0\'" '+
            'style="cursor:pointer; border-bottom:1px solid #C0C0C0;" onclick="gorightclick(2);">&nbsp;'+str2+'&nbsp;</td></tr>';
            s+='</table>';

            atts.innerHTML = s;
            atts.style.position='absolute';
            atts.style.top=posy;
            atts.style.left=posx;
            atts.style.display='block';
            //Event.stop(evt);
          }
          return false;
        };

        hotspottype[0]=hotspottype[1]=hotspottype[2]=hotspottype[3]=1;
        showpoi();
      }

      function rmenumousedown(){
        return false;
      }

      function hiderightclickbox(){
        var atts = document.getElementById("rightclickoption");
        if(atts.style.top.substring(0,1)!='-'){
          atts.style.top="-300px";
        }
      }

      function shownearbybookmark(name,lat,lon){
        clearmarkers();
	clearCsNearbyMarker();
        var ll = getlonlat(lon,lat);
        addmarker(ll,"B");
        map.panTo(ll);
        var sss = document.getElementById("skey");
        if(sss){
          sss.value=name;
        }
      }


      function showbookmarkonmap(lat,lon){
        clearmarkers();
	clearCsNearbyMarker();
        var ll = getlonlat(lon,lat);
        addcustommarker(ll,"marker-blue.png",49,32,-8,-32,"Dummy");
        mappanto(ll[0],ll[1]);
        showmarker();
      }

      function addbookmark(lat,lon,name){
        name=encodeURIComponent(name);
        if(lat!=""&&lon!=""&&name!="")
        loadbox2("boxtitle2.php?t=bookmark"+"&l="+lang+"&ltab="+lasttab,"newlocationbookmark.php?lat="+lat+"&lon="+lon+"&name="+name+"&l="+lang+"&ltab="+lasttab);
      }

      function callweb(weburl){
        var url = weburl;
        var result = "";
          $.ajax({
              url: url,
              type: 'GET',
              async: false,
              cache: false,
              timeout: 30000,
              error: function(){
            alert("Error to connect server!");
              },
              success: function(msg){
            result = msg;
              }
          });
        return result;
      }


      function gorightclick(mode){
        switch(mode){
          case 0:
            startlat=mapclicklat;
            startlon=mapclicklon;
            mapstartlat=mapclicklat;
            mapstartlon=mapclicklon;
            var rrr = callweb("get_rgeocode.php?lat="+mapclicklat+"&lon="+mapclicklon+"&l="+lang);
            mapstartname = rrr;
            if (locbookmark != "") mapstartname = locbookmark;
            startname = mapendname;
            gomenu(2,1);
            //mapstartname=mapclicklat.toPrecision(8)+","+mapclicklon.toPrecision(9);
            break;
          case 1:
            endlat=mapclicklat;
            endlon=mapclicklon;
            mapendlat=mapclicklat;
            mapendlon=mapclicklon;
            var rrr = callweb("get_rgeocode.php?lat="+mapclicklat+"&lon="+mapclicklon+"&l="+lang);
            mapendname = rrr;
            if (locbookmark != "") mapendname = locbookmark;
            endname = mapendname;
            gomenu(2,1);
            //mapendname=mapclicklat.toPrecision(8)+","+mapclicklon.toPrecision(9);
            break;
          case 2:
            var rrr = callweb("get_rgeocode.php?lat="+mapclicklat+"&lon="+mapclicklon+"&l="+lang);
            bookmarkname = rrr;
            addbookmark(mapclicklat,mapclicklon, bookmarkname);
            clearmarkers();
	    clearCsNearbyMarker();
            removeline();
          break;
        }
        hiderightclickbox();
        if(mode==0 || mode==1){
          chmenumode=1;
          gomenu(2);
          if(mapendlat>mapstartlat){
            if(mapendlat>0.0){
              var ll = getlonlat(mapendlon,mapendlat);
              //emarker = addcustommarker(ll,"endpoint_tc.png",84,31,-33,-31);
              emarker = addcustommarker(ll,eemar,36,80,-20,-80);
              emarker.events.register("mousedown", emarker, function(e) {
                movingmarker=emarker;
              });
              emarker.events.register("mouseup", emarker, function(e) {
                movingmarker=null;
              });
              emarker.events.register("mouseout", emarker, function(e) {
                movingmarker=null;
              });
            }
            if(mapstartlat>0.0){
              var ll=getlonlat(mapstartlon,mapstartlat);
              emarker = addcustommarker(ll,ssmar,36,80,-20,-80);
              m.events.register("click", m, function(e) {
                movingmarker=m;
                movingmarkerxy=e.xy;
              });
            }
            reordermarker();
            }else{
            if(mapstartlat>0.0){
              var ll=getlonlat(mapstartlon,mapstartlat);
              var m = addcustommarker(ll,ssmar,36,80,-20,-80);
              m.events.register("click", m, function(e) {
                movingmarker=m;
                movingmarkerxy=e.xy;
              });
            }
            if(mapendlat>0.0){
              var ll=getlonlat(mapendlon,mapendlat);
              var m = addcustommarker(ll,eemar,36,80,-20,-80);
              m.events.register("click", m, function(e) {
                movingmarker=m;
                movingmarkerxy=e.xy;
              });
            }
            reordermarker();
          }
        }
        loclocbookmark = "";
      }

      function showstartendpoints(){
        if(mapstartlat>0.0){
          var ll=getlonlat(mapstartlon,mapstartlat);
          console.log(mapstartlon);
          var m = addcustommarker(ll,ssmar,36,80,-10,-80,lstartpo);
        }
        if(mapendlat>0.0){
          var ll=getlonlat(mapendlon,mapendlat);
          var m = addcustommarker(ll,eemar,36,80,-10,-80,lendpo);
        }
        //reordermarker();
        showmarker();
      }

      var markersize = new Array(1000);

      function addcustommarker(ll,png,sizex,sizey,offx,offy,name){
        var lng=parseFloat(ll[0]);
        var lat=parseFloat(ll[1]);
        var increment = 1;
        var lastpoint = -1;
        var info = name+"||C||"+lat+"||"+lng+"||"+png+"||"+sizex+"||"+sizey+"||"+offx+"||"+offy;

        if(lastpoint==-1) lastpoint=markercount;
        if(sizex==15)
          markercodes[lastpoint] = "P";
        else
          markercodes[lastpoint] = "C";
        markerlat[lastpoint] = lat;
	markersize[lastpoint] = [sizex,sizey,offx,offy];
        markers[lastpoint] = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([lng+alon,lat+alat],'EPSG:4326', 'EPSG:3857')),
            name: info
        });
        amode='pixels';
        ax=(-offx)*2;
        ay=(-offy);
        if(sizex==15){
          ax=0.5;
          ay=0.5;
          amode='fraction';
        }
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                scale: 1,
                anchor: [ax,ay],
                anchorXUnits: amode,
                anchorYUnits: amode,
                opacity: 1,
                src: png
            }))
        });
        markers[lastpoint].setStyle(iconStyle);
        markercount+=increment;
      }

      function addstoponmap(stopid,lon,lat,ccode,bsa_seq,name,rdv,bound,eta,altLon,altLat){
        name=name+"{"+stopid+"^"+lat+"^"+lon+"^"+bsa_seq+"^"+rdv+"^"+bound+"^"+eta+"^"+altLat+"^"+altLon+"}";
        if(ccode=='B')
          var mmm = addcustommarker(getlonlat(lon,lat),"xstop.png",40,40,-2,-40,name);
        else if(ccode=='S')
          var mmm = addcustommarker(getlonlat(lon,lat),"sstop.png",40,40,-2,-40,name);
        else if(ccode=='E')
          var mmm = addcustommarker(getlonlat(lon,lat),"estop.png",40,40,-2,-40,name);
        else if(ccode=='C')
          var mmm = addcustommarker(getlonlat(lon,lat),"xstop.png",40,40,-2,-40,name);
        else if(ccode=='R')
          var mmm = addcustommarker(getlonlat(lon,lat),"sstop.png",40,40,-2,-40,name);
        else if(ccode=='G')
          var mmm = addcustommarker(getlonlat(lon,lat),"estop.png",40,40,-2,-40,name);
        else if(ccode=='Y')
          var mmm = addcustommarker(getlonlat(lon,lat),"stop3.png",40,40,-2,-40,name);
        else
          var mmm = addcustommarker(getlonlat(lon,lat),"stop.png",15,15,-7,-7,name);
        if(ccode=='S' || ccode=='E')
          var mmm = addcustommarker(getlonlat(lon,lat),"dummy.png",15,15,-7,-7,name);
        /*
        mmm.events.register("click", mmm, function(e){
          stopclick1(stopid,lat,lon,bsa_seq,rdv,bound,eta)
        });
        */
      }



      function addstoponmap_near(stopid,lon,lat,ccode,bsa_seq,name,rdv,altLon,altLat){
        lon = lon-0;
        lat = lat-0;
	altLon = altLon - 0;
	altLat = altLat - 0;
        var temp = '||0||0||0';
        var etainfo = stopid.concat(temp);
        //makeRequest(\'auto_e9d160cd20d8446e98433148b2dc0cad.php?info='.$etainfo.'\',\'dummydiv\')
        //var mmm = addmarker(getlonlat(lon,lat),ccode,num,name);
        name=name+"|*|["+stopid+"]"+stopid+"|*|"+altLon+"||"+altLat+"|*|";
//alert(name);
        if(ccode=='B')
        var mmm = addcustommarker(getlonlat(lon,lat),"xstop.png",40,40,-2,-40,name);
        else if(ccode=='S')
        var mmm = addcustommarker(getlonlat(lon,lat),"sstop.png",40,40,-2,-40,name);
        else if(ccode=='E')
        var mmm = addcustommarker(getlonlat(lon,lat),"estop.png",40,40,-2,-40,name);
        else if(ccode=='C')
        var mmm = addcustommarker(getlonlat(lon,lat),"xstop.png",40,40,-2,-40,name);
        else if(ccode=='R')
        var mmm = addcustommarker(getlonlat(lon,lat),"sstop.png",40,40,-2,-40,name);
        else if(ccode=='G')
        var mmm = addcustommarker(getlonlat(lon,lat),"estop.png",40,40,-2,-40,name);
        else if(ccode=='Y')
        var mmm = addcustommarker(getlonlat(lon,lat),"stop3.png",40,40,-2,-40,name);
        else
        var mmm = addcustommarker(getlonlat(lon,lat),"stop.png",15,15,-7,-7,name);

        /*
          mmm.events.register("click", mmm, function(e){
          makeRequest('auto_e9d160cd20d8446e98433148b2dc0cad.php?info='+etainfo,'dummydiv')
          stopclick1_nearby(stopid,lat,lon)
          });
        */
      }

      var lhotspot = "";

      function hotspotonmap(id,lat,lon,cat,name){
        lat = lat-0;
        lon = lon-0;
        var ll = getlonlat(lon,lat);
        //var mmm = addmarker(ll,"B");
        var img = "";
        if (cat=='Leisure')
        img='poi_leisure.png';
        else if (cat=='Shopping')
        img='poi_shopping.png';
        else if (cat=='Exhibitions')
        img='poi_exhibitions.png';
        var name = "*"+name+"{"+id+"^"+lat+"^"+lon;
        addcustommarker(getlonlat(lon,lat),img,40,40,-6,-40,name);
      }

      function hotspotclick(id,tlat,tlon){
        var lat=parseFloat(tlat);
        var lon=parseFloat(tlon);
        var coord = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
        hotspotpopup.setPosition(coord);
        makeRequestref('gethotspotresult.php?id='+id+'&lat='+lat+'&lon='+lon+'&l='+lang,'hpopupcontent',ajaxindex);
        var z = Math.floor(map.getView().getZoom());
        if(z>=10 && z<=18){
          var coord2 = ol.proj.transform([lon, lat-difflat[z]], 'EPSG:4326', 'EPSG:3857');
          mappantoxy(coord2);
        }
        hideleftpanel();
      }

      function hotspotclickdelay(id,lat,lon){
        poipopup(getlonlat(lon,lat));
        ajaxindex++;
        var ositem=document.getElementById(hlstop);
        if(ositem){
          ositem.style.backgroundColor="";
        }
        var sitem=document.getElementById(id);
        if(sitem){
          hlstop=id;
          sitem.style.backgroundColor="#FFEA80";
        }
        var url='gethotspotresult.php?id='+id+'&lat='+lat+'&lon='+lon+'&l='+lang;
        setTimeout("makeRequestref('"+url+"','popupcontent',ajaxindex)",1000);
      }


      /************* Not In Use *************/
      function stopclick(id,lat,lon,num,rnum,d,v,altLat,altLon){
        fbpopup(getlonlat(lon,lat));
        ajaxindex++;
        var ositem=document.getElementById(hlstop);
        if(ositem){
          ositem.style.backgroundColor="";
        }
        var sitem=document.getElementById(num);
        if(sitem){
          hlstop=num;
          sitem.style.backgroundColor="#FFEA80";
        }
        makeRequestref('getrouteinstop.php?id='+id+'&lat='+lat+'&lon='+lon+'&r='+rnum+'&d='+d+'&v='+v+'&l='+lang+'&altLat='+altLat+'&altLon='+altLon,'popupcontent',ajaxindex);
        document.getElementById('redcross').style.visibility='hidden';
        currentlist=0;
      }


      var latest_stopclick1_time = (new Date()).getTime();
      var getrouteinstop_ref = 0;
      //function stopclick1(stopid,lat,lon,bsa_seq,rdv,bound){
      function stopclick1(stopid,lat,lon,bsa_seq,rdv,bound,eta,altLat,altLon){
//alert('in stopclick1');

        if ((new Date()).getTime() - latest_stopclick1_time < 500)
        {
          //alert( 'too fast');
          return;
        }

        getrouteinstop_ref = ++ajaxindex;

        latest_stopclick1_time = (new Date()).getTime();
        //alert(latest_stopclick1_time);
        tlon = parseFloat(lon)+alon;
        tlat = parseFloat(lat)+alat;

        var ositem=document.getElementById(hlstop);
        if(ositem){
          ositem.style.backgroundColor="";
        }
        var sitem=document.getElementById('slist'+stopid+'-'+bsa_seq);
        if(sitem){
          hlstop='slist'+stopid+'-'+bsa_seq;
          sitem.style.backgroundColor="#FFEA80";
        }
        makeRequestref('getrouteinstop.php?stopid='+stopid+'&lat='+lat+'&lon='+lon+'&seq='+bsa_seq+'&rdv='+rdv+'&bound='+bound+'&eta='+eta+'&l='+lang+'&ref='+getrouteinstop_ref+
		'&altLat='+altLat+'&altLon='+altLon
            ,'popupcontent',getrouteinstop_ref);
        document.getElementById('redcross').style.visibility='hidden';
        currentlist=0;
        var coord = ol.proj.transform([tlon, tlat], 'EPSG:4326', 'EPSG:3857');
        markerpopup.setPosition(coord);
        //showmarkerpopupinfo(undefined)


	var z = Math.floor(map.getView().getZoom());
        if(z>=10 && z<=18){
          var coord2 = ol.proj.transform([tlon+difflon[z], tlat-difflat[z]], 'EPSG:4326', 'EPSG:3857');
          mappantoxy(coord2);
        }
      }


      // ******** Not in use ********
      function stopclick1_nearby(stopid,lat,lon){
        fbpopup(getlonlat(lon,lat));
        ajaxindex++;
        makeRequestref('getrouteinstop_nearby.php?stopid='+stopid+'&lat='+lat+'&lon='+lon+'&l='+lang,'popupcontent',ajaxindex);
        document.getElementById('redcross').style.visibility='hidden';
        currentlist=0;
      }

      function panto(lat,lon){
        map.panTo(getlonlat(lon,lat));
      }

      function mapgoto(lat,lon){
        var lonlat = getlonlat(lon,lat);
        map.setCenter (lonlat, 14);
        hidebox2();
      }


      function nearby(){
        currentloc="";
        showloading();
        clearmarkers();
	clearCsNearbyMarker();
        removeline();
        var ll1= map.getCenter();
        var ll2= ll1.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
        tlat=ll2.lat-alat;
        tlon=ll2.lon-alon;
        lastnearbylat = lat;
        lastnearbylon = lon;
        ajaxindex++;
        makeRequestref('getnearbyroute.php?lat='+tlat+'&lon='+tlon+'&l='+lang,'sysitembox',ajaxindex);
        setTimeout(function(){ makeRequestref('getnearbystop.php?lat='+tlat+'&lon='+tlon+'&l='+lang,'dummydiv',ajaxindex);}, 1000);
        currentlist=0;

        currentloc = callweb("get_rgeocode.php?lat="+tlat+"&lon="+tlon+"&l="+lang);
        var aaa = document.getElementById('skey');
        aaa.value = currentloc;

  //      map.zoomTo(17);

      }

      function shownearbystop(r,d,v,lat,lon){
        clearmarkers();
	clearCsNearbyMarker();
        var ll1= map.getCenter();
        var ll2= ll1.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
        tlat=ll2.lat-alat;
        tlon=ll2.lon-alon;
        ajaxindex++;
        if(lat!=0,lon!=0){
          makeRequestref('getnearbystopinroute.php?lat='+lat+'&lon='+lon+'&r='+r+'&d='+d+'&v='+v,'dummydiv',ajaxindex);
        }
        else{
          makeRequestref('getnearbystopinroute.php?lat='+tlat+'&lon='+tlon+'&r='+r+'&d='+d+'&v='+v,'dummydiv',ajaxindex);
        }
      }

      function getlonlat(lon,lat){
        return [lon,lat];
        //alert(lon+" "+lat);
        //return ol.proj.transform( [lon+alon, lat+alat], 'EPSG:4326',   'EPSG:3857');
      }


      function callweb(weburl){
       var url = weburl;
        var result = "";

        url = url.replace("'","~SQ~");
                                url = url.replace('""','~DQ~');
                                var n = url.indexOf("?");
                                if (n > 0){
                                        url = url + "&ssid=" + ssid;
                                }else{
                                        url = url + "?ssid=" + ssid;
                                }
                                sn++;
        if(url.indexOf("?")>0)
                                url=url+'&sysid='+sn;
                                else
                                url=url+'?sysid='+sn;


        $.ajax({
            url: url,
            type: 'GET',
            async: false,
            cache: false,
            timeout: 30000,
            error: function(){
              //debug("Error to connect server!");
            },
            success: function(msg){
              result = msg;
            }
        });
        return result;
      }

      var lastmakerequesturl = "";

      function makeRequestref(urlx,id,ref) {
        if(id=="sysinfo"){
          lastmakerequesturl=urlx;
        }
        urlx = urlx.replace("'","~SQ~");
        urlx = urlx.replace('""','~DQ~');
        var n = urlx.indexOf("?");
        if (n > 0){
          urlx = urlx + "&ssid=" + ssid;
        }else{
          urlx = urlx + "?ssid=" + ssid;
        }
        sn++;
        var pdf11 = document.getElementById('pdf11');
        if(pdf11 && id!="lbox2"){
          hidebox2();
        }
        sn++;
        var url="";
        if(urlx.indexOf("?")>0)
        url=urlx+'&sysid='+sn;
        else
        url=urlx+'?sysid='+sn;
        var http_request = false;
        var ts1 = "";
        var ts2 = "";
        var p=0;
        if (window.XMLHttpRequest) { // Mozilla, Safari,...
          http_request = new XMLHttpRequest();
          } else if (window.ActiveXObject) { // IE
          try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
            try {
              http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
          }
        }

        if (!http_request) {
          alert('Giving up :( Cannot create an XMLHTTP instance');
          return false;
        }
        http_request.onreadystatechange = function() {
        alertContentsref(urlx,http_request,id,ref); };
        http_request.open('GET', url, true);
        http_request.send(null);
      }



      function alertContentsref(urlx,http_request,id,ref) {

        if (http_request.readyState == 4 && ajaxindex==ref) {

          if (http_request.status == 200) {



                        var mesg = http_request.responseText;
                        if(id=="v_ustatus"){
              v_ustatus=mesg;
              }else{
              if(id.substring(0,4)=='txt_'){
                document.getElementById(id).value=mesg;
                                }else{
                if (urlx.indexOf('auto_8feba05d2378403aace93d05bbf36c55.php'))
                {
                console.log('>>>>>>>>>>>>>> ' + ref);
                }
                var checkcnt=0;
                /*while(document.getElementById(id) && checkcnt<5){
                  setTimeout('',500);
                  checkcnt=checkcnt+1;
                }*/
                if (urlx.indexOf('auto_8feba05d2378403aace93d05bbf36c55.php') > -1 && geteta_ref != ref)
                  return;
                else
                document.getElementById(id).innerHTML=mesg;
              }
              window.scrollTo(0,0);
            }
            } else {
                        errorcnt++;
                        //alert('There was a problem with the ajax request.');
          }
        }
      }

      function menu2action(){
          if(chmenumode==1 || true){
            if(startlat>0.0){
              document.ppsearch.sloc.value = Math.round(startlat*1000000)/1000000+','+Math.round(startlon*1000000)/1000000;
              startname=convertcharBACK(startname);
              document.getElementById('sloc').value=startname;
              document.getElementById('sloc').style.color='#000000';
              mapstartname=startname;
              mapstartlat=startlat;
              mapstartlon=startlon;
            }
            if(endlat>0.0){
              document.ppsearch.eloc.value = Math.round(endlat*1000000)/1000000+','+Math.round(endlon*1000000)/1000000;
              endname=convertcharBACK(endname);
              document.getElementById('eloc').value=endname;
              document.getElementById('eloc').style.color='#000000';
              mapendname=endname;
              mapendlat=endlat;
              mapendlon=endlon;
            }
          }else{
            startlon=startlat=endlon=endlat=0.0;
          }
          chmenumode=0;
          if(actioncode=='B' || true){
            clearmarkers();
	    clearCsNearbyMarker();
            showstartendpoints();
          }
      }

      function makeRequest(urlx,id) {
        if(id=="sysinfo"){
          var aaa = urlx.split(".");
          if(aaa[0]=="menu2" && lastmakerequesturl=="menu2"){
            menu2action();
            return;
          }
          lastmakerequesturl=aaa[0];
        }
        urlx = urlx.replace("'","~SQ~");
        urlx = urlx.replace('""','~DQ~');
        var n = urlx.indexOf("?");
        if (n > 0){
          urlx = urlx + "&ssid=" + ssid;
        }else{
          urlx = urlx + "?ssid=" + ssid;
        }
        sn++;
        var url="";
        if(urlx.indexOf("?")>0)
        url=urlx+'&sysid='+sn;
        else
        url=urlx+'?sysid='+sn;
        var http_request = false;
        var ts1 = "";
        var ts2 = "";
        var p=0;
        if (window.XMLHttpRequest) { // Mozilla, Safari,...
          http_request = new XMLHttpRequest();
          } else if (window.ActiveXObject) { // IE
          try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
            try {
              http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
          }
        }

        if (!http_request) {
          alert('Giving up :( Cannot create an XMLHTTP instance');
          return false;
        }
        http_request.onreadystatechange = function() {
        alertContents(http_request,id); };
        http_request.open('GET', url, true);
        http_request.send(null);
      }



      function alertContents(http_request,id) {
        if (http_request.readyState == 4) {
          if (id=='sysitembox2' || id=='sysitembox3' || id=='darea' || id=='dummydiv')
          hideloading(1000);
          if (http_request.status == 200) {
              var mesg = http_request.responseText;
              if(id=="v_ustatus"){
                v_ustatus=mesg;
              }else if(id=="*popup*"){
                popup_request(mesg);
              }else{
              if(id.substring(0,4)=='txt_'){
                document.getElementById(id).value=mesg;
                                }else{
                var checkcnt=0;
                while(document.getElementById(id) && checkcnt<5){
                  setTimeout('',500);
                  checkcnt=checkcnt+1;
                }
                document.getElementById(id).innerHTML=mesg;
                if(id=="autocom" || id=="autocom2"){
                  if(mesg.length<10){
                    document.getElementById(id).style.display ="none";
                  }
                }
              }
              window.scrollTo(0,0);
            }
            goresize();
            } else {
                        errorcnt++;
                        //alert('There was a problem with the ajax request.');
          }
        }
      }

      function gosearch(aaa){
        makeRequest('gosearch.php','search');
      }


      function vmarker(lat,lon){
        var ll;
        clearmarkers();
	clearCsNearbyMarker();
        ll=getlonlat(lon,lat);
        addmarker(ll,"R");
        map.setCenter(ll, 17);
        //map.panTo(ll);
      }

      function vroute(id){
        addline('route.php?id='+id,'#FF0000');
        makeRequest('busstop.php?id='+id,'dummydiv');
      }


      function goresizex()
      {
        var p2p_guide = document.getElementById('p2p_guide');
        var p2pmenu = document.getElementById('p2pmenu');
        var myHeight = document.body.clientHeight-10;
        //alert(myHeight);
        if(p2p_guide && p2pmenu) {
          p2p_guide.style.height=(myHeight - 22 - 52 - 84 - 8 - p2pmenu.clientHeight)+"px";
        }


        var itemlist_title_height=0;
        var itemlist_title = document.getElementById('itemlist_title');
        if(itemlist_title) {
          itemlist_title_height = itemlist_title.clientHeight;
        }

        var stoplist_title_height=0;
        var stoplist_title = document.getElementById('stoplist_title');
        if(stoplist_title) {
          stoplist_title_height = stoplist_title.clientHeight;
        }

        var p2p_routelist_title_height=0;
        var p2p_routelist_title = document.getElementById('p2p_routelist_title');
        if(p2p_routelist_title) {
          p2p_routelist_title_height = p2p_routelist_title.clientHeight;
          console.log("set p2p_routelist_title_height");
        }

        var p2p_stoplist_title_height=0;
        var p2p_stoplist_title = document.getElementById('p2p_stoplist_title');
        if(p2p_stoplist_title) {
          p2p_stoplist_title_height = p2p_stoplist_title.clientHeight;
          console.log("set p2p_stoplist_title_height");
        }

        var p2p_routenote_height=0;
        var routenote = document.getElementById('routenote');
        if(routenote) {
          p2p_routenote_height = routenote.clientHeight;
          console.log("set p2p_routenote_height");
        }

        var ajheight=0;
        var businfo = document.getElementById('businfo');
        if(businfo){
          ajheight=businfo.clientHeight-32;
        }
        var businfo2 = document.getElementById('businfo2');
        if(businfo2){
          ajheight=businfo2.clientHeight-50;
        }
        var x,y;
        if (self.innerHeight) // all except Explorer
        {
          x = self.innerWidth;
          y = self.innerHeight;
        }
        else if (document.documentElement && document.documentElement.clientHeight)
        // Explorer 6 Strict Mode
        {
          x = document.documentElement.clientWidth;
          y = document.documentElement.clientHeight;
        }
        else if (document.body) // other Explorers
        {
          x = document.body.clientWidth;
          y = document.body.clientHeight;
        }
        var screenh = y-28;
        var screenw = x-389;

        var ob = document.getElementById('optionbar');
        if(ob)
          ob.style.left = (screenw+265)+"px";
        var bmlist = document.getElementById('bookmarklist');
        if(bmlist)
          bmlist.style.left = (screenw+265-190)+"px";

        var bs1 = document.getElementById('hotspot');
        if(bs1){
          bs1.style.left = (screenw+265)+"px";
          bs1.style.top = (screenh-25)+"px";
        }
        var bs2 = document.getElementById('hotspot2');
        if(bs2){
          bs2.style.left = (screenw+265)+"px";
          bs2.style.top = (screenh-84)+"px";
        }
        var mwy = document.getElementById('mapwithyou');
        if(mwy){
          mwy.style.left = (screenw+235)+"px";
          mwy.style.top = (screenh+6)+"px";
        }

        var w = document.getElementById('wrapper');
        if(w){
          w.style.top = ((document.documentElement.clientHeight-500)/2)+"px";
          w.style.left = ((document.documentElement.clientWidth-600)/2)+"px";
        }
        var w2 = document.getElementById('wrapper2');
        if(w2){
          w2.style.top = ((document.documentElement.clientHeight-300)/2)+"px";
          w2.style.left = ((document.documentElement.clientWidth-400)/2)+"px";
        }
        var w3 = document.getElementById('wrapper3');
        if(w3){
          document.getElementById('wrapper3').style.top = ((document.documentElement.clientHeight-600)/2) +"px";
          if (document.getElementById('wrapper4').style.visibility!="hidden")
          {
            document.getElementById('wrapper3').style.left = ((document.documentElement.clientWidth)/2+50)+"px";
          }
          else
          {
            document.getElementById('wrapper3').style.left = ((document.documentElement.clientWidth-400)/2)+"px";
          }
          // document.getElementById('wrapper3').style.visibility = "visible";
        }
        var w4 = document.getElementById('wrapper4');
        if(w4){
          document.getElementById('wrapper4').style.top = ((document.documentElement.clientHeight-600)/2) +"px";
          if (document.getElementById('wrapper3').style.visibility!="hidden")
          {
            document.getElementById('wrapper4').style.left = ((document.documentElement.clientWidth)/2-450)+"px";
          }
          else
          {
            document.getElementById('wrapper4').style.left = ((document.documentElement.clientWidth-500)/2)+"px";
          }
          // document.getElementById('wrapper4').style.visibility = "visible";
        }
        var w5 = document.getElementById('wrapper5');
        if(w5){
          document.getElementById('wrapper5').style.top = ((document.documentElement.clientHeight-600)/2) +"px";
          // if (document.getElementById('wrapper3').style.visibility!="hidden")
          // {
          document.getElementById('wrapper4').style.left = ((document.documentElement.clientWidth)/2-450)+"px";
          // }
          // else
          // {
          // document.getElementById('wrapper4').style.left = ((document.documentElement.clientWidth-500)/2)+"px";
          // }
          // document.getElementById('wrapper4').style.visibility = "visible";
        }
        var ibox = document.getElementById('sysitembox');
        if(ibox){
          sysboxheight(ibox);
        }
        var ibox2 = document.getElementById('sysitembox2');
        if(ibox2){
          sysboxheight(ibox2);
        }
        var ibox3 = document.getElementById('sysitembox3');
        if(ibox3){
	  console.log("Top "+ibox3.style.top);
          sysboxheight(ibox3);
        }
        var ibox4 = document.getElementById('sysitembox4');
        if(ibox4){
          ibox4.style.height=(screenh-162)+"px";
        }
        var nbbox = document.getElementById('nearbylist');
        if(nbbox){
          var cheight = parseInt(ibox.style.height.substring(0,3));
          nbbox.style.height=(cheight-43)+"px";
        }
        var al1 = document.getElementById('arealist1');
        if(al1){
          var cheight = parseInt(ibox3.style.height.substring(0,3));
          al1.style.height=(cheight-43)+"px";
        }

        var rl1 = document.getElementById('routelist1');
        if(rl1){
          if(ibox2){
            var cheight = parseInt(ibox2.style.height.substring(0,3));
            rl1.style.height=(cheight-42)+"px";
          }
          if(ibox3){
            var cheight = parseInt(ibox3.style.height.substring(0,3));
            rl1.style.height=(cheight-48)+"px";
          }
        }
        var rl2 = document.getElementById('routelist2');
        if(rl2 && ibox2){
          var cheight = parseInt(ibox2.style.height.substring(0,3));
          if (p2p_routelist_title_height!= 0){
            rl2.style.height=(cheight - p2p_routelist_title_height- p2p_routenote_height - 5)+"px";
	    console.log("r1="+rl2.style.height);
	  }
          if (itemlist_title_height!= 0){
            rl2.style.height=(cheight - itemlist_title_height)+"px";
            rl2.style.height="calc(100vh - 230px)";
	    console.log("r3="+rl2.style.height);
	  }
        }else if(rl2 && ibox){
          var cheight = parseInt(ibox.style.height.substring(0,3));
          rl2.style.height=(cheight-42)+"px";
	  rl2.style.height="calc(100vh - 226px)";
	    console.log("r4="+rl2.style.height);
        }else if(rl2 && ibox3){
          var cheight = parseInt(ibox3.style.height.substring(0,3));
          rl2.style.height=(cheight - p2p_routelist_title_height - p2p_routenote_height - 5)+"px";
          console.log("set p2p_routelist height");
	    console.log("r5="+rl2.style.height);
        }

        var slpp = document.getElementById('sysstoplistpp');
        if(slpp){
          var dtheight = 0;
          var ttheight = 26;
          var cheight = parseInt(ibox3.style.height.substring(0,3));
          slpp.style.height=(cheight-101-40-ajheight)+"px";
          var dtheight=(cheight-101-40-ajheight-ttheight);
          var dtsl1 = document.getElementById('dtsysstoplist1');
          dtsl1.style.height=(dtheight+45)+"px";
          console.log("test 3");
        }
        var sl1 = document.getElementById('sysstoplist1');
        if(sl1){
          var dtheight = 0;
          var ttheight = 26;
          var sysstoplist1_height = 0;
          if(ibox2){
            var cheight = parseInt(ibox2.style.height.substring(0,3));
            sl1.style.height=(cheight-42-stoplist_title_height-35-5+5)+"px";
            dtheight=(cheight-101-40-ajheight-ttheight-50);
            console.log("set sysstoplist 1");
          }else if(ibox3){
            var cheight = parseInt(ibox3.style.height.substring(0,3));
            sl1.style.height=(cheight-42-stoplist_title_height-35-5+5)+"px";
            dtheight=(cheight-101-40-ajheight-ttheight);
            console.log("set sysstoplist 1");
          }else{
            var cheight = parseInt(ibox.style.height.substring(0,3));
            sl1.style.height=(cheight-42-stoplist_title_height-35-5+5)+"px";
            dtheight=(cheight-101-35-ajheight-ttheight);
            console.log("xtest 3");
          }

          sysstoplist1_height = parseInt(sl1.style.height.substring(0,3));
        }



        var il1 = document.getElementById('itemlist1');
        if(il1){

          if(ibox3){
            var cheight = parseInt(ibox3.style.height.substring(0,3));
            il1.style.height = (cheight - p2p_stoplist_title_height - p2p_routenote_height)+"px";
            il1.style.height = (sysstoplist1_height)+"px";

          }else if(ibox2 || ibox){
            il1.style.height = (sysstoplist1_height)+"px";

          console.log("set itemlist1height");
          }

          var dtsl1 = document.getElementById('dtsysstoplist1');
          if(dtsl1){
            dtsl1.style.height=(sysstoplist1_height-24)+"px";  // Busstop, fare title height = 24
            console.log("set dtsystoplist1 height");
          }
        }

        var il2 = document.getElementById('itemlist2');
        if(il2){

          if(ibox3){
            var cheight = parseInt(ibox3.style.height.substring(0,3));
            il2.style.height = (cheight - p2p_stoplist_title_height)+"px";
            il2.style.height = (sysstoplist1_height)+"px";
          }else if(ibox2 || ibox){
            il2.style.height = (sysstoplist1_height)+"px";
          console.log("set itemlist2 height");
          }
        }

        var pbar = document.getElementById('pdfbar');
        if(pbar){
          pbar.style.top=(screenh+20)+"px";
        }

        var rc = document.getElementById('redcross');
        if(rc){
          rc.style.top=(screenh/2+7)+"px";
          rc.style.left=(screenw/2+387-15)+"px";
        }

	var snote = document.getElementById('specialNote');
	if(snote){
	  snote.style.bottom=10+"px";
	}

      }

      function fixtop(sid,top){
	var sbox = document.getElementById(sid);
	if(sbox){
		sbox.style.top = top+"px";
	}
      }

      function goetaresize()
      {
	var popupboxlist = document.getElementById('popupboxlist');
        var nextbus = document.getElementById('nextbus');
	nextbus.style.height = (popupboxlist.clientHeight - 18) + "px";

        var nextbus_title = document.getElementById('nextbus_title');
        var nextbus_list = document.getElementById('nextbus_list');
	var nextbus_refresh = document.getElementById('nextbus_refresh');
        if(nextbus_refresh){
		nextbus_list.style.height=(nextbus.clientHeight - nextbus_title.clientHeight - nextbus_refresh.clientHeight - 10)+"px";
		var nextbus_listitem = document.getElementById('nextbus_listitem');
		var nextbus_space = document.getElementById('nextbus_space');
		var nextbus_disclaimer = document.getElementById('nextbus_disclaimer');
		console.log("Listitem ="+nextbus_listitem.clientHeight+"||Disclaimer ="+nextbus_disclaimer.clientHeight+"|| List ="+nextbus_list.clientHeight);
		if((nextbus_listitem.clientHeight + nextbus_disclaimer.clientHeight) < nextbus_list.clientHeight){
			nextbus_space.style.height = (nextbus_list.clientHeight - nextbus_listitem.clientHeight - nextbus_disclaimer.clientHeight) + "px";
		}
	}
      }

      function gorouteinstopresize()
      {
        var infoonmap = document.getElementById('infoonmap');
        var busstopname = document.getElementById('busstopname');
        var popupboxlist = document.getElementById('popupboxlist');
        var popupboxlistmenu = document.getElementById('popupboxlistmenu');
        popupboxlist.style.height=(infoonmap.clientHeight - busstopname.clientHeight - popupboxlistmenu.clientHeight)+"px";

      }

      function movesider(){
        var siderbar = document.getElementById('zoomslider');
        if(siderbar && map!=null){
          siderbar.style.top = ((18-map.getZoom())*11+119)+"px";
        }
      }

      function itemhighlighton(ss){
        if(ss.substring(0,2)=="xx")
        //document.getElementById(ss).style.backgroundColor='#808080';
        document.getElementById(ss).style.backgroundColor='#bdbdbd';
        else
        document.getElementById(ss).style.backgroundColor='#ffa500';
      }

      function itemhighlightoff(ss){
        document.getElementById(ss).style.backgroundColor='';
      }

      function menuon(ss,mode){
        if(mode==1)
        document.getElementById(ss).style.backgroundColor='#FF0000';
        else
        document.getElementById(ss).style.backgroundColor='#FFA500';
      }

      function moption(ss,mode){
        if(mode==1)
          document.getElementById(ss).style.backgroundColor='#E0E0E0';
        else
          document.getElementById(ss).style.backgroundColor='#FFFFFF';
      }

      function gomenu(ss,m){
        if(ss!=4){
          clearmarkers();
	  clearCsNearbyMarker();
          hidebox2();
        }
        if(ss!=0 && ss!=4 ){
          clearmarkers();
	}
	clearCsNearbyMarker();
        if(mapstartlat>0.0&&mapstartlon>0.0){
          addcustommarker(getlonlat(mapstartlon,mapstartlat),ssmar,36,80,-20,-80);
        }
        if(mapendlat>0.0&&mapendlon>0.0){
          addcustommarker(getlonlat(mapendlon,mapendlat),eemar,36,80,-20,-80);
        }
        if(ss!=4){
	  //mwypopupremove();
	  //removeline();
	  hidebox5();
	  hidebox4();
        }
        makeRequest('menu'+ss+'.php'+'?l='+lang+'&m='+m,'sysinfo');
        currentmenu=ss;
        if(ss!=0){
          stopnearby();
        }
        cleartraffic();
      }

      function hidemenubar(){
	document.getElementById("hotspot_line").style.backgroundColor='';
      }

      function loadbox2(boxheadfile,boxfile){
        makeRequest(boxheadfile,'boxhead2');
        makeRequest(boxfile,'lbox2');
        showbox2();
      }

      function loadbox3(boxheadfile,boxfile)
      {
        makeRequest(boxheadfile,'boxhead3');
        makeRequest(boxfile,'lbox3');
        showbox3();
      }

      function loadbox4(boxheadfile,boxfile,mode)
      {
        makeRequest(boxheadfile,'boxhead4');
        makeRequest(boxfile,'lbox4');
        showbox4(mode);
      }

      function loadbox5(boxheadfile,boxheadfile2,boxfile,boxfile2)
      {
        makeRequest(boxheadfile,'boxhead5-1');
        makeRequest(boxheadfile2,'boxhead5-2');
        makeRequest(boxfile,'lbox5-1');
        makeRequest(boxfile2,'lbox5-2');
        showbox5();
      }

      function loadbox6(boxheadfile,boxfile)
      {
        makeRequest(boxheadfile,'boxhead6');
        makeRequest(boxfile,'lbox6');
        showbox6();
      }

      function loadbox7(boxheadfile,boxfile)
      {
        makeRequest(boxheadfile,'boxhead7');
        makeRequest(boxfile,'lbox7');
        showbox7();
      }

      function genpdf(f){
        str1="正在產生報表，請稍候...";
        if(lang==1){
          str1="Generating, please wait...";
        }
        if(lang==2){
          str1="正在产生报表，请稍候...";
        }
        var box2=document.getElementById('lbox2');
        box2.innerHTML='<table width="100%" height="282" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"><tr><td align="center" valign="middle">'+
        '<img src="loading_orange.gif" /><br><br><br>'+str1+'</td></tr></table>';
        makeRequest('pp2genpdf.php?f='+f,'dummydiv');
      }

      function fbgenpdf(f1,f2){
        makeRequest("fbgenpdf.php?f1="+f1+"&f2="+f2,"dummydiv");
      }

      function pdftomail(e,f,fx){
        pic="pdfview.png";
        pdfname=f;
        pdfnamex=fx;
        str1="檢視";
        str2="發送郵件";
        bk="返回";
        if(lang==1){
          str1="View";
          str2="Send Email";
          bk="back";
        }
        if(lang==2){
          str1="检视";
          str2="发送邮件";
          bk="返回";
        }
        var box2=document.getElementById('lbox2');
        if(e!=""){
          sendpdf(e);
          box2.innerHTML=oldpdf;
          document.getElementById('femail').value=e;
          /*
            box2.innerHTML='<form name="fpdf" id="fpdf"><table width="100%" height="282" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"><tr>'+
            '<td align="center" valign="middle"><a href="pdf/'+f+'.pdf" target="_BLANK"><img src="'+pic+'"><br>'+str1+'</a>'+
            '<br><br><input type="button" value="'+str2+'" onclick="sendpdf(\''+e+'\');"></td></tr></table></form>';
          */
          }else{
          var p=oldpdf.toLowerCase().indexOf('<span');
          //alert(p);
          var ts1='';
          var ts2='';
          if(f!="")
          ts1='<td align="center" valign="middle"><a href="pdf/'+f+'.pdf" target="_BLANK"><img src="'+pic+'"><br>'+str1+'</a><br></td>';
          if(fx!="")
          ts2='<td align="center" valign="middle"><a href="pdf/'+fx+'.pdf" target="_BLANK"><img src="'+pic+'"><br>'+str1+'</a></td>';
          var tpdf = oldpdf.substring(0,p);
          box2.innerHTML='<table width="390" height="280" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"><tr><td>'+tpdf+
          '</td><td><table width="50" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"><tr height="90">'+ts1+'</tr><tr height="90">'+ts2+'</tr></table>'+
          '</td></tr>'+
          '<tr><td colspan="2" align="right" valign="bottom"><span onclick="document.getElementById(\'lbox2\').innerHTML=oldpdf;" style="cursor:pointer;">'+
          '<b>'+bk+'</b></span>&nbsp;&nbsp;</td><tr></table></div>';
          /*
            box2.innerHTML=oldpdf.substring(0,p)+
            '<table width="370" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"><tr><td width="40"></td>'+ts1+ts2+
            '<td width="40" align="right" valign="bottom"><span onclick="document.getElementById(\'lbox2\').innerHTML=oldpdf;" style="cursor:pointer;">'+
            '<b>'+bk+'</b></span>&nbsp;&nbsp;</td></tr>'+
            '</table></div>';
          */
        }
      }

      function pdftoprint(f){
        var pic="";
        if(f.indexOf("_1")>0)
        pic="pdf1.png";
        else if(f.indexOf("_2")>0)
        pic="pdf2.png";
        else if(f.indexOf("_3")>0)
        pic="pdf3.png";
        else
        pic="pdf4.png";
        pdfname=f;
        str1="資料完成按這裡顯示";
        if(lang==1){
          str1="Click here to show";
        }
        if(lang==2){
          str1="资料完成按这里显示";
        }
        var box2=document.getElementById('lbox2');
        box2.innerHTML='<form name="fpdf" id="fpdf"><table width="100%" height="282" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"><tr>'+
        '<td align="center" valign="middle"><a href="pdf/'+f+'.pdf" target="_BLANK"><img src="'+pic+'"><br>'+str1+'</a>'+
        '</td></tr></table></form>';
      }

      function sendpdf(eee){
        makeRequest('sendpdf.php?f='+pdfname+'&fx='+pdfnamex+'&email='+eee+'&l='+lang,'dummydiv');
      }

      function msendpdf(mode,pdf,f1,f2,extra){
        //alert(mode + ', ' + pdf +', ' + f1 + ', ' + f2 + ', ' + extra);
        var box2=document.getElementById('lbox2');
        oldpdf=box2.innerHTML;
        str1="請輸入有效的電郵地址";
        str2="請選擇所需資料";
        str3="您只能傳送電郵給一位收件者";
        if(lang==1){
          str1="Please enter a valid email address";
          str2="Please select your required information";
          str3="You can send email to one recipient only";
        }
        if(lang==2){
          str1="请输入有效的电邮地址";
          str2="请选择所需资料";
          str3="您只能传送电邮给一位收件者";
        }
        var femail=document.getElementById('femail');
        var ee=femail.value;
        var emailCount = ee.match(/@/g);

        if(extra=="V")
        ee="";

        if (emailCount != null && emailCount.length > 1){
          alert(str3);
        }
        else if(extra!="V" && (ee.length<5 || !emailValidation(ee))){
          alert(str1);
        }
        else{
          var t1=document.getElementById('pdf11').src.indexOf('Ok-icon');
          var t2=document.getElementById('pdf12').src.indexOf('Ok-icon');
          var t3=document.getElementById('pdf21').src.indexOf('Ok-icon');
          var t4=-1;
          var tt=document.getElementById('pdf22');
          if(tt)
          t4=tt.src.indexOf('Ok-icon');
          var p1="";
          if(mode=="A"){
            if(t1>0 && t2>0){
              p1=pdf+"_A";
              }else if(t1>0){
              p1=pdf+"_1";
              }else if(t2>0){
              p1=pdf+"_2";
            }
            }else{
            if(t1>0 && t2>0){
              p1=pdf+"_B";
              }else if(t1>0){
              p1=pdf+"_3";
              }else if(t2>0){
              p1=pdf+"_4";
            }
          }
          if(t3<0)
          f1="";
          if(t4<0)
          f2="";
          if(p1=="" && f1=="" && f1==""){
            alert(str2);
            }else{
            str1="載入中, 請稍候...";
            if(lang==1){
              str1="Loading, please wait...";
            }
            if(lang==2){
              str1="载入中, 请稍候...";
            }
            box2.innerHTML='<table width="100%" height="282" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"><tr><td align="center" valign="middle">'+
            '<img src="loading_orange.gif" /><br><br><br>'+str1+'</td></tr></table>';
            makeRequest('msendpdf.php?e='+ee+'&p='+p1+'&f1='+f1+'&f2='+f2+'&l='+lang,'dummydiv');
          }
        }
      }

      // email validation
      function emailValidation(email) {

        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if(reg.test(email) == false) {
          return false;
        }

        return true;
      }




      function showbox2()
      {
        document.getElementById('wrapper2').style.top = ((document.documentElement.clientHeight-300)/2)+"px";
        document.getElementById('wrapper2').style.left = ((document.documentElement.clientWidth-400)/2)+"px";
        document.getElementById('wrapper2').style.visibility = "visible";
      }

      function hidebox2(){
        document.getElementById('wrapper2').style.visibility = 'hidden';
        document.getElementById('lbox2').innerHTML='';
      }

      function showbox3()
      {
        document.getElementById('wrapper3').style.top = ((document.documentElement.clientHeight-600)/2) +"px";
        if (document.getElementById('wrapper4').style.visibility!="hidden")
        {
          document.getElementById('wrapper3').style.left = ((document.documentElement.clientWidth)/2+50)+"px";
        }
        else
        {
          document.getElementById('wrapper3').style.left = ((document.documentElement.clientWidth-400)/2)+"px";
        }
        document.getElementById('wrapper3').style.visibility = "visible";
      }

      function hidebox3(){
        document.getElementById('wrapper3').style.visibility = 'hidden';
        document.getElementById('lbox3').innerHTML='';
      }

      function showbox4(mode)
      {
        document.getElementById('wrapper4').style.top = ((document.documentElement.clientHeight-600)/2) +"px";
        if (document.getElementById('wrapper3').style.visibility!="hidden")
        {
          document.getElementById('wrapper4').style.left = ((document.documentElement.clientWidth)/2-450)+"px";
        }
        else
        {
          document.getElementById('wrapper4').style.left = ((document.documentElement.clientWidth-500)/2)+"px";
        }
        document.getElementById('wrapper4').style.visibility = "visible";
      }

      function hidebox4(){
        document.getElementById('wrapper4').style.visibility = 'hidden';
        document.getElementById('lbox4').innerHTML='';
      }

      function showbox5()
      {
        document.getElementById('wrapper5').style.top = ((document.documentElement.clientHeight-600)/2)+"px";
        document.getElementById('wrapper5').style.left = ((document.documentElement.clientHeight-600)/2)+"px";
        document.getElementById('wrapper5').style.visibility = "visible";
      }

      function hidebox5(){
        document.getElementById('wrapper5').style.visibility = 'hidden';
        document.getElementById('lbox5-1').innerHTML='';
        document.getElementById('lbox5-2').innerHTML='';
      }

      function showbox6()
      { //left: calc(380px + (100% - 380px - 206px)/2); top: calc(50% + 50px);
        document.getElementById('wrapper6').style.top = ((document.documentElement.clientHeight)/2 + 50)+"px";
        //document.getElementById('wrapper6').style.left = (380 + (document.documentElement.clientWidth -380 -206)/2)+"px";
        document.getElementById('wrapper6').style.visibility = "visible";
      }

      function hidebox6(){
        document.getElementById('wrapper6').style.visibility = 'hidden';
        document.getElementById('lbox6').innerHTML='';
      }

      function showbox7()
      {
        document.getElementById('wrapper7').style.top = ((document.documentElement.clientHeight-300)/2)+"px";
        document.getElementById('wrapper7').style.left = ((document.documentElement.clientWidth-300)/2)+"px";
        document.getElementById('wrapper7').style.visibility = "visible";
      }

      function hidebox7(){
        document.getElementById('wrapper7').style.visibility = 'hidden';
        document.getElementById('lbox7').innerHTML='';
      }

      function hidesysitembox(s){
        var list = document.getElementById(s);
        list.style.display = "none";
      }

      function showsysitembox(s){
        var list = document.getElementById(s);
        list.style.display = "block";
      }

      function loadbox(boxheadfile,boxfile)
      {
        makeRequest(boxheadfile,'boxhead');
        makeRequest(boxfile,'lbox');
        showbox();
      }

      function showbox()
      {
        document.getElementById('wrapper').style.top = ((document.documentElement.clientHeight-500)/2)+"px";
        document.getElementById('wrapper').style.left = ((document.documentElement.clientWidth-600)/2)+"px";
        document.getElementById('wrapper').style.visibility = "visible";
      }

      function hidebox(){
        document.getElementById('wrapper').style.visibility = 'hidden';
        document.getElementById('lbox').innerHTML='';
      }

      function routeinfo(r,d,v){
        makeRequest('getstopinroute.php?r='+r+'&d='+d+'&v='+v,'sysinfo');
      }

      function showxarea(id,s,e,t,darea){
        showloading();
        makeRequest("ppxsearch_2.php?id="+id+"&s="+s+"&e="+e+"&t="+t+'&l='+lang,darea);
        stack.push(document.getElementById('sysitembox3').innerHTML);
      }

      function showdroute(r,d,v,r2,d2,v2,s,e,sz,ez,xa){
        r = trim(r);
        d = trim(d);
        v = trim(v);

        current_r = r.toUpperCase();
        current_d = d.toUpperCase();
        current_v = v.toUpperCase();

        if(current_d=='')
        current_d="T";


        r2 = trim(r2);
        d2 = trim(d2);
        v2 = trim(v2);

        current_r2 = r2.toUpperCase();
        current_d2 = d2.toUpperCase();
        current_v2 = v2.toUpperCase();

        if(current_d2=='')
        current_d2="T";


        showloading();
        mwypopupremove();
        addline('getpproute.php?r='+r+'&d='+d+'&v='+v+"&s="+s+"&e="+e+"&line=1",'#FF0000');
        appendline('getpproute.php?r='+r2+'&d='+d2+'&v='+v2+"&s="+s+"&e="+e+'&l='+lang + "&line=1",'#0000FF');
        makeRequest('getpp2rroutestop.php?r='+r+'&d='+d+'&v='+v+'&r2='+r2+'&d2='+d2+'&v2='+v2+'&s='+s+'&e='+e+'&l='+lang+'&sz='+sz+'&ez='+ez+'&xa='+xa,'sysitembox3');
        //alert('getpp2rroutestop.php?r='+r+'&d='+d+'&v='+v+'&r2='+r2+'&d2='+d2+'&v2='+v2+'&s='+s+'&e='+e+'&l='+lang+'&sz='+sz+'&ez='+ez+'&xa='+xa);
        stack.push(document.getElementById('sysitembox3').innerHTML);
      }

      function showpdf(r,d,v,r2,d2,v2,s,e,sz,ez,xa){
        var sl=encodeURIComponent(document.getElementById('sloc').value);
        var el=encodeURIComponent(document.getElementById('eloc').value);
        loadbox2("boxtitle2.php?t=PDF&l="+lang,'getpp2rroutestopscript.php?r='+r+'&d='+d+'&v='+v+'&r2='+r2+'&d2='+d2+'&v2='+v2+'&s='+s+'&e='+e+'&l='+lang+'&sz='+sz+'&ez='+ez+'&xa='+xa+'&sl='+sl+'&el='+el);
      }

      function showpdfs(r,d,v,s,e,sz,ez){
        var sl=encodeURIComponent(document.getElementById('sloc').value);
        var el=encodeURIComponent(document.getElementById('eloc').value);
        loadbox2("boxtitle2.php?t=PDF&l="+lang,'getpproutestopscript.php?r='+r+'&d='+d+'&v='+v+'&s='+s+'&e='+e+'&l='+lang+'&sz='+sz+'&ez='+ez+'&sl='+sl+'&el='+el);
      }

      function showpdfd(r,d,v,r2,d2,v2,s,e,sz,ez,xa){
        alert("Not Ready");
      }

      function showpproute(r,d,v,s,e){
        r = trim(r);
        d = trim(d);
        v = trim(v);

        current_r = r.toUpperCase();
        current_d = d.toUpperCase();
        current_v = v.toUpperCase();

        if(current_d=='')
        current_d="T";

        current_r2 = '';
        current_d2 = '';
        current_v2 = '';


        hlstop="";
        mwypopupremove();
        addline('getpproute.php?r='+r+'&d='+d+'&v='+v+"&s="+s+"&e="+e+"&line=1",'#FF0000');
        if(sysmode==0 || sysmode==-10){
          makeRequest('getppstopinroute.php?r='+r+'&d='+d+'&v='+v+'&s='+s+'&e='+e+'&l='+lang,'sysitembox');
          stack.push(document.getElementById('sysitembox').innerHTML);
          sysmode=-10;
          }else if(sysmode==1){
          makeRequest('getppstopinroute.php?r='+r+'&d='+d+'&v='+v+'&s='+s+'&e='+e+'&l='+lang,'sysitembox2');
          stack.push(document.getElementById('sysitembox2').innerHTML);
          }else{
          makeRequest('getppstopinroute.php?r='+r+'&d='+d+'&v='+v+'&s='+s+'&e='+e+'&l='+lang,'sysitembox3');
          stack.push(document.getElementById('sysitembox3').innerHTML);
        }
      }

      var current_r;
      var current_d;
      var current_v;

      var current_r2;
      var current_d2;
      var current_v2;

      function ltrim(instr){
        return instr.replace(/^[\s]*/gi,"");
      }

      function rtrim(instr){
        return instr.replace(/[\s]*$/gi,"");
      }

      function trim(instr){
        instr = ltrim(instr);
        instr = rtrim(instr);
        return instr;
      }

  /*    function showvariance(r,d,v,to,addStack){

        r = trim(r);
        d = trim(d);
        v = trim(v);

        current_r = r.toUpperCase();
        current_d = d.toUpperCase();
        current_v = v.toUpperCase();

        if(current_d=='')
        current_d="T";

        current_r2 = '';
        current_d2 = '';
        current_v2 = '';


        showloading();
        hlstop="";
        mwypopupremove();
        addline('getroute.php?r='+r+'&d='+d+'&v='+v,'#FF0000');
        makeRequest('getroutestop.php?r='+r+'&d='+d+'&v='+v+'&l='+lang,'dummydiv');
        if(sysmode==0 || sysmode==-10){
          makeRequest('getvariance.php?r='+r+'&d='+d+'&v='+v+'&l='+lang+'&to='+to+'&cur='+currentlist+'&rdv='+rdv+'&bound='+bound,'sysitembox');

          if (addStack)
          stack.push(document.getElementById('sysitembox').innerHTML);
          sysmode=-10;
          }else if(sysmode==1){
          makeRequest('getvariance.php?r='+r+'&d='+d+'&v='+v+'&l='+lang+'&to='+to+'&cur='+currentlist+'&rdv='+rdv+'&bound='+bound,'sysitembox2');

          if (addStack)
          stack.push(document.getElementById('sysitembox2').innerHTML);
          }else{
          makeRequest('getvariance.php?r='+r+'&d='+d+'&v='+v+'&l='+lang+'&to='+to+'&cur='+currentlist+'&rdv='+rdv+'&bound='+bound,'sysitembox3');
        }
        goresize();

        currentlist=0;
      }*/

      function showvariance1(list_id, addStack){

        showloading();
        hlstop="";
        mwypopupremove();
        if(sysmode==0 || sysmode==-10){
          var tbox = document.getElementById('sysitembox');
          tbox.style.top="150px";
          makeRequest('getvariance.php?lid='+list_id+'&l='+lang+'&cur='+currentlist+'&rdv='+autoRouteSearch_rdv+'&bound='+autoRouteSearch_bound,'sysitembox');

          if (addStack)
          stack.push(document.getElementById('sysitembox').innerHTML);
          sysmode=-10;
          }else if(sysmode==1){
          var tbox = document.getElementById('sysitembox2');
          tbox.style.top="150px";
          makeRequest('getvariance.php?lid='+list_id+'&l='+lang+'&cur='+currentlist+'&rdv='+autoRouteSearch_rdv+'&bound='+autoRouteSearch_bound,'sysitembox2');

          if (addStack)
          stack.push(document.getElementById('sysitembox2').innerHTML);
          }else{
          var tbox = document.getElementById('sysitembox3');
	  if(tbox) tbox.style.top="150px";
          makeRequest('getvariance.php?lid='+list_id+'&l='+lang+'&cur='+currentlist+'&rdv='+autoRouteSearch_rdv+'&bound='+autoRouteSearch_bound,'sysitembox3');

        }
        goresize();

        currentlist=0;
      }

      function showvariance2(info, addStack){
        showloading();
      //  hlstop="";
        mwypopupremove();
        console.log('stopselect=');
        console.log(stopselect);
        console.log('actioncode=');
        console.log(actioncode);
        if(sysmode==0 || sysmode==-10){
          makeRequest('getvariance.php?info='+info+'&l='+lang+'&cur='+currentlist+'&rdv='+autoRouteSearch_rdv+'&bound='+autoRouteSearch_bound,'sysitembox');

          if (addStack) stack.push(document.getElementById('sysitembox').innerHTML);
          sysmode=-10;
          }else if(sysmode==1){
          makeRequest('getvariance.php?info='+info+'&l='+lang+'&cur='+currentlist+'&rdv='+autoRouteSearch_rdv+'&bound='+autoRouteSearch_bound,'sysitembox2');

      	  if (addStack) stack.push(document.getElementById('sysitembox2').innerHTML);
          }else{
          var tbox = document.getElementById('sysitembox3');
          tbox.style.top="150px";
          makeRequest('getvariance.php?info='+info+'&l='+lang+'&cur='+currentlist+'&rdv='+autoRouteSearch_rdv+'&bound='+autoRouteSearch_bound,'sysitembox3');
        }
        //goresize();

        currentlist=0;
        showleftpanel();
      }
      function showroute(r,d,v,addStack){
        r = trim(r);
        d = trim(d);
        v = trim(v);

        current_r = r.toUpperCase();
        current_d = d.toUpperCase();
        current_v = v.toUpperCase();

        if(current_d=='')
        current_d="T";

        current_r2 = '';
        current_d2 = '';
        current_v2 = '';


        showloading();
        hlstop="";
        mwypopupremove();
        addline('getroute.php?r='+r+'&d='+d+'&v='+v,'#FF0000');
        makeRequest('getroutestop.php?r='+r+'&d='+d+'&v='+v+'&l='+lang,'dummydiv');
        if(sysmode==0 || sysmode==-10){
          makeRequest('getstopinroute.php?l='+lang+'&cur='+currentlist,'sysitembox');

          if (addStack)
          stack.push(document.getElementById('sysitembox').innerHTML);
          sysmode=-10;
          }else if(sysmode==1){
          makeRequest('getstopinroute.php?l='+lang+'&cur='+currentlist,'sysitembox2');

          if (addStack)
          stack.push(document.getElementById('sysitembox2').innerHTML);
          }else{
          makeRequest('getstopinroute.php?l='+lang+'&cur='+currentlist,'sysitembox3');
        }
        goresize();

        currentlist=0;
      }

      function showroute1(info, addStack){
        info=encodeURIComponent(info);
        //alert(info);
        //info = "1||G||11-CEF-1||一二三||CTB***11-CEF-1***1***48***10100***O";
        clearmarkers();
	clearCsNearbyMarker();
        removeCircle();
        showloading();
        hlstop="";
        mwypopupremove();
        variantcount = 1;
        addline('getline.php?info='+info,'#FF0000');
        makeRequest('showsingleroutestops2.php?info='+info+'&l='+lang,'dummydiv');
        if(sysmode==0 || sysmode==-10){
          makeRequest('getstopinroute.php?l='+lang+'&info='+info+'&cur='+currentlist,'sysitembox');
          if (addStack)
          stack.push(document.getElementById('sysitembox').innerHTML);
          sysmode=-10;
          }else if(sysmode==1){
          makeRequest('getstopinroute.php?l='+lang+'&info='+info+'&cur='+currentlist,'sysitembox2');
          if (addStack)
          stack.push(document.getElementById('sysitembox2').innerHTML);
          }else{
          makeRequest('getstopinroute.php?l='+lang+'&info='+info+'&cur='+currentlist,'sysitembox3');
        }
        //goresize();

        currentlist=0;
        console.log(variantcount);
      }

      function showsingleroutestops(info, eta){
        makeRequest('showsingleroutestops2.php?info='+info+'&eta='+eta+'&l='+lang,'dummydiv');
      }

      function showroutep2p(info, list_id, generalinfo){
        showloading();
        mwypopupremove();
//        addline('getlinep2p.php?info='+info,'#FF0000');
//        addline('getpproute.php?r='+r+'&d='+d+'&v='+v+"&s="+s+"&e="+e+"&line=1",'#FF0000');
//        appendline('getpproute.php?r='+r2+'&d='+d2+'&v='+v2+"&s="+s+"&e="+e+'&l='+lang + "&line=1",'#0000FF');
        makeRequest('getp2pstopinroute.php?info='+info+'&ginfo='+generalinfo+'&lid='+list_id+'&l='+lang,'sysitembox3');
        //alert('getpp2rroutestop.php?r='+r+'&d='+d+'&v='+v+'&r2='+r2+'&d2='+d2+'&v2='+v2+'&s='+s+'&e='+e+'&l='+lang+'&sz='+sz+'&ez='+ez+'&xa='+xa);
        stack.push(document.getElementById('sysitembox3').innerHTML);
      }

      function showrouteline(s){
        linelayer = 0;
        var aaa  = s.split("|*|");
        for(var i=0;i<=aaa[0]-1;i++){
          var bbb = aaa[(i+1)].split("||");
          if(bbb[1].indexOf("-")>0){


            var col = '#FF0000';
            if(i==1) col = '#0000FF';
            if(i==2) col = '#006000';
            if(i==0)
              addline('getlinep2p.php?rdv='+bbb[1]+'&start='+bbb[2]+'&dest='+bbb[3]);
            else
              appendline('getlinep2p.php?rdv='+bbb[1]+'&start='+bbb[2]+'&dest='+bbb[3]);
          }
        }
      }

      function showroutestop(s){
        makeRequest('showstops2.php?r='+s+'&l='+lang,'dummydiv');
        autozoom();
      }

      function backsearch(){
        //stack.pop();
        hidebox2();
        hidebox5();
        hidebox4();
        var id="";
        if(document.getElementById('sysitembox')!=null){
          id="sysitembox";
        }
        else if(document.getElementById('sysitembox2')!=null){
          id="sysitembox2";
        }else if(document.getElementById('sysitembox3')!=null){
          id="sysitembox3";
        }

        if(stack.length>0){
	  var hdata = stack.pop();
          if(hdata.indexOf("-- NEARBYROUTE --")>0){
		startnearby('');
	  }

          document.getElementById(id).innerHTML=hdata;

	  if(hdata.indexOf('id="p2p_routelist"')>0){
		// Normal list
		if (lastP2PResultListViewMode == 0)
			setTimeout(function(){ document.getElementById("routelist2").scrollTop = lastP2PResultListScrollY; }, 300);
		else if(lastP2PResultListViewMode == 1){
			document.getElementById("p2p_detailed_list_btn").click();
		}


	 	//document.getElementById("routelist2").scrollTop = lastP2PResultListScrollY;
                //alert(lastP2PResultListScrollY)
          }

          //alert(stack.pop());
        }
	fixtop('sysitembox2',161);
        goresize();
      }

      function routeremark(r,d,v){
        loadbox('boxtitle.php?t=路線備注','routeremark.php?r='+r+'&d='+d+'&v='+v);
      }

      function routetimetable(r,d,v){
        loadbox('boxtitle.php?t=服務時間','routetimetable.php?r='+r+'&d='+d+'&v='+v);
      }

      function showroute2(){
        var bmlist = document.getElementById('itemlist1');
        var bmlist2 = document.getElementById('itemlist2');

        bmlist2.style.display = "none";
        bmlist.style.display="block";

        currentlist=0;
      }

      function showtimetable1(info,bound,m){
        //showloading();
        var bmlist = document.getElementById('itemlist1');
        var bmlist2 = document.getElementById('itemlist2');
        var bmlist3 = document.getElementById('p2pstoplist');

        if(bmlist) bmlist.style.display = "none";
        if(bmlist3) bmlist3.style.display = "none";
        bmlist2.style.display="block";
        makeRequest('gettimetable.php?info='+info+'&m='+m+'&bound='+bound+'&l='+lang+'&ltab='+lasttab,'itemlist2');

        currentlist=2;
      }

      function genpdftimetable(info,bound,m){
        makeRequest('genpdftimetable.php?info='+info+'&m='+m+'&bound='+bound+'&l='+lang,'dummydiv');
      }

      function genpdfstop(info){
        makeRequest('genpdfstop.php?info='+info+'&l='+lang,'dummydiv');
      }

      function showtimetable_multi(r,d,v, r2, d2, v2){
        showloading();
        var bmlist = document.getElementById('itemlist1');
        var bmlist2 = document.getElementById('itemlist2');

        bmlist.style.display = "none";
        bmlist2.style.display="block";
        makeRequest('getpptimetable.php?r='+r+'&d='+d+'&v='+v+'&r2='+r2+'&d2='+d2+'&v2='+v2+'&l='+lang,'itemlist2');
      }

      function getremark(r,d,v){
        showloading();
        var bmlist = document.getElementById('itemlist1');
        var bmlist2 = document.getElementById('itemlist2');
        bmlist.style.display = "none";
        bmlist2.style.display="block";
        makeRequest('getremark.php?r='+r+'&d='+d+'&v='+v+'&l='+lang,'itemlist2');
        currentlist=1;
      }

      function getremark1(info,m){
        //showloading();
        var bmlist = document.getElementById('itemlist1');
        var bmlist2 = document.getElementById('itemlist2');
        bmlist.style.display = "none";
        bmlist2.style.display="block";
        makeRequest('getremark.php?info='+info+'&m='+m+'&l='+lang+'&ltab='+lasttab,'itemlist2');
        currentlist=1;
      }

      function getremark_multi(r,d,v, r2, d2, v2){
        showloading();
        var bmlist = document.getElementById('itemlist1');
        var bmlist2 = document.getElementById('itemlist2');
        bmlist.style.display = "none";
        bmlist2.style.display="block";
        makeRequest('getremark_multi.php?r='+r+'&d='+d+'&v='+v+'&r2='+r2+'&d2='+d2+'&v2='+v2+'&l='+lang+'&ltab='+lasttab,'itemlist2');
      }

      function getnotice1(id){
        //showloading();
        var bmlist = document.getElementById('itemlist1');
        var bmlist2 = document.getElementById('itemlist2');
        bmlist.style.display = "none";
        bmlist2.style.display="block";
        makeRequest('getnotice.php?id='+id+'&l='+lang+'&ltab='+lasttab,'itemlist2');
        currentlist=1;
      }

      function getpdf1(info,mode){
        showloading();
        var bmlist = document.getElementById('itemlist1');
        var bmlist2 = document.getElementById('itemlist2');
        bmlist.style.display = "none";
        bmlist2.style.display="block";
        makeRequest('share'+mode+'.php?info='+info+'&l='+lang+'&ltab='+lasttab,'itemlist2');
        currentlist=1;
      }

      function zoomroute(minlat,maxlat,minlon,maxlon){
        autozoomed=0;
      }

      function startendmarker(slon,slat,elon,elat){
        addcustommarker(getlonlat(elon,elat),eemar,36,80,-20,-80);
        addcustommarker(getlonlat(slon,slat),ssmar,36,80,-20,-80);
        reordermarker();
      }

      function poiaddmarker(type,lat,lon,name,event){
        skipmapclick=1;
        if(type=="s"){
          startname = name;
          startlat = lat;
          startlon = lon;
        }else{
          endname = name;
          endlat = lat;
          endlon = lon;
        }
        gomenu(2,1);
      }

      function addtitle(input,str,lat,lon){
        var skey=document.getElementById(input);
        if(input=="sloc"){
          mapstartname = str;
          console.log(mapstartname);
          mapstartlat=lat;
          mapstartlon=lon;
        }
        else if(input=="eloc"){
          mapendname = str;
          mapendlat=lat;
          mapendlon=lon;
        }
      }

      function kkksearch(e)
      {
        var keynum
        var keychar
        var numcheck
        if(window.event) // IE
        {
          keynum = e.keyCode
        }else if(e.which) // Netscape/Firefox/Opera
        {
          keynum = e.which
        }
        keychar = String.fromCharCode(keynum)
        if(keychar=='\r'){
          if(document.ksearch.skey.value!=""){
            searchcount++;
          }
          showloading();

	//alert( $('#routeSearchBtn').attr('src'));
	//setTimeout(function(){ $('#skey').autocomplete("close"); } , 3000);

          //document.getElementById('srec').innerHTML="搜尋記錄:<a style='color: #404040;' href=javascript:getcookie();>"+searchcount+"</a>";
          makeRequest('routesearch.php?skey='+document.ksearch.skey.value+'&rtype='+getCheckedValue(document.ksearch.rrr)+'&savecookie=1&l='+lang,'sysitembox2');
          hidep2pmenu();
          currentlist=0;

	  // It stored search num to cookie at routesearch.php already. We should not store cookie again at here
          //makeRequest('setcookie.php?skey='+document.ksearch.skey.value+'&rtype='+getCheckedValue(document.ksearch.rrr),'aaa');
          return false;
          }else{
          return true;
        }
      }

      function getCheckedValue(radioObj) {
        if(!radioObj)
        return "";
        var radioLength = radioObj.length;
        if(radioLength == undefined)
        if(radioObj.checked)
        return radioObj.value;
        else
        return "";
        for(var i = 0; i < radioLength; i++) {
          if(radioObj[i].checked) {
            return radioObj[i].value;
          }
        }
        return "";
      }

      function togglebookmark(){
        var bmlist = document.getElementById('bookmarklist');
        if(bmlist.style.visibility == "hidden")
        {
          showbookmark();
          document.getElementById('bookmarko_noff').src='minus.png';
        }
        else
        {
          hidebookmark();
          document.getElementById('bookmarko_noff').src='plus.png';
        }
      }

      function showhotspotbutton(){
        var bmlist = document.getElementById('hotspot');
        if(bmlist)
          bmlist.style.visibility = "visible";
//        document.getElementById('hotspot_noff').src='plus.png';
      }

      function hidehotspotbutton(){
        var bmlist = document.getElementById('hotspot');
        if(bmlist)
          bmlist.style.visibility = "hidden";
        var bmlist2 = document.getElementById('hotspot2');
        if(bmlist2)
          bmlist2.style.display = "none";
      }

      function togglehotspot(){
        var bmlist = document.getElementById('hotspot2');
        if(bmlist){
          if(bmlist.style.display == "none")
          {
            bmlist.style.display = "block";
            document.getElementById('hotspot_noff').src='minus.png';
          }
          else
          {
            bmlist.style.display = "none";
            document.getElementById('hotspot_noff').src='plus.png';
          }
        }
      }
      function showbookmark2(mode){
        bookmode=mode;
        showbookmark();
        document.getElementById('bookmarko_noff').src='minus.png';
      }

      function showbookmarktext(name,lat,lon){
        if(bookmode==1){
          document.getElementById('sloc').value=name;
          document.getElementById('sloc').style.color='#000000';
          mapstartname=name;
          var ll=getlonlat(lon,lat);
          mapstartlat=lat;
          mapstartlon=lon;
          clearmarkers();
	  clearCsNearbyMarker();
          addcustommarker(ll,ssmar,36,80,-20,-80);
          if(mapendlat>0.0&&mapendlon>0.0){
            addcustommarker(getlonlat(mapendlon,mapendlat),eemar,36,80,-20,-80);
            document.getElementById("elat").value=mapendlat;
            document.getElementById("elon").value=mapendlon;
          }
        }
        if(bookmode==2){
          document.getElementById('eloc').value=name;
          document.getElementById('eloc').style.color='#000000';
          mapendname=name;
          var ll=getlonlat(lon,lat);
          mapendlat=lat;
          mapendlon=lon;
          clearmarkers();
	  clearCsNearbyMarker();
          addcustommarker(ll,eemar,36,80,-20,-80);
          if(mapstartlat>0.0&&mapstartlon>0.0){
            addcustommarker(getlonlat(mapstartlon,mapstartlat),ssmar,36,80,-20,-80);
            document.getElementById("slat").value=mapstartlat;
            document.getElementById("slon").value=mapstartlon;
          }
        }
        bookmode=0;
        hidebookmark();
      }

      function showbookmark(){
        var bmlist = document.getElementById('bookmarklist');
        bmlist.style.visibility = "visible";
        document.getElementById('bookmarko_noff').src='minus.png';
        makeRequest("getbookmark_8_15.php?l="+lang,"bookmarklist");
      }

      function showbookmark1(m){
        makeRequest("getbookmark.php?m="+m+"&l="+lang+"&ltab="+lasttab,"sysitembox4");
      }

      function showbookmarkroute(info){
        info=encodeURIComponent(info);
        console.log("Bookmarkselectstop=");
        console.log(stopselect);
        sysmode=1;
        var tbox = document.getElementById('sysitembox2');

	if (tbox)
	        tbox.style.top="146px";

        makeRequest("getbookmarkroute.php?info="+info+"&l="+lang,"sysitembox2");


      }

      function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

      function showbookmarkp2p(){
        var aaa = p2pbookmark_info.split("||");
        //alert(p2pbookmark_info);
        var bbb = aaa[1].split(",");
        var ccc = aaa[2].split(",");
        var ddd = aaa[6].split(",");
        var tdate = aaa[5];
        tdate =tdate.replace(/-/g,"/");

        var today = new Date();

        var slon = bbb[1];
        var slat = bbb[0];
        var elon = ccc[1];
        var elat = ccc[0];
        var sloc = ddd[0];
        var eloc = ddd[1];
        var ws = aaa[3];
        var leg = aaa[4]
        var datetime = new Date(tdate);
        if (datetime < today) datetime = today;

        var year = datetime.getFullYear();
        var month = datetime.getMonth()+1;
        var day = datetime.getDate();
        var date = year + "-" + month + "-" + day;
        var hour = addZero(datetime.getHours());
        var minute = addZero(datetime.getMinutes());


        document.ppsearch.slat.value=slat;
        document.ppsearch.slon.value=slon;
        document.ppsearch.elat.value=elat;
        document.ppsearch.elon.value=elon;

        document.ppsearch.sloc.value=convertcharBACK(sloc);
        document.ppsearch.eloc.value=convertcharBACK(eloc);

        document.getElementById('search_day').innerHTML=datetolab(date);

        document.getElementById('search_hour').value=hour;
        document.getElementById('search_minute').value=minute;
        //document.getElementById('search_time').value=time;
        setspeedmode(ws);
        setdrmode(leg);

        mapstartlat=slat;
        mapstartlon=slon;
        mapendlat=elat;
        mapendlon=elon;

      }

      function modifybookmark(id,data,i){
        data=encodeURIComponent(data);
        document.getElementById(id).innerHTML="<form id='myform"+i+"' method='post' onsubmit='return validatebm(); convertqoute(\'rec\');' action='updatebookmark.php' target='dummyframe' ><input id='cid' name='cid' type='hidden' value="+id+"><input id='rec' name='rec' type='text' size='40' value=''/>";
        document.getElementById('pencil'+i).innerHTML="<img src='pencil.png' height='20px' width='20px' style='cursor:pointer'"+' onclick="updatebookmark(\''+i+'\');" /> </form>';
      }

      function updatebookmark(i){
        //alert(i);
        document.getElementById('myform'+i).submit();
        //showbookmark();
      }

      function hidebookmark(){
        var bmlist = document.getElementById('bookmarklist');
        bmlist.style.visibility = "hidden";
      }

      function ppsearchx(slat,slon,elat,elon,time){
        //alert("x");
        /*
          if(slat!=""&&slon!=""&&elat!=""&&elon!=""){
          showloading();
          document.getElementById('p2p_guide').innerHTML='';

          makeRequest("ppsearch.php?s="+slat+" "+slon+"&e="+elat+" "+elon+"&daytime="+time+'&l='+lang,"sysitembox3");
          stack.push(document.getElementById('sysitembox3').innerHTML);
          document.getElementById('sysitembox3').innerHTML='';
          hidep2pmenu();
          }
          else
        */
        document.getElementById('sysitembox3').style.display="block";
        if(mapstartlat!=0.0&&mapstartlon!=0.0&&mapendlat!=0.0&&mapendlon!=0.0){
          showloading();
          document.getElementById('p2p_guide').innerHTML='sdfasf';

          makeRequest("ppsearch.php?s="+mapstartlat+" "+mapstartlon+"&e="+mapendlat+" "+mapendlon+"&daytime="+time+'&l='+lang,"sysitembox3");
          stack.push(document.getElementById('sysitembox3').innerHTML);
          document.getElementById('sysitembox3').innerHTML='';
          hidep2pmenu();
          currentlist=0;
        }
        else{
          if(lang==2){
            var ttstr1="请确定起点 / 终点";
            var ttstr2="请确定起点";
            var ttstr3="请确定终点";
          }
          else if(lang==1){
            var ttstr1='Please confirm origin / destination'
            var ttstr2="Please confirm origin";
            var ttstr3="Please confirm destination";
          }
          else{
            var ttstr1="請確定起點 / 終點";
            var ttstr2="請確定起點";
            var ttstr3="請確定終點";
          }
          if(mapstartlat=="0"&&mapstartlon=="0"&&mapendlat=="0"&&mapendlon=="0"){
            alert(ttstr1);
          }
          else if(mapstartlat=="0"&&mapstartlon=="0"){
            alert(ttstr2);
          }
          else if(mapendlat=="0"&&mapendlon=="0"){
            alert(ttstr3);
          }
        }
      }

      function ppsearch_p3(slat,slon,elat,elon,ws,leg,loc,time){
        lastmakerequesturl="";
        loc=encodeURIComponent(loc);
        document.getElementById('sysitembox3').style.display="block";
        if(mapstartlat!=0.0&&mapstartlon!=0.0&&mapendlat!=0.0&&mapendlon!=0.0){
          showloading();
          document.getElementById('p2p_guide').innerHTML='';
          var smode="T";
          if(rsortmode==2) smode="F";
          if(rsortmode==3) smode="W";
          makeRequest("ppsearch_p3.php?slat="+mapstartlat+"&slon="+mapstartlon+"&elat="+mapendlat+"&elon="+mapendlon+"&t="+time+"&ws="+ws+"&leg="+leg+"&loc="+loc+"&m1="+smode+"&l="+lang,"sysitembox3");
          stack.push(document.getElementById('sysitembox3').innerHTML);
          document.getElementById('sysitembox3').innerHTML='';
          hidep2pmenu();
          currentlist=0;
        }
        else{
          if(lang==2){
            var ttstr1="请确定起点 / 终点";
            var ttstr2="请确定起点";
            var ttstr3="请确定终点";
          }
          else if(lang==1){
            var ttstr1='Please confirm origin / destination'
            var ttstr2="Please confirm origin";
            var ttstr3="Please confirm destination";
          }
          else{
            var ttstr1="請確定起點 / 終點";
            var ttstr2="請確定起點";
            var ttstr3="請確定終點";
          }
          if(mapstartlat=="0"&&mapstartlon=="0"&&mapendlat=="0"&&mapendlon=="0"){
            //alert(ttstr1);
            loadbox7("boxtitle7.php?t=bookmark&l="+lang+"&ltab=311","alertmsg.php?ltab=310&l="+lang+"&msg="+ttstr1);
            //alert(ttstr1);
          }
          else if(mapstartlat=="0"&&mapstartlon=="0"){
            loadbox7("boxtitle7.php?t=bookmark&l="+lang+"&ltab=311","alertmsg.php?ltab=310&l="+lang+"&msg="+ttstr2);
            //alert(ttstr2);
          }
          else if(mapendlat=="0"&&mapendlon=="0"){
            loadbox7("boxtitle7.php?t=bookmark&l="+lang+"&ltab=311","alertmsg.php?ltab=310&l="+lang+"&msg="+ttstr3);
            //alert(ttstr3);
          }
        }
      }

      function route_search_category(mode)
      {
        showloading();

        document.getElementById('ksearch_air').src = 'rs_air.png';
        document.getElementById('ksearch_tourist').src = 'rs_tourist.png';
        document.getElementById('ksearch_eta').src = 'rs_eta.png';
        document.getElementById('ksearch_overnight').src = 'rs_night.png';
        document.getElementById('ksearch_all').src = 'rs_all.png';

        /*if (mode==0)
          document.getElementById('ksearch_day').src = 'rs_normal_selected.png';
          else if (mode==1)
          document.getElementById('ksearch_night').src = 'rs_night_selected.png';
          else if (mode==2)
          document.getElementById('ksearch_air').src = 'rs_air_selected.png';
          else if (mode==3)
          document.getElementById('ksearch_all').src = 'rs_all_selected.png';
        */

      }

      function search_cookie(rtype,skey,savecookie){
        if(skey!=""){
          searchcount++;
        }

        //showloading();

        //document.getElementById('srec').innerHTML="搜尋記錄:<a style='color: #404040;' href=javascript:getcookie();>"+searchcount+"</a>";
        makeRequest('routesearch.php?rtype='+rtype+'&skey='+skey+'&l='+lang+'&savecookie='+savecookie,'sysitembox2');
        //stack.push(document.getElementById('sysitembox2').innerHTML);
        hidep2pmenu();
        currentlist=0;
        //if (rtype=='')
        //makeRequest('setcookie.php?skey='+skey+'&rtype='+rtype,'dummydiv');
      }

      function getcookie(){
        makeRequest('getsearch.php?l='+lang,'sysitembox2');
      }

      function delhistory(type){
        if(type=="all"){
          makeRequest('delhistory.php?id=all','sysitembox2');
          searchcount=0;
          //document.getElementById('srec').innerHTML="搜尋記錄:<a style='color: #404040;' href=javascript:getcookie();>"+searchcount+"</a>";
        }
        else{
          makeRequest('delhistory.php?id='+type,'sysitembox2');
          searchcount--;
          //document.getElementById('srec').innerHTML="搜尋記錄:<a style='color: #404040;' href=javascript:getcookie();>"+searchcount+"</a>";
        }
      }

      function gethistory(skey,rtype){
        makeRequest('routesearch.php?rtype='+rtype+'&skey='+skey+'&l='+lang,'sysitembox2');
        hidep2pmenu();
        currentlist=0;
      }

      function searchpress(lat,lon){
        showloading();
        if(sysmode==-10){
          sysmode=0;
        }
        removeline();
        if(lat!=""&&lon!=""){
          var ll = getlonlat(lon,lat);
          map.panTo(ll);
  //        makeRequest('getnearbyroute.php?lat='+lat+'&lon='+lon+'&l='+lang,'sysitembox');
          currentlist=0;
        }
      }
      function switchloc(){
        var sloc=document.getElementById("sloc").value;
        var eloc=document.getElementById("eloc").value;
        var slat=document.getElementById("slat").value;
        var slon=document.getElementById("slon").value;
        var elat=document.getElementById("elat").value;
        var elon=document.getElementById("elon").value;
        var mslat=mapstartlat;
        var mslon=mapstartlon;
        var melat=mapendlat;
        var melon=mapendlon;
        if(lang==2){
          var ttstr1="请选择或输入起点";
          var ttstr2="请选择或输入终点";
        }
        else if(lang==1){
          var ttstr1='Please select or input the origin'
          var ttstr2="Please select or input the destination";
        }
        else{
          var ttstr1="請選擇或輸入起點";
          var ttstr2="請選擇或輸入終點";
        }
        if(sloc!=ttstr1&&eloc!=ttstr2){
          document.getElementById("sloc").value=eloc;
          document.getElementById("eloc").value=sloc;
          document.getElementById("slat").value=elat;
          document.getElementById("slon").value=elon;
          document.getElementById("elat").value=slat;
          document.getElementById("elon").value=slon;
          mapstartlat=melat;
          mapstartlon=melon;
          mapendlat=mslat;
          mapendlon=mslon;
          clearmarkers();
	  clearCsNearbyMarker();
          addcustommarker(getlonlat(mapstartlon,mapstartlat),ssmar,36,80,-20,-80);
          addcustommarker(getlonlat(mapendlon,mapendlat),eemar,36,80,-20,-80);
        }
        /*var tmpSrc = document.getElementById("p2p_1st").src;
          document.getElementById("p2p_1st").src=document.getElementById("p2p_2nd").src;
        document.getElementById("p2p_2nd").src=tmpSrc;*/
      }
      var topBarLinkColor = '#bda8d1';
      var topBarLinkSelectedColor = '#ffffff';
      var topBarEnColor = '#bda8d1';
      var topBarTcColor = '#ffffff';
      var topBarScColor = '#bda8d1';

      function setlang(l,b){
        lang=l;
        map.zoomIn();

        topBarEnColor = topBarLinkColor;
        topBarTcColor = topBarLinkColor;
        topBarScColor = topBarLinkColor;
        if (l==0)
        {
          topBarTcColor = topBarLinkSelectedColor;
          nwfbLang = 2;
        }
        else if (l==1)
        {
          topBarEnColor = topBarLinkSelectedColor;
          nwfbLang = 1;
        }
        else if (l==2)
        {
          topBarScColor = topBarLinkSelectedColor;
          nwfbLang = 3;
        }

        document.getElementById('lang_tc').style.color=topBarTcColor;
        document.getElementById('lang_en').style.color=topBarEnColor;
        document.getElementById('lang_sc').style.color=topBarScColor;
        if(l==1){
          document.getElementById('fb_logo').innerHTML='<a href="http://www.nwstbus.com.hk/home/default.aspx?intLangID=1" target="_BLANK"><img  src="logo_2017.png"/></a>';
          document.getElementById('bookmark').innerHTML='&nbsp;Bookmark';
          document.getElementById('hotspot4').innerHTML='&nbsp;Hot Spots';
          document.getElementById('hotspot5').innerHTML='&nbsp;Leisure';
          document.getElementById('hotspot6').innerHTML='&nbsp;Shopping';
          document.getElementById('hotspot7').innerHTML='&nbsp;Exhibitions';
          document.getElementById('closestr').innerHTML='Close';
          document.getElementById('copyright').innerHTML='Copyright © 2016 Citybus Limited & New World First Bus Services Limited. All Rights Reserved.&nbsp';
          ssmar="startpoint-f_en.png";
          eemar="endpoint-f_en.png";
          templocname="New bookmark";
          }else if(l==2){
          document.getElementById('fb_logo').innerHTML='<a href="http://www.nwstbus.com.hk/home/default.aspx?intLangID=3" target="_BLANK"><img  src="logo_2017.png"/></a>';
          document.getElementById('bookmark').innerHTML='&nbsp;我的书签';
          document.getElementById('hotspot4').innerHTML='&nbsp;热点推介';
          document.getElementById('hotspot5').innerHTML='&nbsp;消闲';
          document.getElementById('hotspot6').innerHTML='&nbsp;购物';
          document.getElementById('hotspot7').innerHTML='&nbsp;展览';
          document.getElementById('closestr').innerHTML='关闭';
          document.getElementById('copyright').innerHTML='版权所有&copy; 2016 城巴有限公司及新世界第一巴士服务有限公司&nbsp';
          ssmar="startpoint-f_sc.png";
          eemar="endpoint-f_sc.png";
          templocname="新书签";
        }
        else{
          document.getElementById('fb_logo').innerHTML='<a href="http://www.nwstbus.com.hk/home/default.aspx?intLangID=2" target="_BLANK"><img  src="logo_2017.png"/></a>';
          document.getElementById('bookmark').innerHTML='&nbsp;我的書籤';
          document.getElementById('hotspot4').innerHTML='&nbsp;熱點推介';
          document.getElementById('hotspot5').innerHTML='&nbsp;消閒';
          document.getElementById('hotspot6').innerHTML='&nbsp;購物';
          document.getElementById('hotspot7').innerHTML='&nbsp;展覽';
          document.getElementById('closestr').innerHTML='關閉';
          document.getElementById('copyright').innerHTML='版權所有&copy; 2016 城巴有限公司及新世界第一巴士服務有限公司&nbsp';
          ssmar="startpoint-f.png";
          eemar="endpoint-f.png";
          templocname="新書籤";
        }
        if(b==1){
          gomenu(currentmenu);
        }
        //makeRequest('test_914.php?a='+l,'aaa');
        //alert();
      }

      function setlangclick(l,b){
        var f;

        if (b == 2)
        f=0;
        else if (b == 1)
        f=1;
        else if (b == 0)
        f=2;
        else if (b == 4)
        f=3;

        //alert('b='+b + ', f='+f);

        window.location='?l='+ l +'&f=' + f;
      }

      function fun(e,o) {
        /* FF 下判断鼠标是否离开DIV */
        var list = document.getElementById('autocom');
        if(window.navigator.userAgent.indexOf("Firefox")>=1) {
          var x = e.clientX + document.body.scrollLeft;
          var y = e.clientY + document.body.scrollTop ;
          var left = o.offsetLeft;
          var top = o.offsetTop;
          var w = o.offsetWidth;
          var h = o.offsetHeight;

          if(y < top || y > (h + top) || x > left + w || x<left ) {
            list.style.visibility="hidden";
          }
        }

        /* IE */
        if(o.contains(event.toElement ) == false    )
        list.style.visibility="hidden";

      }


      function showloading()
      {
        //document.getElementById('loadingimg').src='';
        document.getElementById('loadingimgdiv').style.visibility = "visible";
      }
      function hideloading(ms)
      {
        //document.getElementById('loadingimg').src='loading_off.png';
        //document.getElementById('loadingimgdiv').style.visibility = "hidden";
        setTimeout('hideloadingTimeout()', ms);
      }
      function hideloadingTimeout()
      {
        //document.getElementById('loadingimg').src='loading_off.png';
        document.getElementById('loadingimgdiv').style.visibility = "hidden";
      }

      function Get_srcElement(evgl)
      {
        var str1;
        var str2;
        　　var srcElement=""
        　　 //Is it a IE or Firefox?
        　　var evg=evgl.srcElement?evgl.srcElement:evgl.target;
        　　srcElement = evg.tagName;
        　 if(srcElement!="INPUT"&&srcElement!="LI"){

          if (document.getElementById('autocom')&&document.getElementById('autocom2')){
            document.getElementById('autocom').style.display="none";
            if(document.getElementById('sloc').value==""){
              str1="請選擇或輸入起點";
              if(lang==1){
                str1="Please select or input the origin";
              }
              if(lang==2){
                str1="请选择或输入起点";
              }
              document.getElementById('sloc').value=str1;
              document.getElementById('sloc').style.color='#707070';
            }
            document.getElementById('autocom2').style.display="none";
            if(document.getElementById('eloc').value==""){
              str2="請選擇或輸入終點";
              if(lang==1){
                str2="Please select or input the destination";
              }
              if(lang==2){
                str2="请选择或输入终点";
              }
              document.getElementById('eloc').value=str2;
              document.getElementById('eloc').style.color='#707070';
            }
          }
          else{
            if (document.getElementById('autocom')){
              document.getElementById('autocom').style.display="none";
              if(document.getElementById('skey').value==""){
                str1="請選擇或輸入地點";
                if(lang==1){
                  str1="Please select or input the location";
                }
                if(lang==2){
                  str1="请选择或输入地点";
                }
                document.getElementById('skey').value=str1;
                document.getElementById('skey').style.color='#707070';
              }
            }
          }
        }
      }


      var p2pMenu = true;
      function hidep2pmenu()
      {
        goresize();
      }

      function getsheight(){
        var x,y;
        if (self.innerHeight) // all except Explorer
        {
          x = self.innerWidth;
          y = self.innerHeight;
        }
        else if (document.documentElement && document.documentElement.clientHeight)
        // Explorer 6 Strict Mode
        {
          x = document.documentElement.clientWidth;
          y = document.documentElement.clientHeight;
        }
        else if (document.body) // other Explorers
        {
          x = document.body.clientWidth;
          y = document.body.clientHeight;
        }
        return y;
      }

      function shownearbytop(){
        refreshIntervalId = setInterval("showtop(1);", 100);
      }

      function showp2pmenu2(){
        document.getElementById('p2pmenu').style.display = "block";
        var s1 = document.getElementById('sysitembox');
        if(s1){
          if(s1.style.top<"180px")
          refreshIntervalId = setInterval("showtop(1);", 100);
          else
          refreshIntervalId = setInterval("hidetop(1);", 100);
        }
        var s2 = document.getElementById('sysitembox2');
        if(s2){
          if(s2.style.top<"180px")
          refreshIntervalId = setInterval("showtop(2);", 100);
          else
          refreshIntervalId = setInterval("hidetop(2);", 100);
        }
        var s3 = document.getElementById('sysitembox3');
        if(s3){
          if(s3.style.top<"180px")
          refreshIntervalId = setInterval("showtop(3);", 100);
          else
          refreshIntervalId = setInterval("hidetop(3);", 100);
        }
      }

      function showtop(v){
        var tbox;
        var pos = 200;
        if(v==1){
          tbox = document.getElementById('sysitembox');
          pos = 200;
        }
        if(v==2)
        {
          tbox = document.getElementById('sysitembox2');
          if (document.getElementsByClassName("oop")[0].clientHeight > 50)
          {
            pos = 320;
          }
          else
          {
            pos = 250;
          }
        }
        if(v==3){
          tbox = document.getElementById('sysitembox3');
          pos = 275;
        }
        if((tbox.style.top<(pos-2)+'px')){
          var ctop = parseInt(tbox.style.top.substring(0,3));
          var step = (pos-ctop)/2;
          if(step < 2) step = 2;
          tbox.style.top = (ctop+step)+'px';
        }else{
          tbox.style.top = (pos)+'px';
          clearInterval(refreshIntervalId);
          var sbar = document.getElementById('slidebar');
          if (sbar){
            if(sbar.src.indexOf("v-slide")>0)
              sbar.src="v-slide.png";
            else
              sbar.src="w-slide.png";
          }
        }
        goresize();
      }

      function sysboxheight(tbox){
        var ctop = parseInt(tbox.style.top.substring(0,3));
        var h = getsheight();
        tbox.style.height = (h-ctop-4+3)+'px';
      }


      function totop(v){
        var tbox;
        if(v==1){
          tbox = document.getElementById('sysitembox');
        }
        if(v==2){
          tbox = document.getElementById('sysitembox2');
        }
        if(v==3){
          tbox = document.getElementById('sysitembox3');
        }
       	if(tbox) tbox.style.top = '150px';

        var sbar = document.getElementById('slidebar');
        if (sbar){
          if(sbar.src.indexOf("v-slide")>0)
          sbar.src="v-slide-d.png";
          else
          sbar.src="w-slide-d.png";
        }
      }

      function hidetop(v){
        var tbox;
        if(v==1){
          tbox = document.getElementById('sysitembox');
        }
        if(v==2){
          tbox = document.getElementById('sysitembox2');
        }
        if(v==3){
          tbox = document.getElementById('sysitembox3');
        }
        if((tbox.style.top>'146px')){
          var ctop = parseInt(tbox.style.top.substring(0,3));
          var step = (ctop-150)/2;
          if(step < 2) step = 2;
          tbox.style.top = (ctop-step)+'px';
          }else{
          tbox.style.top = '150px';
          clearInterval(refreshIntervalId);
          var sbar = document.getElementById('slidebar');
          if(sbar.src.indexOf("v-slide")>0)
          sbar.src="v-slide-d.png";
          else
          sbar.src="w-slide-d.png";
        }
        goresize();
      }

      function setslidebar(){
        var vbox;
        tbox = document.getElementById('sysitembox');
        if(!tbox)
        tbox = document.getElementById('sysitembox2');
        if(!tbox)
        tbox = document.getElementById('sysitembox3');
        if(tbox){
          var sbar = document.getElementById('slidebar');
          if (sbar){
            if(tbox.style.top<'160px'){
              if(sbar.src.indexOf("v-slide")>0)
              sbar.src="v-slide-d.png";
              else
              sbar.src="w-slide-d.png";
            }else{
              if(sbar.src.indexOf("v-slide")>0)
              sbar.src="v-slide.png";
              else
              sbar.src="w-slide.png";
            }
          }
        }
      }


      function showp2pmenux(){
        document.getElementById('p2pmenu').style.display = "block";
        if(p2pMenu){
          p2pMenu = false;
          refreshIntervalId = setInterval(hidetop, 200);
          }else{
          p2pMenu = true;
          topboxheight=document.getElementById('p2pmenu').style.height;
          refreshIntervalId = setInterval(showtop, 200);
        }
      }



      function showp2pmenu(){
        if(p2pMenu){
          document.getElementById('p2pmenu').style.display = "none";
          p2pMenu = false;
          }else{
          document.getElementById('p2pmenu').style.display = "block";
          p2pMenu = true;
        }
        goresize();
      }
      /*function stopProp(e) {
        if (e && e.stopPropogation) e.stopPropogation();
        else if (window.event && window.event.cancelBubble)
        window.event.cancelBubble = true;
      }*/

      function pselect(v){
        var sss=document.getElementById('pdfsss');
        if(!sss)
        return;
        var p=document.getElementById('pdf'+v);
        if(p){
          if(p.src.indexOf("tdummy")>0){
            p.src='Ok-icon.png';
            if(v<10){
              var p1=document.getElementById('pdf'+v+'1');
              if(p1)
              p1.src='Ok-icon.png';
              var p2=document.getElementById('pdf'+v+'2');
              if(p2)
              p2.src='Ok-icon.png';
              }else{
              if(v<20)
              document.getElementById('pdf1').src="tdummy.png";
              else
              document.getElementById('pdf2').src="tdummy.png";
            }
            }else{
            p.src="tdummy.png";
            if(v<10){
              var p1=document.getElementById('pdf'+v+'1');
              if(p1)
              p1.src="tdummy.png";
              var p2=document.getElementById('pdf'+v+'2');
              if(p2)
              p2.src="tdummy.png";
              }else{
              if(v<20)
              document.getElementById('pdf1').src="tdummy.png";
              else
              document.getElementById('pdf2').src="tdummy.png";
            }
          }
        }
      }

      function checkTime(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      }


      function getEtaLastUpdate() {
        var today = new Date();
        var y = today.getFullYear();
        var mm = today.getMonth() + 1;
        var d = today.getDate();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        m = checkTime(m);
            s = checkTime(s);
        mm = checkTime(mm);
        d = checkTime(d);
            document.getElementById('etalastupdate').innerHTML = ('0' + h).slice(-2) + ":" + m + ":" + s;
      }


      function clearppdata(){
        document.ppsearch.slat.value=document.ppsearch.slon.value=document.ppsearch.elat.value=document.ppsearch.elon.value="";
        document.ppsearch.sloc.value=document.ppsearch.eloc.value="";
        mapstartlat=0.0;
        mapstartlon=0.0;
        mapendlat=0.0;
        mapendlon=0.0;
        clearmarkers();
	clearCsNearbyMarker();
      }

      function settimemode(m){
        document.getElementById('timemode1').style.backgroundColor="";
        document.getElementById('timemode2').style.backgroundColor="";
        if(m==1)
          document.getElementById('timemode1').style.backgroundColor="#FF8822";
        else
          document.getElementById('timemode2').style.backgroundColor="#FF8822";
      }

      function setdrmode(m){
        document.getElementById('drmode1').style.backgroundColor="";
        document.getElementById('drmode2').style.backgroundColor="";
        document.getElementById('drmode1').style.color="";
        document.getElementById('drmode2').style.color="";
        if(m==1){
          document.getElementById('drmode1').style.backgroundColor="#6c3f98";
          document.getElementById('drmode1').style.color="#FFFFFF";
          document.ppsearch.leg.value="1";
        }
        else{
          document.getElementById('drmode2').style.backgroundColor="#6c3f98";
          document.getElementById('drmode2').style.color="FFFFFF";
          document.ppsearch.leg.value="2";
        }
      }

      function setbmmode(m){
        document.getElementById('bmmode1').style.backgroundColor="#404040";
        document.getElementById('bmmode2').style.backgroundColor="#404040";
        document.getElementById('bmmode3').style.backgroundColor="#404040";
        document.getElementById('bmmodeline1').style.backgroundColor="#404040";
        document.getElementById('bmmodeline2').style.backgroundColor="#404040";
        document.getElementById('bmmodeline3').style.backgroundColor="#404040";
        document.getElementById('bmmode1').style.color="#FFFFFF";
        document.getElementById('bmmode2').style.color="#FFFFFF";
        document.getElementById('bmmode3').style.color="#FFFFFF";
        if(m==1){
          document.getElementById('bmmode1').style.backgroundColor="#FFFFFF";
          document.getElementById('bmmodeline1').style.backgroundColor="#ffa500";
          document.getElementById('bmmode1').style.color="#404040";
        }
        if(m==2){
          document.getElementById('bmmode2').style.backgroundColor="#FFFFFF";
          document.getElementById('bmmodeline2').style.backgroundColor="#ffa500";
          document.getElementById('bmmode2').style.color="#404040";
        }
        else if(m==3){
          document.getElementById('bmmode3').style.backgroundColor="#FFFFFF";
          document.getElementById('bmmodeline3').style.backgroundColor="#ffa500";
          document.getElementById('bmmode3').style.color="#404040";
        }
      }



      function setdistmode(m){
        document.getElementById('distmode1').style.backgroundColor="";
        document.getElementById('distmode2').style.backgroundColor="";
        document.getElementById('distmode3').style.backgroundColor="";
        document.getElementById('distmode4').style.backgroundColor="";
        document.getElementById('distmode5').style.backgroundColor="";
        if(m==1){
          document.getElementById('distmode1').style.backgroundColor="#FF8822";
        }
        if(m==2){
          document.getElementById('distmode2').style.backgroundColor="#FF8822";
        }
        if(m==3){
          document.getElementById('distmode3').style.backgroundColor="#FF8822";
        }
        if(m==4){
          document.getElementById('distmode4').style.backgroundColor="#FF8822";
        }
        if(m==5){
          document.getElementById('distmode5').style.backgroundColor="#FF8822";
        }
      }

      function setsortmode(m){
        document.getElementById('sortmode1').style.backgroundColor="";
        document.getElementById('sortmode2').style.backgroundColor="";
        document.getElementById('sortmode3').style.backgroundColor="";
        if(m==1){
          document.getElementById('sortmode1').style.backgroundColor="#FF8822";
        }
        if(m==2){
          document.getElementById('sortmode2').style.backgroundColor="#FF8822";
        }
        if(m==3){
          document.getElementById('sortmode3').style.backgroundColor="#FF8822";
        }
      }

      function setspeedmode(m){
        document.getElementById('speedmode1').style.backgroundColor="";
        document.getElementById('speedmode2').style.backgroundColor="";
        document.getElementById('speedmode3').style.backgroundColor="";
        document.getElementById('speedmode4').style.backgroundColor="";
        document.getElementById('speedmode1').style.color="";
        document.getElementById('speedmode2').style.color="";
        document.getElementById('speedmode3').style.color="";
        document.getElementById('speedmode4').style.color="";
        if(m==0.5){
          document.getElementById('speedmode1').style.backgroundColor="#6c3f98";
          document.getElementById('speedmode1').style.color="#FFFFFF";
          document.ppsearch.walkingspeed.value=m;
        }
        if(m==0.8){
          document.getElementById('speedmode2').style.backgroundColor="#6c3f98";
          document.getElementById('speedmode2').style.color="#FFFFFF";
          document.ppsearch.walkingspeed.value=m;
        }
        if(m==1.3){
          document.getElementById('speedmode3').style.backgroundColor="#6c3f98";
          document.getElementById('speedmode3').style.color="#FFFFFF";
          document.ppsearch.walkingspeed.value=m;
        }
        if(m==1.8){
          document.getElementById('speedmode4').style.backgroundColor="#6c3f98";
          document.getElementById('speedmode4').style.color="#FFFFFF";
          document.ppsearch.walkingspeed.value=m;
        }
      }

      function expandtable(){
        var tblock=document.getElementById('stopbetween');
        var tblocktext=document.getElementById('expandtext')
        if(tblock.style.display=="none"){
          tblock.style.display="block";
          tblocktext.innerHTML="Hide ▲";
        }else{
          tblock.style.display="none";
          tblocktext.innerHTML="Show ▼";
        }

      }

      function expandtable2(){
        var tblock=document.getElementById('stopbetween2');
        var tblocktext=document.getElementById('expandtext2')
        if(tblock.style.display=="none"){
          tblock.style.display="block";
          tblocktext.innerHTML="Hide ▲";
        }else{
          tblock.style.display="none";
          tblocktext.innerHTML="Show ▼";
        }

      }

      function showtimesearch(){
        var tblock=document.getElementById('selecttime');
        var sblock=document.getElementById('changesetting');
        if(tblock.style.display=="none"){
          tblock.style.display="block";
          sblock.style.display="none";
        }else{
          tblock.style.display="none";
        }

      }

      function showsetting(){
        var tblock=document.getElementById('changesetting');
        if(tblock.style.display=="none"){
          tblock.style.display="block";
        }else{
          tblock.style.display="none";
        }
      }

      function showstartendpoint(){
        document.getElementById('startingpoint').innerHTML = mapstartname;
        document.getElementById('endingpoint').innerHTML = mapendname;

      }

      function showp2pstop(i){
        var tblock=document.getElementById('route'+i);
        var tblocktext=document.getElementById('expandtext'+i)
        var tstopimage=document.getElementById('stopimage'+i)
        if(tblock.style.display=="none"){
          tblock.style.display="block";
          tblocktext.innerHTML="▲";
          tstopimage.src="ypole.png";
        }else{
          tblock.style.display="none";
          tblocktext.innerHTML="▼";
          tstopimage.src="exchangeexpand.png";
        }
      }

          function copyroutelinkold(idname)
          {
                  var id=document.getElementById(idname);
                  id.select();
                  document.execCommand('copy');
          }

          var copyroutelink = function(elementId) {

            var input = document.getElementById(elementId);
            var isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);

            if (isiOSDevice) {

              var editable = input.contentEditable;
              var readOnly = input.readOnly;

              input.contentEditable = true;
              input.readOnly = false;

              var range = document.createRange();
              range.selectNodeContents(input);

              var selection = window.getSelection();
              selection.removeAllRanges();
              selection.addRange(range);

              input.setSelectionRange(0, 999999);
              input.contentEditable = editable;
              input.readOnly = readOnly;

            } else {
              input.select();
            }

            document.execCommand('copy');
          }


          function setselectdate(jump){
            selectdateindex += jump;
            if(selectdateindex<0) selectdateindex=2;
            if(selectdateindex>2) selectdateindex=0;
            if(jump==0) selectdateindex=0;
            var aaa = selectdatelab.split(",");

            document.getElementById('search_day').innerHTML = aaa[selectdateindex];
          }

          function datetolab(date){
            var aaa = selectdate.split(",");
            var bbb = selectdatelab.split(",");
            for(i=0;i<aaa.length;i++){
                if (date == aaa[i]) selectdateindex=i;
            }
            return bbb[selectdateindex];

          }

          function labtodate(lab){
            var aaa = selectdate.split(",");
            var bbb = selectdatelab.split(",");
            for(i=0;i<bbb.length;i++){
                if (lab == bbb[i]) selectdateindex=i;
            }
            return aaa[selectdateindex];
          }


          function getselectdate(){
            var aaa = selectdate.split(",");
            var bbb = selectdatelab.split(",");
            var tmpdate = document.getElementById('search_day').innerHTML;
            var h = document.getElementById('search_hour').value;
            var m = document.getElementById('search_minute').value;
            var date = labtodate(tmpdate) + "%20" + h + ":" + m;
            //var t = document.getElementById('search_time').value;
            //var date = labtodate(tmpdate) + " " + t;
        return date
          }

          function setp2ptime(){
            setselectdate(0);
            var d = new Date();
            var h = addZero(d.getHours());
              var m = addZero(d.getMinutes());
              document.getElementById('search_hour').value = h;
              document.getElementById('search_minute').value = m;
            //document.getElementById('search_time').value = h + ":" +m;
          }

          function getselectloc(){
            var start = document.getElementById('sloc').value;
            var dest = document.getElementById('eloc').value;
            var searchloc = start + "," + dest;
        return searchloc;
          }

          function showdirectsearch(info, addStack){
              console.log("info=");
            console.log(info);
  //            setTimeout(makeRequest('getvariance.php?info='+info+'&l='+lang+'&cur='+currentlist,'sysitembox2'),1000);
          }

      function stophighlight(){
        console.log("Test StopHLinputed");
        tstopselect = 'slist'.concat(stopselect);
        console.log(tstopselect);
            var ositem=document.getElementById(tstopselect);
        if(ositem){
          console.log("Test StopHLshowed");
          ositem.style.backgroundColor="#FFEA80";
          hlstop='';
        }
          }

          function showselectstoponmap(rdv, eta){
      makeRequest('getselectstoponmap.php?rdv='+rdv+'&stopid='+stopselect+'&eta='+eta+'&l='+lang,'dummydiv');
          }

          function p2psharecheck(id){

            var checkbox = document.getElementById("sharep2p"+id);
        if (checkbox.className == 'sharep2pclear'){
          checkbox.className = 'sharep2pchecked';
          if (id == 10 || id == 20){
            //console.log("need to change block");
            for(i=1;i<=3;i++){
            var temp = Number(id)+Number(i);
            var checkboxnext = document.getElementById("sharep2p"+temp);
            //console.log("sharep2p"+id+i);
            if (checkboxnext) checkboxnext.className = 'sharep2pblocked';
            }
          }
        }else if (checkbox.className == 'sharep2pchecked'){
          checkbox.className = 'sharep2pclear';
          if (id == 10 || id == 20){
            //console.log("need to clear block");
            for(i=1;i<=3;i++){
            var temp = Number(id)+Number(i);
            var checkboxnext = document.getElementById("sharep2p"+temp);
            //console.log("sharep2p"+id+i);
            if (checkboxnext) checkboxnext.className = 'sharep2pclear';
            }
          }
        }
          }

          function pdfcheck(id){

          var pdfselect = document.getElementById("pdf"+id);
        if (pdfselect.value == 1){
          pdfselect.value = 0;
          if (id == 10 || id == 20){
            //console.log("need to change block");
            for(i=1;i<=3;i++){
            var temp = Number(id)+Number(i);
            var pdfselectnext = document.getElementById("pdf"+temp);
            //console.log("sharep2p"+id+i);
            if (pdfselectnext) pdfselectnext.value = 0;
            }
          }
        }else if (pdfselect.value == 0){
          pdfselect.value = 1;
          if (id == 10 || id == 20){
            //console.log("need to change block");
            for(i=1;i<=3;i++){
            var temp = Number(id)+Number(i);
            var pdfselectnext = document.getElementById("pdf"+temp);
            //console.log("sharep2p"+id+i);
            if (pdfselectnext) pdfselectnext.value = 1;
            }
          }
        }
          }

          function getshareinfo(){
            //setTimeout(function(){ makeRequest('sharelink.php?info='+shareinfo+'&fromWeb=Y&l='+lang,'dummydiv');}, 500);
		var currentdate = new Date();
		var shareInfoStr = 'P2P||'+startlat+','+startlon+'||'+endlat+','+endlon+'||'+$('#sloc').val()+'||'+$('#eloc').val()+'||'+currentdate.getFullYear()+'-'+('0'+(currentdate.getMonth()+1)).slice(-2)+'-'+
				('0'+currentdate.getDate()).slice(-2)+' '+('0'+currentdate.getHours()).slice(-2)+':'+('0'+currentdate.getMinutes()).slice(-2)+':'+('0'+currentdate.getSeconds()).slice(-2)+',';
		setTimeout(function(){ makeRequest('sharelink.php?info='+shareInfoStr+'&fromWeb=Y&l='+lang,'dummydiv');}, 500);
          }

          function genpngapidata(info,z,startend,mode){
            var ppstartend = startend.split('||');
            var pslat = ppstartend[0];
            var pslon = ppstartend[1];
            var pelat = ppstartend[2];
            var pelon = ppstartend[3];
            var w = 600;
            var h = 300;

            var api_link = "genpngapi.php?info="+info+"&l="+lang;

            if (mode =='A'){
              w = 1000;
              h = 600;
            }
            if (mode =='S'){
              api_link = api_link + "&x=" + pslon + "&y=" + pslat;
            }
            if (mode =='E'){
              api_link = api_link + "&x=" + pelon + "&y=" + pelat;
            }
            if(z) api_link = api_link + "&z=" + z;
            api_link = api_link + "&w=" + w + "&h=" + h;
            //makeRequest('genpngapi.php?info='+info+'&startend='+startend+'&l='+lang,'dummydiv');
            makeRequest(api_link,'dummydiv');
            document.getElementById('pngapi_link').value = "firstbus.mapwithyou.com/nwp3/" + api_link;
          }

          function genpngapiinfo(info){
            pdfid ='';
            makeRequest('showpngapiinfo.php?info='+info+'&l='+lang,'dummydiv');
          }

      function specialNote(r,m)
      {
        var snote = document.getElementById('specialNote');
        if (m =='S'){
              snote.style.left = '50%';
            }else
            {
              snote.style.left = '10px';
            }
        makeRequest('specialNote.php?r='+r+'&l='+lang,'specialNote');


      }

      function showspecialNote()
      {
        document.getElementById('specialNote').style.visibility = "visible";
        document.getElementById('blockclick').style.display = "block";
      }

      function hidespecialNote()
      {
        document.getElementById('specialNote').style.visibility = "hidden";
        document.getElementById('blockclick').style.display = "none";
      }

      function createPDF(id,e)
      { var arr=pdfroute.split(',');

        var pdf11 = document.getElementById('pdf11');
        var pdf12 = document.getElementById('pdf12');
        var pdf21 = document.getElementById('pdf21');
        var pdf22 = document.getElementById('pdf22');
        var pdf23 = document.getElementById('pdf23');
        var tpdf11 = pdf11.value;
        var tpdf12 = pdf12.value;
        var tpdf21 ="";
        var tpdf22 ="";
        var tpdf23 ="";
        var email ="";

        if (pdf21){
          if (pdf21.value == 1){
            tpdf21 = arr[0];
          } else{
          tpdf21 = 0;
          }
        }else {
          tpdf21 = 0;
        }

        if (pdf22){
          if (pdf22.value == 1){
            tpdf22 = arr[1];
          } else{
          tpdf22 = 0;
          }
        }else {
          tpdf22 = 0;
        }

        if (pdf23){
          if (pdf23.value == 1){
            tpdf23 = arr[2];
          } else{
          tpdf23 = 0;
          }
        }else {
          tpdf23 = 0;
        }

        var errmsg ="請選取所需的資料";
        var sentmsg ="已發出電郵";
        if (lang == 1) {
          errmsg = "Please select required information";
          sentmsg = "Email Sent";
        }else if (lang == 2) {
          errmsg = "请选取所需的资料";
          sentmsg ="已发出电邮";
        }

        if (tpdf11 == 0 && tpdf12 == 0 && tpdf21 == 0 && tpdf22 == 0 && tpdf23 == 0) {
          alert(errmsg);
          return false;
        }

        if(e){

        var aaa = document.getElementById('share_email');
        var email = aaa.value;
        makeRequest('reportPDF.php?id='+id+'&r11='+tpdf11+'&r12='+tpdf12+'&r21='+tpdf21+'&r22='+tpdf22+'&r23='+tpdf23+'&e='+email+'&l='+lang,'dummydiv');
        alert(sentmsg);
        }else{
        window.open('reportPDF.php?id='+id+'&r11='+tpdf11+'&r12='+tpdf12+'&r21='+tpdf21+'&r22='+tpdf22+'&r23='+tpdf23+'&l='+lang);
        }
        //makeRequest('reportPDF.php?id='+id+'&l='+lang,'dummydiv');
      }

      function checkemail(){
        var aaa = document.getElementById('share_email');
        var email = aaa.value;

        var errmsg ="電郵地址無效";
        if (lang == 1) {errmsg = "Invalid email address";
        }else if (lang == 2) {errmsg = "电邮地址无效";
        }

        filter=/^.+@.+\..{2,3}$/
        if (filter.test(email)){
          return true;
        }else {
          alert(errmsg);
          return false;
        }
      }

      function validate_hour(){
        var aaa = document.getElementById('search_hour');
        var h = aaa.value;

        var errmsg ="時間錯誤";
        if (lang == 1) {errmsg = "Invalid Hour";
        }else if (lang == 2) {errmsg = "时间错误";
        }

        if (h>=0 && h<24){
          return true;
        }else {
          alert(errmsg);
          aaa.value = '00';
        }
      }

      function validate_minute(){
        var aaa = document.getElementById('search_minute');
        var m = aaa.value;

        var errmsg ="分鐘錯誤";
        if (lang == 1) {errmsg = "Invalid Minute";
        }else if (lang == 2) {errmsg = "分钟错误";
        }

        if (m>=0 && m<60){
          return true;
        }else {
          alert(errmsg);
          aaa.value = '00';
        }
      }

      function convertquote(s){
        var aaa = document.getElementById('s').value;
        aaa = convertcharGO(aaa);
        document.getElementById('s').value = aaa;
      }

      function getLocation(m){
        currentloc_mode = m;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition,geoerror);
          }else{
              alert("Geolocation is not supported by this browser.");
          }
        }

      function geoerror(error){
        if (currentloc_mode == '0') {
                lat=22.280403429297003 - alat;
                lon=114.18416613911 - alon;
        var ll = getlonlat(lon,lat);
          map.panTo(ll);
          gomenu(0,1);
          } else {
		 alert("Geolocation is not supported by this browser: "+error.message);
          }
      }

      function showPosition(position) {
        var tlat1 = 22.396429 - 0.002;
                                var tlat2 = 22.396429 + 0.002;
                                var tlon1 = 114.109496 - 0.002;
                                var tlon2 = 114.109496 + 0.002;
        if(currentloc_mode == 's'){
          mapstartlat=position.coords.latitude;
          mapstartlon=position.coords.longitude;
          if(mapstartlat > tlat1 && mapstartlat < tlat2 && mapstartlon > tlon1 && mapstartlon <tlon2){
          mapstartlat=22.280403429297003 - alat;
                                        mapstartlon=114.18416613911 - alon;
          }

  //        alert(mapstartlat);
      //        alert(mapstartlon);
          var rrr = callweb("get_rgeocode.php?lat="+mapstartlat+"&lon="+mapstartlon+"&l="+lang);
          mapstartname = rrr;
	  startname = mapstartname;
	  document.getElementById('sloc').value=mapstartname;

          var ll=getlonlat(mapstartlon,mapstartlat);
          emarker = addcustommarker(ll,ssmar,36,80,-20,-80);
          map.panTo(ll);
          reordermarker();
          gomenu(2);
        }else if(currentloc_mode == 'e'){
          mapendlat=position.coords.latitude;
          mapendlon=position.coords.longitude;
          if(mapendlat > tlat1 && mapendlat <tlat2 && mapendlon > tlon1 && mapendlon <tlon2){
                                        mapendlat=22.280403429297003 - alat;
                                        mapendlon=114.18416613911 - alon;
                                        }
  //        alert(mapendlat);
  //        alert(mapendlon);
          var rrr = callweb("get_rgeocode.php?lat="+mapendlat+"&lon="+mapendlon+"&l="+lang);
          mapendname = rrr;
	  endname = mapendname;
	  document.getElementById('eloc').value=mapendname;

          var ll=getlonlat(mapendlon,mapendlat);
          emarker = addcustommarker(ll,eemar,36,80,-20,-80);
          map.panTo(ll);
          reordermarker();
          gomenu(2);
        }else if(currentloc_mode == '0'){

        var ll = getlonlat(lon,lat);
          lat=position.coords.latitude;
          lon=position.coords.longitude;
          if(lat > tlat1 && lat <tlat2 && lon > tlon1 && lon <tlon2){
                                        lat=22.280403429297003 - alat;
                                        lon=114.18416613911 - alon;
                                        }
          var ll = getlonlat(lon,lat);
          map.panTo(ll);
          gomenu(0,1);
        }
      }

      function autocomplet() {
        var min_length = 0; // min caracters to display the autocomplete
        var keyword = $('#country_id').val();
        if (keyword.length >= min_length) {
          $.ajax({
            url: 'ajax_refresh.php',
            type: 'POST',
            data: {keyword:keyword},
            success:function(data){
              $('#country_list_id').show();
              $('#country_list_id').html(data);
            }
          });
        } else {
          $('#country_list_id').hide();
        }
      }

      function convertcharGO(s){
        s = s.replace("'","~SQ~");
        s = s.replace('"','~DQ~');
        s = s.replace("&","~AND~");
        s = s.replace("!","~XM~");
        s = s.replace("/","~EM~");

        return s;
      }

      function convertcharBACK(s){
        s = s.replace("~SQ~","'");
        s = s.replace('~DQ~"','"');
        s = s.replace("~AND~","&");
        s = s.replace("~XM~","!");
        s = s.replace("~EM~","!");

        return s;
      }

      function validatebm(){
        var aaa = document.getElementById('bmname');
        var bmname = aaa.value;

        var errmsg ="書籤不能包括特別符號";
        if (lang == 1) {errmsg = "Bookmark can not contains special symbol";
        }else if (lang == 2) {errmsg = "书籤不能包括特别符号";
        }

        filter=/.[\u4e00-\u9fa5_0-9a-zA-Z'"()]$/
        if (filter.test(bmname)){
          return true;
        }else {
          alert(errmsg);
          return false;
        }
      }

      function keepalive(){
        makeRequest("dummy.php?ssid=5e6dcd6cd8e0d","dummydiv");
      }

      var timehandle = setInterval("keepalive();", 120000);


function removeCircle(){

}

function mwypopupremove(){
  hidemappop();
}

function fbpopup(ll){

}

function reordermarker(){

}

function autozoom(){

}

function stopdocment(){

}

var matched, browser;

jQuery.uaMatch = function( ua ) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie)[\s?]([\w.]+)/.exec( ua ) ||
        /(trident)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    return {
        browser: match[ 1 ] || "",
        version: match[ 2 ] || "0"
    };
};

matched = jQuery.uaMatch( navigator.userAgent );
//IE 11+ fix (Trident)
matched.browser = matched.browser == 'trident' ? 'msie' : matched.browser;
browser = {};

if ( matched.browser ) {
    browser[ matched.browser ] = true;
    browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
    browser.webkit = true;
} else if ( browser.webkit ) {
    browser.safari = true;
}

jQuery.browser = browser;
// log removed - adds an extra dependency
//log(jQuery.browser)


function langinit(){
  if(lang==1){
    ssmar="startpoint-f_en.png";
    eemar="endpoint-f_en.png";
  }else if(lang==2){
    ssmar="startpoint-f_sc.png";
    eemar="endpoint-f_sc.png";
  }else{
    ssmar="startpoint-f.png";
    eemar="endpoint-f.png";
  }
}

function hidebookmark(){
  var box = document.getElementById('getbookmarklist');
  box.style.display="none";
}


function getbookmark(obj,no){
  var box = document.getElementById('getbookmarklist');
  var h = $(obj).offset().top;
  var l = $(obj).offset().left;
  box.style.top = (h+5)+"px";
  box.style.left = (l+5)+"px";
  box.style.display="block";
  makeRequest("bookmarklist.php?mode="+no,"getbookmarklist");
}

function setbmstartend(mode,str){
  var aaa = str.split("||");
  if(mode==0){
    startname = aaa[1];
    startlat = parseFloat(aaa[2]);
    startlon = parseFloat(aaa[3]);
  }else{
    endname = aaa[1];
    endlat = parseFloat(aaa[2]);
    endlon = parseFloat(aaa[3]);
  }
  mappanto(parseFloat(aaa[3]),parseFloat(aaa[2]));
  gomenu(2,1);
  hidebookmark();
}

function closeautocom(){
	var box = document.getElementById('autocom');
	var box2 = document.getElementById('autocom2');
	if(box){
		box.style.display="none";
	}
	if(box2){
		box2.style.display="none";
	}
}

//-------------------- For CS --------------------------
var tramRailSource = new ol.source.Vector({});
var csNearByStopSource = new ol.source.Vector({}); // nearby stops of selected stop


var isTramRailOn = false;


var stopNearbyMarkersize = new Array(1000);

// show nearby stops of selected stop
  function addstoponmap_near_cs(stopid,lon,lat,ccode,bsa_seq,name,rdv,altLon,altLat){
        lon = lon-0;
        lat = lat-0;
        var temp = '||0||0||0';
        var etainfo = stopid.concat(temp);
        //makeRequest(\'auto_e9d160cd20d8446e98433148b2dc0cad.php?info='.$etainfo.'\',\'dummydiv\')
        //var mmm = addmarker(getlonlat(lon,lat),ccode,num,name);
        name=name+"|*|["+stopid+"]"+stopid+"|*|"+altLon+"||"+altLat+"|*|";
        var mmm = addcustommarker_cs(getlonlat(lon,lat),"stop3.png",40,40,-2,-40,name);
  }

  function addcustommarker_cs(ll,png,sizex,sizey,offx,offy,name){
        var lng=parseFloat(ll[0]);
        var lat=parseFloat(ll[1]);
        var increment = 1;
        var lastpoint = -1;
	var info = name+"||C||"+lat+"||"+lng+"||"+png+"||"+sizex+"||"+sizey+"||"+offx+"||"+offy;

        lastpoint=stopNearbyMarkercount;
	stopNearbyMarkerlat[lastpoint] = lat;
        stopNearbyMarkersize[lastpoint] = [sizex,sizey,offx,offy];


        stopNearbyMarkers[lastpoint] = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([lng+alon,lat+alat],'EPSG:4326', 'EPSG:3857')),
                name: info
        });
	amode='pixels';
        ax=(-offx)*2;
        ay=(-offy);
        if(sizex==15){
          ax=0.5;
          ay=0.5;
          amode='fraction';
        }
        var iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                        scale: 1,
                        anchor: [ax,ay],
                        anchorXUnits: amode,
                        anchorYUnits: amode,
                        opacity: 1,
                        src: png
                }))
        });
        stopNearbyMarkers[lastpoint].setStyle(iconStyle);

        csNearByStopSource.addFeature(stopNearbyMarkers[lastpoint]);

	stopNearbyMarkercount++;

  }


function clearCsNearbyMarker()
{
        csNearByStopSource.clear();
}


function showTramRail(){
        tramRailSource.clear()
        if (!isTramRailOn){
                document.getElementById("tramrailBtn").style.background='#6c3f98';

                //addtramRail('getTramRailLine.php?id=1','#FF0000');

                /*for (i=0; i<10; i++)
                        addTramLineColor('getTramRailLine.php?id='+i, 0.6, 200, 0, 155);{
                }*/

                var s=callweb('getTramRailLine.php');

                var routeItem = s.split("|**|");
                for(var i=0; i<routeItem.length; i++)
                {
                        addTramLineColor(routeItem[i], 0.6, 200, 0, 155);
                }
        }
        else
        {
                document.getElementById("tramrailBtn").style.background='#af89d3';
        }

        isTramRailOn = !isTramRailOn;
}


function addTramLineColor(s,a, r, g, b){

//alert(s);
  var color='rgba('+r+','+g+','+ b+','+a+')';
//var color='rgba(0,128,0,0.6)';
  var lineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke(({
      color: color,
      width: 2
    }))
  });


  var pointscolor = [];

  var linepoint = s.split("|*|");
  var segment = [];
  for(var i=0; i<linepoint.length; i++){
    if(linepoint[i].length>5){
      var aaa = linepoint[i].split("||");
      var lon = parseFloat(aaa[1]);
      var lat = parseFloat(aaa[0]);
      segment.push(ol.proj.transform( [lon, lat], 'EPSG:4326', 'EPSG:3857'));
    }
  }

  pointscolor.push(segment);

  var colorline = new ol.Feature({
      geometry: new ol.geom.MultiLineString(pointscolor),
      name: "Line"
  });
  colorline.setStyle(lineStyle);


  tramRailSource.addFeature(colorline);
}


function clearAutoRouteSearchData()
{
	autoRouteSearch_info = "";
	autoRouteSearch_rdv = "";
	autoRouteSearch_r = "";
	autoRouteSearch_d = "";
	autoRouteSearch_v = "";
	autoRouteSearch_bound = "";
	autoRouteSearch_stopid = "";
}

var routeDetailMode="p2p";
function reCalItemList2Height()
{
	if (routeDetailMode=='p2p')
		$('#itemlist2').css({ 'height': 'calc(100% - ' + document.getElementById('routenote').clientHeight + 'px - 95px' });
	else if (routeDetailMode=='single')
                $('#itemlist2').css({ 'height': '100%' });
}

function changevarianceicon(route_index, bound, lang){
	var box = document.getElementById('variance_icon');
	var imagesrc = box.src;
	var filename = imagesrc.replace(/^.*[\\\/]/, '');
	var rect = box.getBoundingClientRect();
        console.log(rect.top, rect.right, rect.bottom, rect.left);
	if(filename=="variant_close.png"){
		box.src="variant_open.png";
		hidevarianceoption();
	}else{
		box.src="variant_close.png";
		showvarianceoption(rect.top);
		makeRequest('showvarianceoption.php?rid='+route_index+'&bound='+bound+'&l='+lang+'&ltab='+lasttab,'variance_options');
	}
	console.log(filename);
}

function showvarianceoption(top){
	var box = document.getElementById('variance_options');
	box.style.display="block";
	box.style.top = top+'px';
	var boxback = document.getElementById('variance_options_back');
	boxback.style.top = (top+25)+'px';
	boxback.style.bottom = '0px';
        boxback.style.display = "block";
}

function hidevarianceoption(){
        var box = document.getElementById('variance_options');
        box.style.display="none";
	var obj = document.getElementById('variance_icon');
	obj.src="variant_open.png";
	var boxback = document.getElementById('variance_options_back');
	boxback.style.display = "none";
}



//-------------------- For Recaptcha -------------------------
function showRecaptcha() {
        var obj = document.getElementById("recaptbox");
        obj.style.display = "block";
        //var url = "showRecaptcha.php";
        //makeRequest(url, "recap");
}

function hideRecaptcha() {
        var obj = document.getElementById("recaptbox");
        obj.style.display = "none";
}

function testScriptLoad() {
        var htmlEl = "recaptcha";

        if (recaptcha_rendered) {
                grecaptcha.reset(recaptchaId);
        } else {
                var captchaOptions = {
                        sitekey: '6LcKzb4UAAAAAMGKa9eidIJuiAJHY4JiSlYefBrK',
                        size: 'invisible',
                        callback: function (token) {
                                //console.log('test:   ',token);

                                alert(recaptcha_type);
                                hideRecaptcha();
                        }
                };

                recaptchaId = grecaptcha.render(htmlEl, captchaOptions, false);

                recaptcha_rendered = true;
        }
}

function recaptchaLoad() {
        var htmlEl = "recaptcha";

        if (recaptcha_rendered) {
                grecaptcha.reset(recaptchaId);
        } else {
                var captchaOptions = {
                        sitekey: '6LcKzb4UAAAAAMGKa9eidIJuiAJHY4JiSlYefBrK',
                        size: 'invisible',
                        callback: function (token) {
                                //console.log('test:   ',token);

                                hideRecaptcha();
                                makeRequest("checkSuccess.php?type=" + recaptcha_type + "&checkValue=" + recaptcha_key + "&success=Y", "dummydiv");
                        }
                };

                recaptchaId = grecaptcha.render(htmlEl, captchaOptions, false);

                recaptcha_rendered = true;
        }
}





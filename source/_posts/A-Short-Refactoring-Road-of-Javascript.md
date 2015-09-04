title: "A Short Refactoring Road of Javascript"
layout: post
tags:
  - javascript
  - design pattern
category:
  - technology
date: 2014/6/10
---

> Seek and find.

Last month I was busy to test one of my idea that help people plan their daily trips easier, then I created a site called [quickloop][1]. However, curious friends may find the source code looks so ugly, definitely not object oriented nor unit testable. YES, that's what we called `prototype`.

As a guy always trying to cook better data, I started a simple refactoring three days ago. Since I am a classic layman of Javascript design pattern, I decide to read a little bit about the design pattern in Javascript. This book, *[Learning Javascript Design Patterns][2]*, is a very good source to quickly grasp the key concept and start your refactoring road. Something called `prototype pattern` comes to my mind. Sounds interesting, let's have a look at what it does.

<!-- more -->

Previously, a piece of my code looks like the following block.

```
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(centerMapByPosition);
    } else {
      alert("Geolocation is not supported by this browser!");
    }
  }

  function centerMapByPosition(position) {
    var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map.setCenter(center);
    map.setZoom(12);
  }

  function centerMapByCoordinates(lat, lng) {
    var center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
    map.setZoom(12);
  }

  Plus, I have tons of global variables list below.

  var map = null;
  var geocoder = null;
  var infowindow = null;
  var autocomplete = null;
  var distanceMatrix = null;
  var directionsDisplay = null;
  var directionsService = null;
```

This kind of code is a typical guy who learned Javascript for an hour could write. But why it does not a good code? Simply for two reason: 1) it does not look pretty; 2) it is not modulized which causes a lot of trouble to unit test. So how does this `prototype pattern` could help? Let's see what we could do to change the above code into a prototype pattern code.

```
var MapServiceHelper = function () {
  var map = null;
  var geocoder = null;
  var infowindow = null;
  var autocomplete = null;
  var distanceMatrix = null;
  var directionsDisplay = null;
  var directionsService = null;
}

MapServiceHelper.prototype = {
  getCurrentLocation: function () {
    ...
  },

  centerMapByPosition: function (position) {
    ...
  },

  centerMapByCoordinates: function (lat, lng) {
    ...
  }
}
```

Thereafter, we can use the MapServiceHelper in the following way.

```
$(doucument).ready(function () {
  var mapServiceHelper = new MapServiceHelper();
  mapServiceHelper.getCurrentLocation();
    ...
});
```

Now do you feel the code becomes more clear to understand and maintain? At least I do. However, if you look at the `getCurrentLocation()` function, you will find the `centerMapByPosition()` is actually a callback from Google Maps API. So can I just use `this.centermapByPosition` as my callback?

Unfortunately, you cannot althougth I thought so and used that way. The key issue here is Javascript's context. If you define a variable inside a Javascript function and this variable is visible from the callback function. In contrast, `this` points to a different context when the execution jumps to the callback function.

A simple solution is to make a copy of the context to a variable so that the context can be exposed to the callback function.

```
function A () {
  this.y = 100;
  var context = this;
  function B () {
    var x = context.y; // here x = 100;
  }
}
```

This looks like a good solution and it works well. But the only thing I don't like is the duplicaltion. I have to make a copy of the context almost everywhere when I meet a callback function. Moreover, if you have multiple layer nested callback, this make life even worse. Thanks to the post, *[Understanding Scope and Context in Javascript][3]*, I could use an even better way which is referred as `call and apply`. See the following code as an example.

```
if(!('bind' in MapServiceHelper.prototype)){
  MapServiceHelper.prototype.bind = function(){
    var fn = this, context = arguments[0], args = Array.prototype.slice.call(arguments, 1);
    return function(){
      return fn.apply(context, args.concat(Array.prototype.slice.call(arguments)));
    }
  }
}
```

In this way, I can use any callback funtion with a suffix `.bind(this)` to force the context to the one I need. Finally, I change it to the following style.

```
getCurrentLocation: function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(this.callbackGetCurrentLocation.bind(this));
  } else {
    alert("Geolocation is not supported by this browser!");
  }
},

callbackGetCurrentLocation: function (position) {
  var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  this.Map.setCenter(center);
  this.Map.setZoom(12);
},

setMapCenterByCoordinates: function (lat, lng) {
  var center = new google.maps.LatLng(lat, lng);
  this.Map.panTo(center);
  this.Map.setZoom(12);
},
```

Till now, a short refactoring with the prototype pattern has been done and the code looks better. More importantly, it helps me quickly locate a bug that I could spend a long time to notice.

[1]: http://jilongliao.com/quickloop
[2]: http://addyosmani.com/resources/essentialjsdesignpatterns/book/
[3]: http://ryanmorr.com/understanding-scope-and-context-in-javascript/

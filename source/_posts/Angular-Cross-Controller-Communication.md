title: "Angular Cross Controller Communication"
layout: post
tags:
- javascript
- angular
category:
- technology
date: 2015/1/1
---

When we architect a larger Angular app, we cannot avoid the cross controller communication issue. This issue is very interesting because it has some overlap with the `$watch` concept. My first approach is to give the hope `$watch` will handle everything simply and elegantly. However, it turns out we might need a little more work with `$rootScope`, `$broadcast` and `$on` here to overcome this little challenge.

<!-- more -->

So here is the scenario that I need to tackle.

> I have two controllers: `A` and `B`, which shares the same data `x`. Both A and B have directives to change and update the data. So when `x` is changed in `A`, the changes should be reflected in `B` as well, and vice versa.

My first solution is to have a `Service` hold the shared data `x` and use `$watch` to monitor this variable in both controllers. The code is like the following:

```{javascript}
// service
angular.module("myApp", [])
.service("SharedDataService", function() {
  return {
    x: []
  };
});

// controller A
angular.module("myApp")
.controller("A", ["$scope", "SharedDataService", function($scope, SharedDataService) {
  $scope.$watch(function() {
    return SharedDataService.x;
  }, function(newValue) {
    $scope.x = SharedDataService.x;
  });
  // do something to change x.
}]);

// controller B
angular.module("myApp")
.controller("B", ["$scope", "SharedDataService", function($scope, SharedDataService) {
  $scope.$watch(function() {
    return SharedDataService.x;
  }, function(newValue) {
    $scope.x = SharedDataService.x;
  });
  // do something to change x.
}]);
```

This code looks perfect for me at the beginning because you can always catch the data change. However, when I run the code, I realize one of the important thing about `$watch` in this scenario that controller A's change can be propagated to controll B, not the reverse way. I thought there might be some other issues with this, later I think it might not the right way to deal with cross controller communication after exhausted trying.

After reading some stack overflow posts, I understand three other things: `$rootScope`, `$broadcast` and `$on`. So the idea becomes more straight forward that use `$rootScope` to notify while listen events inside each controller. Performance-wise this is a cheaper notification as well because you just broadcast a simple message but the updated data is always stored in the service. Therefore, with a little tweak on the code above, we can easily make the cross controller communication happen.

```{javascript}
// service
angular.module("myApp", [])
.service("SharedDataService", ["$rootScope", function($rootScope) {
  return {
    x: [],
    notify: function() {
      $rootScope.$broadcast("xHasChanged");
    }
  };
}]);

// controller A
angular.module("myApp")
.controller("A", ["$scope", "SharedDataService", function($scope, SharedDataService) {
  $scope.$on("xHasChanged", function() {
    $scope.x = SharedDataService.x;
  });
  // do something to change x.
  SharedDataService.notify();
}]);

// controller B
angular.module("myApp")
.controller("B", ["$scope", "SharedDataService", function($scope, SharedDataService) {
  $scope.$on("xHasChanged", function() {
    $scope.x = SharedDataService.x;
  });
  // do something to change x.
  SharedDataService.notify();
}]);
```

###P.S
If you put controller `A` and `B` in different files, you need to understand the difference of the code a little: `angular.module("myApp", [])` creates an app module while `angular.module("myApp")` refers to the existing app module.

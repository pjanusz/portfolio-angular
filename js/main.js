var site = angular.module('site', ['ngRoute', 'ngAnimate', 'vcRecaptcha']);

site.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/start.html'
        })
        .when('/start', {
            templateUrl: 'pages/start.html'
        })
        .when('/about', {
            templateUrl: 'pages/about.html',
        })
        .when('/portfolio', {
            templateUrl: 'pages/portfolio.html',
        })
        .when('/contact', {
            templateUrl: 'pages/contact.html',
        });
});

site.controller('siteCtrl', function ($scope, $http) {
    $http.get('js/content.json')
        .then(function (response) {
            $scope.content = response.data;
        });
});

site.controller('navCtrl', function ($scope, $location, $window, $document) {
    $scope.mainNav = angular.element($document[0].querySelector('#nav-main'));
    if ($window.innerWidth >= 651) $scope.hideNavToggle = false;
    else $scope.hideNavToggle = true;
    $scope.isActive = function (loc) {
        return loc === $location.path();
    }
    $window.onresize = function resize() {
        if ($window.innerWidth >= 651 && $scope.hideNavToggle === true) {
            $scope.hideNavToggle = false;
            $scope.$apply();
        } else if ($window.innerWidth <= 650 && $scope.hideNavToggle === false) {
            $scope.hideNavToggle = true;
            $scope.$apply();
        }
    }
    $scope.navToggle = function () {
        return $scope.hideNavToggle = $scope.hideNavToggle === true ? false : true;
    }
});

site.controller('aboutCtrl', ['$scope', '$document', function ($scope, $document) {
    $scope.goTo = function (to) {
        var main = $document[0].querySelector('#main');
        var scroll = $document[0].querySelector('#' + to);
        main.scrollTo(0, scroll.offsetTop - 100);
    };
}]);

site.controller('portfolioCtrl', ['$scope', function ($scope) {
    $scope.selected = 0;
    projectsLength = $scope.content.portfolio.items.length;
    $scope.select = function ($index, $event) {
        console.log($event.target.index);
        if (!$index && $event.toElement.value == 'minus') {
            return $scope.selected === 0 ? $scope.selected = projectsLength - 1 : $scope.selected--;
        } else if (!$index && $event.toElement.value == 'plus')
            return $scope.selected >= projectsLength - 1 ? $scope.selected = 0 : $scope.selected++;
        else {
            return $scope.selected = $index;
        }
    }
}]);

site.controller('contactCtrl', ['$scope', '$http', 'vcRecaptchaService', function ($scope, $http, vcRecaptchaService) {
    $scope.publicKey = '6LfEVoUUAAAAAO2-ve3QbcS8_R0xIPvvNgYtgA4x';
    $scope.sendMail = function () {
        if (!$scope.contactForm || !$scope.contactForm.name || !$scope.contactForm.mail || !$scope.contactForm.text) return;

        /* vcRecaptchaService.getResponse() gives you the g-captcha-response */

        if (vcRecaptchaService.getResponse() === "") { //if string is empty
            alert("Zaznacz, że nie jesteś robotem, nawet jak jesteś ;)")
        } else {
            var fromForm = {
                'name': $scope.contactForm.name,
                'email': $scope.contactForm.mail,
                'text': $scope.contactForm.text,
                'captchaResponse': vcRecaptchaService.getResponse() //send g-captcah-reponse to our server
            }
            $http.post('https://piotrjanusz.pl/mail.php', fromForm).success(function (x) {
                if (x) {
                    grecaptcha.reset();
                    $scope.contactForm.name = '';
                    $scope.contactForm.mail = '';
                    $scope.contactForm.text = '';
                    alert("Wiadomość została wysłana!");
                } else {
                    alert("Coś nie tak z reCaptcha...");
                }
            }).error(function (error) {
                console.log(error);
            });
        }
    }
}]);
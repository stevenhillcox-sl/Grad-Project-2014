require.config({
    baseUrl: "js/",
    paths: {
        'jQuery': 'lib/jquery-2.1.1.min',
        'knockout': 'lib/knockout-3.2.0',
        'TouchSwipe': 'lib/jquery.touchSwipe.min',
        'bootstrap': 'http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min'
    },
    shim: {
        'jQuery': {
            exports: '$'
        },
        'knockout': {
            exports: 'ko'
        },
        'bootstrap': ['jQuery'],
        'TouchSwipe': ['jQuery']
    }
});


require(['jQuery', 'knockout', 'viewmodels/IndexViewModel', 'bootstrap'], function($, ko, IndexViewModel) {

    var self = this;

    self.indexViewModel = new IndexViewModel();
    ko.applyBindings(self.indexViewModel);
});
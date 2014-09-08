require.config({
    baseUrl: "js/",
    paths: {
        'jQuery': 'lib/jquery-2.1.1.min',
        'knockout': 'lib/knockout-3.2.0',
        'TouchSwipe': 'lib/jquery.touchSwipe.min'
    },
    shim: {
        'jQuery': {
            exports: '$'
        },
        'knockout': {
            exports: 'ko'
        },
        'TouchSwipe': ['jQuery']
    }
});

require(['jQuery', 'knockout', 'viewmodels/IndexViewModel'], function($, ko, IndexViewModel) {

    var self = this;

    self.indexViewModel = new IndexViewModel()
    ko.applyBindings(self.indexViewModel);
});
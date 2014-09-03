require.config({
    paths: {
        'jQuery': 'lib/jquery-2.1.1.min',
        'knockout': 'lib/knockout-3.2.0'
    },
    shim: {
        'jQuery': {
            exports: '$'
        },
        'knockout': {
            exports: 'ko'
        }
    }
});

require(['knockout','viewmodels/IndexViewModel'], function(ko, IndexViewModel){
    ko.applyBindings(new IndexViewModel());
});
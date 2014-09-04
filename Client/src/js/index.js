require.config({
    paths: {
        'jQuery': 'lib/jquery-2.1.1.min',
        'knockout': 'lib/knockout-3.2.0',
        'bootstrap' : 'lib/bootstrap.min',
        'bootstrap-hover' : 'lib/bootstrap-hover-dropdown.min'
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
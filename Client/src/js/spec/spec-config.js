require.config({
    paths: {
        'jQuery': 'Client/src/js/lib/jquery-2.1.1.min',
        'knockout': 'Client/src/js/lib/knockout-3.2.0',
        'TouchSwipe': 'Client/src/js/lib/jquery.touchSwipe.min'
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
ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [55.769796, 37.638879],
            zoom: 14,
            controls: [], //['geolocationControl', 'zoomControl'],
        }, {
            suppressMapOpenBlock: true,
            geolocationControlSize: "large",
            geolocationControlPosition: {
                top: "300px",
                right: "20px"
            },
            geolocationControlFloat: 'none',
            zoomControlSize: "small",
            zoomControlFloat: "none",
            zoomControlPosition: {
                top: "220px",
                right: "20px"
            }
        }, {
            searchControlProvider: 'yandex#search'
        }),
        MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        ),

        myPlacemarkWithContent = new ymaps.Placemark([55.769796, 37.638879], {
            iconContent: '',
        }, {
            iconLayout: 'default#imageWithContent',
            iconImageHref: '../images/yndx.svg',
            iconImageSize: [12, 12],
            iconImageOffset: [185, -130],
            iconContentOffset: [15, 15],
            iconContentLayout: MyIconContentLayout,
        });

    myMap.geoObjects.add(myPlacemarkWithContent);
});
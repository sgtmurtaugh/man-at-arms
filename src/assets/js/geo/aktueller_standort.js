/*!
 * @name aktueller_standort
 * @author @dkoslows
 * Ermittlung des aktuellen Standorts: Erhalt von Geo- und Adressdaten
 * */
;(function($){
    if (!$.hjb) {
        $.hjb = {};
    }

    $.hjb.aktuellerStandort = function(el, options){
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("hjb.aktuellerStandort", base);

        base.init = function(){
            base.options = $.extend({}, $.hjb.aktuellerStandort.defaultOptions, options);
            base.$el.on(base.options.onEvent, function(){
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(base.receiveGeoPosition, base.receiveGeoError)
                } else {
                    console.log('GEO-Api wird von Ihrem Browser nicht unterstützt');
                }
            });
        };

        base.receiveGeoPosition = function(position){
            if (position != null){

                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                if (base.options.writeIntoLatLng) {
                    var formElementLatLng = $('[name="' + base.options.formControlNameLatLng + '"]');
                    if (formElementLatLng != null) {
                        $(formElementLatLng).val(lat + ',' + lng);
                    } else {
                        console.log('Das FormElement mit dem Namen ' + base.options.formControlNameLatLng + 'wurde nicht gefunden.');
                    }
                }

                if (base.options.writeIntoPlzOrt) {
                    var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
                    var geocoder = new google.maps.Geocoder;
                    if (geocoder != null) {
                        geocoder.geocode({'location': latlng}, function (results, status) {
                            if (status === 'OK') {
                                if (results[0]) {
                                    var address = results[0].formatted_address;
                                    var address_parts = address.split(',');
                                    var formattedAddress = address_parts[1].trim();

                                    var formElementPlzOrt = $('[name="' + base.options.formControlNamePlzOrt + '"]');
                                    if (formElementPlzOrt != null){
                                        $(formElementPlzOrt).val(formattedAddress);
                                    } else {
                                        console.log('Das FormElement mit dem Namen ' + base.options.formControlNamePlzOrt + 'wurde nicht gefunden.');
                                    }
                                } else {
                                    console.log('Geocoder: Es wurde kein Resultat gefunden.');
                                }
                            } else {
                                console.log('Geocoder: Status nicht OK. Status = ' + status)
                            }
                        });
                    } else {
                        console.log('Geocoder ist null.');
                    }
                }
            } else {
                console.log('Die Position konnte nicht ermittelt werden (Position ist null).');
            }
        };

        base.receiveGeoError = function(error){
            console.log("Es trat folgender Fehler auf: " + error);
        },

        base.init();
    };

    $.hjb.aktuellerStandort.defaultOptions = {
        onEvent: "click",
        writeIntoLatLng: true,
        formControlNameLatLng: "coordinates_direct",
        writeIntoPlzOrt: true,
        formControlNamePlzOrt: "plzOrt"
    };

    $.fn.hjb_aktuellerStandort = function(options){
        return this.each(function() {(new $.hjb.aktuellerStandort(this, options));
        });
    }

})(jQuery);

//Hier muss der initiale Aufruf gemacht werden. Modul ansprechen
$('a[name="standortlink"]').hjb_aktuellerStandort();
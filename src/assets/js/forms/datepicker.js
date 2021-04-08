/**
 * Created by anuebel on 21.07.2016.
 */


/* German initialisation for the jQuery UI date picker plugin. */
/* Written by Milian Wolff (mail@milianw.de). */
( function( factory ) {
    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( [ "../widgets/datepicker" ], factory );
    } else {

        // Browser globals
        factory( jQuery.datepicker );
    }
}( function( datepicker ) {

    datepicker.regional.de = {
        closeText: "Schließen",
        prevText: "&#x3C;Zurück",
        nextText: "Vor&#x3E;",
        currentText: "Heute",
        monthNames: [ "Januar","Februar","März","April","Mai","Juni",
            "Juli","August","September","Oktober","November","Dezember" ],
        monthNamesShort: [ "Jan","Feb","Mär","Apr","Mai","Jun",
            "Jul","Aug","Sep","Okt","Nov","Dez" ],
        dayNames: [ "Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag" ],
        dayNamesShort: [ "So","Mo","Di","Mi","Do","Fr","Sa" ],
        dayNamesMin: [ "So","Mo","Di","Mi","Do","Fr","Sa" ],
        weekHeader: "KW",
        dateFormat: "dd.mm.yy",
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: "" };
    datepicker.setDefaults( datepicker.regional.de );

    return datepicker.regional.de;

} ) );


$(document).ready(function(){


    var formular_datepicker = $(".form-element-datepicker input");

    $( formular_datepicker ).datepicker({
        //showOn: "button",
        //buttonImage: "images/calendar.gif",
        //buttonImageOnly: true,
        //buttonText: "Bitte auswählen...",
        firstDay: 1,
        minDate:'-100y',
        maxDate:'+100y',
        defaultDate:'+0y',
        yearRange:'-100y:+100y',
        changeMonth: true,
        changeYear: true,
        showOtherMonths: true
    });

});

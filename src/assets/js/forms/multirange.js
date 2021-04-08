/*!
 * Copyright:    Copyright (c) 2020
 * Company:      KBS
 * Author:       ckraus
 * Version:      $Revision: 1.0 $
 * Modified by:  $Author: ckraus $
 * Date:         $Date: 2020/08/13 17:00:03 $
 *
 * Wenn die Seite gerendert wurde, werden alle Input Elemente mit der class multirange auf type hidden gesetzt, da hier der Foundation Mechanismus greift und Elemente dann optisch versteckt werden
 * muessen.
 */
document.addEventListener('DOMContentLoaded', function(event) {
    // $('#{{id}}_max').get(0).type = 'hidden';
    $('input.multirange').each(function ( index, obj ) {
        obj.type = 'hidden';
    });
});

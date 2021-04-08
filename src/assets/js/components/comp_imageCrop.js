/*!
 * @name comp_imageCrop
 * @author @ckraus
 * TODO
 */
;(function($){
    if (!$.hjb) {
        $.hjb = {};
    }

    $.hjb.comp_imageCrop = function(el, options) {
        let base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("hjb.comp_imageCrop", base);

        base.init = function() {
            base.options = $.extend({}, $.hjb.comp_imageCrop.defaultOptions, options);



            var URL = window.URL || window.webkitURL;
            var $upload = $('#upload');
            var $handle = $('#cropHandle');
            var $file = $('#file');
            var $canvas = $('#canvas');
            var caman;


            $handle.hide();

            if (URL) {
                $file.change(function () {
                    var files = this.files;
                    var file;

                    if (files && files.length) {
                        file = files[0];

                        if (/^image\/\w+$/.test(file.type)) {
                            base.startCaman(URL.createObjectURL(file));
                        } else {
                            window.alert('Please choose an image file.');
                        }
                    }
                });
            } else {
                $file.prop('disabled', true);
            }

            $('#brightness').on('click', function () {
                if (caman) {
                    caman.brightness(20).render(base.startCropper);
                }
            });

            $('#contrast').on('click', function () {
                if (caman) {
                    caman.contrast(10).render(base.startCropper);
                }
            });
        };

        /**
         *
         */
        base.startCropper = function() {

            // Destroy if already initialized
            if ($canvas.data('cropper')) {
                $canvas.cropper('destroy');
            }

            // Initialize a new cropper
            $canvas.cropper({
                crop: function (e) {
                    console.log(e);
                }
            });
        }

        /**
         *
         * @param url
         */
        base.startCaman = function (url) {
            caman = Caman('#canvas', url, function () {
                URL.revokeObjectURL(url);
                $upload.hide();
                $handle.show();

                base.startCropper();
            });
        }


        base.init();
    };

    $.hjb.comp_imageCrop.defaultOptions = {

    };

    $.fn.hjb_comp_imageCrop = function(options){
        return this.each(function() {
            (new $.hjb.comp_imageCrop(this, options));
        });
    }
})(jQuery);

$('html').hjb_comp_imageCrop();




// $(function () {
//     var URL = window.URL || window.webkitURL;
//     var $upload = $('#upload');
//     var $handle = $('#handle');
//     var $file = $('#file');
//     var $file = $('#file');
//     var $canvas = $('#canvas');
//     var caman;
//
//     function startCropper() {
//
//         // Destroy if already initialized
//         if ($canvas.data('cropper')) {
//             $canvas.cropper('destroy');
//         }
//
//         // Initialize a new cropper
//         $canvas.cropper({
//             crop: function (e) {
//                 console.log(e);
//             }
//         });
//     }
//
//     function startCaman(url) {
//         caman = Caman('#canvas', url, function () {
//             URL.revokeObjectURL(url);
//             $upload.hide();
//             $handle.show();
//
//             startCropper();
//         });
//     }
//
//     $handle.hide();
//
//     if (URL) {
//         $file.change(function () {
//             var files = this.files;
//             var file;
//
//             if (files && files.length) {
//                 file = files[0];
//
//                 if (/^image\/\w+$/.test(file.type)) {
//                     startCaman(URL.createObjectURL(file));
//                 } else {
//                     window.alert('Please choose an image file.');
//                 }
//             }
//         });
//     } else {
//         $file.prop('disabled', true);
//     }
//
//     $('#brightness').on('click', function () {
//         if (caman) {
//             caman.brightness(20).render(startCropper);
//         }
//     });
//
//     $('#contrast').on('click', function () {
//         if (caman) {
//             caman.contrast(10).render(startCropper);
//         }
//     });
// });
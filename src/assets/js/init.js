(function($) {
    //$('.mod_JobSearch').hjb_createJobSearch();
    //$('.mod_JobSearchResults').hjb_initializeJobSearchResults();
    //$(".module_navigation").kn_moduleNavigation();
    $('.module_carousel').hjb_initializeCarousel();

    $('.mod_JobSearch').hjb_initializeJobSearch({
        "progress": binding => {
            let js = $.hjb.jobsearch;
            let $oldContainer;

            return new $.hjb.bubbles.Progress({
                finalize: () => binding.submit(),
                bubbles: [
                    {
                        headline: () => {
                            let message = binding.what.label;

                            if (binding.what.get() !== "") {
                                message = binding.what.get();
                            }

                            return message;
                        },
                        binding: binding.what,
                        variant: 'SelectButtons',
                        arrange: 'column',
                        complete: () => binding.what.get() !== "" ,
                        renderContainer: update => js.$createSelectButtons(binding.what, update)
                    }, {
                        headline: () => {
                            let message = binding.where.label;

                            if (binding.where.get() !== "") {
                                message = binding.where.get();
                            }

                            return message;
                        },
                        binding: binding.where,
                        variant: 'TextBox',
                        arrange: 'column',
                        complete: () => binding.where.get() !== "",

                        renderContainer: update => {

                            let $container = $(`
                                <form>
                                    <input type="text" placeholder="PLZ oder Ort eingeben" autocomplete="adress-level-2"/>
                                    <input type="submit" style="display: none"/>
                                </form>
                            `);

                            $container.find('input[type=text]:first').bind('custom', function(event, param1, param2){
                                binding.where.set($container.find('input[type=text]:first').val());
                                update();
                                event.preventDefault();
                                event.stopImmediatePropagation();
                            });


                            $container.gsb_AutoSuggest("/DE/Suche/AutosuggestPlzOrt/Autosuggest_Formular.html?nn=12");
                            return $container;
                        }
                    }, {
                        headline: () => {
                            let message = binding.wherefore.label;

                            if (binding.wherefore.get() !== "") {
                                message = binding.wherefore.get();
                            }

                            return message;
                        },
                        binding: binding.wherefore,
                        variant: 'SelectButtons',
                        arrange: 'column',
                        complete: () => binding.wherefore.get() !== "",
                        renderContainer: update => js.$createSelectButtons(binding.wherefore, update)
                    }
                ],

                finish: function() {
                    binding.submit();
                }
            });
        },
        "filter": {
        }
    });
})(jQuery);
;(function($) {
    if (!$.hjb) {
        $.hjb = {};
    }

    $.hjb.jobsearch = {};
    let js = $.hjb.jobsearch;
    let lu = $.hjb.layoututils;

    // Filterpanel

    js.FilterPanel = function(bindings, params) {
        let self = this;
        self.params = $.extend({
            lefts: [],
            rights: [],
            resets: [],
            timing: 222,
            easing: "swing"
        }, params);

        self.opend = false;
        self.activeFilter = null;

        self.$element = $(`
            <div class="mod_JobSearch-FilterPanel">
                <div class="mod_JobSearch-FilterPanelToggle">
                    <button class="lib_LayoutUtils-Toggle">Suche verfeinern</button>
                </div>
                <div class="mod_JobSearch-Content">
                    <div class="mod_JobSearch-FilterBar">
                        <div class="mod_JobSearch-FilterBar--Left"></div>
                        <div class="mod_JobSearch-FilterBar--Right"></div>
                    </div>
                    <div class="mod_JobSearch-ResetPanel">
                        <div class="mod_JobSearch-ResetBar"></div>
                        <button class="mod_JobSearch-ResetAll"></button>
                    </div>
                </div>
            </div>
        `);

        self.$getContent().hide();

        let toggle = new lu.Toggle(self.$getToggle());

        toggle.$element.on('change', event => {
            self.$getContent().toggle();
        });

        self.params.lefts.forEach(filter => self.addLeft(new js.Filter(filter, self)));
        self.params.rights.forEach(filter => self.addRight(new js.Filter(filter, self)));

        self.$getResetAll().on('click', event => self.reset());

        return self;
    };

    js.FilterPanel.prototype.appendTo = function($element) {
        let self = this;

        $element.append(self.$element);

        return self;
    };

    js.FilterPanel.prototype.addLeft = function(filter) {
        let self = this;

        filter.appendTo(self.$getLeft());

        return self;
    };

    js.FilterPanel.prototype.addRight = function(filter) {
        let self = this;

        filter.appendTo(self.$getRight());

        return self;
    };

    js.FilterPanel.prototype.addReset = function(resetter) {
        let self = this;

        self.$getResetBar().append(resetter);

        return self;
    }

    js.FilterPanel.prototype.show = function(filter) {
        let self = this;

        let showFilter = () => filter.show(() => self.activeFilter = filter)

        if (self.activeFilter === filter) {
            self.activeFilter.hide(() => self.activeFilter = null);
        } else if (self.activeFilter != null) {
            self.activeFilter.hide(showFilter);
        } else {
            showFilter();
        }

        return self;
    }

    js.FilterPanel.prototype.$getFilterBar = function() {
        return this.$element.find('.mod_JobSearch-FilterBar');
    }

    js.FilterPanel.prototype.$getLeft = function() {
        return this.$element.find('.mod_JobSearch-FilterBar--Left');
    }

    js.FilterPanel.prototype.$getRight = function() {
        return this.$element.find('.mod_JobSearch-FilterBar--Right');
    }

    js.FilterPanel.prototype.$getToggle = function() {
        return this.$element.find(".mod_JobSearch-FilterPanelToggle > button");
    }

    js.FilterPanel.prototype.$getResetBar = function() {
        return this.$element.find('.mod_JobSearch-ResetBar');
    }

    js.FilterPanel.prototype.$getResetPanel = function() {
        return this.$element.find(".mod_JobSearch-ResetPanel > button");
    }

    js.FilterPanel.prototype.$getContent = function() {
        return this.$element.find(".mod_JobSearch-Content");
    }

    js.FilterPanel.prototype.$getResetAll = function() {
        return this.$element.find(".mod_JobSearch-ResetAll");
    }

    // Filter

    js.Filter = function(params, panel) {
        let self = this;
        self.params = $.extend({

        }, params);
        self.panel = panel;

        self.$element = $(`
            <div class="mod_JobSearch-Filter">
                <button class="mod_JobSearch-FilterToggle lib_LayoutUtils-Toggle"></button>
                <div class="mod_JobSearch-FilterContainer"></div>
            </div>
        `);

        self.$getToggle().data('handle', new lu.Toggle(self.$getToggle()));
        self.$getToggle().on('change', event => self.panel.show(self));

        self.$getToggle().html(self.params.label);
        self.$getToggle().css({borderColor: "transparent"});

        self.$getContainer().fadeOut(0, () => self.$getContainer().slideUp(0));
        self.$getContainer().append(self.params.renderContainer());
        self.$getContainer().css({borderColor: "black"});

        // self.$getToggle().on('change', () => {
        //     if (!self.$resetter.parent()) {
        //         self.panel.addReset(self.$resetter);
        //     }
        // });

        return self;
    }

    js.Filter.prototype.appendTo = function($panel)  {
        let self = this;

        $panel.append(self.$element);

        return self;
    }

    js.Filter.prototype.isShowing = function() {
        return this === this.panel.activeFilter;
    }

    js.Filter.prototype.hide = function(callback = () => {}) {
        let self = this;

        if (self.isShowing()) {
            self.$getToggle().animate({
                backgroundColor: "transparent",
                borderColor: "transparent",
                borderBottomColor: "transparent"
            }, self.panel.timing, self.panel.easing);

            // self.$getContainer().animate({
            //     borderColor: "transparent"
            // }, self.panel.timing, self.panel.easing);

            self.$getContainer().fadeOut(self.panel.timing, self.panel.easing, () => {
                self.$getToggle().css({paddingBottom: "10px"});
                //self.$getContainer().slideUp(self.panel.timing, self.panel.easing);
                callback();
            });
        }

        return self;
    }

    js.Filter.prototype.show = function(callback = () => {}) {
        let self = this;

        if (!self.isShowing()) {
            self.$getToggle().css({paddingBottom: "15px"});
            self.$getToggle().animate({
                backgroundColor: "white",
                borderColor: "black",
                borderBottomColor: "white"
            }, self.panel.timing, self.panel.easing);

            // self.$getContainer().animate({
            //     borderColor: "black"
            // }, self.panel.timing, self.panel.easing);
            self.$getContainer().fadeIn(self.panel.timing, self.panel.easing, () => {
                //self.$getContainer().fadeIn(self.panel.timing, self.panel.easing);
                callback();
            });
        }

        return self;
    }

    js.Filter.prototype.$getToggle = function() {return this.$element.find(".mod_JobSearch-FilterToggle")};


    js.Filter.prototype.$getContainer = function() {return this.$element.find(".mod_JobSearch-FilterContainer")}

    // Results

    js.Results = function($element, binding) {
        let self = this;

        self.$element = $element;
        self.binding = binding;

        self.$morePanel = $(`
            <div class="mod_JobSearch-MorePanel">
                <button class="mod_JobSearch-ResultsMore"></button>
            </div>
        `);

        self.$getMoreButton().html('mehr Laden');
        self.$getMoreButton().click(() => self.loadMore());

        self.$element.find('.mod_JobSearch-Results').append(self.$morePanel);

        self.$getControls().css({display: "none"});

        self.updateMore(self.$element);

        self.transformResults(self.$element);

        binding.addFetchHandler($content => {
            self.transformResults($content);
            self.updateInfo($content);
            self.updateMore($content);
            self.$getContainer().children().remove();
            self.$getContainer().append($content.find('.mod_JobSearch-ResultsContainer').children());
        });

        return self;
    }

    js.Results.prototype.$getInfo = function() {return this.$element.find('.mod_JobSearch-ResultsInfo')};
    js.Results.prototype.$getContainer = function() {return this.$element.find('.mod_JobSearch-ResultsContainer')};
    js.Results.prototype.$getControls = function() {return this.$element.find('.mod_JobSearch-ResultsControls')};
    js.Results.prototype.$getMoreButton = function() {return this.$morePanel.find('button')};


    js.Results.prototype.transformResults = function($resultContainer) {
        let self = this;

        // $resultContainer.find('.mod_JobSearch-Result').each((index, child) => {
        //     let $parent = $(child).parent();
        //     let $button = $(`
        //         <button class="mod_JobSearch-Result"></button>
        //     `);
        //
        //     let $child = $(child);
        //     $child.remove();
        //     $button.append($child.children());
        //
        //     $button.click(() => alert($child.prop('href')));
        //
        //     $parent.append($button);
        // });

        $resultContainer.find('.mod_JobSearch-Result').hjb_doPopupPreparations();

        return self;
    };

    js.Results.prototype.loadMore = function() {
        let self = this;

        $.ajax(self.moreUrl, {
            url: self.moreUrl,
            success: data => {
                let $element = $(data);
                self.updateMore($element);
                self.transformResults($element);
                self.$getContainer().append($element.find('.mod_JobSearch-ResultsContainer').children());
                
                // let $newMoreLink = $element.find('.mod_JobSearch-ResultsLink--Next');
                // if ($newMoreLink.length > 0) {
                //     self.moreUrl = $newMoreLink.attr('href');
                // } else {
                //     self.moreUrl = null;
                //     self.$morePanel.css({display: "none"});
                // }
            }
        });

        return self;
    }

    js.Results.prototype.updateMore = function($content) {
        let self = this;

        let $nextLink = $content.find('.mod_JobSearch-ResultsLink--Next');
        if ($nextLink.length > 0) {
            console.log("update more link: " + $nextLink.attr('href'));
            self.moreUrl = $nextLink.attr('href');
            self.$morePanel.css({display: "flex"});
        } else {
            console.log('no more pages');
            self.moreUrl = null;
            self.$morePanel.css({display: "none"});
        }

        return self;
    }

    js.Results.prototype.updateInfo = function($content) {
        let self = this;

        let newInfoHtml = $content.find('.mod_JobSearch-ResultsInfo').html();

        console.log("replace: " +self.$getInfo().html() + " - " + newInfoHtml);
        self.$getInfo().empty();
        self.$getInfo().html(newInfoHtml);

        return self;
    }

    // Funktionen

    js.$createSelectButtons = (binding, update) => {
        let $element = $(`
            <ul class="mod_JobSearch-QueryButtonList"/>
        `);

        binding.$element.find('option').each((_, option) => {
            let $option = $(option);
            if ($option.val() !== "") {
                let $button = $(`
                    <li class="mod_JobSearch-QuerySelectButton">
                        <button/>
                    </li>
                `);
                $button.find('button').click(event => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    binding.set($option.val());
                    update();
                }).html($option.html());
                $element.append($button);
            }
        });

        return $element;
    };

    js.createSliderFilter = function(binding, update = () => {}, $resetContainer = null) {
        let $element = $(`
            <div class="slider" data-slider>
                <span class="slider-handle"  data-slider-handle role="slider" tabindex="1"></span>
                <span class="slider-fill" data-slider-fill></span>
            </div>
        `);


        $element.attr('data-initial-start', binding.$element.attr('min'));
        $element.attr('data-initial-end', binding.$element.attr('max'));

        $element.find('span.slider-handle').attr('aria-controls', binding.$element.attr('id'));

        $element.foundation();
        $element.on('changed.zf.slider', update);


        if ($resetContainer) {
            js.applyResetTrigger([binding], $resetContainer, () => "Ausgabe: " + binding.get());
        }

        return $element;
    };

    js.createMultiSliderFilter = (minBinding, maxBinding, update = () => {}, $resetContainer = null) => {
        let $element = $(`
            <div>
                <div class="mod_JobSearch-FilterLabelLine">
                    <span class="minValue"></span>
                    <span class="maxValue"></span>
                </div>
                <div class="slider" data-slider>
                    <span class="slider-handle min" data-slider-handle role="slider" tabindex="1"></span>
                    <span class="slider-fill" data-slider-fill></span>
                    <span class="slider-handle max" data-slider-handle role="slider" tabindex="1"></span>
                    
                    <input type="hidden" class="minInput"/>
                    <input type="hidden" class="maxInput"/>
                </div>
            </div>
        `);

        let $minValue = $element.find('.minValue').first();
        let $maxValue = $element.find('.maxValue').first();

        $minValue.html(minBinding.get());
        $maxValue.html(maxBinding.get());

        minBinding.addHandler(() => {
            $minValue.html(minBinding.get());
        });
        maxBinding.addHandler(() => {
            $maxValue.html(maxBinding.get());
        });

        let $slider = $element.find('.slider').first();

        let $minInput = $slider.find('.minInput').first();
        let $maxInput = $slider.find('.maxInput').first();

        $minInput.uniqueId();
        $maxInput.uniqueId();

        $slider.attr('data-initial-start', minBinding.get());
        $slider.attr('data-initial-end', maxBinding.get());
        $slider.attr('data-start', minBinding.min);
        $slider.attr('data-end', maxBinding.max);

        $slider.find('span.slider-handle.min').attr('aria-controls', $minInput.attr('id'));
        $slider.find('span.slider-handle.max').attr('aria-controls', $maxInput.attr('id'));
        $slider.on('changed.zf.slider', () => {
            console.log("slider values: " + $minInput.val() + " - " + $maxInput.val());
            minBinding.set($minInput.val());
            maxBinding.set($maxInput.val());
        });

        minBinding.addHandler(() => {
            console.log("minbind update");
            update()
        });
        maxBinding.addHandler(() => {
            console.log("maxbind update");
            update()
        });

        let rebuildHandler = () => {
            $slider.attr('data-initial-start', minBinding.get());
            $slider.attr('data-initial-end', maxBinding.get());
            $slider.attr('data-start', minBinding.min);
            $slider.attr('data-end', maxBinding.max);
        };

        minBinding.$element.on('fetchUpdate', rebuildHandler);
        maxBinding.$element.on('fetchUpdate', rebuildHandler);

        $slider.foundation();

        if ($resetContainer) {
            js.applyResetTrigger([minBinding, maxBinding], $resetContainer, () => "Von: " + minBinding.get() + " bis: " + maxBinding.get());
        }

        return $element;
    };

    js.createSingleSelectFilter = (binding, update = () => {}, $resetContainer = null) => {
        let $element = $(`<ul></ul>`);

        let inputs = [];

        let rebuildHandler = () => {
            alert("single");
            Object.keys(binding.elements).forEach(key => {
                let optionBinding = binding.elements[key];
                let $option = $(`
                    <li>
                        <input type="checkbox">
                        <label></label>
                    </li>
                `);

                $option.find('label').html(binding.elements[key].label);
                let $input = $option.find('input');
                inputs.push($input);

                if (optionBinding.is()) {
                    $input.prop('checked', true);
                }

                $input.change(() => {
                    optionBinding.select();
                    inputs.forEach($currentInput => {
                        if ($currentInput !== $input) {
                            $currentInput.prop('checked', false);
                        }
                    })
                    update();
                });

                $element.append($option);
            });
        };

        binding.$element.on('fetchUpdate', event => {
            $element.children().remove();
            rebuildHandler();
        });

        rebuildHandler();

        if ($resetContainer) {
            js.applyResetTrigger([binding], $resetContainer, () => "Ausgabe: " + binding.get());
        }

        return $element;
    };

    js.createMultiSelectFilter = (binding, update = () => {}, $resetContainer = null) => {
        let $element = $("<ul></ul>");

        let rebuildHandler = () => {
            Object.keys(binding.elements).forEach(key => {
                let $option = $(`
                    <li>
                        <input type="checkbox">
                        <label></label>
                    </li>
                `);

                $option.find('label').html(binding.elements[key].label);

                let $input = $option.find('input');
                $input.prop('value', binding.elements[key].$element.prop('value'));
                $input.prop('checked', binding.elements[key].$element.prop('checked'));

                $input.change(() => {
                    console.log("change key: " + key + " -> " + $input.prop('checked'));
                    binding.elements[key].set($input.prop('checked'));
                    update();
                });

                $element.append($option);
            });
        };

        binding.addRebuildHandler(() => {
            $element.children().remove();
            rebuildHandler();
        });

        rebuildHandler();

        if ($resetContainer) {
            js.applyResetTrigger([binding], $resetContainer, () => "Ausgabe: " + binding.get());
        }

        return $element;
    };

    js.applyResetTrigger = (bindings, $container, messageProvider) => {
        let $reset = $('<button class="mod_JobSearch-Reset"></button>');
        $reset.html(messageProvider);

        $reset.on('click', event => {
            bindings.forEach(bind => bind.reset())
            $reset.remove();
        });

        bindings.forEach(bind => bind.addHandler(() => {
            $reset.html(messageProvider);
            $container.append($reset);
        }));
    }

    js.initialize = function(element, options) {
        let base = this;
        base.el = element;
        base.$el = $(element);
        base.$form = base.$el.find('form');

        let $query = base.$el.find('.mod_JobSearch-Query');
        let $result = base.$el.find('.mod_JobSearch-Results');

        let binding = new $.hjb.formbind.Binding(base.$form);

        options.progress(binding).appendTo($query);

        let formName = base.$form.prop('name');
        if (Object.keys(options.filter).includes(formName)) {
            options.filter[formName](binding).appendTo($query);
        }

        if ($result.length > 0) {
            let result = new js.Results(base.$el, binding);
        }
    }

    $.fn.hjb_initializeJobSearch = function(options) {
        return this.each(function() {
            new js.initialize(this, options);
        });
    };
})(jQuery);


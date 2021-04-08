;(function($) {
    if (!$.hjb) {
        $.hjb = {};
    }

    $.hjb.formbind = {};
    let formbind = $.hjb.formbind;

    // Binding

    formbind.Binding = function($form) {
        this.$form = $form;
        let self = this;

        self.fetching = false;

        self.fetchHandlers = [];
        self.$form.css({display: "none"});

        $form.find('input[type=text], input[type=range], select').each(function(_, element) {
            let $element = $(element);
            let name = $element.attr("name");

            let selector = 'label[for="' + element.id + '"]';
            let initialValue = $element.val();
            let handlers = [];

            $element.on('change', event => {
                self[name].update()
            });

            self[name] = {
                $element: $element,
                element: $element.get()[0],
                get: () => $element.val(),
                set: value => {
                    if (value !== $element.val()) {
                        console.log("compare: " + value + " != " + $element.val() + " -> update");
                        $element.val(value);
                        handlers.forEach(handler => handler());
                    } else {
                        console.log("compare: " + value + " = " + $element.val());
                    }
                },
                reset: () => set(initialValue),
                addHandler: handler => {
                    handlers.push(handler);
                },
                // updateX: () => {
                //     handlers.forEach(handler => handler());
                // },
                label: $($('label[for="' + element.id + '"]')[0]).text()
            };

            if ($element.is('input[type=text]')) {
                self[name].placeholder = $element.attr('placeholder');

                // Fetch-Update (input text)
                self.fetchHandlers.push($content => {
                    let $fetchElement = $content.find('input[type=text][name=' + name + ']').first();
                    let $fetchLabel = $content.find('label[for=' + $fetchElement.attr('id')+ ']').first();
                    //self[name].$element = $fetchElement;
                    self[name].label = $fetchLabel.text();
                    self[name].set($fetchElement.val());
                    self[name].$element.trigger('fetchUpdate');
                });
            }

            if ($element.is('input[type=range]')) {
                self[name].min = $element.attr('min');
                self[name].max = $element.attr('max');

                // Fetch-Update (input range)
                self.addFetchHandler($content => {
                    let $fetchElement = $content.find('input[type=range][name=' + name + ']').first();
                    let $fetchLabel = $content.find('label[for=' + $fetchElement.attr('id')+ ']').first();
                    self[name].min = $fetchElement.attr('min');
                    self[name].max = $fetchElement.attr('max');
                    self[name].$element = $fetchElement;
                    self[name].label = $fetchLabel.text();
                    self[name].set($fetchElement.val());
                    self[name].$element.trigger('fetchUpdate');
                });
            }

            if ($element.is('select')) {
                self[name].text = () => $element.text()
                self[name].elements = {};
                $element.find('option').each((index, option) => {
                    let $option = $(option);
                    let value = $option.val();
                    let label = $option.html();

                    self[name].elements[value] = {
                        label: label,
                        $element: $option,
                        is: () => base[name].elements[value].$element.attr("selected")==="selected",
                        select: () =>  base[name].elements[value].$element.attr("selected","selected")
                    }
                });

                // Fetch-Update (select)
                self.addFetchHandler($content => {
                    let oldValue = self[name].get();
                    let $fetchElement = $content.find('select[name=' + name + ']').first();
                    let $fetchLabel = $content.find('label[for=' + $fetchElement.attr('id')+ ']').first();
                    //self[name].$element = $fetchElement;
                    self[name].label = $fetchLabel.text();

                    Object.keys(self[name].elements).forEach(key => {
                        self[name].elements[key].$element.remove();
                        delete self[name].elements[key];
                    });

                    $fetchElement.find('option').each((index, option) => {
                        self[name].$element.append($(option));
                    })

                    self[name].$element.find('option').each((index, option) => {
                        let $option = $(option);
                        let value = $option.val();
                        let label = $option.html();

                        self[name].elements[value] = {
                            label: label,
                            $element: $option,
                            is: () => self[name].get() === value,
                            select: () => self[name].set(value)
                        };

                        self[name].$element.append($option);
                    });

                    self[name].$element.val(oldValue);

                    self[name].$element.trigger('fetchUpdate');
                });
            }
        });

        $form.find('input[type=checkbox]').each((_, element) => {
            let $element = $(element);
            let name = $element.attr("name");
            let value = $element.val();

            if (!self[name]) {
                self[name] = {
                    elements: {},
                    get: () => {
                        let valuesString = "";
                        Object.keys(self[name].elements).forEach(key => {
                            if (self[name].elements[value].$element.prop('checked') === true) {
                                if (valuesString != "") {
                                    valuesString = valuesString + "," + self[name].elements[value].$element.val();
                                } else {
                                    valuesString = self[name].elements[value].$element.val();
                                }
                            }
                        });

                        return valuesString;
                    },
                    set: values => {
                        let valuesArray = values.split(',');
                        Object.keys(self[name].elements).forEach(key => {
                            self[name].elements[key].set(valuesArray.indexOf(key) > -1 ? true : false)
                        });
                    }
                }
            }
            self[name].elements[value] = {
                $element: $element,
                element: $element.get()[0],
                get: () => $element.prop('checked'),
                set: value => $element.prop('checked', value),
                toggle: () => $element.prop('checked', !$element.prop('checked')),
                label: $($('label[for="' + element.id + '"]')[0]).text()
            };

            self[name].addRebuildHandler = handler => self[name].rebuildHandlers.push(handler);
            self[name].rebuildHandlers = [];
            self[name].rebuild = () => self[name].rebuildHandlers.forEach(handler => handler());
        });

        // Fetch-Update (checkbox)
        self.addFetchHandler($content => {
            console.log("checkbox fetch update");

            Object.keys(self).forEach(itemName => {
                if (Object.keys(self[itemName]).includes('rebuildHandlers')) {
                    console.log("checkbox name: " + itemName);
                    console.log(Object.keys(self[itemName]));
                    Object.keys(self[itemName].elements).forEach(key => {
                        let $item = self[itemName].elements[key].$element;
                        $form.find('label[for=' + $item.attr('id') + ']').remove();
                        $item.remove();
                    });

                    self[itemName].elements = {};

                    $content.find('input[type=checkbox][name=' + itemName + ']').each((index, item) => {
                        let $item = $(item);
                        let $label = $content.find('label[for=' + $item.attr('id') + ']').first();
                        let value = $item.val();

                        $form.append($item);
                        $form.append($label);

                        self[itemName].elements[value] = {
                            $element: $item,
                            element: $item.get()[0],
                            get: () => $item.prop('checked'),
                            set: value => $item.prop('checked', value),
                            toggle: () => $item.prop('checked', !$item.prop('checked')),
                            label: $('label[for=' + $item.attr('id') + ']').text()
                        };
                    });

                    self[itemName].rebuild();
                }
            });
        });
    }

    formbind.Binding.prototype.submit = function() {
        this.$form.submit();
    }

    formbind.Binding.prototype.addFetchHandler = function(handler) {
        let self = this;

        self.fetchHandlers.push(handler);

        return () => self.fetchHandlers.remove(handler);
    }

    formbind.Binding.prototype.fetch = function() {
        let self = this;

        console.log("fetch called: " + self.fetching);
        if (!self.fetching) {
            self.fetching = true;

            $.ajax({
                url: self.$form.prop('action'),
                type: self.$form.prop('type'),
                data: self.$form.serialize(),
                success: data => {
                    //console.log(data);
                    let $data = $(data);
                    self.fetchHandlers.forEach(handler => handler($data));
                }
            });

            self.fetching = false;
        }

        return self;
    }
})(jQuery);
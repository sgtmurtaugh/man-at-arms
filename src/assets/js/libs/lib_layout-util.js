;($ => {
    if (!$.hjb) {
        $.hjb = {};
    }

    $.hjb.layoututils = {};
    let lu = $.hjb.layoututils;

    // ToggleButton
    lu.Toggle = function($element, options) {
        let self = this;

        self.options = $.extend({

        }, options);

        self.$element = $element;

        if (!self.$element.attr('data-toggle')) {
            self.$element.attr('data-toggle', 'inactive');
        }

        self.$element.on('click', event => self.toggle());

        self.$element.on('change', event => console.log("change"));
    };

    lu.Toggle.prototype.isActive = function() {
        return this.$element.attr('data-toggle') === 'active';
    }

    lu.Toggle.prototype.setActive = function(active) {
        let self = this;
        let change = false;

        if (self.isActive() !== active) {
            change = true;
        }

        if (active) {
            self.$element.attr('data-toggle', 'active');
        } else {
            self.$element.attr('data-toggle', 'inactive');
        }

        if (change) {
            self.$element.trigger('change');
        }

        return self;
    };

    lu.Toggle.prototype.toggle = function() {
        let self = this;

        self.setActive(!self.isActive());

        return self;
    }

    $.fn.getHandle = function() {
        return this.data('handle');
    }

    $.fn.getElement = function() {
        return this.get(0);
    }

})(jQuery);
;(function($) {
    if (!$.hjb) {
        $.hjb = {};
    }

    $.hjb.bubbles = {};
    let b = $.hjb.bubbles;

    b.Progress = function(params) {
        let self = this;

        self.params = $.extend({
            factors: {
                max: 0.8,
                mid: 0.6,
                min: 0.4,
                line: {
                    horizontal: 0.1,
                    vertical: 0.1
                }
            },
            colors: {
                active: "#EE8000 0% 0% no-repeat padding-box",
                inactive: "#54575A 0% 0% no-repeat padding-box",
                border: "#444444"
            },
            sizes: {
                labels: {
                    active: "2rem",
                    inactive: "1rem"
                },
                bubbles: {
                    max: 300
                }
            },
            timing: 222,
            easing: "swing"
        }, params);

        self.params.bubbles.forEach(function(bubble, index) {
            self.add(new b.Bubble(bubble, self));
        });

        $(window).on("resize", () => self.adjustSizes());

        self.$getCurrentLine().css({
            opacity: 0,
            top: "50%",
            bottom: "50%",
            background: self.params.colors.inactive
        });

        self.$getActiveLine().css({
            background: self.params.colors.active
        });

        self.$getInactiveLine().css({
            background: self.params.colors.inactive
        });

        self.updateCurrentLine(-1);
        self.updateProgressLine(-1);
    }

    b.Progress.prototype.appendTo = function($element) {
        let self = this;

        $element.append(self.$element);
        self.adjustSizes();
        self.update(false);

        return self;
    };

    b.Progress.prototype.bubbles = [];

    b.Progress.prototype.$element = (() => $(`
        <div class="lib_BubbleProgress-Progress">
            <div class="lib_BubbleProgress-Wrapper">
                <div class="lib_BubbleProgress-Region--Control">
                    <div class="lib_BubbleProgress-Strip--Lines">
                        <div class="lib_BubbleProgress-Line--Active"></div>
                        <div class="lib_BubbleProgress-Line--Inactive"></div>
                        <div class="lib_BubbleProgress-Line--Current"></div>
                    </div>
                    <div class="lib_BubbleProgress-Strip--Bubbles"></div>
                    <div class="lib_BubbleProgress-Strip--Headlines"></div>
                </div>
                <div class="lib_BubbleProgress-Region--Container"></div>
            </div>
        </div>
    `))();

    b.Progress.prototype.$getControl = function() {
        return this.$element.find('.lib_BubbleProgress-Region--Control');
    };

    b.Progress.prototype.$getContainer = function() {
        return this.$element.find('.lib_BubbleProgress-Region--Container');
    };

    b.Progress.prototype.$getBubbles = function() {
        return this.$getControl().find('.lib_BubbleProgress-Strip--Bubbles');
    };

    b.Progress.prototype.$getHeadlines = function() {
        return this.$getControl().find('.lib_BubbleProgress-Strip--Headlines');
    };

    b.Progress.prototype.$getLines = function() {
        return this.$getControl().find('.lib_BubbleProgress-Strip--Lines');
    };

    b.Progress.prototype.$getActiveLine = function() {
        return this.$getLines().find('.lib_BubbleProgress-Line--Active');
    }

    b.Progress.prototype.$getInactiveLine = function() {
        return this.$getLines().find('.lib_BubbleProgress-Line--Inactive');
    }

    b.Progress.prototype.$getCurrentLine = function() {
        return this.$getLines().find('.lib_BubbleProgress-Line--Current');
    }

    b.Progress.prototype.adjustSizes = function() {
        let self = this;

        self.width = self.$getBubbles().width();
        self.bubbleWidth = Math.min(self.params.sizes.bubbles.max, Math.floor(self.width / self.bubbles.length));

        this.bubbles.forEach(function(bubble) {
           bubble.adjustSizes(self.bubbleWidth);
           bubble.$headline.css({maxWidth: self.bubbleWidth});
           bubble.$container.css({maxWidth: self.bubbleWidth});

        });

        let height = self.bubbles[0].$getButton().innerHeight();

        self.$getLines().css({
            marginTop: self.params.sizes.labels.active,
            height: height
        });

        let border = self.bubbleWidth/self.width * self.params.factors.line.horizontal;

        self.$getActiveLine().css({
            left: border * 100 + "%",
        });

        self.$getInactiveLine().css({
            right: border * 100 + "%",
        });

        let factor = self.getLinePosition(self.bubbles.indexOf(self.activeBubble));

        self.$getCurrentLine().css({
            left: factor * 100 + "%",
            right: (1 - factor) * 100 + "%"
        });

        return self;
    }

    b.Progress.prototype.add = function(param) {
        let self = this;

        if (typeof param === 'object' && !self.bubbles.includes(param)) {
            self.bubbles.push(param);
            self.$getBubbles().append(param.$bubble);
            self.$getHeadlines().append(param.$headline);
            self.$getContainer().append(param.$container);
        }

        return self;
    };

    b.Progress.prototype.update = function(activate = true) {
        let self = this;

        let latestIndex = self.bubbles.length;
        let incomplete = false;
        self.bubbles.forEach((bubble, index) => {
            bubble.updateHeadline();

            if (incomplete) {
                bubble.disable();
            } else {
                bubble.enable();
                if (!bubble.params.complete()) {
                    incomplete = true;
                    latestIndex = index;
                }
            }
        });

        if (!incomplete && self.activeBubble) {
            self.activeBubble.setActive(false, self.params.finalize).destroyContainer();
            self.updateCurrentLine(-1);
            self.activeBubble = null;
        } else if (activate) {
            self.bubbles[latestIndex].activate();
        }
        self.updateProgressLine(latestIndex);

        return self;
    };

    b.Progress.prototype.activate = function(param) {
        let self = this;
        let activeBubble = null;

        switch (typeof param) {
            case 'number':
                activeBubble = self.bubbles[param];
                break;
            case 'object':
                activeBubble = param;
                break;
            default:
                throw 'Parameter nicht erkannt';
        }

        self.updateCurrentLine(self.bubbles.indexOf(activeBubble));

        self.bubbles.forEach(function(bubble) {
            if (bubble !== activeBubble) {
                bubble.setActive(false);
            }
        });

        activeBubble.setActive(true);

        let show = () => {
            self.arrangeContainers(activeBubble);
            activeBubble.createContainer();
        };

        if (typeof self.activeBubble !== "undefined" && self.activeBubble !== null) {
            self.activeBubble.destroyContainer(show);
        } else {
            show();
        }

        self.activeBubble = activeBubble;

        return self;
    };

    b.Progress.prototype.getLinePosition = function(index) {
        let self = this;
        let position;

        let height = self.bubbles[0].$getButton().innerHeight();
        let width = self.$getBubbles().innerWidth();
        let count = self.bubbles.length - 1;

        if (index < 0) {
            position = self.params.factors.line.horizontal * self.bubbleWidth;
        } else if (index >= self.bubbles.length) {
            position = width - (self.params.factors.line.horizontal * self.bubbleWidth);
        } else if (index === 0) {
            position = height/2
        } else if (index === count) {
            position = width - height/2;
        } else {
            position = height/2 + (width - height) / (count) * index;
        }

        return position / width;
    }

    b.Progress.prototype.updateCurrentLine = function(index) {
        let self = this;

        let factor = self.getLinePosition(index);

        self.$getCurrentLine().animate({
            opacity: 0,
            top: "50%",
            bottom: "50%"
        }, self.bubbles[0].params.timing, self.bubbles[0].params.easing, () => {
            self.$getCurrentLine().css({
                left: factor * 100 + "%",
                right: (1 - factor) * 100 + "%"
            });
            if (index >= 0) {
                self.$getCurrentLine().animate({
                    opacity: 1,
                    top: self.params.factors.line.vertical * 100 + "%",
                    bottom: self.params.factors.line.vertical * 100 + "%"
                }, self.params.timing, self.params.easing);
            }
        });

        return self;
    };

    b.Progress.prototype.updateProgressLine = function(index) {
        let self = this;

        let factor = self.getLinePosition(index);

        self.$getActiveLine().animate({
            right: (1 - factor) * 100 + "%"
        }, self.params.timing, self.params.easing);

        self.$getInactiveLine().animate({
            left: factor * 100 + "%"
        }, self.params.timing, self.params.easing);

        return self;
    };

    b.Progress.prototype.removeContainer = function(handler) {
        let self = this;

        if (self.$currentContainer){}
    }

    b.Progress.prototype._getBubbleIndex = function() {

    };

    b.Progress.prototype.arrangeContainers = function(activeBubble) {
        let self = this;

        switch (activeBubble.params.arrange) {
            case "column":
                self.bubbles.forEach(bubble => {
                    bubble.$container.css({
                        flexGrow: 1,
                        flexBasis: 0
                    });
                });
                break;
            case "justified":
                self.bubbles.forEach(bubble => {
                    if (activeBubble === bubble) {
                        bubble.$container.css({
                            flexGrow: 1,
                            flexBasis: "unset",
                        });
                    } else {
                        bubble.$container.css({
                            flexGrow: 1,
                            flexBasis: 0,
                        });
                    }
                });
                break;
            case "stretched":
                self.bubbles.forEach(bubble => {
                    if (activeBubble === bubble) {
                        bubble.$container.css({
                            flexGrow: 1,
                            flexBasis: "unset",
                        });
                    } else {
                        bubble.$container.css({
                            flexGrow: 0,
                            flexBasis: 0,
                        });
                    }
                });
                break;
            default:
                throw "Parameter arrange nicht erkannt";
        }

        return self;
    }

    // Bubble

    b.Bubble = function(params, progress) {
        let self = this;
        self.progress = progress;
        self.params = $.extend({
        }, params);

        self.size = 0;

        self.$bubble = $(`
            <div class="lib_BubbleProgress-Bubble">
                <button/>
            </div>
        `);

        self.$headline = $(`
            <div class="lib_BubbleProgress-Headline">
                <span/>
            </div>
        `);

        self.$container = $(`
            <div class="lib_BubbleProgress-Panel"/>
        `);

        self.enabled = false;

        self.$getButton().attr("disabled", true);

        self.$getButton().on("click", event => {
            self.activate();
            event.preventDefault();
            event.stopImmediatePropagation();
        });

        let activeCss = {
            borderWidth: "3px",
            borderColor: progress.params.colors.inactive
        }

        let inactiveCss = {
            borderWidth: "0px",
            borderColor: "transparent"
        }

        self.$getButton().mouseenter(() => self.$getButton().animate(activeCss, progress.params.timing));
        self.$getButton().mouseleave(() => self.$getButton().animate(inactiveCss, progress.params.timing));
        self.$getButton().focus(() => self.$getButton().animate(activeCss, progress.params.timing));
        self.$getButton().blur(() => self.$getButton().animate(inactiveCss, progress.params.timing));

        $(self.$getHeadline().html(self.params.binding.label));

        self.$getButton().css({
            background: progress.params.colors.inactive
        });

        self.$getHeadline().css({
            fontSize: "100%",
            fontWeight: 450,
            lineHeight: progress.params.sizes.labels.inactive,
            height: progress.params.sizes.labels.inactive,
            marginTop: progress.params.sizes.labels.active,
            marginBottom: 0
        });

        self.$getButton().css({
            marginTop: progress.params.sizes.labels.active,
            transition: "transform " + progress.params.timing + "ms ease",
            transform: "scale(" + progress.params.factors.min + ")",
            borderWidth: "0px",
            borderColor: "transparent",
            borderStyle: "solid"
        });
    }

    b.Bubble.prototype.$getButton = function() {
        return this.$bubble.find('button');
    }

    b.Bubble.prototype.$getHeadline = function() {
        return this.$headline.find('span');
    }

    b.Bubble.prototype.adjustSizes = function(width) {
        let self = this;
        let params = self.progress.params;

        self.size = width;

        self.$getButton().css({
            width: self.size + "px",
            height: self.size + "px",
            borderRadius: self.size/2 + "px",
            marginTop: params.sizes.labels.active,
            transition: "transform " + params.timing + "ms ease",
            //transform: "scale(" + params.factors.min + ")"
        });

        self.updateHeadline();

        return self;
    }

    b.Bubble.prototype.isActive = function() {
        return this.active === true;
    }

    b.Bubble.prototype.setActive = function(active, handler = () => {}) {
        let self = this;
        let params = self.progress.params;

        if (self.isActive() && !active) {
            self.$getHeadline().animate({
                fontSize: "100%",
                fontWeight: 450,
                lineHeight: params.sizes.labels.inactive,
                height: params.sizes.labels.inactive,
                marginTop: params.sizes.labels.active,
                marginBottom: 0
            }, params.timing * 2, params.easing, handler);
            self.$getButton().css({transform: 'scale(' + params.factors.min + ')'});
        } else if (!self.isActive() && active) {
            self.$getHeadline().animate({
                fontSize: "125%",
                fontWeight: 900,
                lineHeight: params.sizes.labels.active,
                height: params.sizes.labels.active,
                marginTop: 0,
                marginBottom: params.sizes.labels.inactive
            }, params.timing, params.easing);
            self.$getButton().css({transform: "scale(" + params.factors.max + ")"});
            setTimeout(() => {
                if (self.isActive()) {
                    self.$getButton().css({transform: "scale(" + params.factors.mid + ")"});
                }
                setTimeout(handler, params.timing);
            }, params.timing);
        }

        this.active = active;

        return self;
    }

    b.Bubble.prototype.activate = function() {
        let self = this;

        self.progress.activate(self);

        return self;
    }

    b.Bubble.prototype.enable = function() {
        let self = this;
        let params = self.progress.params;

        if (!self.isEnabled()) {
            let css = {
                background: params.colors.active
            }
            self.$getButton().attr("disabled", false);
            self.$getButton().animate(css, params.timing, params.easing, () => self.$getButton().css(css));
        }
        self.enabled = true;

        return self;
    }

    b.Bubble.prototype.disable = function() {
        let self = this;
        let params = self.progress.params;

        if (self.isEnabled()) {
            let css = {
                background: params.colors.inactive
            }
            self.$getButton().attr("disabled", true);
            self.$getButton().animate(css, params.timing, params.easing, () => self.$getButton().css(css));
        }
        self.enabled = false;

        return self;
    }

    b.Bubble.prototype.isEnabled = function () {
        return this.enabled === true;
    }

    b.Bubble.prototype.createContainer = function(handler = () => {}) {
        let self = this;
        let params = self.progress.params;

        let $container = self.params.renderContainer(() => self.progress.update());

        $container.fadeOut(0, () => $container.slideUp(0, () => {
            self.$container.empty().append($container);

            $container.slideDown(params.timing, () => {
                $container.fadeIn(params.timing);
                handler();
            });
        }));

        return self;
    }

    b.Bubble.prototype.destroyContainer = function(handler = () => {}) {
        let self = this;
        let params = self.progress.params;

        self.$container.children().each((_, child) => {
            let $child = $(child);
            $child.fadeOut(params.timing, () => {
                $child.slideUp(params.timing, () => $child.remove());
                handler();
            });
        });

        return self;
    }

    b.Bubble.prototype.updateHeadline = function() {
        let self = this;

        self.$getHeadline().html(self.params.headline());

        return self;
    }
})(jQuery);
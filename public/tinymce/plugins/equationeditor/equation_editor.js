var __slice = [].slice;
window.EquationEditor = {}, EquationEditor.Events = {
    on: function(t, n, o) {
        var e;
        return this._events || (this._events = {}), (e = this._events)[t] || (e[t] = []), this._events[t].push({
            callback: n,
            context: o || this
        })
    },
    trigger: function(t) {
        var n, o;
        if (this._events) return n = Array.prototype.slice.call(arguments, 1), (o = this._events[t]) ? this.triggerEvents(o, n) : void 0
    },
    triggerEvents: function(t, n) {
        var o, e, i, r, u;
        for (u = [], e = 0, i = t.length; i > e; e++) o = t[e], u.push((r = o.callback).call.apply(r, [o.context].concat(__slice.call(n))));
        return u
    }
}, EquationEditor.View = function() {
    function t(t) {
        this.options = t, this.$el = this.options.$el || $(this.options.el), this.initialize.apply(this, arguments)
    }
    return t.prototype.$ = function(t) {
        return this.$el.find(t)
    }, t.prototype.initialize = function() {}, t.prototype.createElement = function() {
        return this.$el = $(this.template())
    }, t
}();
var __bind = function(t, n) {
        return function() {
            return t.apply(n, arguments)
        }
    },
    __hasProp = {}.hasOwnProperty,
    __extends = function(t, n) {
        function o() {
            this.constructor = t
        }
        for (var e in n) __hasProp.call(n, e) && (t[e] = n[e]);
        return o.prototype = n.prototype, t.prototype = new o, t.__super__ = n.prototype, t
    };
EquationEditor.CollapsibleView = function(t) {
    function n() {
        return this.toggleCollapse = __bind(this.toggleCollapse, this), n.__super__.constructor.apply(this, arguments)
    }
    return __extends(n, t), n.prototype.initialize = function() {
        return this.$(".collapsible-box-toggle").on("click", this.toggleCollapse)
    }, n.prototype.toggleCollapse = function(t) {
        return t.preventDefault(), this.$(".box-content-collapsible").is(":visible") ? this.closeCollapsible() : this.openCollapsible()
    }, n.prototype.openCollapsible = function() {
        return this.$(".box-content-collapsible").slideDown(), this.toggleOpenClass()
    }, n.prototype.closeCollapsible = function() {
        return this.$(".box-content-collapsible").slideUp(), this.toggleOpenClass()
    }, n.prototype.toggleOpenClass = function() {
        return this.$(".collapsible-box-toggle").toggleClass("collapsible-box-toggle-open")
    }, n
}(EquationEditor.View);
var __bind = function(t, n) {
        return function() {
            return t.apply(n, arguments)
        }
    },
    __hasProp = {}.hasOwnProperty,
    __extends = function(t, n) {
        function o() {
            this.constructor = t
        }
        for (var e in n) __hasProp.call(n, e) && (t[e] = n[e]);
        return o.prototype = n.prototype, t.prototype = new o, t.__super__ = n.prototype, t
    };
EquationEditor.Buttons = {}, EquationEditor.Buttons.BaseButtonView = function(t) {
    function n() {
        return this.handleClick = __bind(this.handleClick, this), n.__super__.constructor.apply(this, arguments)
    }
    return __extends(n, t), n.prototype.initialize = function() {
        return this.latex = this.options.latex, this.buttonText = this.options.buttonText || this.options.latex, this.className = ["math-button", this.options.className].join(" ").trim()
    }, n.prototype.handleClick = function(t) {
        return t.preventDefault(), EquationEditor.Events.trigger("latex:" + this.event, this.latex)
    }, n.prototype.render = function() {
        return this.createElement(), this.$("a").on("click", this.handleClick), this
    }, n.prototype.template = function() {
        return '<div class="' + this.className + '">\n  <a title="' + this.buttonText + '" href="#">' + this.buttonText + "</a>\n</div>"
    }, n
}(EquationEditor.View), EquationEditor.Buttons.CommandButtonView = function(t) {
    function n() {
        return n.__super__.constructor.apply(this, arguments)
    }
    return __extends(n, t), n.prototype.event = "command", n
}(EquationEditor.Buttons.BaseButtonView), EquationEditor.Buttons.WriteButtonView = function(t) {
    function n() {
        return n.__super__.constructor.apply(this, arguments)
    }
    return __extends(n, t), n.prototype.event = "write", n
}(EquationEditor.Buttons.BaseButtonView);
var __bind = function(t, n) {
        return function() {
            return t.apply(n, arguments)
        }
    },
    __hasProp = {}.hasOwnProperty,
    __extends = function(t, n) {
        function o() {
            this.constructor = t
        }
        for (var e in n) __hasProp.call(n, e) && (t[e] = n[e]);
        return o.prototype = n.prototype, t.prototype = new o, t.__super__ = n.prototype, t
    };
EquationEditor.ButtonGroupView = function(t) {
    function n() {
        return this.toggle = __bind(this.toggle, this), n.__super__.constructor.apply(this, arguments)
    }
    return __extends(n, t), n.prototype.initialize = function() {
        return this.groupName = this.options.groupName, this.buttonViews = this.options.buttonViews
    }, n.prototype.render = function() {
        return this.createElement(), this.renderButtons(), new EquationEditor.CollapsibleView({
            $el: this.$el
        }), this.$("header").click(this.toggle), this
    }, n.prototype.toggle = function() {
        return this.$(".collapsible-box-toggle").click()
    }, n.prototype.renderButtons = function() {
        var t, n, o, e, i;
        for (e = this.buttonViews, i = [], n = 0, o = e.length; o > n; n++) t = e[n], i.push(this.$(".buttons").append(t.render().$el));
        return i
    }, n.prototype.template = function() {
        return "<div class=\"button-group collapsible\">\n  <a href='#' class='collapsible-box-toggle ss-dropdown'></a> <header>" + this.groupName + '</header>\n\n  <div class="buttons box-content-collapsible hidden"></div>\n</div>'
    }, n
}(EquationEditor.View), EquationEditor.ButtonViewFactory = {
    create: function(config) {
        var buttonConfig, buttons, klass, _i, _len;
        for (buttons = [], _i = 0, _len = config.length; _len > _i; _i++) buttonConfig = config[_i], klass = eval(buttonConfig.klass), buttons.push(new klass(buttonConfig));
        return buttons
    }
}, EquationEditor.ButtonGroupViewFactory = {
    create: function(t) {
        var n, o, e, i;
        for (o = [], e = 0, i = t.length; i > e; e++) n = t[e], n.buttonViews = EquationEditor.ButtonViewFactory.create(n.buttonViews), o.push(new EquationEditor.ButtonGroupView(n));
        return o
    }
};
var ButtonGroup, Buttons, __bind = function(t, n) {
        return function() {
            return t.apply(n, arguments)
        }
    },
    __hasProp = {}.hasOwnProperty,
    __extends = function(t, n) {
        function o() {
            this.constructor = t
        }
        for (var e in n) __hasProp.call(n, e) && (t[e] = n[e]);
        return o.prototype = n.prototype, t.prototype = new o, t.__super__ = n.prototype, t
    };
Buttons = EquationEditor.Buttons, ButtonGroup = EquationEditor.ButtonGroupView, EquationEditor.EquationEditorView = function(t) {
    function n() {
        return this.focus = __bind(this.focus, this), this.handleWriteButton = __bind(this.handleWriteButton, this), this.handleCommandButton = __bind(this.handleCommandButton, this), n.__super__.constructor.apply(this, arguments)
    }
    return __extends(n, t), n.prototype.initialize = function() {
        return this.existingLatex = this.options.existingLatex, this.restrictions = this.options.restrictions || {}, EquationEditor.Events.on("latex:command", this.handleCommandButton, this), EquationEditor.Events.on("latex:write", this.handleWriteButton, this)
    }, n.prototype.render = function() {
        return $.getJSON("config.json").done(function(t) {
            return function(n) {
                return t.config = n, t.addButtonBar(), t.addButtonGroups(), t.enableMathMagic()
            }
        }(this)), this
    }, n.prototype.enableMathMagic = function() {
        return this.$(".math-button a").mathquill(), this.input().mathquill("editable"), null != this.existingLatex && this.input().mathquill("latex", this.existingLatex), this.focus()
    }, n.prototype.input = function() {
        return this.$(".math")
    }, n.prototype.addButtonBar = function() {
        var t, n, o, e, i;
        for (e = this.buttonBarButtons(), i = [], n = 0, o = e.length; o > n; n++) t = e[n], i.push(this.$(".button-bar").append(t.render().$el));
        return i
    }, n.prototype.addButtonGroups = function() {
        var t, n, o, e, i;
        for (e = this.buttonGroups(), i = [], n = 0, o = e.length; o > n; n++) t = e[n], i.push(this.$(".button-groups").append(t.render().$el));
        return i
    }, n.prototype.buttonBarButtons = function() {
        return EquationEditor.ButtonViewFactory.create(this.config.buttonBar)
    }, n.prototype.buttonGroups = function() {
        var t;
        return t = this.basicButtonGroups(), this.restrictions.disallow_intermediate || (t = t.concat(this.intermediateButtonGroups())), this.restrictions.disallow_advanced || (t = t.concat(this.advancedButtonGroups())), t
    }, n.prototype.basicButtonGroups = function() {
        return EquationEditor.ButtonGroupViewFactory.create(this.config.buttonGroups.basic)
    }, n.prototype.intermediateButtonGroups = function() {
        return EquationEditor.ButtonGroupViewFactory.create(this.config.buttonGroups.intermediate)
    }, n.prototype.advancedButtonGroups = function() {
        return EquationEditor.ButtonGroupViewFactory.create(this.config.buttonGroups.advanced)
    }, n.prototype.handleCommandButton = function(t) {
        return this.performCommand(t), this.focus()
    }, n.prototype.handleWriteButton = function(t) {
        return this.performWrite(t), this.focus()
    }, n.prototype.performCommand = function(t) {
        return this.input().mathquill("cmd", t)
    }, n.prototype.performWrite = function(t) {
        return this.input().mathquill("write", t)
    }, n.prototype.focus = function() {
        return this.$("textarea").focus()
    }, n.prototype.equationLatex = function() {
        return this.input().mathquill("latex")
    }, n
}(EquationEditor.View);

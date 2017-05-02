;(function ( $, window, document, undefined ) {

    "use strict";

    // DEFAULT OPTIONS
    // ===============
    var pluginName =			"selectReplacer";

    // CONSTRUCTOR
    // ===========
    var SelectReplacer = function(element, options){

        this.element = $(element);
        this.settings = $.extend( true, {}, options );
        return this._init();

    };

    // PROTOTYPE
    // =========
    SelectReplacer.prototype = {

        // CONSTRUCTOR
        // -----------
        constructor: SelectReplacer,

        // INITIALIZATION & REQUIREMENTS
        // -----------------------------
        _init: function () {
            return this
                ._setSelectors()
                ._attachEvents()
                ._start();
        },
        _setSelectors: function(){
            this.selectors = {
                target: $(this.element.attr("data-select-replacer__target")),
                options: this.element.find("option")
            };
            return this;
        },
        _start: function(){
            this.currentAttribute = this.element.val();
            this.targetInitialContent = this.selectors.target.html();
            return this;
        },

        // PUBLIC METHODS
        // ---------------
        remove: function(){
            this._detachEvents();
            delete this.element.data()[pluginName];
        },
        reset: function(){
            return this._resetTarget();
        },

        // OPTIONS & ATTR FUNCTIONS
        // -------------
        _resetTarget: function(){
            this.selectors.target.html(this.targetInitialContent);
            return this;
        },
        _updateTarget: function(newAttributeValue){
            var oldHTML = this.selectors.target.html(),
            newHTML = oldHTML.replace(new RegExp(this.currentAttribute, 'g'), newAttributeValue);
            this.selectors.target.html(newHTML);
            this.currentAttribute = newAttributeValue;
            return this;
        },

        // EVENTS
        // ------
        _selectChanged: function(ev){
            var newAttributeValue = this.element.val();
            return this._updateTarget(newAttributeValue);
        },

        _attachEvents: function(){
            this.element.on("change" + "." + pluginName, $.proxy(this._selectChanged, this));
            return this;
        },
        _detachEvents: function(){
            this.element.off("change" + "." + pluginName);
            return this;
        }
    };


    // PLUGIN DEFINITION
    // =================
    $.fn[pluginName] = function ( option ) {
        var args = Array.apply(null, arguments);
        args.shift();
        var internal_return;
        this.each(function() {
            var $this = $(this),
                data = $this.data(pluginName),
                options = typeof option === "object" && option;
            if ( !data ) {
                $.data( this, pluginName, new SelectReplacer( this, options ) );
            }
            if (typeof option === "string" && typeof data[option] === "function"){
                internal_return = data[option].apply(data, args);
                if (internal_return !== undefined)
                    return false;
            }
        });
        if (internal_return !== undefined)
            return internal_return;
        else
            return this;
    };

    var dataApi = function() {
        // Data Api implementation
        // =======================
        $(".js-select-replacer").each(function () {
            $(this).selectReplacer();
        });
    };

    if (document.readyState !== 'loading'){
        dataApi();
    } else {
        document.addEventListener('DOMContentLoaded', dataApi);
    }

})( jQuery, window, document );


$.Class("MmsApp.BaseHandler",
// static properties
{
  count: 0
  //,isUndefined: function(o) {return typeof o === "undefined";}
},
// prototype properties
{
    init: function()
    {
        //increment the static count
        this.Class.count++;
        this._elt = null;
        this.getConfig = function() {throw new Error('Deprecated'); return config;}
    },
    
    /**
     * This method will let us call methods of the underlying DOM element as if it that of the event handler class
     */
    __noSuchMethod__ : function(funcname, args) 
    {
        if(!this.$e()[funcname])
        {
            throw new Error("Function '" + funcname + "' not found");
        }
        return this.$e()[funcname].apply(this.$e(), args);
    },
    
    /**
     * This method will be called when all handlers have been created. The handler can then reference other handlers if needed
     */
    postCreate: function() 
    {
        return this;
    },
    
    /**
     * This method will be called when all handlers have been added to the registry
     */
    postLoad: function() 
    {
        return this;
    },
    
    /**
     * Returns the globale controller. The globale controller will be used to query for handlers or to launch Ajax queries
     */
    setElt: function(elt) 
    {
        this._elt = elt;
    },
    /**
     * Returns the dom element
     */
    $e: function() 
    {
        return this._elt;
    },
    handlesElement: function(domElt)
    {
        return true;
    },
    
    /**
     * This method will be called when all handlers have been created. The handler can then reference other handlers if needed
     */
    registerEventHandlers: function() 
    {
        
    },
    
    /**
     * This method will be called when all handlers has been created. The handler can then reference other handlers if needed
     */
    handleEvent: function(event, data) 
    {
        var funcname = event.type + 'HandleEvent';
        if(!this[funcname])
        {
            throw new Error("Handler method '" + funcname + " not implemented for " + this.Class.shortName);
        }
        return this[funcname](event, data);
    },
    
    /**
     * Gets the id of the underlying DOM element
     */
    getId: function() 
    {
        return this.$e().attr('id');
    },
    
    /**
     * Gets the field name as the serveur expects it, usually the field name used in the config
     */
    getFieldName: function() 
    {
        return this.$e().attr('id');
    },
    
    /**
     * Gets the integer part of the id of the object (if any) represented by the underlying DOM element
     */
    getIdInt: function() 
    {
        var _eltIntId;
        if(typeof _eltIntId === 'undefined')
        {
            _eltIntId = this.$e().attr('id').match(new RegExp("[1-9][0-9]*$"));
            if(_eltIntId)
            {
                _eltIntId = matches[0];
            }
            else
            {
                _eltIntId = '';
            }
        }
        return _eltIntId;
    },
    
    isActive: function()
    {
        return !this.$e().hasClass('Off');
    },
    
    isInactive: function()
    {
        return this.$e().hasClass('Off');
    },
    
    doSetValue: function(html)
    {
        this.$e().html(html);;
        return this;
    },
    
    /**
     * Sets a value for the underlying DOM element
     */
    setValue: function(v) 
    {
        if(this.getController().isString(v))
        {
            this.doSetValue(v);
        }
        else 
        {
            if(this.getController().isDefined(v.html))
            {
                this.doSetValue(v.html);
            }
            this._set(v);
        }
        return this;
    },
    
    /**
     * Gets the value for the underlying DOM element
     */
    getValue: function() 
    {
        this.$e().val();
    }
    
});





MmsApp.BaseHandler("MmsApp.InputHandler",
{
},
{  
    /**
     * Sets a value for the underlying DOM element
     */
    setValue: function(v) 
    {
        this.$e().val(v);
        return this;
    },
    
    /**
     * Gets the value for the underlying DOM element
     */
    getValue: function() 
    {
        switch (this.$e().attr('type')) {
            case 'checkbox':
                return this.$e().prop('checked') ? 1 : 0;
            break;
            default:
            break;
        }
        return this.$e().val();
    },
    /**
     * Gets form
     */
    getForm: function() 
    {
        return this.$e().closest('form').first();
    }
    
});



MmsApp.InputHandler("MmsApp.SelectHandler",
{
},
{  
    /**
     * Sets a value for the underlying DOM element
     */
    setValue: function(data) 
    {
    }, 
    
    getChoices: function()
    {
        return this.$e().find('option');
    },
    postLoad: function()
    {
    },
    hasEmptyChoice: function() {
        return this.getValue() === '';
    }
});



MmsApp.BaseHandler("MmsApp.FormHandler",
{
},
{
     
    init: function(finder, handlerFactory)
    {
       this._super();
       this.getFinder = function() { return finder; };
       this.getHandlerFactory = function() { return handlerFactory; };
    },
    handlesElement: function(domElt)
    {
        return domElt.prop('tagName') === 'FORM';
    }    
});


MmsApp.BaseHandler("MmsApp.ContainerHandler",
{
},
{
    
    init: function(finder, handlerFactory)
    {
        this._super();
        this._eltTags = ['DIV', 'SPAN', 'UL', 'TD'];
        this.getFinder = function() { return finder; };
        this.getHandlerFactory = function() { return handlerFactory; };
        
    },
    handlesElement: function(domElt)
    {
        return this._eltTags.indexOf(domElt.prop('tagName')) !== '-1';
    } ,
    
    write: function(data)
    {
        this.$e().html(data.html);
        this.getHandlerFactory().loadHandlers(this.getFinder().find(this.$e()));
        this.postWrite(data);
    },
    
    postWrite: function(data)
    {
        this.$e().show();
    } , 
    
    processContent: function(content)
    {
        return content;
    } , 
    
    setContent: function(content)
    {
        this.$e().html(this.processContent(content));
        this.getHandlerFactory().loadHandlers(this.getFinder().find(this.$e()));
        this.postSetContent();
    },

    update: function(data) {
        this.setContent(data.html);
        this.processMetadata(data);
        return this;
    },
    processMetadata: function(data) {
        if(!data.metadata) {
            return;
        }
        return this;
    },
    
    postSetContent: function()
    {
        //this.$e().show();
    },
    getTarget: function() 
    {
        return this.$e();
    }
});



MmsApp.BaseHandler("MmsApp.LinkHandler",
{
},
{
    handlesElement: function(domElt)
    {
        return domElt.prop('tagName') === 'A';
    },
    getValue: function() {
        return this.$e().attr('href');
    }
});


MmsApp.BaseHandler("MmsApp.DoubleListHandler",
    {
    },
    {
        init: function(finder, handlerFactory)
        {
            this._super();
            this._eltTags = ['DIV'];
            this.getFinder = function() { return finder; };
            this.getHandlerFactory = function() { return handlerFactory; };

        },
        handlesElement: function(domElt)
        {
            return this._eltTags.indexOf(domElt.prop('tagName')) !== '-1';
        },
        moveItem: function(selected, unselected, item)
        {
            this.unSelect(item);
            if($(item).parents('.js-double-list-selected').size()) {
                console.log("Removing item to selected");
                item.prependTo(unselected);
            } else {
                console.log("Adding item");
                item.prependTo(selected);
            }

            return this;
        },
        moveItems: function(selected, unselected, items)
        {
            var that = this;
            $.each(items, function(key, item) {
                if ($(item).hasClass('selected')) {
                    that.moveItem(selected, unselected, $(item));
                }
            });

            return this;
        },
        unSelect: function(item)
        {
            item.removeClass('selected');
            this.toggleVisualSelect(item);
            return this;
        },
        toggleVisualSelect: function(item)
        {
            if(item.hasClass('selected')) {
                item.find('a i').removeClass('fa-uncheck').addClass('fa-check');
            } else {
                item.find('a i').removeClass('fa-check').addClass('fa-uncheck');
            }
            return this;
        },
        toggleSelect: function(item)
        {
            item.toggleClass('selected');
            this.toggleVisualSelect(item);
            return this;
        },
        onsubmit: function(selected, unselected, element)
        {
            var that = this;
            /**
             * Remove all options and create new ones and select them
             */
            element.empty();
            $.each(selected.children('li'), function(key, item) {
                var value = $(item).data('value');
                console.log("Item text = "+$(item).text());
                $('<option selected="selected"></option>').appendTo(element)
                    .attr('selected', 'selected')
                    .val(value)
                    .text($(item).text());
            });
        },

        postLoad: function()
        {
            var that = this;
            //We will create all events listeners
            this.$e().find('ul li a').click(function(event){
                event.preventDefault();
                that.toggleSelect($(this).closest('li'));
            });
            var element = this.$e().find('select').first();
            var unselected = this.$e().find('.js-double-list-unselected ul').first();
            var selected = this.$e().find('.js-double-list-selected ul').first();
            console.log("Sized: "+unselected.size()+", "+selected.size());
            this.$e().find('.js-double-list-item').dblclick(
                function(event) {
                    that.moveItem(selected, unselected, $(this))
                }
            );
            this.$e().find('.js-double-list-unselect').click(
                function (event) {
                    console.log("click on unsselect conrtol");
                    that.moveItems(selected, unselected, selected.children('li'));
                }
            );
            this.$e().find('.js-double-list-select').click(
                function (event) {
                    console.log("click on select conrtol");
                    that.moveItems(selected, unselected, unselected.children('li'));

                }
            );
            this.$e().closest('form').submit(
                function (event) {
                    //event.preventDefault();
                    that.onsubmit(selected, unselected, element)
                }
            );
        }
    });


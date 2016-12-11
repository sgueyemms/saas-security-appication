$.Class("MmsApp.Router",
{},
{
    init: function(routes, context) {
      this.routes = routes;
      this.context = context;
    },
    getParamsFromContext: function(params) {
        var values = [];
        var context = this.context;
        params.map(function(param) { values[param] = context[param]||null;});
        return values;
    },
    generate: function(name, params, absolute) {
        var route = this.searchRoute(name);
        if(!route) {
            throw new Error(sprintf("Route '%s' not found. Possible values are: %s", name, Object.keys(this.routes)));
        }
        var rootUrl = absolute ? (this.getRootUrl() + '/' ) : '';
        route.uri = route.path;
        return rootUrl + this.buildParams(route, params);
    },
    generateFromDefinition: function(def, params, absolute) {
        if(params) {
            params = $.extend({}, def.params, params);
        } else {
            params = def.params || {};
        }
        return this.generate(def.name, params, absolute);
    },
    searchRoute: function(name) {
        if(typeof this.routes[name] !== "undefined") {
            return this.routes[name];
        } else {
            return null;
        }
    },
    buildParams: function(route, params) {
        var compiled = route.uri,
            params = params || {},
            queryParams = {},
            key = null,
            token = null;
        /* if a path var is missing and has no default value raise an exception */
        for (key = 0; key < route.path_vars.length; key ++) {
            token = route.path_vars[key];
            if(!(token in params)) {
                if(token in route.defaults) {
                    params[token] = route.defaults[token];
                } else {
                    throw new Error("Variable '"+token+"' is required");
                }
            }
        }
        for (var key in params) {
            if (compiled.indexOf('{' + key + '?}') != -1) {
                if (key in params) {
                    compiled = compiled.replace('{' + key + '?}', params[key]);
                }
            } else if (compiled.indexOf('{' + key + '}') != -1) {
                compiled = compiled.replace('{' + key + '}', params[key]);
            } else {
                queryParams[key] = params[key];
            }
        }

        compiled = compiled.replace(/\{([^\/]*)\?}/g, "");

        if (!this.isEmptyObject(queryParams)) {
            return compiled + this.buildQueryString(queryParams);
        }

      return compiled;
    },
    getRootUrl: function() {
        return window.location.protocol + '//' + window.location.host;
    },
    buildQueryString: function(params) {
        var ret = [];
        for (var key in params) {
            ret.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
        }
        return '?' + ret.join("&");
    },
    isEmptyObject: function(obj) {
        var name;
        for (name in obj) {
          return false;
        }
        return true;
    },
    cleanupDoubleSlashes: function(url) {
        return url.replace(/([^:]\/)\/+/g, "$1");
    },
    stripTrailingSlash: function(url) {
        if(url.substr(-1) == '/') {
            return url.substr(0, url.length - 1);
        }
        return url;
    },
    getContextParam: function(name) {
        return this.context[name] || null;
    },
    getContextParams: function(names) {
        return names.map(function(value) { return this.getContextParam(value);}, this);
    }
});


$.Class("MmsApp.JqueryUiDialog",
    {},
    {
        init: function ($elt, config) {
            $elt.dialog($.extend({autoOpen: false}, config || {}));
            this.$e = function () {
                return $elt;
            };
            this.open = function () {
                $elt.dialog('open');
                return this;
            };
            this.close = function () {
                $elt.dialog('close');
            };
            this.title = function (title) {
                $elt.dialog('option', 'title', title);
                return this;
            };
        }
    }
);

$.Class("MmsApp.Window",
{},
{
    init: function($elt, finder, handlerFactory, config)
    {
        this.$e = function () {return $elt; };
        this.getFinder = function() { return finder; };
        this.getHandlerFactory = function() { return handlerFactory; };
        this.getTarget = function() {return $elt;};
        //@todo Replace this with a builder passed as a parameter
        var dialog = new MmsApp.JqueryUiDialog($elt, config);
        this.getDialog = function () {return dialog; };
    },
    open: function() {
        this.getDialog().open();
        return this;
    },
    preClose: function() {
        
    },
    postClose: function() {
        
    },
    close: function() {
        this.preClose();
        this.getDialog().close();
        this.postClose();
        return this;
    },
    setContent: function(content) {
        this.getTarget().html(content);
        this.getHandlerFactory().loadHandlers(this.getFinder().find(this.getTarget()));
        this.postSetContent();
        this.getDialog().open();
        return this;
    },
    postSetContent: function() {
        return this;
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
        if(data.metadata.title) {
            this.getDialog().title(data.metadata.title);
        }
        return this;
    }

});
$.Class("MmsApp.WindowFactory",
{},
{
    init: function(builder, finder, handlerFactory, config)
    {
        this.getBuilder = function() { return builder; };
        this.getFinder = function() { return finder; };
        this.getHandlerFactory = function() { return handlerFactory; };
        this.getConfig = function() { return config; };
        this._namedWindows = {};
        var storage = {};
        this.getModal = function(elt) {
            return storage[$(elt).attr('id')];
        };
        this.addModal = function(modal) {
            var id = modal.getTarget().attr('id');
            storage[id] = modal;
            return this;
        };
        this.removeModal = function(modal) {
            var id = modal.getTarget().attr('id');
            delete storage[id];
            return this;
        };
    },
    create: function(config)
    {
        var targetDiv = $(
            '<div id="___'+this.getHandlerFactory().getNextId()+
            '" class="modal-window-target js-modal-window-target"/>'
        ).appendTo('body');
        
        var modal = this.getBuilder()(
            targetDiv, 
            this.getFinder(),
            this.getHandlerFactory(),
            $.extend({}, this.getConfig(), config||{})
        );
        this.addModal(modal);
        return modal;
    },
    createNamed: function(name, config)
    {
        if(this._namedWindows[name]) {
            //this._namedWindows[name].close();
            return this._namedWindows[name];
        }
        this._namedWindows[name] = this.create(config);
        return this._namedWindows[name];
    }
});

$.Class("MmsApp.SpinnerFactory",
{},
{
    init: function(builder, config, $defaultTarget)
    {
        console.log('init SpinnerFactory');
        this.getBuilder = function() { return builder; };
        this.getConfig = function() { return config; };
        this.getDefaultTarget = function() { return $defaultTarget; };
        this._items = {};
    },
    create: function(config, $target)
    {
        $target = $target || this.getDefaultTarget();
        return this.getBuilder()(
            $target,
            $.extend({}, this.getConfig(), config)
        );
    },
    createNamed: function(name, config, $target)
    {
        if(!this._items[name]) {
            this._items[name] = this.create(config, $target);
        }
        return this._items[name];
    }
});

$.Class("MmsApp.FlashMessage",
{},
{
    init: function($elt, config)
    {
        config = $.extend(config||{}, {timeout: 20000})
    },
    open: function() {
        //this.getDialog().open();
        return this;
    },
    close: function() {
        this.getDialog().close();
        return this;
    },
    add: function(content) {

        return this;
    }

});

$.Class("MmsApp.AjaxIndicator",
{},
{
    init: function($elt, config)
    {
        config = $.extend({timeout: 20000}, config||{});
        var self = this;
        this.getConfig = function() { return config; };
        var counter = 0;
        this.counter = function () { return counter; };
        this.increment = function () {
            counter++;
            return self;
        };
        this.decrement = function () {
            if(counter > 0) {
                counter--;
            }
            return self;
        };
        var timeoutId;
        this.createProgress = function () {
            $.blockUI();
            //$('body').css('cursor','wait');
            if(timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function() { self.timeout();}, config.timeout);
            return self;
        };
        this.deleteProgress = function () {
            progress = $.unblockUI();
            //$('body').css('cursor','auto');
            return self;
        };
        this.timeout = function() {
            clearTimeout(timeoutId);
            counter = 0;
            this.deleteProgress();
        };
    },
    show: function() {
        console.log("Show in indicator");
        this.createProgress().increment();
        return this;
    },
    hide: function() {
        console.log("hide in indicator");
        this.decrement();
        if(!this.counter()) {
            console.log("hide in indicator, hiding");
            this.deleteProgress();
        }
        return this;
    }
});

$.Class("MmsApp.Ajax",
{},
{
    init: function(indicator, pathPrefix)
    {
        this.getIndicator = function() {return indicator;};
        this.setIndicator = function(param) { indicator = param; return this;};
        this.getPathPrefix = function(){return pathPrefix;};
    },
    start: function() {
        this.getIndicator().show();
        return this;
    },
    end: function() {
        this.getIndicator().hide();
        return this;
    },
    getDefaultSettings: function()
    {
        return {
            done: function(data, textStatus, jqXHR) {
            },
            fail: function(data, textStatus, jqXHR) {
            }
        };
    },

    _doRun: function(settings)
    {
        var self = this;
        this.start();
        $.ajax(settings).done(settings.done).fail(settings.fail).always( function() { self.end(); });
    },

    _prepareSettings: function(settingsParam)
    {
        var settings = $.extend({}, this.getDefaultSettings(), settingsParam);
        settings.url = this.getPathPrefix()+settings.url;
        return settings;
    },

    run: function(settingsParam)
    {
        var settings = this._prepareSettings(settingsParam);
        this._doRun(settings);
    },

    submit: function(form, settingsParam)
    {
        console.log("Submitting form");
        var settings = {
            type: form.attr('method'),
            url: settingsParam.url || form.attr('action')||'',
            data: form.serialize(),
            done: function(data, textStatus, jqXHR) {
                if(data.result === 'success') {
                    console.log( 'submit, done, success');
                    this.doneSuccess(data, textStatus, jqXHR);
                } else if(data.result === 'error') {
                    console.log( 'submit, done, error');
                    this.doneError(data, textStatus, jqXHR);
                } else {
                    console.log( 'submit, done, undefined result code: '+data.result);
                }
            },
            fail: function(data, textStatus, jqXHR) {
            },
            doneSuccess: function(data, textStatus, jqXHR) {
            },
            doneError: function(data, textStatus, jqXHR) {
            }
        };
        this.run($.extend(settings, settingsParam));
    },

    _doRepeat: function(settings, times)
    {
        var self = this;
        if(times) {
            $.ajax(settings).done(settings.done).fail(function() {
                console.log( ' -------------- Repeating AJAx run, number='+times);
                self._doRepeat(settings, --times);
            }).complete(settings.complete);
        } else {
            this._doRun(settings);
        }
    },

    repeat: function(settingsParam, times)
    {

        var settings = this._prepareSettings(settingsParam);
        this._doRepeat(settings, times);
    }

});

$.Class("MmsApp.Finder",
{},
{
    init: function(defaultPattern)
    {
        this.getDaultPattern = function(){return defaultPattern;}
    },

    find: function(elt, pattern)
    {
        return elt.find(pattern||this.getDaultPattern());
    }

});

$.Class("MmsApp.HandlerFactory",
{
},
{
    init: function(servicePool, serviceIdentifier, storage)
    {
        this.getServiceIdentitier = function(){return serviceIdentifier;};
        this.getStorage = function(){return storage;};
        this.getServicePool = function(){return servicePool;};

        var sequence = 1;
        this.getNextSequence = function () {return sequence++;};
        this.getNextId = function() {return '_app_' + sequence++;};
    },
    loadHandler: function(handler)
    {
        handler.postCreate();
        handler.registerEventHandlers();
        var events = handler.$e().data('appEvents') || {};
        var servicePool = this.getServicePool();
        $.each(events, function (name, definition) {
            var eventData = definition.data || {};
            if(definition.serviceName) {
                var parts = definition.serviceName.split(':');
                if(parts.length > 1) {
                    handler.$e()[name](function(event) { servicePool.get(parts[0])[parts[1]](handler, event, eventData); });
                } else {
                    handler.$e()[name](function(event) { servicePool.get(parts[0])(handler, event, eventData); });
                }
            } else {
                handler.$e()[name](function(event) { return handler.handleEvent(event, eventData); });
            }
        });
    },
    postLoad: function(handler)
    {
        handler.postLoad();
    },
    loadHandlers: function(elements)
    {
        var self = this;
        var handlers = $.grep(elements.map(function(){return self.createHandler(this);}), function(h){return h ? true : false;});
        console.log('loadHandlers, handlers.length=' + handlers.length);
        $.each(handlers, function(){self.loadHandler(this);});
        $.each(handlers, function(){self.postLoad(this);});
    },
    getHandlerServiceName: function(elt)
    {
        var serviceName;
        serviceName = elt.data(this.getServiceIdentitier());
        if(!serviceName) {
            serviceName = 'dom.'+elt.prop('tagName').toLowerCase();
        }
        return serviceName;
    },
    getEltId: function($elt, set)
    {
        var id = $elt.attr('id');
        if(!id) {
            id = this.getNextId();
            if(set) {
                $elt.attr('id', id);
            }
        }
        return id;
    },
    findHandler: function(elt) {
        var $elt = $(elt);
        var id = this.getEltId($elt, true);
        return this.getStorage().has(id) ? this.getStorage().get(id) : null;
    },
    /**
     * Creates or read a handler from the storage
     * @param DomElement elt
     * @returns {servicesAnonym$9@call;getStorage@call;get}
     */
    getHandler: function(elt) {
        var handler = this.findHandler(elt);
        if(handler) {
            return handler;
        }
        handler = this.createHandler(elt);
        if(handler) {
            this.loadHandler(handler).postLoad(handler);
        }
        return handler;
    },
    createHandler: function(elt, serviceName)
    {
        var $elt = $(elt);
        if($elt.length === 0) {
            return null;
        }
        var id = this.getEltId($elt);
        if(!serviceName)
        {
            serviceName = this.getHandlerServiceName($elt);
            if(!serviceName)
            {
                console.log(sprintf("No service name found for '%s', looked for data attribute %s", this.getStorage().getId($elt), this.getServiceIdentitier()));
                return null;
            }
        }
        //console.log(sprintf("Creating handler '%s' for ID=%s", serviceName, id))
        var handler = this.getServicePool().get(serviceName);
        if(!handler)
        {
             throw new Error(sprintf("createHandler, service '%s' not found for element '%s", serviceName, id));
        }
        if(handler.handlesElement($elt)) {
            //console.log(sprintf("Created handler '%s' for ID=%s, class=%s", serviceName, id, handler.Class.fullName));
            handler.setElt($elt);
            this.getStorage().set(id, handler);
            return handler;
        } else {
            //console.log(sprintf("Skipped created handler '%s' for ID=%s, class=%s, as it does not support this element", serviceName, id, handler.Class.fullName));
            return null;
        }
    }
});

$.Class("MmsApp.HandlerStorage",
{},
{
    init: function()
    {
        var handlers = {};

        this.getId = function(id)
        {
            if($.type(id) === 'string')
            {
                return id;
            }
            return id.attr('id');
        };
        this.set = function(id, h) {
            handlers[id] = h;
            return this;
        };
        this.has = function(id)
        {
            return handlers.hasOwnProperty(this.getId(id));
        };

        this.get = function(id)
        {
            id = this.getId(id);
            if(!handlers.hasOwnProperty(id))
            {
                console.trace();
                throw new Error("No handler found for '"+id+"'");
            }
            return handlers[id];
        };
        this.getByPattern = function(pattern)
        {
            var ret = null;
            var elt = $(pattern).first();
            var id = null;
            if(elt)
            {
                id = elt.attr('id');
                if(id)
                {
                    ret = handlers[id];
                }
            }

            return ret;
        };
        this.getHandlers = function() {return handlers;};
        var dataControls = {};
        var dataControlHandlers = {};
        this.addDataControls = function(data)
        {
            $.each(data, function (key, value) {dataControlHandlers[key] = self.getHandler(key);});
            $.extend(dataControls, data);
            return this;
        };
        this.addDataControlHandler = function(h)
        {
            dataControlHandlers[h.getId()] = h;
            if(!dataControls[h.getId()])
            {
                dataControls[h.getId()] = {};
            }
            return this;
        };
        this.getDataControls = function() {return dataControls;};
        this.getDataControlHandlers = function() {return dataControlHandlers;};
        this.getDataControlHandler = function(id) {return dataControlHandlers[id];};


    }

});

$.Class("MmsApp.FormXhttpSubmitter",
{},
{
    init: function(ajax, router, finder, handlerFactory)
    {
       this.getAjax = function() { return ajax; };
       this.getRouter = function() { return router; };
       this.getFinder = function() { return finder; };
       this.getHandlerFactory = function() { return handlerFactory; };
    },
    getSubmitUrl: function(form, data)
    {
        if(data && data.url) {
            return data.url;
        }
        if(data && data.route) {
            return this.getRouter().generateFromDefinition(data.route, {});
        }
        return form.attr('action')||'';
    },
    processSettings: function(settings)
    {
        return settings;
    },

    submit: function(form, eventData)
    {
        var url = this.getSubmitUrl(form, eventData);
        console.log("Submit url="+url);
        var self = this;
        var settings = {
            type: form.attr('method'),
            url: url,
            data: form.serialize(),
            done: function(data, textStatus, jqXHR) {
                self.handleDone(data, textStatus, jqXHR, eventData)
            },
            fail: function(data, textStatus, jqXHR) {
                self.handleFail(data, textStatus, jqXHR, eventData);
            }
        };
        this.getAjax().run(this.processSettings(settings));
        return this;
    },
    handleDone: function(data, textStatus, jqXHR, eventData)
    {
        if(data.result === 'success') {
            console.log( 'handleDone, success');
            this.handleSuccessResult(data, textStatus, jqXHR, eventData);
        } else if(data.result === 'error') {
            console.log( 'handleDone, error');
            this.handleErrorResult(data, textStatus, jqXHR, eventData);
        } else {
            console.log( 'handleDone, undefined result code: '+data.result);
        }
    },
    handleFail: function(data, textStatus, jqXHR, eventData)
    {
        /*
         * Check why. Retry a certain number of times ?
         */
        console.log( 'Called handleFail() on '+this.Class.fullName );
    },

    handleSuccessResult: function(data, textStatus, jqXHR, eventData)
    {
        console.log( 'Called handleSuccessResult()' );
    },

    handleErrorResult: function(data, textStatus, jqXHR, eventData)
    {

        console.log( 'Called handleErrorResult()' );
    }
});


MmsApp.BaseHandler("MmsApp.Illustration",
{},
{
    init: function(dataTranformer, handlerLoader, ajax, router)
    {
       this.getDataTranformer = function() { return dataTranformer; };
       this.getHandlerLoader = function() { return handlerLoader; };
       this.getAjax = function() { return ajax; };
       this.getRouter = function() { return router; };
    },
    postLoad: function()
    {
        var data = this.getDataTranformer().transform(this.$e());
        if(data.type === 'chart') {
            this.$e().kendoChart(data.data);
        } else if(data.type === 'grid') {
            this.$e().kendoGrid(data.data);
        } else {
            throw new Error('Invalid illustration type '+data.type);
        }
        this.getHandlerLoader().loadFor(this.$e());
    }
});


$.Class("MmsApp.IllustrationDataTransformer",
{},
{
    init: function(container, serviceNamePrefix)
    {
       this.getContainer = function() { return container; };
       this.getServiceNamePrefix = function() { return serviceNamePrefix; };
    },
    transform: function($e)
    {
        var widgetType = $e.data('mmsWidgetType');
        var widgetData = this.getContainer()
            .get(this.getServiceNamePrefix()+widgetType)
            .transform(widgetType, $e.data('mmsWidgetData'));
        return {
            type: widgetType,
            data: widgetData
        };
    }
});
$.Class("MmsApp.IllustrationGridDataTransformer",
{},
{
    init: function(container, serviceNamePrefix)
    {
       this.getContainer = function() { return container; };
       this.getServiceNamePrefix = function() { return serviceNamePrefix; };
    },
    transform: function(widgetType, widgetData)
    {
        var transformedData = [];
        var transformer = null;
        var container = this.getContainer();
        var serviceNamePrefix = this.getServiceNamePrefix();
        var serviceName = null;
        var column = [];
        $.each(widgetData.values, function (rowIndex, rowData) {
            transformedData[rowIndex] = {};
            $.each(rowData, function(name, value) {
                column = widgetData.columns[name];
                serviceName = serviceNamePrefix+column._options.type;
                transformer = container.get(serviceName);
                transformedData[rowIndex][name] = transformer(column, value, rowData);
            });
        });
        var columnsList = [];
        $.each(widgetData.columns, function (name, column) {
            columnsList.push(column);
        });
        return {
            dataSource: transformedData,
            columns: columnsList
        };
    }
});

$.Class("MmsApp.IllustrationChartDataTransformer",
{},
{
    init: function(container, serviceNamePrefix)
    {
       this.getContainer = function() { return container; };
       this.getServiceNamePrefix = function() { return serviceNamePrefix; };
    },
    transform: function(widgetType, widgetData)
    {
        return widgetData;
    }
});

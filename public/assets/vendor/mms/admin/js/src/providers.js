$.Class("MmsApp.Provider.KernelServiceProvider",
{},
{
    init: function(app)
    {
        this.getApp = function() {return app;};
    },

    register: function(container)
    {
        var App = this.getApp();
        container.set('helper.url.add_query_param', container.share(function(c) {
            return function (url, name, value) {
                if(url.indexOf('?') === -1) {
                    url += '?';
                } else if(url.substr(-1) !== '?') {
                    url += '&';
                }
                return url += (name+'='+value);
            };
        }));
        container.set('router', container.share(function(c) {
            var routing = c.get('routing');
            return new App.Router(routing.routes, routing.context);
        }));
        container.set('finder', container.share(function(c) {
            return new App.Finder(c.get('handler_pattern'));
        }));
        container.set('hs', container.share(function(c) {
            return new App.HandlerStorage();
        }));
        //@todo: replace the third argument with a pool of services dedicated to creating handlers ?
        container.set('hf', container.share(function(c) {
            return new App.HandlerFactory(c, c.get('app_service_identifier'), c.get('hs'));
        }));
        container.set('hl', container.share(function(c) {
            return {
                loadFor: function($e) { return c.get('hf').loadHandlers(c.get('finder').find($e)) }
            };
        }));
        container.set('flash_messages', function(c) {
            return new App.FlashMessage();
        });

        container.set('ajax_indicator', function(c) {
            return new App.AjaxIndicator($('#_indicator_'));
        });
        container.set('ajax', function(c) {
            return new App.Ajax(c.get('ajax_indicator'), c.get('xhttp_path_prefix'));
        });

        container.set('window_builder', function(c) {
            return function($elt, finder, handlerFactory, config) {
                return new App.Window($elt, finder, handlerFactory, config);
            };
        });
        container.set('wf', container.share(function(c) {
            var windowConfig = {
              actions: ['Maximize', 'Close'],
              height: 700,
              width: 1000,
              modal: true,
              resizable: true,
              draggable: true,
              title: 'MMS',
              visible: false,
              refresh: function(){
                this.center();
              }
              //,
              // close: function(e){
              //   this.destroy();
              // }
            };

            return new App.WindowFactory(c.get('window_builder'), c.get('finder'), c.get('hf'), windowConfig);
        }));
        //js-modal-window-target
        container.set('modal.close_parent', function(c) {
            return function(handler, event, eventData) {
                event.preventDefault();
                var modal = c.get('wf').getModal(handler.$e().closest('.js-modal-window-target'));
                if(modal) {
                    modal.close();
                    c.get('wf').removeModal(modal);
                }
            };
        });
        container.set('spinner_builder', function(c) {
            return function($elt, config) {
                return new App.AjaxIndicator($elt, config);
            };
        });
        container.set('sf', container.share(function(c) {
            var windowConfig = {
              actions: ['Maximize', 'Close'],
              height: 700,
              width: 1000,
              modal: true,
              resizable: true,
              draggable: true,
              title: 'MMS',
              refresh: function(){
                this.center();
              },
              close: function(e){
                this.destroy();
              }
            };

            return new App.WindowFactory(c.get('spinner_builder'), windowConfig, $('#_indicator_'));
        }));

        container.set('redirect', function(c) {
            return function(data) {
                window.location.assign(data.url);
            };
        });

        container.set('datepicker', function(c) {
            var handler = new App.InputHandler();
            handler.postLoad = function() {
                console.log("datepicker postLoad");
                this.$e().kendoDatePicker({
                    format: "yyyy-MM-dd"
                });
            };
            return handler;
        });

        container.set('tooltip', function(c) {
          var service = new App.LinkHandler();

          var tooltipConfig = $.extend( {
            autoHide: true,
            callout: true,
            height: Infinity,
            width: 250,
            position: "left", // selected left to prevent page from creating horizontal scrollbar - options: "bottom", "top", "left", "right", "center"
            showAfter: 100, // ignored if showOn: "click" or "focus"
            showOn: "mouseenter" //
          }, c.get('tooltip_config') );

          service.registerEventHandlers = function() {
              service.$e().kendoTooltip($.extend(tooltipConfig, service.$e().data('tooltipConfig')));
          };

          return service;
        });

        container.set('datagrid_frozen', function(c) {
          var service = new App.ContainerHandler();
          // **Disabled doubleScrollbar plugin until we figure out how to make it responsive**
          // $('.datagrid-frozen__scroll').doubleScroll({
          //   //contentElement: ".datagrid-frozen__scroll table",
          //   resetOnWindowResize: true
          // });
          // var topScrollHeight = $('.doubleScroll-scroll-wrapper').height();
          // $('.datagrid-frozen__frozen').css('padding-top', topScrollHeight);

          return service;
        });

        container.set('action_list', function(c) {
          var config = $.extend( {
            maxVisibleItems: 2
          }, c.get('action_list_config') );

          var service = new App.InputHandler();

          service.registerEventHandlers = function() {
            var $list    = service.$e();
            var $items   = $list.children();
            var numItems = $items.length;

            // If number of action items > max, hide overflow items and insert into Bootstrap .dropdown
            if(numItems > config.maxVisibleItems){
              // Store overflowing item HTML markup & remove them from the DOM
              var overflowHtml = '';
              for(var i = config.maxVisibleItems; i < numItems; i++){
                overflowHtml += '<li>';
                overflowHtml += $items[i].innerHTML;
                overflowHtml += '</li>';
                $items[i].remove();
              }
              // Append target link/button for Bootstrap .dropdown
              var htmlStr = '<li class="action-list__item"><div class="dropdown"><a class="action-list__dropdownlist-target dropdown-toggle" data-toggle="dropdown" href="#0" title="View More"><i class="fa fa-ellipsis-h"></i></a><ul class="dropdown-menu dropdown-menu-right">';
              htmlStr += overflowHtml;
              htmlStr += '</ul></div></li>';
              $list.append(htmlStr);
            }
          };

          return service;
        });

        /**
         * This is a shared builder
         */
        container.set('spinner', container.share(function(c) {
            return function (elt) {
                var $elt = $(elt);
                console.log("element tag when creating a spinner:"+$elt.prop('tagName'));
                var div = $elt.closest('div');
                if(div.length === 0) {
                    console.log("element tag when creating a spinner, not div found");
                    return {
                        show: function () {}, hide: function() {}};
                }
                console.log("element tag when creating a spinner:"+$elt.prop('tagName')+", div class="+div.prop('class'));
                return {
                    show: function () {div.spin();},
                    hide: function() {div.spin(false);}
                };
            };
        }));

        /**
         * This is a shared builder
         */
        container.set('switch', container.share(function(c) {
            return function(handler, event, eventData) {
                var value = handler.getValue();
                if(value) {
                    var routeDef = eventData.route || handler.$e().data('route');
                    var paramName = eventData.param_name || handler.$e().data('param_name');
                    var routeParams = $.extend({}, routeDef.params);
                    routeParams[paramName] = handler.getValue();
                    var url = c.get('router').generateFromDefinition({
                        name: routeDef.name,
                        params: routeParams
                    });
                    window.location.assign(url);
                } else {

                }
            };
        }));

        container.set('grid.batch', function(c) {
            var service = c.get('dom.input');
            service.postLoad = function () {
                service.getForm().find('input.js-batch-selector').click(function(event) {
                    $(this).prop('checked', $(this).prop('checked'));
                    service.getForm().find('input.js-batch-item-selector').prop('checked', $(this).prop('checked'));
                });
                service.getForm().find('.js-batch-actions').change(function(event) {
                    service.getForm().submit();
                });
            };
            return service;
        });
        
        container.set('message.dismiss', function(c) {
            var handler = c.get('dom.a');
            handler.postLoad = function() {
                this.$e().click(function(event) {
                    event.preventDefault();
                    handler.$e().closest('.flash').fadeOut();
                });
            };
            return handler;
        });

        container.set('tree', function(c) {
            var handler = c.get('dom.div');
            handler.postLoad = function() {
                var data = this.$e().data('data');
                this.$e().tree({
                    data: data,
                    autoOpen: false
                });
            };
            return handler;
        });
    }

});

$.Class("MmsApp.Provider.DomHandlerServiceProvider",
{},
{
    init: function(app)
    {
        this.getApp = function() {return app;};
    },

    register: function(container)
    {
        var App = this.getApp();
        container.set('dom.input', function(c) {
            return new App.InputHandler();
        });
        container.set('dom.select', function(c) {
            return new App.SelectHandler();
        });
        container.set('dom.div', function(c) {
            return new App.ContainerHandler(c.get('finder'), c.get('hf'));
        });
        container.set('dom.a', function(c) {
            return new App.LinkHandler();
        });
        container.set('dom.button', function(c) {
            return new App.InputHandler();
        });
        container.set('dom.td', function(c) {
            var service = new App.ContainerHandler(c.get('finder'), c.get('hf'));
            service.getRowElt = function() {
                return service.$e().closest('tr').first();
            };
            service.getObjectId = function() {
                return service.getRowElt().data('mmsId');
            };
            return service;

        });
    }

});

$.Class("MmsApp.Provider.FormServiceProvider",
{},
{
    init: function(app)
    {
        this.getApp = function() {return app;};
    },

    register: function(container)
    {
        var App = this.getApp();
        container.set('form', function(c) {
            return new App.FormHandler(c.get('finder'), c.get('hs'));
        });

        container.set('form.ajax_submitter', function(c) {
            return new App.FormXhttpSubmitter(
                c.get('ajax'),
                c.get('router'),
                c.get('finder'),
                c.get('hf')
            );
        });

        /**
         * Services to handle the double list
         */
        container.set('form.double_list', function(c) {
            var service = new App.DoubleListHandler(c.get('finder'), c.get('hf'));
            console.log('Created a double list handler');
            return service;
        });
    }

});


$.Class("MmsApp.Provider.AdminServiceProvider",
{},
{
    init: function(app)
    {
        this.getApp = function() {return app;};
    },

    register: function(container) {
        var App = this.getApp();

        /* Wrap the content block around a function variable.
         * This will add the variable in the scope but will not pull the
         * service until dependent services call it
         */
        var contentBlock = function () {
            return container.get('hf').getHandler($('.js-datagrid-wrapper').first());
        };

        /** ------------
         * Services for form AJAX handling
         */container.set('app.form.loader', function (c) {
            return function (config) {
                var service = config.loader || c.get('ajax');
                var view = config.view || c.get('wf').create(config.eventData.window);
                console.log('config.loadSettings.url=' + config.loadSettings.url);
                service.run(config.loadSettings);
                return {view: view, loader: service, config: config};
            };
        });
        //Creates the configuration that drives a form loading
        container.set('app.form.loader.config.default', function (c) {
            return function (eventData, url, target, view) {
                if (!view) {
                    if (eventData.window) {
                        //The form will go into a modal window
                        view = c.get('wf').create(eventData.window);
                    } else {
                        //The form will go into a local view
                        var elt = $(eventData.target).first();
                        if (!elt) {
                            throw new Error("Invalid view target'" + eventData.target + "'");
                        }
                        view = c.get('dom.div');
                        view.setElt(elt);
                    }
                }
                var loadSettings = {
                    url: url,
                    done: function (data, textStatus, jqXHR) {
                        view.update(data);
                    }
                };
                if (eventData.window.updater) {
                    loadSettings.done = function (data, textStatus, jqXHR) {
                        c.get(eventData.window.updater)(view, data);
                    }
                }
                var handlerSettings = {
                    doneError: function (data, textStatus, jqXHR) {
                        view.setContent(data.html);
                    },
                    doneSuccess: function (data, textStatus, jqXHR) {
                        console.log("Setting window title");
                        if (data.target) {
                            //$(data.target).html(data.html);
                            c.get('hl').loadFor($(data.target).html(data.html));
                        } else {
                            view.setContent(data.html);
                        }
                        view.close();
                        if(data.on_close) {
                            c.get(data.on_close)(data, eventData, target);
                        } else if(eventData.on_close) {
                            c.get(eventData.on_close)(data, eventData, target);
                        }
                    }
                };
                view.postSetContent = function () {
                    c.get('app.form.handlers_builder')(view.getTarget(), handlerSettings);
                };
                return {
                    url: url || null,
                    view: view,
                    eventData: eventData,
                    target: target,
                    loadSettings: loadSettings,
                    handlerSettings: handlerSettings
                };
            };
        });
        container.set('app.form.loader.a', function (c) {
            return function (handler, event, eventData) {
                event.preventDefault();
                var config = c.get('app.form.loader.config.default')(
                    eventData, handler.getValue(), handler.$e()
                );
                c.get('app.form.loader')(config);
            };
        });
        container.set('app.form.loader.button', function (c) {
            return function (handler, event, eventData) {
                event.preventDefault();
                var url = handler.getForm().attr('action');
                console.log('app.form.loader.button, url=' + url);
                var config = c.get('app.form.loader.config.default')(
                    eventData, url, eventData.target
                );
                c.get('app.form.loader')(config);
            };
        });

        container.set('app.form.handlers_builder', function (c) {
            return function ($elt, settings) {
                console.log('app.form.handlers_builder, running');
                //Catch the filter form submit event
                var form = $elt.find('form').first();
                form.submit(function (event) {
                    event.preventDefault();
                    c.get('ajax').submit(form, settings);
                });
            };
        });

        /** ------------
         * Services for the Datagrid
         */
        container.set('app.datagrid.container', function (c) {
            console.log('creating app.datagrid.container');
            var service = c.get('dom.div');
            var settings = {
                done: function (data, textStatus, jqXHR, eventData) {
                    service.setContent(data.html);
                }
            };
            service.processContent = function (content) {
                return $(content).html();
            }
            service.postSetContent = function () {
                c.get('app.datagrid.handlers_builder')(service.$e(), settings);
            };
            service.postLoad = function () {
                c.get('app.datagrid.handlers_builder')(service.$e(), settings);
            }
            return service;
        });
        container.set('app.datagrid.loader', function (c) {
            return function (url, windowEventData, $target) {
                var service = c.get('ajax');
                var modal = c.get('wf').create(windowEventData.window);
                var settings = {
                    done: function (data, textStatus, jqXHR, eventData) {
                        modal.setContent(data.html);
                    }
                };
                //Do not need this anymore, the datagrid service will do it
//                modal.postSetContent = function() {
//                    c.get('app.datagrid.handlers_builder')(this.getTarget(), settings);
//                };
                service.run($.extend(settings, {url: url}));
            };
        });
        container.set('app.datagrid.loader.a', function (c) {
            return function (handler, event, eventData) {
                event.preventDefault();
                c.get('app.datagrid.loader')(handler.getValue(), eventData, handler.$e());
            };
        });

        container.set('app.datagrid.handlers_builder', function (c) {
            return function ($elt, settings) {
                var indicatorBuilder = function ($target) {
                    return c.get('ajax_indicator');
                    return c.get('spinner')($target);
                }
                var linkHandler = function (target, event) {
                    event.preventDefault();
                    c.get('ajax').setIndicator(indicatorBuilder(target)).run($.extend(settings, {url: target.attr('href')}));
                };
                console.log('app.datagrid.handlers_builder, running');
                //Catch the filter form submit event
                var filterForm = $elt.find('form').first();
                filterForm.submit(function (event) {
                    event.preventDefault();
                    c.get('ajax').setIndicator(indicatorBuilder(filterForm)).submit(filterForm, settings);
                });

                $elt.find('.js-datagrid-filter').find('a.js-filter-reset').click(function (event) {
                    linkHandler($(this), event);
                });
                //Catch the drop down change event
                $elt.find('.js-datagrid-filter').find('select').off('change').change(function (event) {
                    console.log('binding change in filter block');
                    c.get('ajax').setIndicator(indicatorBuilder($(this))).submit(filterForm, settings);
                });
                $elt.find('.js-datagrid-pager').find('a').click(function (event) {
                    linkHandler($(this), event);
                });
                $elt.find('.datatable__header').find('a.sorter').click(function (event) {
                    linkHandler($(this), event);
                });
                //
            };
        });

        container.set('app.datagrid.notice', function (c) {
            return function (handler, event, eventData) {
                var div = handler.$e().closest('div');
                div.prepend('<div>This operation may time some time to complete</div>')
            };
        });

        container.set('app.datagrid.filter.handlers_builder', function (c) {
            return function ($elt) {
                console.log('app.datagrid.filter.handlers_builder, running');
                //Catch the filter form submit event
                var filterForm = $elt.find('form').first();
                filterForm.submit(function (event) {
                    event.preventDefault();
                    container.get('app.datagrid.filter.form_submitter')(filterForm, event);
                });

                $elt.find('.js-datagrid-filter').find('a.js-filter-reset').click(function (event) {
                    event.preventDefault();
                    container.get('app.datagrid.filter.url_loader')(
                        c.get('helper.url.add_query_param')(
                            filterForm.attr('action'),
                            'filters',
                            'reset'
                        ),
                        $(this)
                    );
                });
                //Catch the drop down change event
                $elt.find('.js-datagrid-filter').find('select').off('change').change(function (event) {
                    console.log('binding change in filter block');
                    container.get('app.datagrid.filter.form_submitter')(filterForm, event);
                });
                //
            };
        });

        container.set('app.datagrid.filter.url_loader', function (c) {
            return function (url, $target) {
                var service = c.get('ajax');
                var settings = {
                    url: url,
                    done: function (data, textStatus, jqXHR, eventData) {
                        contentBlock().write(data);
                    }
                };
                service.run(settings);
            };
        });

        container.set('app.datagrid.filter.form_submitter', function (c) {
            return function (form, event) {
                event.preventDefault();
                var service = c.get('form.ajax_submitter');
                service.handleSuccessResult = function (data, textStatus, jqXHR, eventData) {
                    contentBlock().write(data.html);
                };
                service.submit(form);
            };
        });

        /*
         * For open/close handle of the filter conatiner
         */
        container.set('app.datagrid.filter.open_close_handle', function (c) {
            return function (handler, event, eventData) {
                event.preventDefault();
                var view = $(eventData.target).first();
                var toggle = handler.$e();
                if (view.is(':visible')) {
                    view.hide('slow');
                    toggle.removeClass('action--open').addClass('action--closed');
                } else {
                    view.show('slow');
                    toggle.removeClass('action--closed').addClass('action--open');
                }
            };
        });
    }
});

$.Class("MmsApp.Provider.AppServiceProvider",
{},
{
    init: function(app)
    {
        this.getApp = function() {return app;};
    },

    register: function(container)
    {
        var App = this.getApp();



    }
});


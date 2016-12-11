window.__MmsApp_Bootstrap__ = {
    run: function($, container, App, undefined) 
    {
        container.register(function(c) { return new App.Provider.KernelServiceProvider(App).register(c); });
        container.register(function(c) { return new App.Provider.DomHandlerServiceProvider(App).register(c); });
        container.register(function(c) { return new App.Provider.FormServiceProvider(App).register(c); });
        container.register(function(c) { return new App.Provider.AdminServiceProvider(App).register(c); });
        container.register(function(c) { return new App.Provider.AppServiceProvider(App).register(c); });
        if(window.__mms_providers__) {
            $.each(window.__mms_providers__, function(provider) {provider(container);}); 
        }
        container.get('hf').loadHandlers(container.get('finder').find($('body')).not('label'));
        if(window.__mms_runners__) {
            $.each(window.__mms_runners__, function(runner) {runner(container);}); 
        }
    }
};

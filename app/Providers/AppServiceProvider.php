<?php

namespace App\Providers;


use Illuminate\Support\ServiceProvider;
use Symfony\Bridge\Twig\Extension\FormExtension as TwigBridgeFormExtension;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Add the Form templates to the Twig Chain Loader
        $reflected = new \ReflectionClass(TwigBridgeFormExtension::class);
        $path = dirname($reflected->getFileName()).'/../Resources/views/Form';
        $this->app['view']->addLocation($path);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}

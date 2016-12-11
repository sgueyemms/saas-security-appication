<?php

namespace App\Providers;

use Mms\Admin\AbstractAdminServiceProvider;
use Mms\Laravel\Eloquent\BlameableManager;
use Mms\Laravel\Eloquent\CodeManager;

/**
 * Description of AdminServiceProvider
 *
 * @author sgueye
 */
class AdminServiceProvider extends AbstractAdminServiceProvider
{
    /**
     * 
     * @return array
     */
    public function loadAdminConfigurations()
    {
        return [
            'implementation' => [
                'disabled' => false,
                'code' => 'implementation',
                'class' =>  \App\Admin\ImplementationAdmin::class,
                'model_class' => \App\Models\Implementation::class,
                'controller_name' => \App\Http\Controllers\Admin\ImplementationController::class,
                'id' => 'admin.admins.implementation',
                'label' => 'menu.implementations',
                'group' => 'default',
                'security' => [
                    'information' => [
                        'GUEST' =>    [],
                        'STAFF' =>    ['VIEW'],
                        'EDITOR' =>   ['VIEW'],
                        'ADMIN' =>    ['MASTER'],
                    ],
                ]
            ],
        ];
    }
    public function register()
    {
//        $this->app->bind(RoutePatternGenerator::class, $this->app->share(function($app) {
//            return new IdSegmentRouteBuilder($app->make(Inflector::class), '', 'mms_admin');
//        }));

        parent::register();
    }

}

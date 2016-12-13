<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::get(
    '/',
    [
        'as' => 'home',
        'uses' => 'HomeController@index'
    ]
);

Route::get(
    '/home',
    [
        'as' => 'home2',
        'uses' => 'HomeController@index'
    ]
);

//Language switch route
Route::get(
    '/language/switch/{code}',
    [
        'as' => 'language_switch',
        'uses' => 'LanguageSwitchController@get'
    ]
);


Route::any(
    '/mockup/{tpl}',
    [
        'as' => 'app.mockup.browse',
        'uses' => 'MockupController@get',
    ]
);

Route::any(
    '/mockup',
    [
        'as' => 'app.mockup',
        'uses' => 'MockupController@get',
    ]
);



//Clients access to API key management
Route::get(
    '/clients',
    [
        'as' => 'api.clients',
        'uses' => 'ApiClientsController@get'
    ]
);


Route::get(
    '/stop-impersonation',
    [
        'as' => 'app.impersonate_stop',
        'uses' => '\Mms\Security\Http\Controllers\ImpersonateController@stop'
    ]
);
//Clients access to API key management
Route::get(
    '/impersonate/{id}',
    [
        'as' => 'app.impersonate',
        'uses' => '\Mms\Security\Http\Controllers\ImpersonateController@get'
    ]
);

Route::get(
    '/profile',
    [
        'as' => 'app.user.profile',
        'uses' => '\Mms\Admin\Http\Controllers\ProfileController@get'
    ]
);


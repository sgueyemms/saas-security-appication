<?php

return array(

    /*
     |--------------------------------------------------------------------------
     | Debugbar Settings
     |--------------------------------------------------------------------------
     |
     | Debugbar is enabled by default, when debug is set to true in app.php.
     | You can override the value by setting enable to true or false instead of null.
     |
     */

    'enabled' => null,
    'route_prefix'        => '/admin/',
    'route_name_prefix'   => 'mms_admin',
    'label_list_actions' => true,
    'label_object_actions' => true,
    /*
     |--------------------------------------------------------------------------
     | Global Routing Dependency Files
     |--------------------------------------------------------------------------
     |
     | Files that have an impact on the routing system. For instance if you define
     | the admin services in app_path('Providers/AdminServiceProvider.php') you 
     | can add  this file in the list. If you do so whenever this file changes the 
     | routing cache will be updated. If you decide to create a config file where 
     | you define the admin configuration entries you can add that file to the list
     |
     | Important note: 
     | When you change this value you have to clear the cache to allow
     | the caching service to take them into account
     |
     */
    'routing_global_resources' => [
        
    ],
    'groups'              => [
        'default' => [
            'label' => 'mms_admin::admin.group_label_default',
        ]
    ],
    'filters' => [
        /* If true filters will be persisted, admin instances can override 
         * the value by calling setPersistFilters() method
         */
        'persist' => false,
    ],
    
    'templates'           => [
        'dashboard'                       => 'mms_admin::dashboard',
        'user_profile'                    => 'mms_admin::user_profile',
        'base_action'                     => 'mms_admin::layout',
        'index_action'                    => 'mms_admin::action/index',
        'user_block'                      => 'mms_admin::user_block',
        'add_block'                       => 'mms_admin::add_block',
        'layout'                          => 'mms_admin::standard_layout',
        'ajax'                            => 'mms_admin::ajax_layout',
        'search'                          => 'mms_admin::search',
        'datagrid'                        => 'mms_admin::crud/datagrid',
        'list'                            => 'mms_admin::crud/list',
        'list_table'                      => 'mms_admin::crud/list_table',
        'list_field'                      => 'mms_admin::crud/list_field',
        'list_field_boolean'              => 'mms_admin::crud/list_field_boolean',
        'list_field_datetime'             => 'mms_admin::crud/list_field_datetime',
        'list_field_text'                 => 'mms_admin::crud/list_field_text',
        'list_field_orm_one_to_many'      => 'mms_admin::crud/list_field_orm_one_to_many',
        'list_field__actions'             => 'mms_admin::crud/list_field__actions',
        'list_field_header'               => 'mms_admin::crud/list_field_header',
        'list_field_header__actions'      => 'mms_admin::crud/list_field_header__actions',
        'list_object_action'              => 'mms_admin::crud/list_object_action',
        'list_batch_actions_header'       => 'mms_admin::crud/list_batch_actions_header',
        'list_batch_selector'             => 'mms_admin::crud/list_batch_selector',
        'filter'                          => 'mms_admin::crud/filter',
        'form'                            => 'mms_admin::crud/form', #this is a Twig template
        'filter_form'                     => 'mms_admin::crud/filter_form', #this is a Twig template
        'show'                            => 'mms_admin::crud/show',
        'show_columns'                    => 'mms_admin::crud/show_columns',
        'show_field'                      => 'mms_admin::crud/show_field',
        'show_field_datetime'             => 'mms_admin::crud/show_field_datetime',
        'show_field_orm_many_to_one'      => 'mms_admin::crud/show_field_orm_many_to_one',
        'show_field_orm_one_to_many'      => 'mms_admin::crud/show_field_orm_one_to_many',
        'show_field_orm_many_to_many'     => 'mms_admin::crud/show_field_orm_many_to_many',
        'show_field_boolean'              => 'mms_admin::crud/show_field_boolean',
        'show_field_text'                 => 'mms_admin::crud/show_field_text',
        'show_compare'                    => 'mms_admin::crud/show_compare',
        'edit'                            => 'mms_admin::crud/edit',
        'create'                          => 'mms_admin::crud/create',
        'preview'                         => 'mms_admin::crud/preview',
        'history'                         => 'mms_admin::crud/history',
        'acl'                             => 'mms_admin::crud/acl',
        'history_revision_timestamp'      => 'mms_admin::crud/history_revision_timestamp',
        'action'                          => 'mms_admin::crud/action',
        'action__sumit'                   => 'mms_admin::crud/action__submit',#this is a Twig template
        'action__link'                    => 'mms_admin::crud/action__link',#this is a Twig template
        'select'                          => 'mms_admin::crud/list__select',
        'list_block'                      => 'mms_admin::block/block_admin_list',
        'search_result_block'             => 'mms_admin::block/block_search_result',
        'short_object_description'        => 'mms_admin::short_object_escription',
        'delete'                          => 'mms_admin::crud/delete',
        'batch'                           => 'mms_admin::crud/list__batch',
        'batch_confirmation'              => 'mms_admin::crud/batch_confirmation',
        'inner_list_row'                  => 'mms_admin::crud/list_inner_row',
        'base_list_field'                 => 'mms_admin::crud/base_list_field',
        'pager_links'                     => 'mms_admin::pager/links',
        'pager_results'                   => 'mms_admin::pager/results',
        'tab_menu_template'               => 'mms_admin::tab_menu_template'
    ],
    'export' => [
        'max_results' => 1000
    ],
    'security' => [
        'information' => [
            'GUEST' =>    ['VIEW', 'LIST'],
            'STAFF' =>    ['EDIT', 'LIST', 'CREATE'],
            'EDITOR' =>   ['OPERATOR', 'EXPORT'],
            'ADMIN' =>    ['MASTER'],
        ],

        # permissions not related to an object instance and also to be available when objects do not exist
        # the DELETE admin permission means the user is allowed to batch delete objects
        'admin_permissions' => ['VIEW', 'CREATE', 'LIST', 'DELETE', 'UNDELETE', 'EXPORT', 'OPERATOR', 'MASTER'],

        # permission related to the objects
        'object_permissions' => ['VIEW', 'EDIT', 'DELETE', 'UNDELETE', 'OPERATOR', 'MASTER', 'OWNER']
    ]
);

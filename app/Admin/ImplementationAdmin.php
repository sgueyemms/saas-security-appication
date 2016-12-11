<?php

namespace App\Admin;

use Mms\Admin\Admin;
use Mms\Admin\Mapper\DatagridMapper;
use Mms\Admin\Mapper\ListMapper;
use Mms\Admin\Mapper\FormMapper;
use Mms\Admin\Mapper\ShowMapper;

/**
 * Description of ImplementationAdmin
 *
 * @author sgueye
 */
class ImplementationAdmin extends Admin
{

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('name')->end()
        ;
    }

    protected function configureListFields(ListMapper $mapper)
    {
        $mapper->addIdentifier('name')->end()
            ->addObjectAction('edit')->end()
            ->addObjectAction('show')->end()
            ->addObjectAction('delete')->end()
        ;
    }


    /**
     *
     * @param FormMapper $mapper
     */
    protected function configureCreateFormFields(FormMapper $mapper)
    {
        $mapper->add('name')->end()
            ->addButton('create')->end()
        ;
    }



    /**
     *
     * @param FormMapper $mapper
     */
    protected function configureFormFields(FormMapper $mapper)
    {
        $mapper->add('name')->end()
            ->addButton('update')->end()
        ;
    }

    /**
     *
     * @param FormMapper $mapper
     */
    protected function configureEditAutocompleteFormFields(FormMapper $mapper)
    {
        $mapper->add('name')->end()
            ->addButton('update')->end()
        ;
    }
    /**
     *
     * @param FormMapper $mapper
     */
    protected function configureDeleteFormFields(FormMapper $mapper)
    {
        $mapper->addButton('delete')->end()
            ;
    }
    /**
     *
     * @param ShowMapper $mapper
     */
    protected function configureShowFields(ShowMapper $mapper)
    {
        $mapper
            ->add('name')->end()
            ;
    }
}

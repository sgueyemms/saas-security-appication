<?php 

namespace App\Http\Controllers\Admin;
 
use App\Admin\ImplementationAdmin;
use App\Http\Controllers\Controller;
use Mms\Admin\Http\AdminControllerInterface;
use Mms\Admin\Http\AdminControllerTrait;

class ImplementationController extends Controller implements AdminControllerInterface
{
    use AdminControllerTrait;
    public function __construct(ImplementationAdmin $admin)
    {
        $this->setAdmin($admin);
    }
}
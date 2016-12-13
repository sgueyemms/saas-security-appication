<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Laravel\Passport\HasApiTokens;
use Mms\Laravel\Eloquent\BaseModel as MmsBaseModel;
use Mms\Laravel\Eloquent\Mapping\Annotation\Annotations as MmsAnnotations;
use Illuminate\Notifications\Notifiable;
use Mms\Security\Model\ImpersonatableUserInterface;
use Mms\Security\Model\ImpersonatableUserTrait;


/**
 *
 * @MmsAnnotations\ModelDefaultSort(field="name")
 * @MmsAnnotations\LifecycleHookCollection({
 *  @MmsAnnotations\LifecycleHook(name="blameable", config={"created_by": "", "updated_by": ""})
 * })
 *
 */
class User extends MmsBaseModel implements AuthenticatableContract,
                                            AuthorizableContract,
                                            CanResetPasswordContract,
                                            ImpersonatableUserInterface
{
    use Authenticatable, Authorizable, CanResetPassword, Notifiable, HasApiTokens, ImpersonatableUserTrait;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'email', 'password'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->getFullName();
    }

    /**
     * @return string
     */
    public function getFullName()
    {
        return $this->first_name.' '.$this->last_name;
    }

    /**
     *
     * @MmsAnnotations\Association
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'link_user_role', 'user_id', 'role_id');
    }

    /**
     * @return array
     */
    public function getRoles()
    {
        return [
            'ROLE_SUPER_ADMIN'
        ];
        return $this->roles()->pluck('name')->all();
    }

    /**
     * @param $name
     * @return bool
     */
    public function hasRole($name)
    {
        foreach ($this->getRoles() as $roleName) {
            if($roleName == $name) {
                return true;
            }
        }
        return false;
    }

    /**
     * @return bool
     */
    public function isSuperAdmin()
    {
        return $this->hasRole('ROLE_SUPER_ADMIN');
    }
}

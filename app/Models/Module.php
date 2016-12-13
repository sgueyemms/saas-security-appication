<?php

namespace App\Models;

use Mms\Laravel\Eloquent\BaseModel as MmsBaseModel;
use Mms\Laravel\Eloquent\Mapping\Annotation\Annotations as MmsAnnotations;


/**
 *
 * @MmsAnnotations\ModelDefaultSort(field="name")
 *
 */
class Module extends MmsBaseModel
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'module';

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->name ?: '-';
    }

    /**
     *
     * @MmsAnnotations\Association
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function implementation()
    {
        return $this->belongsTo(Implementation::class, 'imp_id');
    }

    /**
     *
     * @MmsAnnotations\Association
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
     public function fields()
     {
         return $this->hasMany(ModuleField::class, 'id', 'module_id');
     }

    /**
     *
     * @MmsAnnotations\Association
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function actions()
    {
        return $this->hasMany(ModuleAction::class, 'id', 'module_id');
    }

    /**
     *
     * @MmsAnnotations\Association
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function object_actions()
    {
        return $this->hasMany(ModuleObjectAction::class, 'id', 'module_id');
    }
}

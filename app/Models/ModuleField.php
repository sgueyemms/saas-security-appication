<?php

namespace App\Models;

use Mms\Laravel\Eloquent\BaseModel as MmsBaseModel;
use Mms\Laravel\Eloquent\Mapping\Annotation\Annotations as MmsAnnotations;


/**
 *
 * @MmsAnnotations\ModelDefaultSort(field="name")
 *
 */
class ModuleField extends MmsBaseModel
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'module_field';

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
    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }
}

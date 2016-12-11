<?php

namespace App\Models;

use Mms\Laravel\Eloquent\BaseModel as MmsBaseModel;
use Mms\Laravel\Eloquent\Mapping\Annotation\Annotations as MmsAnnotations;


/**
 *
 * @MmsAnnotations\ModelDefaultSort(field="name")
 *
 */
class Implementation extends MmsBaseModel
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'implementation';

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
     public function users()
     {
         return $this->hasMany(User::class, 'id', 'imp_id');
     }

    /**
     *
     * @MmsAnnotations\Association
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function actions()
    {
        return $this->hasMany(Action::class, 'id', 'imp_id');
    }

    /**
     *
     * @MmsAnnotations\Association
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function documents()
    {
        return $this->hasMany(Document::class, 'id', 'imp_id');
    }

    /**
     *
     * @MmsAnnotations\Association
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function contacts()
    {
        return $this->hasMany(Contact::class, 'id', 'imp_id');
    }
}

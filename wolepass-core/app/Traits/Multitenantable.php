<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Multitenantable
{
    public static function bootMultitenantable()
    {
        if (auth()->check()) {
            static::creating(function ($model) {
                if (empty($model->tenant_id)) {
                    $model->tenant_id = auth()->user()->tenant_id;
                }
            });

            static::addGlobalScope('tenant_id', function (Builder $builder) {
                $builder->where('tenant_id', auth()->user()->tenant_id);
            });
        }
    }
}

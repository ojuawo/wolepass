<?php

namespace App\Models;

use App\Traits\Multitenantable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    use HasUuids, Multitenantable;

    protected $fillable = ['tenant_id', 'phone_number', 'full_name', 'photo_url'];
}

<?php

namespace App\Models;

use App\Traits\Multitenantable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    use HasUuids, Multitenantable;

    protected $fillable = [
        'tenant_id',
        'unit_id',
        'host_id',
        'visitor_id',
        'visit_type',
        'otp_code',
        'status',
        'expected_arrival'
    ];
}

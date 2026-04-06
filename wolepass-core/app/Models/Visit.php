<?php

namespace App\Models;

use App\Traits\Multitenantable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    use HasFactory, HasUuids, Multitenantable;

    protected $fillable = [
        'tenant_id',
        'unit_id',
        'host_id',
        'visitor_id',
        'visit_type',
        'otp_code',
        'status',
        'expected_arrival',
        'checked_in_at',
        'checked_in_by',
    ];

    protected $casts = [
        'expected_arrival' => 'datetime',
        'checked_in_at'    => 'datetime',
    ];

    public function visitor()
    {
        return $this->belongsTo(Visitor::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function gateGuard()
    {
        return $this->belongsTo(User::class, 'checked_in_by');
    }
}

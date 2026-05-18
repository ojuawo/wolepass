<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PollOption extends Model
{
    use HasUuids;

    protected $fillable = ['notice_id', 'option_text'];

    public function notice(): BelongsTo
    {
        return $this->belongsTo(Notice::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(PollVote::class);
    }

    public function getVoteCountAttribute(): int
    {
        return $this->votes()->count();
    }

    public function hasVotedByUser(string $userId): bool
    {
        return $this->votes()->where('user_id', $userId)->exists();
    }
}

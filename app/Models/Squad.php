<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Squad extends Model
{
    protected $fillable = [
        'Name',
        'general_project_id',
        'anggota'
    ];

    protected $casts = [
        'anggota' => 'array',
    ];

    /**
     * Relationship with GeneralProject
     */
    public function project()
    {
        return $this->belongsTo(GeneralProject::class, 'general_project_id', 'id');
    }

    /**
     * Get users that are members of this squad
     */
    public function team()
    {
        if (!empty($this->anggota)) {
            return User::whereIn('id', $this->anggota)->get();
        }

        return collect();
    }

    /**
     * Get team members as attribute (for easier access)
     */
    public function getTeamMembersAttribute()
    {
        return $this->team();
    }

    /**
     * Get team member names as comma-separated string
     */
    public function getTeamNamesAttribute()
    {
        return $this->team()->pluck('name')->join(', ');
    }

    /**
     * Get team member count
     */
    public function getTeamCountAttribute()
    {
        return is_array($this->anggota) ? count($this->anggota) : 0;
    }

    /**
     * Check if user is member of this squad
     */
    public function hasMember($userId)
    {
        return is_array($this->anggota) && in_array($userId, $this->anggota);
    }

    /**
     * Add member to squad
     */
    public function addMember($userId)
    {
        $anggota = $this->anggota ?? [];
        if (!in_array($userId, $anggota)) {
            $anggota[] = $userId;
            $this->update(['anggota' => $anggota]);
        }
        return $this;
    }

    /**
     * Remove member from squad
     */
    public function removeMember($userId)
    {
        $anggota = $this->anggota ?? [];
        $anggota = array_filter($anggota, function ($id) use ($userId) {
            return $id != $userId;
        });
        $this->update(['anggota' => array_values($anggota)]);
        return $this;
    }
}

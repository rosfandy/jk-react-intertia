<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class GeneralProject extends Model
{
    protected $fillable = [
        'nama',
        'deskripsi',
        'divisi_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'user_id'
    ];

    public function team(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'general_project_user')
            ->select('users.id', 'users.name') // Ambil kolom tanpa JSON
            ->distinct(false); // Matikan DISTINCT
    }


    public function squad()
    {
        return $this->hasMany(Squad::class);
    }
}

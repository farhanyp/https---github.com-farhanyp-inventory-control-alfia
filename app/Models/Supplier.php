<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;

    protected $table = 'supplier';

    const UPDATED_AT = null;

    protected $fillable = [
        'supplier_code',
        'supplier_name',
        'phone_number',
        'address',
    ];

    public function incomingProducts(): HasMany
    {
        return $this->hasMany(IncomingProduct::class, 'supplier_id');
    }
}

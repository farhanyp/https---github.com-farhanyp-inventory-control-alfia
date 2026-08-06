<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reseller extends Model
{
    use HasFactory;

    protected $table = 'reseller';

    protected $fillable = ['name'];

    public function sales()
    {
        return $this->hasMany(Sales::class, 'reseller_id');
    }

    public function salesDetails()
    {
        return $this->hasMany(SalesDetail::class, 'reseller_id');
    }
}

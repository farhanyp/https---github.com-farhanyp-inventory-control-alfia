<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BatchStock extends Model
{
    use HasFactory;

    protected $table = 'batch_stock';

    const UPDATED_AT = null;

    protected $fillable = [
        'product_id',
        'batch_no',
        'expired_date',
        'initial_quantity',
        'remaining_quantity',
        'purchase_price',
        'incoming_source_id',
    ];

    protected function casts(): array
    {
        return [
            'expired_date' => 'date',
            'initial_quantity' => 'decimal:2',
            'remaining_quantity' => 'decimal:2',
            'purchase_price' => 'decimal:2',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function incomingProduct(): BelongsTo
    {
        return $this->belongsTo(IncomingProduct::class, 'incoming_source_id');
    }

    public function salesDetails(): HasMany
    {
        return $this->hasMany(SalesDetail::class, 'batch_id');
    }

    public function stockHistories(): HasMany
    {
        return $this->hasMany(StockHistory::class, 'batch_id');
    }
}

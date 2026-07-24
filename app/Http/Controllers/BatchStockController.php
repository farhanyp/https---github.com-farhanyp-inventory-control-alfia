<?php

namespace App\Http\Controllers;

use App\Models\BatchStock;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BatchStockController extends Controller
{
    public function index()
    {
        // Sort by expired date ascending (putting NULLs at the end) and then by remaining quantity ascending
        $batchStocks = BatchStock::with(['product', 'incomingProduct.supplier'])
            ->where('remaining_quantity', '>', 0)
            ->orderByRaw('expired_date IS NULL ASC, expired_date ASC, remaining_quantity ASC')
            ->paginate(10);

        return Inertia::render('batch-stocks/index', [
            'batchStocks' => $batchStocks,
        ]);
    }

}

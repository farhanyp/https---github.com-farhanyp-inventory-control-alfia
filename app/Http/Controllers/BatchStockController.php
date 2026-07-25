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
        // 1. Dapatkan 10 produk yang memiliki stok tersisa dengan query whereHas ke Product (sehingga total() akurat)
        $paginatedProducts = Product::whereHas('batchStocks', function($query) {
            $query->where('remaining_quantity', '>', 0);
        })->paginate(10);

        // 2. Ambil semua batch dari 10 produk tersebut
        $batchStocksData = BatchStock::with(['product', 'incomingProduct.supplier'])
            ->where('remaining_quantity', '>', 0)
            ->whereIn('product_id', $paginatedProducts->pluck('id'))
            ->orderByRaw('expired_date IS NULL ASC, expired_date ASC, remaining_quantity ASC')
            ->get();

        // 3. Buat paginator manual menggunakan data Total & Current Page yang akurat dari Product
        $batchStocks = new \Illuminate\Pagination\LengthAwarePaginator(
            $batchStocksData,
            $paginatedProducts->total(),
            $paginatedProducts->perPage(),
            $paginatedProducts->currentPage(),
            ['path' => \Illuminate\Pagination\Paginator::resolveCurrentPath()]
        );

        return Inertia::render('batch-stocks/index', [
            'batchStocks' => $batchStocks,
        ]);
    }

}

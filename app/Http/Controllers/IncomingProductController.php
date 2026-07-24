<?php

namespace App\Http\Controllers;

use App\Models\IncomingProduct;
use App\Models\Supplier;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class IncomingProductController extends Controller
{
    public function index()
    {
        $incomingProducts = IncomingProduct::with(['supplier', 'product', 'creator'])->orderBy('id', 'desc')->paginate(10);
        $suppliers = Supplier::orderBy('supplier_name')->get();
        $products = Product::orderBy('product_name')->get();

        return Inertia::render('incoming-products/index', [
            'incomingProducts' => $incomingProducts,
            'suppliers' => $suppliers,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $minStock = 0.01;
        if ($request->filled('product_id')) {
            $product = Product::find($request->product_id);
            if ($product) {
                $minStock = $product->min_stock;
            }
        }

        $messages = [
            'incoming_date.required' => 'Tanggal masuk wajib diisi.',
            'incoming_date.date' => 'Format tanggal masuk tidak valid.',
            'supplier_id.required' => 'Supplier wajib dipilih.',
            'supplier_id.exists' => 'Supplier yang dipilih tidak valid.',
            'product_id.required' => 'Produk wajib dipilih.',
            'product_id.exists' => 'Produk yang dipilih tidak valid.',
            'expired_date.date' => 'Format tanggal kedaluwarsa tidak valid.',
            'expired_date.after_or_equal' => 'Tanggal kedaluwarsa tidak boleh sebelum tanggal barang masuk.',
            'quantity.required' => 'Kuantitas wajib diisi.',
            'quantity.numeric' => 'Kuantitas harus berupa angka.',
            'quantity.min' => 'Kuantitas minimal harus ' . $minStock . ' (sesuai batas stok minimal produk).',
            'purchase_price.required' => 'Harga beli wajib diisi.',
            'purchase_price.numeric' => 'Harga beli harus berupa angka.',
            'purchase_price.min' => 'Harga beli tidak boleh kurang dari 0.',
        ];

        $validated = $request->validate([
            'incoming_date'  => 'required|date',
            'supplier_id'    => 'required|exists:supplier,id',
            'product_id'     => 'required|exists:product,id',
            'expired_date'   => 'nullable|date|after_or_equal:incoming_date',
            'quantity'       => 'required|numeric|min:' . $minStock,
            'purchase_price' => 'required|numeric|min:0',
            'description'    => 'nullable|string',
        ], $messages);

        $validated['total'] = $validated['quantity'] * $validated['purchase_price'];
        $validated['created_by'] = Auth::id();
        $validated['created_at'] = now();

        IncomingProduct::create($validated);

        return redirect()->back()->with('success', 'Barang Masuk berhasil ditambahkan.');
    }

    public function update(Request $request, IncomingProduct $incomingProduct)
    {
        $minStock = 0.01;
        if ($request->filled('product_id')) {
            $product = Product::find($request->product_id);
            if ($product) {
                $minStock = $product->min_stock;
            }
        }

        $messages = [
            'incoming_date.required' => 'Tanggal masuk wajib diisi.',
            'incoming_date.date' => 'Format tanggal masuk tidak valid.',
            'supplier_id.required' => 'Supplier wajib dipilih.',
            'supplier_id.exists' => 'Supplier yang dipilih tidak valid.',
            'product_id.required' => 'Produk wajib dipilih.',
            'product_id.exists' => 'Produk yang dipilih tidak valid.',
            'expired_date.date' => 'Format tanggal kedaluwarsa tidak valid.',
            'expired_date.after_or_equal' => 'Tanggal kedaluwarsa tidak boleh sebelum tanggal barang masuk.',
            'quantity.required' => 'Kuantitas wajib diisi.',
            'quantity.numeric' => 'Kuantitas harus berupa angka.',
            'quantity.min' => 'Kuantitas minimal harus ' . $minStock . ' (sesuai batas stok minimal produk).',
            'purchase_price.required' => 'Harga beli wajib diisi.',
            'purchase_price.numeric' => 'Harga beli harus berupa angka.',
            'purchase_price.min' => 'Harga beli tidak boleh kurang dari 0.',
        ];

        $validated = $request->validate([
            'incoming_date'  => 'required|date',
            'supplier_id'    => 'required|exists:supplier,id',
            'product_id'     => 'required|exists:product,id',
            'expired_date'   => 'nullable|date|after_or_equal:incoming_date',
            'quantity'       => 'required|numeric|min:' . $minStock,
            'purchase_price' => 'required|numeric|min:0',
            'description'    => 'nullable|string',
        ], $messages);

        $validated['total'] = $validated['quantity'] * $validated['purchase_price'];

        $incomingProduct->update($validated);

        return redirect()->back()->with('success', 'Barang Masuk berhasil diperbarui.');
    }

    public function destroy(IncomingProduct $incomingProduct)
    {
        $incomingProduct->delete();

        return redirect()->back()->with('success', 'Barang Masuk berhasil dihapus.');
    }
}

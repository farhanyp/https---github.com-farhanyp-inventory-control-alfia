<?php

namespace App\Http\Controllers;

use App\Models\Reseller;
use Illuminate\Http\Request;

class ResellerController extends Controller
{
    public function index()
    {
        $resellers = Reseller::orderBy('id', 'desc')->paginate(10);

        return \Inertia\Inertia::render('resellers/index', [
            'resellers' => $resellers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:120',
        ]);

        Reseller::create($validated);

        return redirect()->back()->with('success', 'Reseller created successfully.');
    }

    public function update(Request $request, Reseller $reseller)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:120',
        ]);

        $reseller->update($validated);

        return redirect()->back()->with('success', 'Reseller updated successfully.');
    }

    public function destroy(Reseller $reseller)
    {
        try {
            $reseller->delete();
            return redirect()->back()->with('success', 'Reseller berhasil dihapus.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == '23000') {
                return back()->withErrors(['message' => 'Reseller ini tidak dapat dihapus karena masih terhubung dengan data penjualan.']);
            }
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus data.']);
        }
    }
}

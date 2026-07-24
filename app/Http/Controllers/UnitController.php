<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index()
    {
        $units = Unit::orderBy('id', 'desc')->paginate(10);

        return Inertia::render('units/index', [
            'units' => $units,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_name' => 'required|string|max:100',
        ]);

        Unit::create($validated);

        return redirect()->back()->with('success', 'Unit created successfully.');
    }

    public function update(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'unit_name' => 'required|string|max:100',
        ]);

        $unit->update($validated);

        return redirect()->back()->with('success', 'Unit updated successfully.');
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();

        return redirect()->back()->with('success', 'Unit deleted successfully.');
    }
}

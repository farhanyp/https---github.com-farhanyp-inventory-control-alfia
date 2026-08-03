<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('role:MANAGEMENT|ADMIN')->group(function () {
        Route::get('users', [\App\Http\Controllers\UserController::class, 'index'])->name('users.index');
        Route::put('users/{user}/role', [\App\Http\Controllers\UserController::class, 'updateRole'])->name('users.updateRole');
        Route::delete('users/{user}', [\App\Http\Controllers\UserController::class, 'destroy'])->name('users.destroy');
    });

    Route::middleware('role:MANAGEMENT|STAFF')->group(function () {
        Route::resource('categories', \App\Http\Controllers\CategoryController::class)->except(['create', 'show', 'edit']);
        Route::resource('units', \App\Http\Controllers\UnitController::class)->except(['create', 'show', 'edit']);
        Route::resource('suppliers', \App\Http\Controllers\SupplierController::class)->except(['create', 'show', 'edit']);
        Route::resource('products', \App\Http\Controllers\ProductController::class)->except(['create', 'show', 'edit']);
        Route::resource('incoming-products', \App\Http\Controllers\IncomingProductController::class)->except(['create', 'show', 'edit']);
        Route::resource('batch-stocks', \App\Http\Controllers\BatchStockController::class)->only(['index']);
        Route::resource('sales', \App\Http\Controllers\SalesController::class)->only(['index', 'store', 'show']);
    });

    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [\App\Http\Controllers\ReportController::class, 'index'])->name('index');
        Route::get('/stock', [\App\Http\Controllers\ReportController::class, 'stock'])->name('stock');
        Route::get('/incoming', [\App\Http\Controllers\ReportController::class, 'incoming'])->name('incoming');
        Route::get('/sales', [\App\Http\Controllers\ReportController::class, 'sales'])->name('sales');
        Route::get('/expired', [\App\Http\Controllers\ReportController::class, 'expired'])->name('expired');
    });
});

require __DIR__.'/settings.php';

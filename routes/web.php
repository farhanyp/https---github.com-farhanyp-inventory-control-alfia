<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::middleware('role:MANAGEMENT|ADMIN')->group(function () {
        Route::get('users', [\App\Http\Controllers\UserController::class, 'index'])->name('users.index');
        Route::put('users/{user}/role', [\App\Http\Controllers\UserController::class, 'updateRole'])->name('users.updateRole');
    });

    Route::middleware('role:MANAGEMENT|STAFF')->group(function () {
        Route::resource('categories', \App\Http\Controllers\CategoryController::class)->except(['create', 'show', 'edit']);
        Route::resource('units', \App\Http\Controllers\UnitController::class)->except(['create', 'show', 'edit']);
        Route::resource('suppliers', \App\Http\Controllers\SupplierController::class)->except(['create', 'show', 'edit']);
        Route::resource('products', \App\Http\Controllers\ProductController::class)->except(['create', 'show', 'edit']);
        Route::resource('incoming-products', \App\Http\Controllers\IncomingProductController::class)->except(['create', 'show', 'edit']);
    });
});

require __DIR__.'/settings.php';

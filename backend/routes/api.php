<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\UserPreferenceController;

// User Registration
Route::post('/register', [AuthController::class, 'register']);
// User Login
Route::post('/login', [AuthController::class, 'login']);
// User Logout (Requires authentication)
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
// Get Authenticated User (Requires authentication)
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
// Get Article (Requires authentication)
Route::middleware('auth:sanctum')->get('/articles', [ArticleController::class, 'index']);
Route::middleware('auth:sanctum')->post('/articles/search', [ArticleController::class, 'search']);
// Set user preferences (authenticated)
Route::middleware('auth:sanctum')->post('/preferences', [UserPreferenceController::class, 'setPreferences']);
// Fetch personalized news feed (authenticated)
Route::middleware('auth:sanctum')->get('/personalized-feed', [UserPreferenceController::class, 'getPersonalizedFeed']);
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserPreference;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class UserPreferenceController extends Controller
{
    /**
     * Set user preferences (sources, categories, authors)
     */
    public function setPreferences(Request $request)
    {
        $request->validate([
            'sources' => 'nullable|array',
            'categories' => 'nullable|array',
            'authors' => 'nullable|array',
        ]);

        // Get the authenticated user
        $user = $request->user();

        // Update or create the user preferences
        $preferences = UserPreference::updateOrCreate(
            ['user_id' => $user->id],
            [
                'sources' => json_encode($request->sources),
                'categories' => json_encode($request->categories),
                'authors' => json_encode($request->authors),
            ]
        );

        return response()->json([
            'message' => 'Preferences updated successfully.',
            'preferences' => $preferences,
        ], 200);
    }

    /**
     * Fetch personalized news feed based on user preferences
     */
    public function getPersonalizedFeed(Request $request)
    {
        // Get the authenticated user's preferences
        $user = $request->user();
        $preferences = $user->preference;

        if (!$preferences) {
            return response()->json(['message' => 'No preferences set.'], 404);
        }

        // Prepare query parameters based on preferences
        $queryParamsNewsApi = [
            'apiKey' => env('NEWS_API_KEY'), // NewsAPI key from .env
            'sources' => json_decode($preferences->sources),
            'category' => json_decode($preferences->categories),
            'authors' => json_decode($preferences->authors),
        ];
        $queryParamsGuardianApi = [
            'apiKey' => env('NEWS_API_KEY'), // NewsAPI key from .env
            'sources' => json_decode($preferences->sources),
            'category' => json_decode($preferences->categories),
            'authors' => json_decode($preferences->authors),
        ];

        // Make request to NewsAPI (example)
        $responseNewsAPI = Http::get('https://newsapi.org/v2/everything', $queryParamsNewsApi);
        // Fetch articles from The Guardian, BBC, etc.
        $responseGuardian = Http::get('https://content.guardianapis.com/search', $queryParamsGuardianApi);
        // Merge the results from different APIs
        $articles = array_merge($responseNewsAPI->json()['articles'], $responseGuardian->json()['response']['results']);

        // Return the articles fetched from the API
        return response()->json($articles->json());
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http; // Import Http client

class ArticleController extends Controller
{
    /**
     * Fetch all articles (Example: from NewsAPI)
     */
    public function index()
    {
        // Fetch articles from NewsAPI
        $newsApiResponse = Http::get('https://newsapi.org/v2/top-headlines', [
            'apiKey' => env('NEWS_API_KEY'),
            'country' => 'us',
        ]);

        // Fetch articles from The Guardian API
        $guardianApiResponse = Http::get('https://content.guardianapis.com/search', [
            'api-key' => env('GUARDIAN_API_KEY'),
            'section' => 'news',
        ]);

        // Fetch articles from BBC News (this might be a placeholder as BBC might need a different setup)
        $bbcApiResponse = Http::get('https://newsapi.org/v2/top-headlines', [
            'apiKey' => env('NEWS_API_KEY'),
            'sources' => 'bbc-news',
        ]);

        // Merge the results from different APIs
        $articles = array_merge(
            $newsApiResponse->json()['articles'] ?? [],
            $guardianApiResponse->json()['response']['results'] ?? [],
            $bbcApiResponse->json()['articles'] ?? []
        );

        return response()->json($articles);
    }

    /**
     * Search articles based on keywords
     */
    public function search(Request $request)
    {
        // Validate the request input
        $request->validate([
            'keyword' => 'required|string',
            'category' => 'nullable|string',
            'source' => 'nullable|string',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
        ]);

        // Prepare the query parameters for NewsAPI
        $newsApiParams = [
            'apiKey' => env('NEWS_API_KEY'),
            'q' => $request->keyword, 
            'from' => $request->from, 
            'to' => $request->to, 
            'category' => $request->category,
            'sources' => $request->source,
        ];

        // Fetch results from NewsAPI
        $newsApiResponse = Http::get('https://newsapi.org/v2/everything', $newsApiParams);

        // Prepare the query parameters for The Guardian API
        $guardianApiParams = [
            'api-key' => env('GUARDIAN_API_KEY'),
            'q' => $request->keyword, // Guardian API uses `q` for searching
        ];

        // Fetch results from The Guardian
        $guardianApiResponse = Http::get('https://content.guardianapis.com/search', $guardianApiParams);

        // Fetch results from BBC (using NewsAPI for BBC as an example)
        $bbcApiResponse = Http::get('https://newsapi.org/v2/everything', [
            'apiKey' => env('NEWS_API_KEY'),
            'q' => $request->keyword,
            'sources' => 'bbc-news',
        ]);

        // Merge the results from different APIs
        $articles = array_merge(
            $newsApiResponse->json()['articles'] ?? [],
            $guardianApiResponse->json()['response']['results'] ?? [],
            $bbcApiResponse->json()['articles'] ?? []
        );

        return response()->json($articles);
    }
}

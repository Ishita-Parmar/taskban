<?php
$baseUrl = 'http://127.0.0.1:8000/api';

function request($method, $url, $data = [], $token = null) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    $headers = ['Accept: application/json', 'Content-Type: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if (!empty($data) && $method !== 'GET') {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return ['code' => $httpCode, 'body' => json_decode($response, true)];
}

echo "1. Testing Register...\n";
$register = request('POST', $baseUrl . '/register', [
    'name' => 'Test User',
    'email' => 'test' . time() . '@example.com',
    'password' => 'password',
    'password_confirmation' => 'password'
]);
echo "Response Code: " . $register['code'] . "\n";
if ($register['code'] >= 400) {
    echo "Error: " . json_encode($register['body']) . "\n";
} else {
    echo "Register Success.\n";
}

$token = $register['body']['access_token'] ?? $register['body']['token'] ?? null;

if (!$token) {
    echo "Failed to get token. Stopping.\n";
    exit(1);
}

echo "\n2. Testing Create Project...\n";
$project = request('POST', $baseUrl . '/projects', [
    'name' => 'Test Project',
    'key' => 'TEST',
    'description' => 'A project for testing'
], $token);
echo "Response Code: " . $project['code'] . "\n";
if ($project['code'] >= 400) {
    echo "Error: " . json_encode($project['body']) . "\n";
} else {
    echo "Project Create Success.\n";
}

$projectId = $project['body']['id'] ?? $project['body']['data']['id'] ?? null;

if ($projectId) {
    echo "\n3. Testing Create Issue...\n";
    $issue = request('POST', $baseUrl . '/projects/' . $projectId . '/issues', [
        'title' => 'Test Issue',
        'description' => 'Test issue description',
        'status' => 'todo',
        'priority' => 'high',
        'type' => 'bug'
    ], $token);
    echo "Response Code: " . $issue['code'] . "\n";
    if ($issue['code'] >= 400) {
        echo "Error: " . json_encode($issue['body']) . "\n";
    } else {
        echo "Issue Create Success.\n";
    }
}

echo "\nAll tests finished.\n";

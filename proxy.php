<?php
/*
 * Прокси для обычного хостинга (Beget, Timeweb, REG.RU и т. п.).
 * Браузер обращается только к домену сайта, а этот скрипт пересылает запросы дальше:
 *   /sb/...   → база данных Supabase
 *   /off/...  → база продуктов Open Food Facts (сканер)
 *   /dns/...  → проверка почтовых доменов при регистрации
 * Так сайт работает в России без VPN. Правила переадресации — в файле .htaccess.
 */

$TARGETS = [
    'sb'  => 'https://afzroggvqgadcozukiwy.supabase.co',
    'off' => 'https://world.openfoodfacts.org',
    'dns' => 'https://dns.google',
];

// исходный адрес вместе с сырой строкой запроса (повторяющиеся параметры важны для базы)
$uri = $_SERVER['REQUEST_URI'] ?? '';
if (!preg_match('#^.*?/(sb|off|dns)(/.*)?$#', $uri, $m) || !isset($TARGETS[$m[1]])) {
    http_response_code(404);
    exit('Not found');
}
$url = $TARGETS[$m[1]] . ($m[2] ?? '/');

// пересылаем только нужные заголовки
$headers = [];
$incoming = function_exists('getallheaders') ? getallheaders() : [];
foreach ($_SERVER as $key => $value) {
    if (strpos($key, 'HTTP_') === 0) {
        $name = str_replace('_', '-', strtolower(substr($key, 5)));
        $incoming[$name] = $value;
    }
}
if (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) $incoming['authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
if (!empty($_SERVER['CONTENT_TYPE'])) $incoming['content-type'] = $_SERVER['CONTENT_TYPE'];
$allowed = ['apikey', 'authorization', 'content-type', 'accept', 'prefer', 'range', 'accept-profile',
            'content-profile', 'x-client-info', 'x-supabase-api-version'];
$sent = [];
foreach ($incoming as $name => $value) {
    $lower = strtolower($name);
    if (in_array($lower, $allowed, true) && !isset($sent[$lower])) {
        $sent[$lower] = true;
        $headers[] = $lower . ': ' . $value;
    }
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST  => $method,
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_ENCODING       => '',
]);
if (!in_array($method, ['GET', 'HEAD'], true)) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

// передаём браузеру статус и полезные заголовки ответа
$pass = ['content-type', 'content-range', 'location', 'preference-applied', 'cache-control'];
curl_setopt($ch, CURLOPT_HEADERFUNCTION, function ($ch, $line) use ($pass) {
    $parts = explode(':', $line, 2);
    if (count($parts) === 2 && in_array(strtolower(trim($parts[0])), $pass, true)) {
        header(trim($parts[0]) . ': ' . trim($parts[1]), false);
    }
    return strlen($line);
});

$body = curl_exec($ch);
if ($body === false) {
    http_response_code(502);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['message' => 'Прокси не смог связаться с сервером: ' . curl_error($ch)], JSON_UNESCAPED_UNICODE);
    exit;
}
http_response_code(curl_getinfo($ch, CURLINFO_RESPONSE_CODE));
echo $body;

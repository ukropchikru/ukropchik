/*
 * Настройки подключения к базе данных Supabase.
 *
 * 1. Создайте проект на https://supabase.com (бесплатно).
 * 2. Выполните файл supabase/schema.sql в разделе SQL Editor.
 * 3. Скопируйте значения из Project Settings → API:
 *      Project URL      → SUPABASE_URL
 *      anon public key  → SUPABASE_ANON_KEY
 *
 * Ключ anon — публичный, его можно хранить в коде сайта: доступ к данным
 * ограничивают правила Row Level Security из schema.sql.
 *
 * Пока поля пустые, сайт работает в демо-режиме и хранит данные в браузере.
 *
 * SUPABASE_PROXY — путь, через который сайт ходит в базу через свой домен
 * (правила в файле _redirects). Такие правила понимает только Netlify,
 * поэтому прокси включается лишь на хостах из PROXY_HOSTS.
 * На GitHub Pages и на localhost запросы идут напрямую.
 */
window.APP_CONFIG = {
  SUPABASE_URL: 'https://afzroggvqgadcozukiwy.supabase.co',
  SUPABASE_PROXY: '/sb',
  PROXY_HOSTS: ['netlify.app'],
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmenJvZ2d2cWdhZGNvenVraXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNzEwNDUsImV4cCI6MjEwODc0NzA0NX0.JVwHKHXWD1iD0MVjo2dGut7WWOlYTSZ54qlIpOpqhPc',
};

/* true — если сайт открыт на хостинге с прокси (_redirects): /sb, /off, /dns */
window.APP_CONFIG.useProxy = (window.APP_CONFIG.PROXY_HOSTS || []).some(
  (host) => location.hostname === host || location.hostname.endsWith('.' + host)
);

<?php require_once($_SERVER['DOCUMENT_ROOT'].'/maxfax_social' .'/core/f.php'); ?>
<!doctype html>
<html id="html" class="">
<head>
  <meta charset="utf-8">
  <meta name="generator" content="My App 1.0.0">
	<noscript>
	<meta http-equiv="Refresh" content="0; /signup">
	</noscript>
  <meta http-equiv="Content-Security-Policy" content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

  <meta name="theme-color" content="#999999">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-tap-highlight" content="no">
  <title>Go App</title>
  <meta name="description" content="iOS App">

  <meta property="og:title" content="App Store">
  <meta property="og:description" content="iOS App">
  <meta property="og:image" content="https://api.godialog.ru/content/storage/system/pwaicon.png">
  <meta property="og:image:width" content="1500">
  <meta property="og:image:height" content="800">
  <meta property="og:site_name" content="App Store">
  <meta property="og:type" content="website">
  <meta property="og:url" content="#">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="App Store">
  <meta name="twitter:description" content="iOS App">
  <meta name="twitter:image" content="https://api.godialog.ru/content/storage/system/pwaicon.png">

  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="apple-touch-icon" href="https://api.godialog.ru/content/storage/system/pwaicon.png">
  <link rel="icon" href="https://api.godialog.ru/content/storage/system/pwaicon.png">
  <link rel='manifest' type='application/manifest+json' href='/manifest.webmanifest'>
	<script type="text/javascript">
    /**
    @todo исправить window.location.replace в router
    !! исправлен возможный баг при изменении текущей директории в Apache (endsWith)
    */
    let isToken = localStorage.getItem("authToken") && localStorage.getItem("authToken").length > 32;
        /**
         * #change: Исправлен возможный баг при замене текущей директрии Apache
           location.pathname != '/auth' => !location.pathname.endsWith('/auth')
         */
	if(!location.pathname.endsWith('/auth') && !isToken ){
		window.location.replace("/auth")
	}


  </script>
	<link rel="stylesheet" href="<?=mini(false,		'/assets/font-awesome/css/fa.css')?>">
	<link rel="stylesheet" href="<?=mini(false,		'/assets/css/framework7.bundle.min.css')?>">
	<link rel="stylesheet" href="<?=mini(false,		'/assets/css/style.css')?>">
	<link rel="stylesheet" href="<?=mini(false,		'/assets/css/app.css')?>">
	<link rel="stylesheet" href="<?=mini(false,		'/assets/css/comments.css')?>">
	<link rel="stylesheet" href="<?=mini(false,		'/assets/css/comments.dark.css')?>">
</head>

<body style="">
<div id="app">
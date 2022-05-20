<?php

namespace KasimirJS\Elements;

require __DIR__ . "/../vendor/autoload.php";

header("Content-Type: text/javascript");

$data = KasimirLoader::Load();
if ($data !== file_get_contents(__DIR__ . "/kasimir-elements.js"))
    file_put_contents(__DIR__ . "/kasimir-elements.js", $data);


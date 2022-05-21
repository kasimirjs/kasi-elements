<?php

namespace KasimirJS\Elements;

class KasimirLoader
{


    const MAP = [
        "core/init.js",
        "elements/inline-template.js",
        "elements/include.js",

        "styles/init.js",
        "styles/bootstrap5-modal.js",

        "helper/loader.js",
        "helper/action-button.js",
        "helper/modal.js",

    ];


    public static function Load()
    {
        $output = "/* KasimirJS EMBED - documentation: https://kasimirjs.infracamp.org - Author: Matthias Leuffen <m@tth.es>*/\n";
        foreach (self::MAP as $value) {
            $output .= "\n/* from $value */\n";
            $output .= file_get_contents(__DIR__ . "/" . $value);
        }
        return $output;
    }

}

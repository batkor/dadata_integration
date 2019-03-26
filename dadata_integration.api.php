<?php

/**
 * @file
 *
 * Hooks for dadata_integration module.
 */

/**
 * @addtogroup hooks
 * @{
 */

/**
 * Alter messages being added to page.
 *
 * @param array $messages
 *   Array with messages.
 */
function hook_dadata_attach_alter(array &$attachments) {
  $attachments['#attached']['drupalSettings']['dadata'] = [
    'builder' => [
      'path' => "/you/path/to/js/file/for/dadata_init.js",
      'style' => "/you/path/to/css/file/for/dadata.css",
      'elements' => [
        // Array you elements.
      ],
      'is_attach' => FALSE, // attached status
    ],
    'api_key' => "you_dadata_api_key",
  ];
}

/**
 * @} End of "addtogroup hooks".
 */
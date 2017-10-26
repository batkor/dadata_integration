<?php

namespace Drupal\dadata_integration\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Prophecy\Util\StringUtil;

class DadataIntegrationAutocomplete {

  public function autocomplete(Request $request, $type_field = FALSE, $count = 0) {
    $matches = [];
    $input_string = $request->get('q', FALSE);
    if ($input_string && $type_field && $count) {
      $results = $this->getData($input_string, $type_field, $count);
      foreach ($results as $result) {
        $matches[] = ['value' => $result->value, 'label' => $result->value];
      }
    }

    return new JsonResponse($matches);
  }

  private function getData($input_string = '', $type_field = '', $count = 5) {
    $results = [];
    if (!empty($type_field) && $header_request = $this->getHeaderRequest()) {
      $data_request = '{"query":"' . $input_string . '","count":' . $count . '}';
      $url = $this->getUrlData($type_field);
      $client = \Drupal::httpClient();
      try {
        $request = $client->post($url, [
            'headers' => $header_request,
            'body' => $data_request,
          ]
        );
        $result = $request->getBody()->getContents();
        $results = json_decode($result)->suggestions;
      } catch (RequestException $e) {
        watchdog_exception('dadata_integration', $e);
      }
    }

    return $results;
  }

  private function getUrlData($type_field) {
    $urls = [
      'address' => 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
      'fio' => 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio',
      'party' => 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party',
      'bank' => 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/bank',
    ];

    return $urls[$type_field];
  }

  private function getHeaderRequest() {
    $result = FALSE;
    $config = \Drupal::getContainer()->get('config.factory')
      ->getEditable('dadata_integration.import');
    $api_key = $config->get('api_key', FALSE);
    if ($api_key) {
      $result = [
        'Content-Type' => 'application/json',
        'Accept' => 'application/json',
        'Authorization' => 'Token ' . trim($api_key),
      ];
    }

    return $result;
  }

}
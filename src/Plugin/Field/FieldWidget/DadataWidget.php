<?php

/**
 * @file
 * This DadataWidget for field.
 */

namespace Drupal\dadata_integration\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CssCommand;

/**
 * Plugin implementation of the 'dadata_widget' widget.
 *
 * @FieldWidget(
 *   id = "dadata_widget",
 *   label = @Translation("Dadata widget"),
 *   field_types = {
 *     "string"
 *   }
 * )
 */
class DadataWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {

    return [
        'type_field' => 'none',
        'type_api' => 'suggest',
        'count_item' => 5,
        'type_field_address' => TRUE,
      ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $config = \Drupal::getContainer()->get('config.factory')
      ->getEditable('dadata_integration.import');
    $api_key = $config->get('api_key', FALSE);

    if ($api_key) {
      $element['type_api'] = [
        '#type' => 'select',
        '#title' => t('Type API service'),
        '#description' => t('Selected API service Dadata.'),
        '#options' => [
          'suggest' => t('Suggest'),
        ],
        '#default_value' => $this->getSetting('type_api'),
        '#required' => TRUE,
        '#disabled' => TRUE,
      ];

      $element['type_field'] = [
        '#type' => 'select',
        '#title' => t('Type field service'),
        '#description' => t('Selected type field service Dadata.'),
        '#options' => $config->get('type_field'),
        '#default_value' => $this->getSetting('type_field'),
        '#required' => TRUE,
        '#ajax' => [
          'callback' => 'Drupal\dadata_integration\Plugin\Field\FieldWidget\DadataWidget::changeTypeField',
          'event' => 'change',
        ],
      ];
      $element['type_field_address'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('Input address popup windows'),
        '#default_value' => $this->getSetting('type_field_address'),
        '#wrapper_attributes' => [
          'class' => [
            $this->getSetting('type_field') == 'address' ? '' : 'hidden',
            'type_field_address',
          ],
        ],
      ];
      $element['count_item'] = [
        '#type' => 'number',
        '#title' => t('Count items'),
        '#description' => t('Count items is service Dadata.'),
        '#default_value' => $this->getSetting('count_item'),
        '#required' => TRUE,
      ];
    }
    else {
      $element['status_messages'] = [
        '#type' => 'html_tag',
        '#tag' => 'p',
        '#value' => $this->t('You have not entered the key of the IPA, <a href="/admin/config/user-interface/dadata_integration" target="_blank">please enter your key here</a>'),
      ];
    }
    return $element;

  }

  /**
   * Ajax function change type field select.
   */
  public function changeTypeField(array &$form, FormStateInterface $form_state) {
    $response = new AjaxResponse();
    $style = ['display' => 'none'];
    if ($form_state->getValues()['fields']['field_address']['settings_edit_form']['settings']['type_field'] == 'address') {
      $style = ['display' => 'block'];
    }
    $response->addCommand(new CssCommand('.type_field_address', $style));
    return $response;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];

    $summary[] = t('API Dadata: @type_api <br> Type service: @type_field <br> Count items: @count_item',
      [
        '@type_field' => $this->getSetting('type_field'),
        '@type_api' => $this->getSetting('type_api'),
        '@count_item' => $this->getSetting('count_item'),
      ]
    );

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {

    $elem = [
      '#type' => 'textfield',
      '#default_value' => isset($items[$delta]->value) ? $items[$delta]->value : NULL,
    ];

    if ($this->getSetting('type_field_address')) {
      $elem += [
        '#wrapper_attributes' => [
          'class' => ['input_popup_address_' . $delta],
        ],
      ];
      $config = \Drupal::getContainer()->get('config.factory')
        ->getEditable('dadata_integration.import');
      $api_key = $config->get('api_key', FALSE);
      $form['#attached']['library'][] = 'dadata_integration/dadata_integration_lib';
      $form['#attached']['drupalSettings']['dadata_integration']['api_key'] = $api_key;
    }
    else {
      $elem += [
        '#autocomplete_route_name' => 'dadata_integration.autocomplete',
        '#autocomplete_route_parameters' => [
          'type_field' => $this->getSetting('type_field'),
          'count' => $this->getSetting('count_item'),
        ],
      ];
    }

    $element += $elem;

    return ['value' => $element];
  }

}

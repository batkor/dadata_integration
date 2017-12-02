<?php

/**
 * @file
 * This DadataWidget for field email.
 */

namespace Drupal\dadata_integration\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'dadata_widget_email' widget.
 *
 * @FieldWidget(
 *   id = "dadata_widget_email",
 *   label = @Translation("Dadata widget email"),
 *   field_types = {
 *     "email"
 *   }
 * )
 */
class DadataWidgetEmail extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {

    return [
      'type_field' => 'email',
      'type_api' => 'suggest',
      'count_item' => 5,
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
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
      '#options' => [
        'email' => 'Email',
      ],
      '#default_value' => $this->getSetting('type_field'),
      '#required' => TRUE,
      '#disabled' => TRUE,
    ];
    $element['count_item'] = [
      '#type' => 'number',
      '#title' => t('Count items'),
      '#description' => t('Count items is service Dadata.'),
      '#default_value' => $this->getSetting('count_item'),
      '#required' => TRUE,
    ];

    return $element;
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

    $element += [
      '#type' => 'textfield',
      '#default_value' => isset($items[$delta]->value) ? $items[$delta]->value : NULL,
      '#autocomplete_route_name' => 'dadata_integration.autocomplete',
      '#autocomplete_route_parameters' => [
        'type_field' => $this->getSetting('type_field'),
        'count' => $this->getSetting('count_item'),
      ],
    ];

    return ['value' => $element];
  }

}

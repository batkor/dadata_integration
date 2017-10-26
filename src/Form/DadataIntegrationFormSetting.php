<?php

/**
 * @file
 * The form setting.
 */

namespace Drupal\dadata_integration\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class ImportContactForm.
 *
 * @package Drupal\dadata_integration\Form
 */
class DadataIntegrationFormSetting extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['dadata_integration.import'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'dadata_integration_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $config = $this->config('dadata_integration.import');

    $form['api_key'] = [
      '#title' => $this->t('API key'),
      '#type' => 'textfield',
      '#default_value' => $config->get('api_key') ? $config->get('api_key') : NULL,
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);
    $config = $this->config('dadata_integration.import');
    $config->set('api_key', $form_state->getValue('api_key'));
    $config->save();
  }

}

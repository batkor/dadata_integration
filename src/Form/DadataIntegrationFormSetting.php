<?php

/**
 * @file
 * The form setting.
 */

namespace Drupal\dadata_integration\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Serialization\Yaml;

/**
 * Class DadataIntegrationFormSetting.
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

    $output = Yaml::encode($config->getOriginal());

    $form['config'] = array(
      '#type' => 'textarea',
      '#title' => $this->t('Config'),
      '#default_value' => $output,
      '#rows' => 36,
      '#required' => TRUE,
    );

    return parent::buildForm($form, $form_state);
  }

  public function validateForm(array &$form, FormStateInterface $form_state) {
    $new_value = Yaml::decode($form_state->getValue('config'));
    if (is_array($new_value)) {
      $form_state->setValue('new_value', $new_value);
    }
    else {
      $form_state->setErrorByName('config', $this->t('Invalid input'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('dadata_integration.import');
    $config->setData($form_state->getValue('new_value'));
    $config->save();
    parent::submitForm($form, $form_state);
  }

}

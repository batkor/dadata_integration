<?php

/**
 * @file
 * The form setting.
 */

namespace Drupal\dadata_integration\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

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
    $form['#tree'] = TRUE;
    $form['container'] = [
      '#type' => 'vertical_tabs',
    ];
    $form['main_tab'] = [
      '#type' => 'details',
      '#title' => $this->t('Main settings'),
      '#group' => 'container',
    ];
    $form['main_tab']['api_key'] = [
      '#title' => $this->t('API key'),
      '#type' => 'textfield',
      '#default_value' => $config->get('api_key') ? $config->get('api_key') : NULL,
      '#description' => $this->t('Your IP address is the key. if you do not have it then get it <a href="https://dadata.ru/" target="_blank">https://dadata.ru</a>'),
    ];
    $form['form_reg_tab'] = [
      '#type' => 'details',
      '#title' => $this->t('Forms'),
      '#group' => 'container',
    ];
    $form['form_reg_tab']['status_messages'] = [
      '#type' => 'html_tag',
      '#tag' => 'p',
      '#value' => $this->t('Section in the development. You can contact us for individual development'),
    ];


    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);
    $config = $this->config('dadata_integration.import');
    $config->set('api_key', $form_state->getValue(['main_tab', 'api_key']));
    $config->save();

  }

}

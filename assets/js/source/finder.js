import Drupal from 'drupalCore';
import drupalSettings from 'drupalSettingsCore';


Drupal.behaviors.DataInit = {
  attach: function (context, settings) {
    context = context || document;
    settings = settings || drupalSettings;

    if (!settings.dadata.api_key) {
      console.error(Drupal.t('Dadata_integration: Not set API key'));
      return;
    }

    // Find element for attach builder.
    let elements = settings.dadata.builder.elements;
    let call_builder = false;
    for (let key of Object.keys(elements)) {
      let query_result = context.querySelectorAll(elements[key].selector);
      if (query_result.length) {
        call_builder = true;
        elements[key]['is_found'] = true;
      }
    }
    // Attach builder.
    if (call_builder && !settings.dadata.builder.is_attach) {
      let builder = document.createElement("script");
      builder.src = settings.dadata.builder.path;
      document.body.appendChild(builder);
      builder.onload = () => {
        Drupal.behaviors.DadataInit.attach(context, settings, elements);
        settings.dadata.builder.is_attach = true;
      };
    }
    // Attach style
    let css_id = 'dadata_style';
    if (!document.getElementById(css_id) && settings.dadata.builder.style)
    {
      var link  = document.createElement('link');
      link.id   = css_id;
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = settings.dadata.builder.style;
      link.media = 'all';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }
};
import Drupal from 'drupalCore';
import drupalSettings from 'drupalSettingsCore';


Drupal.behaviors.DataInit = {
  attach: function (context, settings) {
    context = context || document;
    settings = settings || drupalSettings;

    let elems = context.querySelectorAll('.dd-email');
    if (elems.length && !settings.dadata.builder.is_attach){
      let builder = document.createElement("script");
      builder.src = settings.dadata.builder.path;
      document.body.appendChild(builder);
      builder.onload = () => {
        Drupal.behaviors.DadataInit.attach(context, settings)
      };
      settings.dadata.builder.is_attach = true;
    }

  }
};
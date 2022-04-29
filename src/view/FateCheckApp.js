import { SvelteApplication }  from '@typhonjs-fvtt/runtime/svelte/application';

import FateCheck          from './FateCheck.svelte';

export default class FateCheckApp extends SvelteApplication
{
   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */
   static get defaultOptions()
   {
      return foundry.utils.mergeObject(super.defaultOptions, {
         title: 'Fate',  // Automatically localized from `lang/en.json`.
         id: 'fatecheck',
         width: 'auto',
         popOut: false,
         height: 'auto',

         svelte: {
            class: FateCheck,
            target: document.body
         }
      });
   }
}
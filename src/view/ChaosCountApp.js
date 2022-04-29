import { SvelteApplication }  from '@typhonjs-fvtt/runtime/svelte/application';

import ChaosCounter          from './ChaosCounter.svelte';

export default class ChaosCountApp extends SvelteApplication
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
         title: 'Chaos',  // Automatically localized from `lang/en.json`.
         id: 'chaoscounter',
         width: 'auto',
         headerButtonNoClose: true,
         popOut: false,
         height: 'auto',
 
         svelte: {
            class: ChaosCounter,
            target: document.body
         }
      });
   }
}
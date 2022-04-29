import { SvelteApplication }  from '@typhonjs-fvtt/runtime/svelte/application';

import Meaning          from './Meaning.svelte';

export default class MeaningApp extends SvelteApplication
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
         title: 'Meanings',  // Automatically localized from `lang/en.json`.
         id: 'meaning',
         width: 'auto',
         popOut: false,
         height: 'auto',

         svelte: {
            class: Meaning,
            target: document.body
         }
      });
   }
}
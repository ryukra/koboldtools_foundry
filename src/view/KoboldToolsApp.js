import { SvelteApplication, TJSDialog }                   from '@typhonjs-fvtt/runtime/svelte/application';
   

import KoboldTools from './KoboldTools.svelte';
import FateCheckApp from './FateCheckApp.js';
import RollManager from './RollManager.js';
import MeaningApp from './MeaningApp';

export default class KoboldToolsApp extends SvelteApplication
{
   /**
    * @inheritDoc
    */
   constructor(options = {}) { super(options); }

   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */
   static get defaultOptions()
   {
      return foundry.utils.mergeObject(super.defaultOptions, {
         id: 'koboldtoolsapp',
         headerButtonNoClose: true,
         resizable: false,
         minimizable: true,
         popOut: false,
         width: 'auto',
         height: 'auto',
         title: 'Koboldtools',

         svelte: {
            class: KoboldTools,
            target: document.body,
            intro: false,
            props: {
               buttons: [
                  { title: 'FATE', class: FateCheckApp },
                  { title: 'MEANING', class: MeaningApp },
                  
               ]
            }
         }
      });
   }
}
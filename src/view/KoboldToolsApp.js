import { SvelteApplication, TJSDialog }                   from '@typhonjs-fvtt/runtime/svelte/application';
   

import KoboldTools from './KoboldTools.svelte';
import FateCheckApp from './FateCheckApp.js';
import RollManager from './RollManager.js';
import MeaningApp from './MeaningApp';
import ThreadTracker from './ThreadTrackerApp';
let boardrect;
Hooks.once('ready', () =>
{
   boardrect = document.querySelector('#board').getBoundingClientRect();
});
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
                  { title: 'FATE', left: 10, top: boardrect.height - 400, class: FateCheckApp },
                  { title: 'MEANING', left: 218, top: boardrect.height - 150, class: MeaningApp },
                  { title: 'THREADS', left: 218, top: boardrect.height - 400, class: ThreadTracker },
                  { title: 'SCENE', onclick: () => 
                     {
                        const roll = new Roll("1d10");
                        const chaos = game.settings.get('koboldtools_foundry', 'chaos');
                        roll.evaluate();
                        const isOdd = Math.abs(roll.result % 2) === 1;
                        if (roll.result > chaos)
                        {
                           ChatMessage.create({ user: game.user.id, content: "Scene is as expected." });
                        }
                        if (roll.result <= chaos)
                        {
                           if (isOdd)
                           {
                              ChatMessage.create({ user: game.user.id, content: "Scene was altered!" });
                           }
                           else
                           {
                              ChatMessage.create({ user: game.user.id, content: "Scene was interupted!" });
                           } 
                        }
                     }
                  }
                  
               ]
            }
         }
      });
   }
}
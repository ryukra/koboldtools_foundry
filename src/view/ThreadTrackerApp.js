import { SvelteApplication }  from '@typhonjs-fvtt/runtime/svelte/application';
import ThreadTracker from './ThreadTracker.svelte';

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
         title: 'Threads',  // Automatically localized from `lang/en.json`.
         id: 'threadtracker',
         width: 'auto',
         popOut: false,
         height: 'auto',

         svelte: {
            class: ThreadTracker,
            target: document.body
         }
      });
      
   }
   _getHeaderButtons()
   {
      const buttons = super._getHeaderButtons();

      buttons.unshift({
         class: 'theme-dark',
         icon: 'fas fa-plus',
         title: 'Add Thread',
         styles: { color: 'white' },

         onclick: function()
         {
            let folder = game.journal.directory.folders.find((f) => f.name === "Threads");
            const newJournalEntry = JournalEntry.create({
                name: 'New Thread',
                folder
              });
         }
      });

      return buttons;
   }
}
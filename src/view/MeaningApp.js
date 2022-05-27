import { SvelteApplication }  from '@typhonjs-fvtt/runtime/svelte/application';
import { SessionStorage }     from '@typhonjs-fvtt/runtime/svelte/store';
import Meaning          from './Meaning.svelte';

const storage = new SessionStorage();
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
   _getHeaderButtons()
   {
      const buttons = super._getHeaderButtons();

      let edit = storage.getItem("edit");

      buttons.unshift({
         class: 'theme-dark',
         icon: 'fas fa-eraser',
         title: edit ? 'Editmode enabled' : 'Editmode disable',
         styles: edit ? { color: 'white' } : { color: 'gray' },

         onclick: function()
         {
            edit = storage.swapItemBoolean("edit");

            this.title = edit ? 'Editmode enabled' : 'Editmode disable';
            this.styles = edit ? { color: 'white' } : { color: 'gray' };
            Hooks.call('editmode');
         }
      });

      return buttons;
   }
}
import KoboldToolsApp from './view/KoboldToolsApp.js';
import ChaosCountApp from './view/ChaosCountApp.js';
import { KoboldToolsLayer } from './KoboldToolsLayer.js';
import ChatVote from './view/ChatVote.svelte';
import FateCheckApp from './view/FateCheckApp.js';
import MeaningApp from './view/MeaningApp';
import ThreadTrackerApp from './view/ThreadTrackerApp';
const sidebarRect = document.querySelector('#sidebar').getBoundingClientRect();

Hooks.once('ready', () =>
{
   new ChaosCountApp({ left: sidebarRect.x - 100, top: sidebarRect.y }).render(true, { focus: true });
});
Hooks.on("getSceneControlButtons", (controls) => {
   controls.push({ 
      name: 'koboldtools', 
      title: 'Koboldtools', 
      layer: 'koboldt', 
      icon: 'fas fa-dragon', 
      visible: true,
      tools: [
         {
            name: "openall",
            title: "Open All",
            icon: 'fas fa-box-open',
            onClick: async () => {
               new FateCheckApp({ left: 10, top: sidebarRect.height - 400 }).render(true, {focus: true});
               new MeaningApp({ left: 218, top: sidebarRect.height - 150 }).render(true, {focus: true});
               new ThreadTrackerApp({ left: 218, top: sidebarRect.height - 400 }).render(true, {focus: true});
            },
            button: true,
         },
         {
            name: "fate",
            title: "FateCheck",
            icon: 'fas fa-question',
            onClick: async () => {
               new FateCheckApp({left: 10, top: sidebarRect.height - 400}).render(true, {focus: true});
            },
            button: true,
         },
         {
            name: "meaning",
            title: "MeaningTool",
            icon: 'fas fa-dice',
            onClick: async () => {
               new MeaningApp({ left: 218, top: sidebarRect.height - 150 }).render(true, {focus: true});
            },
            button: true,
         },
         {
            name: "threads",
            title: "ThreadTracker",
            icon: 'fas fa-list',
            onClick: async () => {
               new ThreadTrackerApp({ left: 218, top: sidebarRect.height - 400 }).render(true, {focus: true});
            },
            button: true,
         },
      ]
   });
});
 
Hooks.once("init", async () => 
   {
      const layers = { koboldt: { layerClass: KoboldToolsLayer, group: "primary" } };
      CONFIG.Canvas.layers = foundry.utils.mergeObject(Canvas.layers, layers);
      game.settings.register("koboldtools_foundry", "voting", {
      name: "Enable Voting",
      hint: "A description of the registered setting and its behavior.",
      scope: "client",
      config: true,
      type: String,
      choices: {
         a: "enable",
         b: "disable"
      },
      default: "a",
      onChange: (value) => console.log(value)
      });
      game.settings.register('koboldtools_foundry', 'chaos', {
         name: 'Chaos',
         hint: 'Chaos',
         scope: 'world',     // "world" = sync to db, "client" = local storage
         config: false,       // false if you dont want it to show in module config
         type: Number,       // Number, Boolean, String,
         default: 0,
         onChange: () => 
         { // value is the new value of the setting
           Hooks.call('chaos');
         }  // set true with a String `type` to use a file picker input
      });
      game.settings.register('koboldtools_foundry', 'eventcheck', {
         name: 'eventcheck',
         hint: 'eventcheck',
         scope: 'world',     // "world" = sync to db, "client" = local storage
         config: false,       // false if you dont want it to show in module config
         type: String,
         default: "",  
      });
      game.settings.register('koboldtools_foundry', 'detail', {
         name: 'detailcheck',
         hint: 'detailcheck',
         scope: 'world',     // "world" = sync to db, "client" = local storage
         config: false,       // false if you dont want it to show in module config
         type: String,
         default: "",  
      });
      game.settings.register('koboldtools_foundry', 'storydice', {
         name: 'detailcheck',
         hint: 'detailcheck',
         scope: 'world',     // "world" = sync to db, "client" = local storage
         config: false,       // false if you dont want it to show in module config
         type: String,
         default: "",  
      });
      game.settings.register('koboldtools_foundry', 'descriptors', {
         name: 'descriptors',
         hint: 'descriptors',
         scope: 'world',     // "world" = sync to db, "client" = local storage
         config: false,       // false if you dont want it to show in module config
         type: Array,
         default: [],  
      });
   }
);
Hooks.on('renderChatMessage', (message, html) =>
{
   const flagData = message.getFlag('koboldtools_foundry', 'vote');

   if (typeof flagData === 'object')
   {
      new ChatVote({ target: html[0], props: flagData });
   }
});

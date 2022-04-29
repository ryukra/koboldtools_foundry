import KoboldToolsApp from './view/KoboldToolsApp.js';
import ChaosCountApp from './view/ChaosCountApp.js';
const sidebarRect = document.querySelector('#sidebar').getBoundingClientRect();
Hooks.once('ready', () =>
{
   
   new KoboldToolsApp({ left: 20, bottom: 200  }).render(true, { focus: true });
});

Hooks.once('ready', () =>
{
   new ChaosCountApp({ left: sidebarRect.x - 100, top: sidebarRect.y }).render(true, { focus: true });
});
Hooks.once("init", async () => 
   {
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
         name: 'detail',
         hint: 'detail',
         scope: 'world',     // "world" = sync to db, "client" = local storage
         config: false,       // false if you dont want it to show in module config
         type: String,
         default: "",  
      });
      game.settings.register('koboldtools_foundry', 'action', {
         name: 'detail',
         hint: 'detail',
         scope: 'world',     // "world" = sync to db, "client" = local storage
         config: false,       // false if you dont want it to show in module config
         type: String,
         default: "",  
      });
      game.settings.register('koboldtools_foundry', 'descriptor', {
         name: 'detail',
         hint: 'detail',
         scope: 'world',     // "world" = sync to db, "client" = local storage
         config: false,       // false if you dont want it to show in module config
         type: String,
         default: "",  
      });
      game.settings.register('koboldtools_foundry', 'npcs', {
         name: 'detail',
         hint: 'detail',
         scope: 'world',     // "world" = sync to db, "client" = local storage
         config: false,       // false if you dont want it to show in module config
         type: Array,
         default: [],  
      });
      game.settings.register('koboldtools_foundry', 'pcs', {
         name: 'detail',
         hint: 'detail',
         scope: 'world',     // "world" = sync to db, "client" = local storage
         config: false,       // false if you dont want it to show in module config
         type: Array,
         default: [],  
      });
      game.settings.register('koboldtools_foundry', 'threads', {
         name: 'detail',
         hint: 'detail',
         scope: 'world',     // "world" = sync to db, "client" = local storage
         config: false,       // false if you dont want it to show in module config
         type: Array,
         default: ['Name', 'Name'],  
      });
   }
);


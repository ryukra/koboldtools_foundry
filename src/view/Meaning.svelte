<script>
   import { TJSApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
   import RollManager from './RollManager.js';
   import Slider from '@bulatdashiev/svelte-slider';
   import { update_await_block_branch } from 'svelte/internal';
   export let elementRoot;
   let eventcheck;
   let detail;
   let action;
   let descriptor;
   let npcs;
   let threads;
   let pcs;
   let lastevent;
   let question;
   npcs = game.settings.get('koboldtools_foundry','npcs');
   threads = game.settings.get('koboldtools_foundry','threads');
   pcs = game.settings.get('koboldtools_foundry','pcs');
   try{
      eventcheck = game.tables.find(entry => entry.id === game.settings.get("koboldtools_foundry",'eventcheck'));
      detail = game.tables.find(entry => entry.id === game.settings.get("koboldtools_foundry",'detail'));
   } catch(error){
      alert("please insert rolltables under meaning");
   }
   
   function onDrop(event)
   {
   // `active` tag must be `true` to handle drop events. The TinyMCE plugin sets this attribute when in edit mode.
   // It may also be manually set in tag markup or by `setAttribute` on the element. if (active !== 'true') { return; }
   let test = JSON.parse(event.dataTransfer.getData('text/plain'))
   if(test.type === "RollTable")
   {
      let table = game.tables.find(entry => entry.id === test.id);
         if(typeof table === 'object'){
            if(table.name.includes("Event")){
               eventcheck = table;
               game.settings.set("koboldtools_foundry",'eventcheck', table.id);
            }
            if(table.name.includes("Detail")){
               detail = table;
               game.settings.set("koboldtools_foundry",'detail', table.id);
            }
         }  
   }
   
   
   }
   
   async function eventCheck(){
      let roll = await eventcheck.draw({displayChat: false});
      let text = await roll.results[0].data.text;
      let output = text;
      let target = "";
      let result = text.match(/NPC|PC|THREAD/i);
      if(lastevent == text){
         eventCheck();
         return;
      }
      lastevent = text;
      let folder;
      try{
         switch(result[0].toLowerCase()){
            case 'npc':
               folder = game.actors.directory.folders.find((f) => f.name === "NPC");
               
               if(folder.content.length > 0){
                  let randomNPC = folder.content[Math.floor(Math.random() * folder.content.length)];
                  target = randomNPC.name;
               }
               else{
                  target = "Create NPC instead";
               }
               break;
            case 'pc':
               folder = game.actors.directory.folders.find((f) => f.name === "PC");
               
               if(folder.content.length > 0){
                  let randomPC = folder.content[Math.floor(Math.random() * folder.content.length)];
                  target = randomPC.name;
               }
               else{
                  target = "dummsack, mach erstmal einen PC lol";
               }
               
               break;
            case 'thread':
               folder = game.journal.directory.folders.find((f) => f.name === "_fql_quests");
               let activethreads = [];
               folder.content.forEach(element => {
                  let content = element.getFlag('forien-quest-log','json');
                  if(content.status == 'active'){
                     activethreads.push(content);
                  }
               });
               if(activethreads.length > 0){
                  let randomthread = activethreads[Math.floor(Math.random() * activethreads.length)];
                  target = randomthread.name;
               }
               else{
                  target = "Open a new Thread instead";
               }
               
               break;
            default:
               break;
         }
      }catch(error){

      }
         
      if(output!=""){
         const rendered_html = await renderTemplate('./modules/koboldtools_foundry/template/CheckEvent.hbs', {output: output, target: target});
         const message = await ChatMessage.create({ user: game.user.id, content: rendered_html});
         await message.setFlag('koboldtools_foundry', 'data', { output: output, target: target});
      }
      
      
   }
   async function detailCheck(){
      let chaos = game.settings.get('koboldtools_foundry','chaos');
      let roll;
      if(chaos == 6){
         roll = new Roll("1d20-2");
      }
      if(chaos == 3){
         roll = new Roll("1d20+2");
      }
      let check = await detail.draw({roll: roll, displayChat:false});
      let text = await check.results[0].data.text;
      let output = text;
      let target = "";
      let result = text.match(/NPC|PC|THREAD/i);
      let folder;
      try{
         switch(result[0].toLowerCase()){
            case 'npc':
               folder = game.actors.directory.folders.find((f) => f.name === "NPC");
               
               if(folder.content.length > 0){
                  let randomNPC = folder.content[Math.floor(Math.random() * folder.content.length)];
                  target = randomNPC.name;
               }
               else{
                  target = "Create NPC instead";
               }
               break;
            case 'pc':
               folder = game.actors.directory.folders.find((f) => f.name === "PC");
               
               if(folder.content.length > 0){
                  let randomPC = folder.content[Math.floor(Math.random() * folder.content.length)];
                  target = randomPC.name;
               }
               else{
                  target = "dummsack, mach erstmal einen PC lol";
               }
               
               break;
            case 'thread':
               folder = game.journal.directory.folders.find((f) => f.name === "_fql_quests");
               let activethreads = [];
               folder.content.forEach(element => {
                  let content = element.getFlag('forien-quest-log','json');
                  if(content.status == 'active'){
                     activethreads.push(content);
                  }
               });
               if(activethreads.length > 0){
                  let randomthread = activethreads[Math.floor(Math.random() * activethreads.length)];
                  target = randomthread.name;
               }
               else{
                  target = "Open a new Thread instead";
               }
               
               break;
            default:
               break;
         }
      }catch(error){

      }
      if(output!=""){
         const rendered_html = await renderTemplate('./modules/koboldtools_foundry/template/CheckDetail.hbs', {output: output, target: target});
         const message = await ChatMessage.create({ user: game.user.id, content: rendered_html});
         await message.setFlag('koboldtools_foundry', 'data', { output: output, target: target});
      }
   }
   async function rollAction(){
      let folder = game.tables.directory.folders.find((f) => f.name === "Action");
      if(folder.content.length > 0){
         let randomtable = folder.content[Math.floor(Math.random() * folder.content.length)];
         let roll = await randomtable.draw({displayChat: false});
         let meanings = await roll.results[0].data.text;
         randomtable = folder.content[Math.floor(Math.random() * folder.content.length)];
         roll = await randomtable.draw({displayChat: false});
         meanings += " ";
         meanings += await roll.results[0].data.text;
         const rendered_html = await renderTemplate('./modules/koboldtools_foundry/template/MeaningsAction.hbs', {meanings: meanings});
         const message = await ChatMessage.create({ user: game.user.id, content: rendered_html});
         await message.setFlag('koboldtools_foundry', 'data', { meanings:meanings});
      }
   }
   async function rollDescriptor(){
      let folder = game.tables.directory.folders.find((f) => f.name === "Descriptor");
      if(folder.content.length > 0){
         let randomtable = folder.content[Math.floor(Math.random() * folder.content.length)];
         let roll = await randomtable.draw({displayChat: false});
         let meanings = await roll.results[0].data.text;
         randomtable = folder.content[Math.floor(Math.random() * folder.content.length)];
         roll = await randomtable.draw({displayChat: false});
         meanings += " ";
         meanings += await roll.results[0].data.text;
         const rendered_html = await renderTemplate('./modules/koboldtools_foundry/template/MeaningsDescriptor.hbs', {meanings: meanings});
         const message = await ChatMessage.create({ user: game.user.id, content: rendered_html});
         await message.setFlag('koboldtools_foundry', 'data', { meanings:meanings});
      }
   }
   async function createMessage(o,t)
   {
      const rendered_html = await renderTemplate('./modules/koboldtools_foundry/template/Checks.hbs', {output: o, target:t});
      const message = await ChatMessage.create({ user: game.user.id, content: rendered_html});
      await message.setFlag('koboldtools_foundry', 'data', { output: o, target:t});
   }
</script>

<svelte:options accessors={true}/>

<TJSApplicationShell bind:elementRoot >
   <main on:drop|preventDefault|stopPropagation={onDrop}
   on:dragover|preventDefault={()=>null}>
      
      <section>
         
         <div>
            {#if typeof eventcheck === 'object'}
               <button title="{eventcheck.name}" on:click={() => eventCheck()}>Event</button>
            {:else}
               <button disabled>Event</button>
            {/if }
         </div>
         <div>
            {#if typeof detail === 'object'}
               <button title="{detail.name}" on:click={() => detailCheck()}>Detail</button>
            {:else}
               <button disabled>Detail</button>
            {/if }
         </div>
         <div>
            <button t on:click={() => rollAction()}>Action</button>
         </div>
         <div>
            <button  on:click={() => rollDescriptor()}>Descript</button>
         </div>
         
      </section>
   </main>
</TJSApplicationShell>


<style lang="scss">
   input {
      width:96%;
      margin: 5px;
   }
   main {
   color: white;
   }
   div {
      float:left; display:inline;
   }
   button {
      width: 60px;
   }
   .container{
      background-color: red;
      height:40px;
      width:100%;
   }
</style>
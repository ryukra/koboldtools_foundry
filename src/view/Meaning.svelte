<script>
   import { TJSApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
   import { SessionStorage }     from '@typhonjs-fvtt/runtime/svelte/store';

   export let elementRoot;
   const storage = new SessionStorage();
   let eventcheck;
   let detail;
   let descriptors = [];
   let descriptor_ids = [];
   let lastevent;
   let storydice;
   let edit;
   let question;
   try{
      eventcheck = game.tables.find(entry => entry.id === game.settings.get("koboldtools_foundry",'eventcheck'));
      detail = game.tables.find(entry => entry.id === game.settings.get("koboldtools_foundry",'detail'));
      storydice = game.tables.find(entry => entry.id === game.settings.get("koboldtools_foundry",'storydice'));
      descriptor_ids = game.settings.get("koboldtools_foundry",'descriptors');
      descriptor_ids.forEach(element => {
         descriptors.push(game.tables.find(entry => entry.id === element));
         descriptors = descriptors;
      });
   } catch(error){
      alert("please insert rolltables under meaning");
   }
   Hooks.on('editmode',() =>{
      edit = storage.getItem("edit");
   })
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
               return;
            }
            if(table.name.includes("Detail")){
               detail = table;
               game.settings.set("koboldtools_foundry",'detail', table.id);
               return;
            }
            if(table.name.includes("StoryDice")){
               storydice = table;
               game.settings.set("koboldtools_foundry",'storydice', table.id);
               return;
            }
            if(!descriptors.includes(table)){
               descriptors.push(table);
               descriptor_ids.push(table.id);
               descriptors = descriptors;
               game.settings.set("koboldtools_foundry",'descriptors', descriptor_ids);
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
                  target = "Add PCs";
               }
               
               break;
            case 'thread':
               folder = game.journal.directory.folders.find((f) => f.name === "Threads");
               if(folder.content.length > 0){
                  let randomthread = folder.content[Math.floor(Math.random() * folder.content.length)];
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
               folder = game.journal.directory.folders.find((f) => f.name === "Threads");
               if(folder.content.length > 0){
                  let randomthread = folder.content[Math.floor(Math.random() * folder.content.length)];
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
   async function rollDescriptors(table){
      
      let check = await table.draw({displayChat: false});
      let text = "";
      check.results.forEach(element => {
         text += element.data.text+" ";
      });
      const rendered_html = await renderTemplate('./modules/koboldtools_foundry/template/MeaningsDescriptor.hbs', {meanings: text, type: table.name.replace(/ *\([^)]*\) */g, "")});
      const message = await ChatMessage.create({ user: game.user.id, content: rendered_html});
      await message.setFlag('koboldtools_foundry', 'data', { meanings: text});
   }
   async function removeDescriptor(table){
      descriptors = descriptors.filter(item => item.id !== table.id);
      descriptors = descriptors;
      descriptor_ids = descriptor_ids.filter(item => item !== table.id);
      game.settings.set("koboldtools_foundry",'descriptors', descriptor_ids);
   }
   async function storyDice(){
      storydice.reset();
      let roll = await storydice.drawMany(4,{displayChat: false});
      let dice = [];
      roll.results.forEach(element => {
         dice.push(element.data.text);
      });
      const rendered_html = await renderTemplate('./modules/koboldtools_foundry/template/StoryDice.hbs', {dice:dice});
      const message = await ChatMessage.create({ user: game.user.id, content: rendered_html});
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
            {#if typeof detail === 'object'}
               <button title="{detail.name}" on:click={() => detailCheck()}>Detail</button>
            {:else}
               <button disabled>Detail</button>
            {/if }
         </div>
         <div>
            <button class="fas fa-dice" on:click={() => storyDice() }></button>
         </div>
         <div> 
         {#each descriptors as button}
            <button title="{button.name}" on:click={() => rollDescriptors(button) }>{button.name.replace(/ *\([^)]*\) */g, "")} </button>{#if edit}<div style="vertical-align:top;font-size:small;" on:click={() => removeDescriptor(button) }>x</div>{/if}
         {/each}
         </div>
         
         
      </section>
   </main>
</TJSApplicationShell>


<style lang="scss">
   main {
      color: white;
   }
   div {
      display:inline;
   }
   button {
      width: auto;
      height:30px;
   }

</style>
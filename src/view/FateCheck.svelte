<script>
   import { TJSApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
   import RollManager from './RollManager.js';
	import Slider from '@bulatdashiev/svelte-slider';
   import { update_await_block_branch } from 'svelte/internal';

   export let elementRoot;
   const rm = new RollManager();
   let chaos = game.settings.get('koboldtools_foundry', 'chaos');
	let votingenabled = false;
	let vote_oods = [2,4];
	let vote_benefit = [0,1];
	let vote_benefit_avg = vote_benefit.reduce((a, b) => a + b, 0);
	vote_benefit_avg = Math.round(vote_benefit_avg/vote_benefit.length);
	let vote_odds_avg = vote_oods.reduce((a, b) => a + b, 0);
	vote_odds_avg = Math.floor(vote_odds_avg/vote_oods.length);
	let value = [3];
	let odds = ["impossible","very unlikely","unlikely","50/50","likely","very likely","has to be"];
	let odds_number = [-8,-4,-2,0,2,4,8];
	let benefit;
	let question = "";
	let answer = false;
   
   function keycontrols(event)
   {  
      if(event.keyCode == 13){
         handleFate(0);
      }
      if(event.keyCode == 40){
         if(value > 0)
            value[0] = value[0]-1;
      }
      if(event.keyCode == 38){
         if(value < 6)
            value[0] = value[0]+1;
      }
   }
	function handleFate(mod){
      benefit = mod;
      let r1 = rm.roll('1d10');
      let r2 = rm.roll('1d10');
      let roll = r1 + r2 + odds_number[value] + mod;
      let chaosroll = rm.roll('1d10');
      let exceptional = false;
      let event = false;
      if (chaosroll < 4 ) {
         if (r1 == r2) {
         exceptional = true;
         event = true;
         } else if (rm.isOdd(r1) && rm.isOdd(r2)) {
         exceptional = true;
         } else if (rm.isEven(r1) && rm.isEven(r2)) {
         event = true;
         }
      }
      if (roll > 10) {
         createMessage(question,true,event,exceptional);
      } else {
         createMessage(question,false,event,exceptional);
      }
      question = "";
      
	}
   async function createMessage(q,a,e,ex)
   {
      q = q.replace(/\?/g,'');
      const rendered_html = await renderTemplate('./modules/koboldtools_foundry/template/FateChatMessage.hbs', {odds: odds[value],question: q,answer: a, event: e, exceptional: ex, benefit: benefit});
      const message = await ChatMessage.create({ user: game.user.id, content: rendered_html});
      await message.setFlag('koboldtools_foundry', 'data', { question: q, answer: a, event: e, exceptional: ex });
   }
   Hooks.on("chaos", async function () {
      chaos = game.settings.get('koboldtools_foundry', 'chaos');
   });

   async function vote(){
      const message = await ChatMessage.create({ user: game.user.id });
      await message.setFlag('koboldtools_foundry', 'vote', {question: question});
   }
</script>

<svelte:options accessors={true}/>

<TJSApplicationShell bind:elementRoot >
   <main>
      <div>
         <p>
            Question
         </p>
         <input on:keydown={keycontrols} bind:value={question}>
         {#if !votingenabled}
         <p style="text-align:center">
            {odds[value]}
         </p>
         <Slider max="6" step="1" bind:value />
         {/if}
      </div>
      <div>
         <button on:click={() => handleFate(0)}>
            FATE
         </button>
         {#if !votingenabled && chaos == 3 || chaos == 6}
         <div>
            <button style="width:49%" on:click={() => handleFate(-2)}>
               -2
            </button>
            <button style="width:49%" on:click={() => handleFate(2)}>
               +2
            </button>
         </div>
         {/if}
      </div>
      {#if votingenabled}
      <div>
         <button on:click={() => vote()}>Vote</button>
      </div>
      {/if}
   </main>
</TJSApplicationShell>


<style lang="scss">
   main {
     color: white;
   }
</style>
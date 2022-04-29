<script>
   import { TJSApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
   export let elementRoot;
   let chaos;
   let userlevel = game.user.isGM;
   let color = [0,0,0,"lime","green","orange","red"]
   function changeChaos(n){
      if(chaos+n<7 && chaos+n > 2){
         game.settings.set('koboldtools_foundry', 'chaos', chaos+n);
         chaos = chaos+n;

      }
   }
   chaos = game.settings.get('koboldtools_foundry', 'chaos');
   if(chaos == 0){
      game.settings.set('koboldtools_foundry', 'chaos', 4);
      chaos = 4;
   }
   Hooks.on("chaos", async function () {
      chaos = game.settings.get('koboldtools_foundry', 'chaos');
   });
</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<TJSApplicationShell bind:elementRoot >
  <main style="color: {color[chaos]}" >
     {chaos}
     {#if userlevel }
     <div>
         <button on:click={() => changeChaos(-1)}>-</button>
         <button on:click={() => changeChaos(1)}>+</button>
      </div>
      {/if}
     
  </main>
</TJSApplicationShell>

<style lang="scss">
  main {
     text-align:center;
     font-size:70px;
     line-height:40px;
     min-height:60px;
     
  }
  button {
     width:30px;
  }
</style>
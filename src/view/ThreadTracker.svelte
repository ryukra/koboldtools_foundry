<script>
    import { TJSApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
    export let elementRoot;
    let folder = game.journal.directory.folders.find((f) => f.name === "Threads");
    let threads = folder.content;
    async function openThread(thread){
        thread.sheet.render(true);
    }
    function deleteThread(thread){
        thread.delete();
    }
    Hooks.on('renderJournalDirectory', () => {
        folder = game.journal.directory.folders.find((f) => f.name === "Threads");
        threads = folder.content;
    })
 </script>
 
 <!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
 <svelte:options accessors={true}/>
 
 <!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
 <!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
 <TJSApplicationShell bind:elementRoot >
   <main>
        <ul>
            {#each threads as thread}
                <li> <div style="width:200px;" on:click={() => openThread(thread) }>{thread.name}</div><div class="fas fa-trash-alt" on:click={() => deleteThread(thread) }></div></li>
            {/each}
        </ul>
   </main>
 </TJSApplicationShell>
 
 <style lang="scss">
    div {
        display:inline-block;
    }
    main {
        
        color:white;
    }
 </style>
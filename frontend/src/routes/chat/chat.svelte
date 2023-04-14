<script lang="ts">
	import { tick } from "svelte";
  import { env } from '$env/dynamic/public';

  interface Message {
    text: string;
    // timestamp: Date;
    sentByUser: boolean;
  }
  
  export let messages: Message[] = [];
  const sessionId: string = crypto.randomUUID();
  let chat: HTMLDivElement; 
  let input: HTMLInputElement;
  let newInputValue = '';
  let readyToSend = true;

  function getChatStartOrEnd(message: Message) {
    return message.sentByUser ? 'chat chat-start' : 'chat chat-end';
  }

  function getChatPrimaryOrSecondary(message: Message) {
    return message.sentByUser ? 'chat-bubble chat-bubble-accent' : 'chat-bubble chat-bubble-success text-white';
  }

  function scrollToBottom() {
    chat.scrollTop = chat.scrollHeight;
  }

  async function triggerSendMessage(input: HTMLInputElement): Promise<void> {
    readyToSend = false;
    try {
      addMessageToList(input.value, true);
      addMessageToList(await sendMessage(input), false);
    } catch (error) {
      addMessageToList("There was an unexpected error", false);
    }
    scrollToBottom();
    readyToSend = true;
    await tick();
    input.focus();
  }

	async function sendMessage(input: HTMLInputElement): Promise<string> {
    console.log(env.PUBLIC_BACKEND_URL)
    // await new Promise(r => setTimeout(r, 2000)); // Only sleep when needed!
    // Make the API call
    const response = await fetch(`${env.PUBLIC_BACKEND_URL}/chat`, { 
        method: 'POST',
        body: JSON.stringify({ text: input.value, sessionId: sessionId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    input.value = '';

    // console.log(response)

    return (await response.json()).message;
	}

  function addMessageToList(text: string, sentByUser: boolean) {
    messages = [...messages, { text: text, sentByUser: sentByUser }];
  }

</script>


<div class="flex h-screen bg-neutral-focus  ">
  <div class="w-full max-w-2xl m-auto bg-base-200 rounded-lg shadow-lg p-6 flex-col">
    <div class="font-bold text-xl mb-4">aime</div>
        <div class="h-96 border p-4 rounded-lg overflow-y-scroll" bind:this={chat}>
          <div>
            {#each messages as message, index}
            <div class="{getChatStartOrEnd(message)}">
              <p class="{getChatPrimaryOrSecondary(message)}">{message.text}</p>
            </div>
            {/each}
          </div>
      </div>
      <form class="mt-4 sticky bottom-0 flex">
        <div class="flex items-stretch w-full space-x-2">
          <input disabled='{!readyToSend}' bind:this={input} bind:value={newInputValue} type="text" placeholder="Type here" class="input input-bordered input-accent flex-1"/>
          <button disabled='{!readyToSend}' class="{readyToSend ? 'btn btn-square' : 'btn btn-square loading'}" on:click={()=>triggerSendMessage(input)}>
            {#if readyToSend}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
            {/if}
          </button>
        </div>
      </form>
  </div>
</div>

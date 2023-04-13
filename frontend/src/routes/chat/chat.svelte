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
    await new Promise(r => setTimeout(r, 2000));
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
      <div class="flex-1">
        <input disabled='{!readyToSend}' bind:this={input} bind:value={newInputValue} type="text" placeholder="Type here" class="input input-bordered input-accent w-full max-w-xs"/>
        <button disabled='{!readyToSend}' class="{readyToSend ? 'btn' : 'btn loading'}" on:click={()=>triggerSendMessage(input)}>{readyToSend ? "Send" : "Answering..."}</button>
      </div>
    </form>
  </div>
</div>

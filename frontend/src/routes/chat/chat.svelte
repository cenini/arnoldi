<script lang="ts">
	import { tick } from "svelte";

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
    return message.sentByUser ? 'chat-bubble chat-bubble-primary' : 'chat-bubble chat-bubble-success';
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
    // Make the API call
    const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        body: JSON.stringify({ text: input.value, sessionId: sessionId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    input.value = '';

    console.log(response)

    return (await response.json()).message;
	}

  function addMessageToList(text: string, sentByUser: boolean) {
    messages = [...messages, { text: text, sentByUser: sentByUser }];
  }

</script>

<div class="flex h-screen">
  <div class="w-full max-w-2xl m-auto bg-gray-100 rounded-lg shadow-lg p-6 flex-col">
    <div class="font-bold text-xl mb-4">aime</div>
        <div class="h-96 border border-gray-300 p-4 rounded-lg overflow-y-scroll" bind:this={chat}>
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
        <input disabled='{!readyToSend}' bind:this={input} bind:value={newInputValue} type="text" placeholder="Type here" class="input input-bordered input-primary w-full max-w-xs"/>
        <button disabled='{!readyToSend}' class="btn" on:click={()=>triggerSendMessage(input)}>Send</button>
      </div>
    </form>
  </div>
</div>

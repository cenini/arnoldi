<script lang="ts">
	import { tick } from "svelte";


  interface Message {
    text: string;
    // timestamp: Date;
    sentByUser: boolean;
  }
  
  export let messages: Message[] = [];
  let input: HTMLInputElement;
  let newInputValue = '';
  let readyToSend = true;

  function getChatStartOrEnd(message: Message) {
    return message.sentByUser ? 'chat chat-start' : 'chat chat-end';
  }

  function getChatPrimaryOrSecondary(message: Message) {
    return message.sentByUser ? 'chat-bubble chat-bubble-primary' : 'chat-bubble chat-bubble-success';
  }

  async function triggerSendMessage(input: HTMLInputElement): Promise<void> {
    readyToSend = false;
    await sendMessage(input);
    readyToSend = true;
    await tick();
    input.focus();
  }

	async function sendMessage(input: HTMLInputElement): Promise<void> {
    var bodyText = input.value;
    messages = [...messages, { text: input.value, sentByUser: true }];
    input.value = '';

    // Make the API call
    let response: Response | null = null;
    try {
      response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      body: JSON.stringify({ text: bodyText }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    } catch (error) {
      // log it! 
      console.log(error);
      // Post an error in the chat!
      messages = [...messages, { text: "There was an unexpected error", sentByUser: false}] // want this to be the error color
      return;
    }

    // Should try/catch here so we can add an error message in the chat if something goes wrong

    console.log(response)

    // Check if the response was successful
    if (!response?.ok) {
      console.log(response);
      // Post an error in the chat!
      messages = [...messages, { text: "There was an unexpected error", sentByUser: false}] // want this to be the error color
      readyToSend = true;
      return;
    }

    const responseJson = (await response.json());
    // console.log(responseJson);
    // Add the new message to the messages array
    messages = [...messages, { text: responseJson.message, sentByUser: false }];
	}

</script>

<div class="flex h-screen">
  <div class="w-full max-w-2xl m-auto bg-gray-100 rounded-lg shadow-lg p-6 flex-col">
    <div class="font-bold text-xl mb-4">aime</div>
        <div class="h-96 border border-gray-300 p-4 rounded-lg overflow-y-scroll">
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

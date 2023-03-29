<script lang="ts">
  interface Message {
    text: string;
    // timestamp: Date;
    sentByUser: boolean;
  }
  
  export let messages: Message[] = [];
  let input: HTMLInputElement;
  let newInputValue = '';

  function getChatStartOrEnd(message: Message) {
    return message.sentByUser ? 'chat chat-start' : 'chat chat-end';
  }
  function getChatPrimaryOrSecondary(message: Message) {
    return message.sentByUser ? 'chat-bubble chat-bubble-primary' : 'chat-bubble chat-bubble-secondary';
  }

	async function sendMessage(input: HTMLInputElement): Promise<void> {
    var bodyText = input.value;
    messages = [...messages, { text: input.value, sentByUser: true }];
    input.value = '';

    // Make the API call
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      body: JSON.stringify({ text: bodyText }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // Should try/catch here so we can add an error message in the chat if something goes wrong

    console.log(response)

    // Check if the response was successful
    if (!response.ok) {
      throw new Error('Failed to send message');
      // Add an error message in the chat
    }

    const responseJson = (await response.json());
    // console.log(responseJson);
    // Add the new message to the messages array
    messages = [...messages, { text: responseJson.message, sentByUser: false }];
    input.focus();
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
        <input bind:this={input} bind:value={newInputValue} type="text" placeholder="Type here" class="input input-bordered input-primary w-full max-w-xs"/>
        <button class="btn" on:click={()=>sendMessage(input)}>Send</button>
      </div>
    </form>
  </div>
</div>

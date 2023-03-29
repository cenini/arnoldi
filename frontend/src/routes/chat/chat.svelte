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
    console.log(responseJson);
    // Add the new message to the messages array
    messages = [...messages, { text: responseJson.message, sentByUser: false }];
	}

</script>


<div class="h-screen bg-white flex items-center justify-center">
  <div class="w-full max-w-md bg-gray-100 rounded-lg shadow-lg p-6">
    <div class="font-bold text-xl mb-4">aime</div>
    <div class="border border-gray-300 p-4 rounded-lg">
      <div class="chat chat-start">
        <div>
          {#each messages as message, index}
          <div class="{getChatStartOrEnd(message)}">
            <p class="{getChatPrimaryOrSecondary(message)}">{message.text}</p>
            <!-- <p class="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</p> -->
          </div>
        {/each}
        </div>
      </div>
    </div>
    <form class="mt-4">
      <div class="flex">
        <input bind:this={input} bind:value={newInputValue} type="text" placeholder="Type here" class="input input-bordered input-primary w-full max-w-xs"/>
        <button class="btn" on:click={()=>sendMessage(input)}>Send</button>
      </div>
    </form>
  </div>
</div>

<script lang="ts">
  interface Message {
    text: string;
    // timestamp: Date;
    sentByUser: boolean;
  }
  
  export let messages: Message[] = [];
  let input: HTMLInputElement;
  let newInputValue = '';

  // async function sendMessage(event: Event) {
  //   // disable submit button until an answer is retrieved
  //   event.preventDefault();
  
  //   // const input = (event.target as HTMLFormElement).querySelector('input[type=text]') as HTMLInputElement;
  //   messages = [...messages, { text: input.value, sentByUser: true }];

  //   // Make the API call
  //   const response = await fetch('http://localhost:3000/chat', {
  //     method: 'POST',
  //     body: JSON.stringify({ text: input.value }),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   });

  //   console.log(response)

  //   // Check if the response was successful
  //   if (!response.ok) {
  //     throw new Error('Failed to send message');
  //   }

  //   const responseJson = (await response.json());
  //   console.log(responseJson);
  //   // Add the new message to the messages array
  //   messages = [...messages, { text: responseJson.message, sentByUser: false }];
  //   input.value = '';
  // }

  function getChatStartOrEnd(message: Message) {
    return message.sentByUser ? 'chat chat-start' : 'chat chat-end';
  }
  function getChatPrimaryOrSecondary(message: Message) {
    return message.sentByUser ? 'chat-bubble chat-bubble-primary' : 'chat-bubble chat-bubble-secondary';
  }

	async function handleKeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement; }): Promise<void> {
    var keyCode = e.code || e.key;
    if (keyCode !== 'Enter') return;
    await sendMessage(input)
	}

	async function sendMessage(input: HTMLInputElement): Promise<void> {
    messages = [...messages, { text: input.value, sentByUser: true }];
    input.value = '';

    // Make the API call
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      body: JSON.stringify({ text: input.value }),
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

<div class="flex flex-col w-full border-opacity-50">
  <div class="grid h-20 card bg-base-300 rounded-box place-items-center">
    <div class="chat chat-start">
      <div>
        {#each messages as message, index}
        <!-- <div class="max-w-md mx-auto my-2 {getClass(message)}" style="border-radius: 8px; padding: 12px;"> -->
        <div class="{getChatStartOrEnd(message)}">
          <p class="{getChatPrimaryOrSecondary(message)}">{message.text}</p>
          <!-- <p class="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</p> -->
        </div>
      {/each}
      </div>
      <input bind:this={input} bind:value={newInputValue} type="text" placeholder="Type here" class="input input-bordered input-primary w-full max-w-xs" on:keydown={handleKeydown}/>
      <button class="btn" on:click={()=>sendMessage(input)}>Send</button>
    </div>
  </div>
</div>



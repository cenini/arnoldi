<script lang="ts">
  interface Message {
    text: string;
    timestamp: Date;
    sentByUser: boolean;
  }
  
  export let messages: Message[] = [];

  async function sendMessage(event: Event) {
    // disable submit button until an answer is retrieved
    event.preventDefault();
    const input = (event.target as HTMLFormElement).querySelector('input[type=text]') as HTMLInputElement;

    // Make the API call
    const response = await fetch('http://localhost:8080/chat', {
      method: 'POST',
      body: JSON.stringify({ text: input.value }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Check if the response was successful
    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    // Add the new message to the messages array
    const newMessage = (await response.json()).message;
    messages = [...messages, { ...newMessage, sentByUser: true }];
    input.value = '';
  }

  function getClass(message: Message) {
    return message.sentByUser ? 'bg-green-300 text-white' : 'bg-gray-200';
  }
</script>

<div>
  <div>
    {#each messages as message, index}
    <div class="max-w-md mx-auto my-2 {getClass(message)}" style="border-radius: 8px; padding: 12px;">
      <p class="text-sm">{message.text}</p>
      <p class="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</p>
    </div>
  {/each}
  </div>
  <form on:submit={sendMessage}>
    <input type="text" placeholder="Type a message..." class="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
    <button type="submit" class="bg-blue-500 text-white rounded-full px-4 py-2 ml-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">Send</button>
  </form>
</div>

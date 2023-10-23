---
title: Axios timeout for chunked responses
image: https://res.cloudinary.com/n0th1ngelse/image/upload/v1697661181/blog/mdvvajkly3hxqo4ywrki.jpg
description: Axios timeout shows unexpected behavior in some specific cases. One can say it does not work. In this article, I show how to guarantee the timeout will stop executing the api request.
language: en
date: 2023-10-22
keywords:
  - JavaScript
  - Axios
  - Fetch
  - AbortSignal
  - AbortController
reposts:
  - medium
  - dev.to
draft: true
---

![Article preview image](https://res.cloudinary.com/n0th1ngelse/image/upload/v1697661181/blog/mdvvajkly3hxqo4ywrki.jpg)

<p class="mkdn-alt">Time is money. 
    <a class="mkdn-link" href="https://stability.ai/stable-diffusion" target="_blank">Created by Stable Diffusion</a>
</p>

ALRIGHT, this was an interesting one. I use [Axios](https://axios-http.com) in one of my pet projects.
Basically, the project is a Telegram bot, that transforms voice messages into text. I know, Telegram now has this
feature for premium subscribers, but this is not something we are about to cover in this article. Here I want to talk
about the tricky way the Axios timeout works.  
Let's start off with the simple HTTP server (I use Express as an example) and a single API endpoint, which takes 10
seconds to resolve:

```typescript
import { createServer } from 'node:http';
import express from 'express';

const api = express();
// I have an API endpoint which takes 10s to resolve
api.post('/regular', (_, res) => {
	setTimeout(() => res.status(200).send({}), 10000);
});

const server = createServer(api);
server.listen(3000);
```

If we deep dive into the [documentation](https://axios-http.com/docs/req_config), we will find that Axios supports the
`timeout` property, and it works quite well:

```typescript
import axios from 'axios';

const start = new Date().getTime();

try {
	console.log('Start request');
	await axios.request({
		method: 'POST',
		url: 'http://localhost:3000/regular',
		timeout: 5000
	});
	console.log('Request was successful');
} catch (err) {
	console.error(err);
}

const end = new Date().getTime();
const requestTime = Math.floor((end - start) / 1000);
console.log(`Request took ${requestTime}s,`, 'should be 5s!');

// Start request
//
// AxiosError: timeout of 5000ms exceeded
//     at RedirectableRequest.handleRequestTimeout (/axios-streaming-timeout/node_modules/axios/lib/adapters/http.js:630:16)
//     at RedirectableRequest.emit (node:events:513:28)
//     at Timeout.<anonymous> (/axios-streaming-timeout/node_modules/follow-redirects/index.js:169:12)
//     at listOnTimeout (node:internal/timers:569:17)
//     at process.processTimers (node:internal/timers:512:7) {
//   code: 'ECONNABORTED',
//
// Request took 5s, should be 5s!
```

## The problem

If it works fine, what is the problem then, you ask me. Here is the thing: as I said, I have a Telegram bot, that
converts voice messages into text. It basically decompresses the voice file into wav buffer and sends the result to one
of the cloud providers. As a result, I receive text recognition for that specific voice message. In fact, one of the
providers I use implements the streaming API. The intention is to show the text recognition by the ways it gets
processed. You receive chunks of text data and you have a choice to wait until you can combine the whole message, or
send it out to the user, so they see the early results. On a code level it actually resolves the request promise, so
you can handle the chunk of data. With the following chunks, it is being resolved again and again, until the final
chunk is received and the request is finished.
If you read this, you can already see the unexpected side effect of this approach. The Axios resolves the request
promise with the first chunk received. Essentially this means that Axios resets the timeout and the request time is not
controlled in any way. For example, I have a timeout of 10 seconds for my bot recognition engine. And I could see in
the logs requests were taking 30, 45, 50 seconds, and even more. With the first chunk received, Axios stops counting
the timeout frame and considers the request resolved. To illustrate this, I created a new endpoint in the Express
server:

```typescript
import { createServer } from 'node:http';
import express from 'express';

const api = express();
// I now have an API endpoint which sends the one chunk of the response each second
api.post('/chunk', (_, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/plain',
		'Transfer-Encoding': 'chunked'
	});

	const intervalId = setInterval(() => {
		console.log('Keep sending chunks');
		res.write(JSON.stringify({ foo: 'bar' }) + '\r\n');
	}, 1000);

	setTimeout(() => {
		console.log('Finalize the request');
		clearInterval(intervalId);
		res.end();
	}, 10000);
});

const server = createServer(api);
server.listen(3000);
```

Now if I call the new endpoint, I will experience rather unexpected behavior:

```typescript
import axios from 'axios';

const start = new Date().getTime();
try {
	console.log('Start request');
	await axios.request({
		method: 'POST',
		url: 'http://localhost:3000/chunk',
		timeout: 5000
	});
	console.log('Request was successful');
} catch (err) {
	console.error(err);
}

const end = new Date().getTime();
const requestTime = Math.floor((end - start) / 1000);
console.log(`Request took ${requestTime}s,`, 'should be 5s!');

// Start request
//
// Keep sending chunks 1
// Keep sending chunks 2
// Keep sending chunks 3
// Keep sending chunks 4
// Keep sending chunks 5
// Keep sending chunks 6
// Keep sending chunks 7
// Keep sending chunks 8
// Keep sending chunks 9
// Finalize the request
//
// Request was successful
// Request took 10s, should be 5s!
```

The request was supposed to take 5 seconds maximum, but it actually took 10 seconds and was successful in the end.
Imagine if it hangs for several minutes! Obviously, users are not in favor of waiting for that long for voice
recognition and they stop using the bot. But how can we fix it?

## AbortSignal to the rescue

From the first glance, one solution would be to wrap the request into my custom cancellation function, so once, say,
`setTimeout()` triggers the handler, we reject the promise and fall into an unhappy flow. BUT. Fortunately, there is a
better way! Let me introduce you to **AbortSignal** and **AbortController**.

**AbortSignal** is a built-in Javascript signal implementation, which is widely adopted to control the execution and
cancellation for other APIs of the language. The interface itself is fairly simple, basically, it only contains a
couple of static methods:

- `AbortSignal.abort()` returns the instance of AbortSignal which is already aborted.
- `AbortSignal.timeout(timeout: number)` returns the signal that will be aborted in the timeframe you specify in the parameters.

As I said, the implementation is pretty simple and does not give us much flexibility. For more complex cases
AbortController comes in handy.

**AbortController** is a wrapper around the AbortSignal and it has one huge benefit — the `abort()` function. This
means you get granular control over the signal execution. You can invoke the function manually at any time when it is
needed. Here are some examples:

- DOM event listener supports the AbortSignal, so we can unsubscribe from all the events in one go:

```typescript
// Create abort controller instance. It contains the signal and abort function
const { signal, abort } = new AbortController();

const saveBtn = document.getElementById('save-btn');
const printBtn = document.getElementById('print-btn');
const backBtn = document.getElementById('back-btn');

// Add the signal to event listener
saveBtn.addEventListener('click', saveHandler, { signal });
// Add the signal to another event listener
printBtn.addEventListener('click', printHandler, { signal });

// Abort the signal when we navigate back
backBtn.addEventListener('click', () => abort(), { signal });
```

In this specific (pretty simplified) example, once we click the **Back button**, we trigger the `abort()` function and
hence send out the abort signal. As a result, we have unsubscribed from all three event listeners. Easy as that!

- As Javascript developers, we spend most of the time handling API requests. And the good news here, `fetch()` method
  supports AbortSignal as well.

```typescript
// Create abort controller instance. It contains the signal and abort function
const { signal, abort } = new AbortController();

try {
	await fetch('http://localhost:3000/regular', {
		method: 'POST',
		signal
	});
} catch (err) {
	console.error(err);
}

const backBtn = document.getElementById('back-btn');
// Now we abort the fetch request once we click on back button
backBtn.addEventListener('click', () => abort());
```

If the request is in the pending state, clicking the Back button will lead to an error in the console `DOMException
[AbortError]: This operation was aborted`. This is one good example of how to implement the timeout for `fetch()`
interface in your application.

For more information and engine support, you can read the MDN articles about
[AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) and
[AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

## Combining with Axios

Now as we got familiar with the interfaces we are going to use, I want to draw your attention to one more thing. If we
go back to Axios, we will quickly realize that [Axios supports](https://axios-http.com/docs/cancellation) AbortSignal
as well. This was amazing news for me as I did not need to write my own custom logic around the request cancellation.
In my implementation timeout is the only thing that matters, so I can even use AbortSignal directly without having to
invoke the AbortController instance — it supports the timeout as I showed above. The fix for my issue is pretty simple:

```typescript
import axios from 'axios';

const start = new Date().getTime();
try {
	console.log('Start request');
	await axios.request({
		method: 'POST',
		url: 'http://localhost:3000/chunk',
		timeout: 5000,
		signal: AbortSignal.timeout(5000) // Add the timeout signal in the config
	});
	console.log('Request was successful');
} catch (err) {
	console.error(err);
}

const end = new Date().getTime();
const requestTime = Math.floor((end - start) / 1000);
console.log(`Request took ${requestTime}s,`, 'should be 5s!');

// Start request
//
// Keep sending chunks 1
// Keep sending chunks 2
// Keep sending chunks 3
// Keep sending chunks 4
//
// CanceledError: canceled
//     at EventTarget.abort (/axios-streaming-timeout/node_modules/axios/lib/adapters/http.js:192:54)
//     at [nodejs.internal.kHybridDispatch] (node:internal/event_target:737:20)
//     at EventTarget.dispatchEvent (node:internal/event_target:679:26)
//     at abortSignal (node:internal/abort_controller:314:10)
//     at Timeout._onTimeout (node:internal/abort_controller:120:7)
//     at listOnTimeout (node:internal/timers:569:17)
//     at process.processTimers (node:internal/timers:512:7) {
//   code: 'ERR_CANCELED',
//
// Request took 5s, should be 5s!
```

I have used the static method `AbortSignal.timeout(5000)` in order to cancel the request if it takes longer than 5
seconds. I could do it with AbortController as well, but this requires a couple more lines of code. For instance:

```typescript
import axios from 'axios';

// Create abort controller instance. It contains the signal and abort function
const { signal, abort } = new AbortController();

// Abort after 5 seconds
setTimeout(() => abort(), 5000);

try {
	await axios.request({
		method: 'POST',
		url: 'http://localhost:3000/chunk',
		timeout: 5000,
		signal
	});
} catch (err) {
	console.error(err);
}
```

As you can see, this approach requires creating an instance of AbortController and creating the timeout manually, so I
would recommend using the `AbortSignal.timeout()` method directly in this simple case.

The last observation to keep in mind is that, since we introduced the AbortSignal, it makes the usage of the Axios
`timeout` property redundant. The race condition appears to be in favor of AbortSignal all the time. And since it
covers the same capability, I believe we can safely remove the `timeout` property for goods.

```typescript
await axios.request({
	method: 'POST',
	url: 'http://localhost:3000/chunk',
	signal: AbortSignal.timeout(5000) // Abort any request by 5 sec timeout
});
```

## The outcome

Users hate to see errors in their applications. But even more, they hate to feel the application is not responding, is
stuck in some in-between state, and does not give feedback if something goes wrong. I can not control the time the
cloud provider will take in order to transform the audio buffer into the text, so I show the error message when it
takes longer than some reasonable time. Axios timeout property works just well with regular API. But if you face the
streaming API endpoint and want to limit the request execution time, keep in mind that the timeout property won't work
as you would expect. Use the native JS AbortSignal implementation to ensure the timeout is applied for any kind of
request. In the meantime, I have filed the issue report in the Axios repository, asking to clarify the timeout behavior
in the documentation.

You can check the source code of this article in
[my repository](https://github.com/n0th1ng-else/axios-streaming-timeout) on GitHub. The code is tested on the Axios
v1.5.0.

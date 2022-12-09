import { OnRpcRequestHandler } from '@metamask/snap-types';

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

// Snaps are ran in browser, but its environment kills long/unresponsive sessions
// How can we emit a heartbeat?
// setInterval(() => wallet.request("Hey Im alive"), 10_000)
// Snaps are spun up in response to messages/events
// https://docs.metamask.io/guide/snaps-development-guide.html#the-snap-lifecycle
// How would we initialise the interval

// TEST - create variable and store on window, does this variable persist (might be removed from SES)
// window.mySnapVar = 'helloooo'; // yep this is removed when snap ends

// TEST - create a interval that updates a variable every second, when calling that variable on a confirm, does it change?
// let value = 0; // variables can be changed within functions, but will be reset if span dies.
// const interval = setInterval(() => { // intervals didn't work
//   value += 1;
// }, 1000);

// TEST - can we utilise CRON to initialise a websocket?

/*

Snaps are ran in browser, but in a Secure EcmaScript Env.
Snaps will killed if long running & can only be started when interacted with.

Problems:
1) How do we stop a snap from ending?
- We can give a snap a heartbeat to preventing it from closing?
- endowment:long-running

2) How do we start the snap for the first time?
- installing snap OK
- but what about closing/reopening browser? Snaps are stopped until interacted with...
- is there way to start on startup??


> This does not mean that you can't create long-running snaps,
> but it does mean that your snaps must handle being shut down,
> especially when they are not within the JSON-RPC request / response cycle.

> Stopped snaps are started whenever they receive a JSON-RPC request,
> unless they have been disabled.

*/

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  // value += 1; // if we have a variable outside snap & snap isn't dead, then value is persisted

  const msg = JSON.stringify(request, null, 2);
  // const msg = `hello: ${value}`;

  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent: msg,
            // textAreaContent:
            //   'But you can edit the snap source code to make it do something, if you want to000!',
          },
        ],
      });
    default:
      throw new Error('Method not found.');
  }
};

/*
request shape
{
  "jsonrpc": "2.0",
  "id": "04CZts2oMtCH-VaUXckgG",
  "method": "hello"
}
*/

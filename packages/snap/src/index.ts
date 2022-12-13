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

// let counter = 0;
// const heartbeat = () => {
//   console.log('HEARTBEAT');
//   counter += 1;
//   // wallet.request({
//   //   method: 'wallet_getSnaps',
//   // });

//   // wallet.request({
//   //   // method: 'heartbeat',
//   //   // params: { snap: "I'm alive" },
//   // });
// };

// let interval: NodeJS.Timer | null = null;
// const HEARTBEAT_MS = 1000;
// const initialiseSnap = () => {
//   if (!interval) {
//     console.log('Initiailise Snap & starting heartbeat');
//     interval = setInterval(() => {
//       heartbeat();
//     }, HEARTBEAT_MS);
//   }
// };

// const cleanSnap = () => {
//   if (interval) {
//     console.log('Killing Snap, Cleanup');
//     interval && clearInterval(interval);
//     interval = null;
//   }
// };

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
  // const msg = JSON.stringify(request, null, 2);

  // test that counter has reset
  const msg = `hello`;

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

export const onCronjob: OnRpcRequestHandler = ({ request }) => {
  // console.log('ON CRON', typeof interval, counter);

  switch (request.method) {
    case 'cronjobMethod': {
      console.log('CRON - Starting Snap');
      // startSnap();
      // Ideally fetch from API (and somehow know that the event has not been notified before)
      // E.g. column to flag if stream event was notified
      return wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'inApp',
            message: 'Noti Stream: 2e91eaa0-d5d4-48a2-adee-546c1ed29245', // Must be below 50 chars
          },
        ],
      });
      break;
    }
    default:
      throw new Error('Method not found.');
  }
};

// eslint-disable-next-line jsdoc/require-jsdoc
// function startSnap() {
//   let exitCondition = false;
//   setTimeout(() => (exitCondition = true), 60000);

//   initialiseSnap();
//   // eslint-disable-next-line no-unmodified-loop-condition, curly
//   while (!exitCondition); // do nothing

//   // Cleanup
//   cleanSnap();
// }

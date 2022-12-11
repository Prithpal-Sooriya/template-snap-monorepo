## Plan

Create Notify Snap that runs in background and can give realtime notifications.

## Notes

- New CRON Snap

  - Can be used to keep snap alive?
  - Can be used to create variable for subscription?
    - Can variables be used with other functions?

- How do I debug MM Snaps

  - https://docs.metamask.io/guide/snaps-development-guide.html#debugging-your-snap
    > use console.log and inspecting the MetaMask background process
    > chrome://extensions -> MM Extension -> Details -> Inspect Views -> background.html

- https://devfolio.co/projects/push-snap-4471
  - Push Protocol Snap (I think I can do something similar, lets see!!)

## User flow

1. DAPP User will be prompted to install snap

- Can we intercept and pass payload (aka can we create Stream and Subscription here?)

2. User will be prompted to be notified button

- We can send custom RPC method here with payload to create Stream & Subscription

3. CRON to keep alive subscription

4. Subscription Callbacks that can invoke MM notifications?

- Will need to see if this is possible.
- e.g. can I send notify message to snap without functions? (Should be fine since is RPC call?)

## Technical Flow

1. User will install snap - see if we can intercept to create notification here
2. User will create notification

   - Site sends RPC
   - Snap receives RPC and create Stream & Connector -> subscribe
     - HAL PAIN POINT - no build in web socket / subscription on API.

3. Make connector publish subscription
4. Make Snap receive subscription & create MM Notification

Other Scenarios (we can handle outside PoC)

1. User unsubscribes from notifications
   - Site sends RPC
   - Snap receives RPC and deletes stream (and connector?)

---

## Development Pain points

<!-- Here are some pain points if we were to make DApps adopt/create own snaps.
Otherwise we could ship HAL snap & action for DApps that don't offer this snap.

MM Snap Pain Points

- OK DX, but not great for subscriptions
- Had to fight against it to not kill snap

- does not accept custom RPC calls

HAL Pain Points

- Stream creation process is initially long for a DApp (need to create a blueprint/recipe, deploy stream, create connector, attach connector)
- Once done tho other users would just need to: Deploy Stream; Attach Connector -->

MM Snaps have no way of creating long lived subscriptions.

- Subscriptions made cannot be stored, as once service ends variables are destroyed.
- CRON can't store subscriptions
- Tried RPC heartbeat, but this doesn't work (MM blocks non-known RPC calls)
- Could use infinite loop to prevent closing requests, but each CRON will have new global variables (so each CRON will create new instance)
  - Set interval doesn't seem to work on CRON...

MM Snaps favours Polling over Subscriptions

- kinds makes sense since low cost, but means no instant notifications...
- No (Current) easy way to create a snap template for different DApps.

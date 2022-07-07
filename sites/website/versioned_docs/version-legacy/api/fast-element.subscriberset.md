---
id: fast-element.subscriberset
title: SubscriberSet class
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[@microsoft/fast-element](./fast-element.md) &gt; [SubscriberSet](./fast-element.subscriberset.md)

## SubscriberSet class

An implementation of [Notifier](./fast-element.notifier.md) that efficiently keeps track of subscribers interested in a specific change notification on an observable source.

<b>Signature:</b>

```typescript
export declare class SubscriberSet implements Notifier 
```

## Remarks

This set is optimized for the most common scenario of 1 or 2 subscribers. With this in mind, it can store a subscriber in an internal field, allowing it to avoid Array\#push operations. If the set ever exceeds two subscribers, it upgrades to an array automatically.

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(source, initialSubscriber)](./fast-element.subscriberset._constructor_.md) |  | Creates an instance of SubscriberSet for the specified source. |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [source](./fast-element.subscriberset.source.md) |  | any | The source that this subscriber set is reporting changes for. |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [has(subscriber)](./fast-element.subscriberset.has.md) |  | Checks whether the provided subscriber has been added to this set. |
|  [notify(args)](./fast-element.subscriberset.notify.md) |  | Notifies all subscribers. |
|  [subscribe(subscriber)](./fast-element.subscriberset.subscribe.md) |  | Subscribes to notification of changes in an object's state. |
|  [unsubscribe(subscriber)](./fast-element.subscriberset.unsubscribe.md) |  | Unsubscribes from notification of changes in an object's state. |
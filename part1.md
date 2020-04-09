---
title: RailsConf 2020 Talk Blog Post - Part 1 - Intro
description: RailsConf 2020 Talk Blog Post
tags: RailsConf 2020, Blogpost, Talk
---

# Part 1 - Communication

Communication is hard, however, communication at a distance over a limited channel is extraordinarily hard. I am sure most of us are experiencing this right now as we have all started to work from home. We no longer have access to the rich, information packed and low-latency communication channel we used to call face-to-face meetings. Instead, we have Zoom or Google Meet meetings where we never know whose turn it is to talk or when someone talks we can hear what they are saying roughly 80% of the time. Moreover, in most meetings, even when you have everyone on camera,  microexpressions or body language does not translate well over video and we lose a lot of the information that we used to rely on traditionally. No wonder most of us are finding it hard to work like this!

However, there are domains in human communication where we have perfected the art of communicating over limited channels to a satisfactory degree. For example, people are and have been for centuries very successful with communication via written text on dead-trees and then for a much more limited time using its digital equivalent, the email. People have built, ruled and destroyed empires using nothing more than messengers with a spoken or written message.

What makes these communication channels so successful? How can we learn from them?

## Layers and Protocols

What is particularly successful about the mailing system that all this evolved into is what you can call the independent layers that it has and the protocols that have been established to carry on effective communication via these layers.

So what do we mean by "layers" exactly? Layers in any system are the independent components of a system that rely on the existence of the other layers that it "sits on" but makes little or, preferably, no assumption about anything but its own concerns.

A good example of layering comes from civil engineering, specifically transport engineering. The way our modern roads are built is based on the same concept of layers, where you have a base layer to provide the basic structure, then another layer on top of that to provide dampening or draining capabilities, then another layer and another until we get to the asphalt top that we always see.

![Insert an image of an asphalt road with layers here](https://via.placeholder.com/600x200/ff00ff/000000?text=Asphalt%20Road%20Image)

Notice that each layer of a road structurally depends on the existence of another layer below it, but layers do not assume anything about the properties of the layers below them. For that reason, you _can_ just dump asphalt on some compressed earth road and call it a paved road and it would work, to a certain extent. Except that would be a highly unstable road and would quickly start wobbling and cracking due to structral problems.

Now that we are clear on layers, what do we mean by a layer supporting different protocols? Again, if we were to turn to our road example, notice how the top layer of the road that was built was built to support a particular "protocol" for how things will move on top of it. The design of the road on the top layer depends on what what kinds of vehicles will be using the road, what their dimensions are, if they will be travelling in both directions or only one, how many parallel lanes we want for travel in each direction, etc etc. The set of all these requirements arise from the "protocols" that we have set for how we do use roads. In general, width of a lane of traffic is more or less a fixed. Based on that fixed with (standards) and how vehicles will travel on the road, we can easily design the road. That also implies which lines and markers we need to draw on the road to signal what protocols need to be observed by vehicles. Think lane dividers, HOV lane messages, right turn, left turn or road division indicator, etc etc.

However, if we take another look at the road picture above, we notice another interesting thing: the top layer of the road does not only support the road but also the infrastructure around the road itself. We can think about these as different protocols. For example, the way pedestrians move on the pavements is completely different than how vehicles operate on the road. Similarly, how the hard shoulder on the side of a road works is completely different from how the road itself works.

Thus, we can see that each layer in a system can support and sustain different modes of operation, which we can call "protocols", all operating side-by-side on the same layer.

## Mailing System

The most fundamental analogy I will be making throughout this series will be the one of the mailing system, or the mailing network. Since most of us take it for granted, unless we are involved in some aspect of it, we usually do not see the different layers, so let's take a closer look.

### Layer 1: Media

In order to send something via the mailing system, we first need something physical to send. This is usually in the form of a piece of paper like a letter or a postcard, but does not have to be.

### Layer 2: Imprint

The message that we want to send to the other party needs to somehow be encoded onto the media that we choose. We could hand-write a message on a postcard, or print something on a piece of paper using a laserjet printer, or we could physically etch a message on a piece of metal. At the end of the day, it does not matter what we choose, the network supports it all, but we need a mechanism by which we make imprints on the physical media.

### Layer 3: Envelope

This is the most critical part of mail delivery since it allow us to disconnect how the mail is delivered from what is being delivered. As far as the network is concerned, it has no idea what is inside the envelope and does not care (apart from some legal considerations). All it needs to be able to perform its delivery obligations is contained on the envelope itself. It has the name and address of the recipient, the name and address of the sender (this is important,in case the mail has to be returned) and optionally some notes on how important and/or time-sensitive the delivery is (for example, registered mail, airmail, e.g.).

The system also supports delivery of items where the envelope and the item are one and the same. For example, postcards are usually not placed in a separate envelope but are sent with the information that would have been on the envelope imprinted next to the message itself. This is also supported, as long as the mailing system can identify which part is the message and which part is the delivery information.

### Layer 4: Routing

Did you ever think about how your letter in an envelope which is addressed to your friend in a city in a totally different county makes its way there? After all, all you have have to do is to write your friend's address on the envelope and leave it at the local post-office (or mail collection box). Who knows how to send the message to your friend? No one at the local post office knows who your friend is, where they live, or even know how to get there. So how does the message make its way to its destination without getting lost? The simple answer is again a set of protocols which enables the system to route the message to its destination.

The mailing system routing is very simple in that it does not require anyone to know all the locations in the world to make the delivery. The decision for how the message will make its way is left to independent agents with limited information who decide on what the next step should be.

Just to make this concrete, suppose that you are on holiday in Cyprus and decided to send a letter to your friend in Brooklyn, New York City. Let's see what kind of steps the letter might be taking:

1. You drop the letter off in a collection box in Paphos (a coastal city in Cyprus)
2. Local delivery people pick up the letter from the box and take it to the local post office
3. All letters are sorted based on its destination at the local post office. For your letter specifically, since it is addressed to the USA, it is routed to the head post office in Nicosia. Notice that at this stage, no one cares where in the US the letter will be going to.
4. Now that the letter is in the head office, it gets collected with other mail that is directed oversees and gets put on some delivery mechanism. For the sake of this example, let's assume it gets put on a plane and goes to Germany.
5. When mail arrives in Germany, it again gets routed with other mail coming from other countries that will be going to the US. Now, your letter is in a bunch of other letters flying to the central delivery hub in the US.
6. At this point, the mail will probably make its way to the Network Distribution Center in New Jersey. At that location, it will be sorted with other mail that is addressed to NYC and will be routed to the Sectional Center Facility in NYC.
7. When the letter gets to the SCF in NYC, it will get sorted based on the zip code and routed to the local post office in Brooklyn.
8. When it gets to the local post office in Brooklyn, the local mail delivery worker will take it to the correct address and leave in the appropriate mailbox.

Phew, so many steps, yet it works so efficiently. The biggest reason why this works so great is the fact that no one in the system apart from the last person needs to know or care what the destination address is exactly. All everyone needs to know is who next to hand it to so that the letter can make its way closer to its destination, nothing more, nothing less. This requires different levels of detail of the address to be considered at different points, but ultimately, only the last segment needs to exactly know the address where your friend lives.

This is the power of good routing!

### Layer 5: Transport

We talked about how the letter gets routed from Paphos, Cyprus to our friend in Brooklyn, NYC but how the decisions are made at each routing point is not at all related to _how_ the letter makes its way to its destination. For example, if we haven't stuck on enough stamps, maybe the system decided to deliver the letter via surface mail. In that case, the delivery will obviously take longer and there will be more delays in between routing points. If we had paid for a higher class of delivery though, the mail might make it through the fastest route possible, in some cases making its way to its destination in couple of days at most. This is basically what happens when you choose next day delivery for your online orders.

So that is the separate layer of transport at work. Notice that the routing and transport layers work hand-in-hand but independently from in other. For that reason, we can consider transport a different layer of the mailing network. There are many ways any delivery can be transported at each leg of the journey and your letter may take different paths through the network depending on which transport was paid for.


Moreover, depending on what level of service you paid for, you might get different guarantees about non-delivery. For registered mail, for example, you are guaranteed to be able to track the delivery while it makes its way through routing stations and will know when and if it is received by the recipient. For lower class of deliveries, though, you might just get the letter returned to you with a note saying that the recipient was not available for delivery.

### Layer 6: Message

Now that we are sure that the letter was delivered to our friend, what happens? Well, hopefully our friend will read it and understand what we were trying to say to them and, maybe, respond back.

But how can we be sure that that will happen? For most people, this won't be a concern but what if we forgot that our friend does not know Esperanto so we wrote the letter to them in Esperanto? Will our friend be able to read the letter then? Of course not!

This brings us to the final layer where the actual communication between us and our friend happens. This layer obviously needs a "protocol" too and that is language. We need to write to our friend in a language and using expression that they will know so that we can communicate our intent very clearly.

If we fail to do so, then all the work of the previous layers and all the cost and effort put into the successful delivery of the letter would have been for nothing. After all, communication only happens if the message gets read and understood!

## Network Stack

So what does that all have to do with the network stack, you might ask. For the intuitive amongst you, the readers of this post, it should be apparent that the network stack has a lot of similarities to how the mailing network works. Obviously, the network stack, currently, spans a way bigger and much faster and efficient network since it can operate at close to the speed of light.

We will start building the network stack from the ground up in [the next part of this series](/1lkg9h4hQyS1JnWUivDcYw).
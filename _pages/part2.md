---
title: The Stack
description: How can we build a layered network model that utilizes packet switching? A first look at the OSI model and the network stack.
tags: RailsConf 2020, Blogpost, Talk
---

# Part 2 - The Stack

## Packet vs Circuit Switching

Before we move on to talking about the stack, it is important to get a sense of the differences between packet switching and circuit switching since it informs the ultimate architecture of what the layers of the network stack look like.

In a nutshell, you can think about circuit switching as any system where there is a dedicated and long-living channel of communication between two parties. That communication channel that is dedicated to those two parties is usually called a circuit. The analogy here is with analog phone lines. If you have watched any black and white films, you would have seen cases where someone picks the phone up, tells the operator to connect them to a certain party, the operator physically connects their line to the other party's line and the two parties start talking. By doing that, the operator ends up creating a physical connection between the two phone lines, a circuit, and that circuit has to stay connected during the whole phone conversation. This is true, even if both parties decide to take a 10 minute nap without hanging up and then pick up the call again. The circuit would just sit there idle but still connected.

Of course, since the number of physical connections that could be made at a given time are limited, long lasting communication is a load on resources in a circuit switched network.

In a packet switched network, on the other hand, each part of the communication is divided up into smaller parts called "packet"s and each packet is routed through the network separately. A good example of a packet switched network is the postal service from the previous part of this series. If you were dealing in a long running correspondence with a friend over the postal network using letters, you could consider each letter as an individual packet that you send in the network. Thus, the modern postal service is, in this sense, a packet switched network. You only consume resources from the network when you have letters to send and during no other time. If the postal service operated like a circuit-switched analog telephone network, it would mean that there would be a postal worker waiting at your doorstep at all times in case you wanted to send another message to your friend, until you told them that you were done with our correspondence.

It is obvious that a packet-switched network has a lot of advantages over circuit-switched networks, especially when it comes to resource usage. However, packet-switching also introduces some problems that don't exist at all in a circuit-switched network. For example, it is up to the communicating endpoints, in a packet-switched network, to keep track of a "session" going on, since there is no dedicated circuit to signal that. Similarly, if one party sends multiple messages to the other, since each message is independent and travels independently through the network, the order of receipt of the two messages is not guaranteed in any way. That is, your friend is very likely to get your second letter before they get the first one. So that becomes a problem that needs to be solved for most communication that assumes a natural order for messages. We will revisit this when we start talking about the `Transport Layer` of the network stack.

## The OSI Model

During 1960s and 1970s there were many propietary networks in existence since each company or network operator had its own idea for how things should be architected. Towards the end of 70s, some people from the industry got together and formulated a general structure for how they thought network stacks should look.

What they came up with is what is called the OSI Model and is still the reference when talking about network stacks. The initial aim of the group was to give this high level architecture and then to provide concrete implementations for every layer of the stack. But, until they were able to formalize the implementations, the TCP/IP stack took over the world and became the de-facto network stack in use everywhere. So, when we talk about network stacks, we will refer to the OSI model but still mostly talk about the TCP/IP implementation. It is good to keep that in mind.

The OSI model proposes a packet switched network model that consists of 7 layers:

![The OSI Model](/assets/images/osi-model.png)

The way each of these layers are proposed to work is as follows:

When one party wants to communicate with another party, they prepare the message into chunks of data packets:

- Each data packet is handed off to the top layer of the stack (that is the `Application Layer`).
- Each layer of the stack is responsible for adding a header and a footer that corresponds to the protocol at that layer to construct a representation appropriate for it.
- Then, each layer passes the constructed message to the layer below.
- When the bottom most layer (`Physical Layer`) is done with the message, it gets transmitted to the remote party.

When the remote party receives the message, their network stack works through the received message in the reverse order:

- The data is received by the bottom-most layer (`Physical Layer`) and is dissected according to the header, footer data
- Data that is processed and extracted out at every layer is passed onto the layer above, the layer above does the same kind of processing that is appropriate for it.
- Finally, the data is processed at the `Application Layer` and passed on to the receiving application/user.

Thus, the model proposed the layered, packet-switched model that we've been examining until this point, where each layer just wraps the raw data passed onto it from the layer above, and then the whole bundle of data is unwrapped layer by layer at the receiving end point.

This is a particularly powerful but sufficiently generic way of proposing how network stacks should operate. For that reason, the model still lives on as the conceptual model for a good network stack.

The OSI model does not propose any concrete implementation for how each layer should operate but they propose different roles for what each layer should be concerned about. We will cover each layer in depth in the next parts of these series.

However, before we do that, this is a good place to mention that the HTTP over TCP/IP over Ethernet/Wifi that is we use below most of our Rails applications can also be considered a concrete implementation of the OSI model. For that reason, we will be referring more to the TCP/IP stack when diving into the network stack.

In [part 3]({% link _pages/part3.md %}) we will start building the layers from ground up.

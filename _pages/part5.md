---
title: Transport Layer
description: RailsConf 2020 Talk Blog Post
tags: RailsConf 2020, Blogpost, Talk
---

# Part 5 - Transport Layer

In the previous parts, we examined how we can [send data from one computer to another](), then we looked at how we can turn [that into a network of many computers all connected](). And [in the last part](), we looked at how we can connect networks together and yet still allow machines to communicate across these disparate networks.

Now that we are able to send data across different network, we start having other concerns. How can we ensure delivery of the data that we send? How can we be sure that the messages that we are sending were actually received? If we are sending a message in multiple parts across the network, each part could take a completely different path. How can we ensure that the receiver can process the parts in the correct sequence?

These are all concerns that the Transport Layer aims to address.

## Layer 4 - Transport Layer

The Network Layer in the OSI model is responsible for reliable transmission of data between different network node. At the same time, the transport layer is also responsible for dividing up the data to be sent into smaller chunks that can be carried by the physical link and, on the receiving end, for reassembling the same data for consumption. A data unit on the transport layer is called a "datagram" or "segment".

The most commonly deployed Transport Layer protocols are:

- User Datagram Protocol (UDP)
- Transmission Control Protocol (TCP)

which we will explain in depth in the next sections

### UDP

UDP is a very simple message oriented protocol intended for delivering messages across networks with integrity. Other than integrity it does not provide any other guarantees like guaranteed delivery and does not need the endpoints to keep any state.

You can think UDP messages like the postcards you send to your friend. Quick, easy, minimum hassle to send, and you don't particularly care if it is delivered or not. Of course, it would be a good thing if you friend gets it, but it is not the end of the world if they don't either.

A UDP datagram consists of a `Header` and `Data` sections. The UDP Header looks like this:


| Source Port | Destination Port | Length   | Checksum |
| --------    | --------         | -------- | -------- |
| 2 bytes     | 2 bytes          | 2 bytes  | 2 bytes  |

and the payload data received from the upper layers is just appended to this header. Simplicity itself!

At the transport layer, we see the introduction of the concept of a `Port`. A port is basically a unique identifier of who the message is addressed to at a given network address. Going back to our postal analogy, if the friend you are sending messages to is sharing their house with other friends, they might have separate post boxes outside for each of them separately. If the mail delivery worker is nice, they can separate the mail based on who it is addressed to into the separate mailboxes. So your friend will only get their letters placed in their mailbox, despite sharing the same exact address with all the flatmates. A port serves the same purpose on the network. You can have multiple applications sending or waiting to receive data on a single host and we need a way to say which of those applications a packet of data is intended for or coming from.

That is why we need the source and destination ports in the header. Notice that port addresses can range from 0 to 65,535, since they are encoded by 2 bytes.

Next up is the length of the whole datagram including the header and the payload. Since this is also a 2 byte value, the maximum theoretical data we can send is 65,535 minus the size of the header, 8 bytes, which equals 65,527 bytes.

Finally, we have a 16-bit (2 byte) checksum of the data that ensures the integrity of the data carried by the datagram. Remember how the network layer and IPv4, specifically, didn't guarantee the integrity of the payload? Using the checksum in our UDP messages, we can make sure that the data we sent to the remote party makes it there without any changes.

In summary, UDP is a connection-less protocol that is:

- **Unreliable**: if a datagram is lost, it will never reach its destination and the sender will never be notified. Transmission of data is best-effort.
- **Not Ordered**: two different messages could arrive at the destination in any order without any guarantees.
- **Lightweight**: since the protocol is best effort and is connection-less, there is no state to keep track of on either the sender nor the receiver.

### TCP

As opposed to the simplicity of UDP, TCP is a monstrously complex protocol. The reason why it is so complex is because it tries to address some very hard problems in the domain of computer science.

One of the biggest problems in computer science is how to reliably communicate over an unreliable channel. To make that concrete, let's go back to our postal service example. You can to communicate with your friend and agree on a date and time to meet somewhere. Suppose, only way you can communicate is by sending each other letters or postcards through the postal service. How can you reliably guarantee to set an agreed date and time for your meeting? The simple answer is you can't, since there is always a chance that your letters might get lost and never arrive.

Imagine this, if your initial letter proposing a date/time is lost in the system, will your friend even know about your desire to meet, let alone the particular date/time you've proposed?

On the other hand, maybe they did receive your letter and accepted the date/time you proposed and responded with another letter to that effect, but, maybe that letter got lost in the system. They are now thinking that you have both agreed and are meeting, but as far as you are concerned, you never got an acknowledgment from your friend so the meeting is not on.

We can add more letters and more messages to this sequence to make it more and more likely that you can agree on a meeting date/time, but we can never 100% guarantee that you can always be in agreement in every situation, no matter what we do.

This is called the "Two Generals' Problem" in computer science literature and was first published [in a 1975 paper](http://hydra.infosys.tuwien.ac.at/teaching/courses/AdvancedDistributedSystems/download/1975_Akkoyunlu,%20Ekanadham,%20Huber_Some%20constraints%20and%20tradeoffs%20in%20the%20design%20of%20network%20communications.pdf). The general result of a rigourous analysis of the problem is that it is unsolveable.

<iframe width="560" height="315" src="https://www.youtube.com/embed/IP-rGJKSZ3s" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

How is this related to TCP, you might ask! Well, unlike UDP, TCP tries to guarantee reliability and ordering for the messages transmitted. Since the networks TCP operates on are not guaranteed to be reliable themselves, in order to guarantee reliability TCP has to address this "Two Generals' Problem".

As we said, the problem is unsolvable in general, but there are ways to address enough of the problem to get a reasonable level of "reliability" and that is exactly what TCP delivers.

#### Connection Establishment

The signature TCP mechanism is the mechanism it uses for establishing a connection. It uses what is called a three-way handshake where the two parties exchange 3 messages to establish and initiate a connection where they have agreed on the parameters. Going back to our Alice and Bob examples, when Alice wants to initiate a connection with Bob, this is what she does:

1. **SYN**: Alice first creates a random sequence number `A` and sends that to Bob in a TCP segment that is marked as a `SYN` message. The `SYN` here is short for Synchronization. This initial message is Alice's attempt to synchronize on the communication parameters with Bob.
2. **SYN/ACK**: When Bob receives the `SYN` segment from from Alice, it stores the sequence number `A` sent by Alice for future reference, and sends back a TCP segment that is marked as both a `SYN` and an `ACK` message. The `SYN` has the same meaning as before, and to accompany that `SYN`, Bob is also sending his own sequence number `B`. The new `ACK` flag here means that this segment is also an Acknowledgement of the initial `SYN` message received from Alice. In order to make sure the `ACK` can be tied back to the initial message received from Alice, the acknowledgement number is set to `A + 1`. This way Bob is communicating back that he has received Alice's message and is now trying to do synchronization on his sequence number as well.
3. **ACK**: Finally, when Alice receives the `SYN/ACK` message, she checks that the acknowledgement number matches what she expects, namely that it is `A + 1`. If that is the case, she stores Bob's sequence number `B` for future reference and sends an `ACK` segment back to Bob with the acknowledgement number set to `B + 1`.

At the end of the third step, if all the messages made it through, then both parties have agreed on each other's sequence numbers that they can use in future messages and they are confident that the other party got their messages so far. Thus, a connection is established.

From now on, whenever either Alice or Bob is going to send TCP segments to each other, they will also mark them as `ACK` messages and include the last known sequence number of the other part plus 1 as the acknowledgement number. This ensures that the communication always happens as part of a sequence and the chain is not broken. Thus, at every step both parties know that their messages were received, since they get acknowledgement messsages back for them in a unique way.

So what happens if messages get lost? Let's analyse a few scenarios:

1. **The initial SYN segments all get lost**: In this case, Alice will not get a `SYN/ACK` segment as a response for her original `SYN` segment. To solve this case, TCP requires Alice to start a timer when she sends the first `SYN` segment and if she didn't get the `SYN/ACK` response within a certain time, to resend the `SYN` segment again. This repeated a set number of times after which if Alice still didn't get a response, it is reported as a TCP connection timeout. This is, for example, what happens if your server is down and a client tries to initiate a connection. The connection waits for a bit and then gives the user a TCP connection timeout error.
2. **The SYN/ACK responses all get lost**: As far as Alice is concerned, the situation is the same, she will run the timers again and will retry her transmissions for a number of times. However, for Bob, this situation is different. In this scenario, Bob got the initial message from Alice and is trying to acknowledge it but is also trying synchronize. So he does the same thing as Alice and starts a time. If Bob, does not get an `ACK` for his `SYN/ACK` segment, he will retry the `SYN/ACK` response again and again until he gives up. In this case, Bob will report a client trying to connect but never succeeded to establish the connection.
3. **The final ACK segments all get lost**: This time, Alice has received a response back from Bob, so as far as she is concerned she is synchronized with him. However, the situation for Bob is the same as the previous case, he never gets acknowledgement of the synchronization that he sent. So he keeps retrying and retrying until he gives up.

In all cases, both parties will realize that something is wrong and will report the situation after some timeouts and retries. However, to give that guarantee TCP requires entities on both sides to not only to keep a record of sequence numbers and which segments got acknowledgement or not, but also to keep some timers as well.

All of this makes TCP a very complicated protocol to implement and execute. But the benefit is the increased reliability guarantees that this brings.

#### Ordering

Up to now, we have been using the sequence numbers in TCP segments as identifiers for the `ACK` packages. But, they also serve another purpose. Since sequence numbers are always incremented on both sides before the next segment is sent out, it can also be used for making sure that segments can be ordered properly upon receipt.

If Bob receives two TCP segments where the first one has sequence number `A + 1` and the next one has sequence number `A`, then he can know to place the data in the second segment before the data in the first segment.

This is like you sending your friend a book page by page as separate letters. If your friend receives page `87` when the last page they have received was `82`, they know that they are missing 5 pages, so will be waiting a while for those pages to make it through before reading page `87`. But, of course, your friend does not know how long to wait for the missing pages and will after a long enough time while deem missing pages as lost and close the communication.

#### Timeouts

Thus, ensuring proper ordering also requires some timeouts. Thus, each endpoint also needs to keep timers for reads and writes. That is why sometimes you get "Read timeout" or "Write timeout" errors from the network. It means the remote party didn't send or respond within a reasonable amount of time.

#### Summary

TCP ends up trading complexity of implementation for certain guarantees in return. This is a good trade-off for many applications where any missing or out of sequence data could be very important. For example, if your clients are sending you their form submissions on your website, you don't want to save their data with some missing details or even worse with their first names and last names in the wrong way around. That would be terrible. That is why TCP is:

- **Reliable**: TCP has acknowledgements, retransmissions and timeouts to ensure reliability. Thus, TCP can ensure that either there is no missing data, or the connection is dropped since there is a problem with transmission.
- **Ordered**: By using the sequence numbers, TCP can ensure that data received is properly ordered. It uses some buffers to store out-of-order data until it has received all the missing pieces.
- **Heavyweight**: Due to all the acknowledgements, retransmissions, timeouts, buffers and state that needs to be kept on each end, TCP ends up being a very heavyweight protocol.

There are still some aspects of TCP that we haven't mentioned here, like flow control and congestion control, that are beyond the scope of this exposition. We strongly urge the reader who is interested to read up more about those topics too.

## Next Part

In the [next part of the series](/wBiVlQOyThmZwBYpZLi5-g), we will finally get a chance to talk about the final 3 layers of the network stack. Despite being separate layers in the OSI model, most of the time the final three layers are all collapsed into Layer 7, the Application Layer, with the responsbilities of the layers in between divided up into lower or higher layers.

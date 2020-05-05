---
title: Network
description: A look at layer 3 of the network stack. How can we communicate over networks of networks where each networks independently?
tags: RailsConf 2020, Blogpost, Talk
---

# Part 4 - Network Layer

In the previous part of the series, we were able to link computers up via some physical connection and we were able to transmit data between two nodes on the local network.

So far, though, we are still locked into our local network. All the computers we can communicate with need to be a part of our network so that we can send them our data frames.

Obviously, that is not a feasible thing to do. We can't realistically aim to connect all the computers into a single network to be able to do any kind of communication. What we can do, though, is to connect different networks together to create a bigger network. :bulb:

While that is physically an easy thing to do (just run a cable between different networks), if we still tried to act like we were all on a single local network, the system would collapse. Everyone would be sending data frames around all the networks addressed to other MAC addresses and until the switches learned which addresses were connected to which ports, the system would quickly grind to a halt.

We need to do better, we need another layer on top of the data-link layer to provide a network layer.

:::{.layer .network}
## Layer 3 - Network Layer

As we motivated in the preamble for this post, we need a higher layer to address and route traffic from one node on one local network to another node on another network. Going back to our postal service analogy, note how this is very similar to how each country has their own postal service with its rules and regulations, but our mail makes it through different countries postal networks without any concern. The reason for that for postal services is because each country has agreed to coordinate their mail delivery efforts and have standardized ways in which to route mail across this network of networks. We aim to do something similar for the Network Layer in our network stack too.

The basic requirements of the Network Layer are some form of unified addressing, some routing and traffic control, and a data unit on the Network Layer is called a "packet".

The Internet Protocol (IP) is the most common example of a Network Layer protocol. IP has two versions:
1. IPv4 which still routes most of the traffic on the Internet today, and
2. IPv6 which is the successor of IPv4 and superceeds it in many ways. However, this version still does not have widespread adoption.

The IP that you are probably most familiar with is IPv4, so we will be talking specifically about that.

Let's start going over each functionality provided by the Network Layer by investigating them in IP.

### Addressing

In IP, the standard of addressing is called an (drumroll :drum_with_drumsticks:) "IP address", which in IPv4 is a 4 byte (32 bit) number and in IPv6 is a 16 byte (128 bit) number. For IPv4, we represent that 4 byte number, by writing each byte of it in decimal form and putting dots in between. I am sure you are all familiar with that notation.

For example, an IPv4 address which would be `0111 1111  0000 0000 0000 0000 0000 00001` in binary would be practically written as `127.0.0.1` (which always points to the same machine. btw). However, do not forget that all IPv4 addresses are actually just 32 binary digits, that will be important when we are talking about routing later on.

Unlike MAC addresses, IP addresses are virtual and are not tied to any particular device. Think about the difference between the two like the IMEI number of your phone and your phone number. IMEI numbers are tied to a physical phone but you can use your phone number on any physical device. Similarly, once you have an IP address, you can use that IP address on any network device that you want.

### Routing

As we said before, the Network Layer is responsible for moving data across a network of separate networks. So we need entities on each network that know how and where to send our data so that it makes its way to the recipient.

This works almost exactly as it does in the postal network example we gave in the [first part of these series]({% link _pages/part1.md %}). Each node that routes data on the Network Layer is called a "router", so each router is, thus, a Layer 3 device, since they can read the network layer protocol. Routers are connected to multiple networks and provide the role of the gateway between them.

So how does this work exactly? Let's dive in on an example:

![Image of a Network of Networks](/assets/images/multiple-networks.png)


Here there are two networks connected to each other. There is a node on the network on the left with IP address `192.168.1.2`, let's call it Alice, who wants to send data to node on the network on the right with the IP address `192.168.10.5`, let's call it Bob.

The two networks are connected by a router that sits on both networks, let's call the router Charlie. Charlie has two IP addresses since it lives in two networks, let's say its IP address is `192.168.1.1` on the first network and `192.168.10.1` on the second network.

Now, when Alice wants to send some data to Bob, it first checks to see if Bob's address is on the same network as Alice. (How does this happen, you might ask, more details on that later.) When Alice realizes that Bob is on a separate network, Alice knows that she needs to first send the data to Charlie. (Again, how did Alice know to send the data to Charlie? Again, more details later.) When Charlie receives the packet, it inspects the destination address and sees that it is an address on the other network and sends the data to Bob directly.

We can expand this scenario to multiple hops across multiple routers across many different networks, the basic concept is always the same. Each router has a lookup table of which IP address range needs to be communicated through which network they are connected to and always route the packets in that direction.

Notice, again, how this is very similar to what happened with our letter on its journey across the postal services around the world. Each routing node only needed to check if the delivery was being made to a different jurisdiction and forwarded it to the next hop on the journey. The same thing happens here.

Now, there were a couple of points that were left unclear in the previous story. How did Alice know that Bob was on a different network? And, how did Alice know about Charlie and that it should send the payload via Charlie to reach Bob?

The simple answer is that Alice needs more configuration than just its IP address. The most basic configuration on any node in an IP network needs 2 more pieces of information. You might have seen these fields if you ever tried to do any network settings:

1. Subnet Mask
2. Default Gateway

<!--
![Image of IP Settings from Windows](https://via.placeholder.com/600x200/ff00ff/000000?text=Windows+Network+Settings)
 -->

Let's see what these settings mean:

#### Subnet Mask

Subnet Mask is a value that allows a node to check if a given IP address is on the same network as the node or not. When Alice (with the IP address 192.168.1.2 remember) wants to send data to Bob, she has to first mask her own IP address with the subnet mask and to compare it with Bob's masked IP address. If the results are the same, then they are on the same network and communicate directly. If the results are different, then the data needs to be sent via some gateway.

Let's see this in the above example. Suppose the subnet mask for both networks above are defined as `255.255.255.0`. Now, what Alice does is the following with her IP address:

{% highlight math %}
Alice's IP address:  192.168.001.002
Alice's Subnet Mask: 255.255.255.000
bitwise AND
----------------------------------
                     192.168.001.000
{% endhighlight %}

The reason for the result above is because `255` in binary is actually `0b11111111`, so has all of its bits set. Whenever we do bitwise AND, we line up the two given numbers and look at the corresponding bits in both numbers, compute the AND, and write the resulting bit in the same location of the result. When we AND any bit with a `1`, the result is always the original value of the bit. Similarly, when we AND any bit with a `0`, the result is always `0`. So by sequencing a string of `1`s followed by a string of `0`s we effectively are able to just mask the leading N binary digits of an IP address. `255.255.255.0` masks the first 3 bytes and zeros out the last byte.

Alice does the same calculation with Bob's IP address(which was `192.168.10.5`):

{% highlight math %}
Bob's IP address:    192.168.010.005
Alice's Subnet Mask: 255.255.255.000
bitwise AND
----------------------------------
                     192.168.010.000
{% endhighlight %}

And now, Alice compares the results. Since `192.168.1.0` is not the same as `192.168.10.0`, Alice knows that Bob is on a different network.

So Alice needs someone to relay the message, and that is the next piece of information that Alice needs.

#### Default Gateway

This setting is basically the IP address of the device on your local network that is able to route data to other networks. Whenever, you discover that an IP address you want to communicate with is on another network, you need to send the data to this IP address first. They (hopefully) know what to do with that message.

In our example above, the Default Gateway for Alice would be Charlie's IP address that is on the same network as Alice, namely `192.168.1.1`.

Notice that, by definition, your IP address should be on the same network as the IP address of your default gateway.

#### In Network Communication

Ok, so far so good. But there is one huge thing we didn't explain yet. The network layer only knows about IP addresses, but we already said in the previous part of the series that the data-link layer (which we are assuming to be Ethernet) addresses machines using MAC addresses. So, if Alice wanted to talk to Dolores (with IP address `192.168.1.20`) who is on the same network as Alice, how would Alice know where to send data to?

The answer is discovery of IP address to MAC address mapping using a protocol called Address Resolution Protocol (ARP, for short). In a nutshell, whenever Alice wants to send data to Dolores's IP address, Alice looks up her ARP Table for an entry for `192.168.1.20`. If there is an entry, then that would be Dolores's machine's MAC address, so the data gets sent there.

If there is no entry in the ARP table for `192.168.1.20`, then a broadcast ARP message is sent on the network that basically says:
> Whoever has the IP address `192.168.1.20`, can you please respond back with your MAC address? Kthxbye

Upon receiving this ARP message, all computers on Alice's network ignore it except for Dolores's machine. Dolores's machine responds to Alice with a message saying:

> Oh, I have the address `192.168.1.20` and my MAC address is `01:23:45:67:89:12`. Please keep a record so that you don't forget.

When Alice gets the message, she makes a note of the mapping in her ARP table and proceeds to send the data to Dolores's machine's MAC address on the data-link layer.

If you want to see the ARP table on your computer, open up a shell right now and type `arp -a`. It would show you something like the following:

<script
  id="asciicast-3HUDgxOPSdRD9ftkTEvGatlSR"
  src="https://asciinema.org/a/3HUDgxOPSdRD9ftkTEvGatlSR.js"
  data-size="small"
  data-speed="2.5"
  data-rows="14"
  async
></script>

You should be able to remove entries from the table using `arp -d 192.168.1.11` (might need `sudo`) and query new ones using `arp 192.168.1.211`.

### Packet Structure

Just for the sake of completeness, here is what an IP packet looks like this:

| Header   | Data |
| -------- | -------- |
| 20-32 bytes | 0 - 65,515 bytes     |

Where the fields in the `Header` are:

| Field    | Length   | Explanation |
| -------- | -------- | -------- |
| **Version**  | 1 nibble | For IPv4 this is always `4` |
| **Internet Header Length** | 1 nibble | Since the Header is variable length, this encodes the number of 4 byte units that make up the header |
| **DSCP**     | 6 bits | Provides a field to indicate different types of service that might have differing networking needs |
| **ECN**      | 2 bits | Allows for end-to-end congestion notifications |
| **Total Length** | 2 bytes | Encodes the total length of the IP packet (including the header size, in bytes) |
| **Identification** | 2 bytes | This field is needed to reassemble an IP payload that might have been divided up (fragmented) into multiple packets |
| **Flags** | 3 bits | Again, to control and identify fragments |
| **Fragment Offset** | 13 bits | An offset to specify where in the assembled payload this fragment will fit |
| **Time to Live** | 1 byte | This field is designed to make sure data packets do not keep circulating in the network indefinitely. Each time a packet is routed to another network, this field is decremented by 1, and when the field value reaches 0, the packet is dropped and a message is sent to the source address of this fact. This will prove useful further on |
| **Protocol** | 1 byte | A field that defines the protocol used in the body of the packet data field. |
| **Header Checksum** | 2 bytes | A 16-bit checksum of the header field to ensure that the header data is not corrupted. Note that there is no checksum to ensure integrity of the packet data. That is the responsibility of the upper layer |
| **Source IP Address** | 4 bytes | The IPv4 address of the sender of the packet |
| **Destination IP Address** | 4 bytes | The IPv4 address of the intended receiver of the packet |
| **Options** | variable length, often 0 bytes | This is an optional field included for extensibility. Often not used |

That is quite a number of fields there! However, do not be dismayed, most of the fields are to serve some of the edge case situations like fragmented packets, etc.

Let's zoom in a little on the essential fields here.

#### Destination IP Address

This is the most critical piece of information in the data packet header, since it tells who the ultimate intended recipient of the packet is. Note that, we are operating on a network of networks now, like postal network, so routing will be handled by entities/nodes that have no idea who the packet is from. So we need a uniformly identifiable address for the destination. In IPv4 packets, that is the 32 bit IP address of the destination.

#### Source IP Address

This is field is analoguous to the sender address in our postal network letter example. We need the sender address to be available in our data packets so that, in case of a problem, or in case some entity along the path want to signal something important about the data packet we sent out to the network, we can be notified. We include the 32-bit IPv4 address of our source node for IPv4 communication.

#### Time to Live

As explained above, this field is here to ensure that the data packet does not enter an infinite loop in the network and keep consuming resources. Going back to our postal network analogy, imagine if our local head post office in Nicosia, Cyprus had a problem where all mail to the US kept being sent back to our local branch post office in Paphos, Cyprus. The branch would send it back to the head office, only for it to be sent back again, causing a letter that never gets delivered but always keeps going around in circles. The TTL is to prevent that from happening in our networks.

It was originally meant to encode actual time in seconds, but it ended up being easier to use it as a counter field where it gets decremented each time the packet gets routed by a router. When the counter reaches 0, the packet is deemed not-deliverable and dropped. A message is sent to the source address to inform them of the fact that the packet was dropped, so they can retry if they want to.

#### Protocol

This is a bit of an interesting field since it encodes the concrete protocol type that this data packet is carrying. Thus, it is a bit of a leak through the layers where the Network layer needs to be aware of the concrete protocol that lives in the Transport layer. But this field comes in handy for routing purposes, so 🤷‍♂️.

Some of the common payload protocols are:

| Protocol Number | Protocol Name | Abbreviation |
| -------- | -------- | -------- |
| 1     | Internet Control Message Protocol     | ICMP     |
| 2     | Internet Group Message Protocol     | IGMP     |
| 6     | Transmission Control Protocol     | TCP     |
| 17     | User Datagram Protocol     | UDP     |

### ICMP

Before we leave the network layer, there is one last protocol that operates at this layer we want to mention and that is the Internet Control Message Protocol (ICMP).

ICMP is a part of the Internet protocol suite and defines a mechanism for providing control or diagnostic on the network.

The simplest example of an ICMP message is the `Echo Request` message. When a network node sends an ICMP `Echo Request` to another node's IP address, the receiver will send back an ICMP `Echo Response` message. This is a very simple ping-pong mechanism built into the IP network layer and you have probably used this a million times already, it is how `ping` works. :smile:

Every time you do a `ping 8.8.8.8`, your machine is sending an ICMP `Echo Request` message to the machine at IP address `8.8.8.8`. An when `8.8.8.8` receives our request, it sends an `Echo Response` message back to our machine. Thus, the `ping` command can calculate the difference between when it sent the initial message and when it received the reply to calculate a roundtrip time. There is no magic in what `ping` does, it just operates at Layer 3 of the network stack.

<script
  id="asciicast-YWJoZzzPiyTbtvqvH38l2np5l"
  src="https://asciinema.org/a/YWJoZzzPiyTbtvqvH38l2np5l.js"
  data-size="small"
  data-rows="14"
  async
></script>

Remember how we talked about `Time to Live` (TTL) above and how we said that if TTL ever gets to `0`, the source address is sent a message. Yes, that message is also in ICMP format and is called the ICMP `Time Exceeded` message. When a sender receives an ICMP `Time Exceeded` message, it knows which router dropped the packet and which packet it was. Did you ever wonder how `traceroute` (`tracert` on Windows) worked? Well now you know.

When you do `traceroute -n 8.8.8.8`, your machine sends an ICMP `Echo Request` packet addressed to `8.8.8.8` with the TTL field set to `1`. When your default gateway (which is the next hop on the route), gets that packet, it decrements the TTL field to `0` and decides to drop the packet. But it also sends an ICMP `Time Exceeded` message to your computer. `traceroute` catches that message and displays which IP address it came from.

Next, `traceroute` sends another ICMP `Echo Request` packet towards `8.8.8.8`
but this time with TTL set to `2`. Now, the packet will be dropped at the hop after our default gateway and we will receive a message from that router. `traceroute` will show us the IP address of that host.

And this will go on and on until the TTL is long enough for the packet to reach `8.8.8.8` upon which our computer will get an ICMP `Echo Response` packet back and `traceroute` knows we've reached to host.

This way, `traceroute` is able to show us all the hops in the network that our packets make their way through to get to `8.8.8.8`, which looks something like this:

<script
  id="asciicast-kJjH1HaJv81pv0Z3fV9IABiPW"
  src="https://asciinema.org/a/kJjH1HaJv81pv0Z3fV9IABiPW.js"
  data-size="small"
  data-speed="1.5"
  data-rows="20"
  async
></script>

:::

## Next Part

This wraps it up for the Network Layer, in the [next part]({% link _pages/part5.md %}) we will step up one more layer and investigate the Transport Layer.

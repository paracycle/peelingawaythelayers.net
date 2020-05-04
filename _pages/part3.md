---
title: Physical and Data-Link
description: A look at the first two layers of the network stack. How can we physically make computers talk to each other and how can we make them address each other?
tags: RailsConf 2020, Blogpost, Talk
---

# Part 3 - Layers 1 and 2

At the beginning there was only one computer, sitting alone.

![Single Computer](/assets/images/alice.png)

There were other computers around but there was no way for them to communicate.

![Two Disconnected Computers](/assets/images/alice-bob.png)

Then, someone came along with a cable and connected them using small electrical signals. The computers were happy, they could finally talk to other computers.

![Two Connected Computers](/assets/images/alice-bob-connected.png)

:::{.layer .physical}
## Physical Layer

The connection that we have to make between two comupters has to be some physical connection. We can think of the connection as a physical wire that carries some signal using electricity or light, or we can also think about wireless connections where the signal is carried by electromagnetic waves travelling through spacetime.

Whatever we choose as the physical connection layer, though, needs to provide facilities to ensure that data can be communicated in both directions (maybe not simultaneously) and there is a clear boundary between when a data packet starts and ends.

The physical layer of the network stack, is thus, responsible for ensuring that the digital bits handed off to it is converted to the appropriate physical signals and transmitted over the connecting medium. Moreover, since each media has a certain capacity for how much communication it can handle, the physical layer is also responsible for ensuring that it is not sending data faster than what the connection can handle.

Common physical layers are the twisted pair CAT-5 or CAT-6 cables for Ethernet, electromagnetic waves at 2.4GHz or 5Ghz frequencey for WiFi, etc.

![CAT6 Cable](https://via.placeholder.com/600x200/ff00ff/000000?text=CAT6+Cable+Image)

An interesting thing to notice for the physical layer is what happens if we connect more than two computers together. How should data flow in that case?

Since these networks are packet switched, there are no circuits of communication as it exists over phone lines for example. So we can't just split a CAT6 cable and run it to two different computers, we need an active device in between to duplicate the signal across to the other cable.

![Three computers connected](/assets/images/alice-bob-charlie.png)

The thing that sits in the middle there is called a "hub" and does something very simple: it just receives signals on any port and broadcasts the same signal over all the other ports. Thus, there is no logic in a simple hub and, for that reason, it is quite wasteful. But it is also the simplest network device you can build.

Since a Hub operates on the physical layer, it is called a Layer 1 (or L1) device.

By the way, each data unit that is sent over this layer is called a "Symbol"
:::

::: {.layer .data-link}
## Data-link Layer

The data-link layer is when things start getting interesting. Now that we have a way of connecting multiple computers together, we need a way for one computer to say that it wants to talk to another computer directly. After all, we cannot keep shouting our messages across the whole network all the time.

For this reason, at this layer, we start assigning addresses to our endpoints. For Ethernet networks or networks in the same family, these addresses are what are called the MAC (Medium Access Control) addresses. Traditionally MAC addresses are physical identifiers that comes encoded into a physical network card. Each maker of a network card (or a network card chip) has a unique prefix identifier and then they add a unique number behind that prefix to construct a unique number for each of the network cards/devices they produce. Thus, each network endpoint on an Ethernet network comes pre-installed with a unique address.

The protocols on the data-link layer allow communication to happen between one node with a unique MAC address and another node with another MAC address. The layer is also responsible for doing error correction for the data packets that are sent and received.

If there is a hub in the network that is still operating in our network, our signals will still be broadcasted to all the network. However, now that we are addressing our communication to a particular endpoint, other nodes will know to drop our packages since the message was not intended for them.

But now that we have identifiers for the sender and recipient going across the wires, we can do one better for handling the traffic across our network. We can build something better than a network hub and we can make it understand the particular Layer 2 protocol that our network is speaking. This device, which is a L2 device, is commonly called a "switch".

What a switch does above a hub is to always listen to the traffic going into and out of all the ports. By doing that and observing the Layer 2 traffic, it can figure out which MAC addresses are attached to which port. Once it can do that, it can also look at incoming packets and can intelligently only deliver them on the port that the recipient is attached to.

And, just like that, we stop always shouting across our network.

Common examples of concrete Data-Link Layer protocols are IEEE 802 based networks which include Ethernet (802.3), Wi-Fi (802.11a/b/g/n) and ZigBee (802.15.4).

Each data unit sent over this layer is called a "Frame". And an Ethernet frame looks something like this:

| MAC destination | MAC source | 802.1Q tag (optional) | Length | Payload | Frame check sequence (32‑bit CRC) |
| -------- | -------- | --------- | --------- | --------- | --------- |
| 6 bytes  | 6 bytes  | (4 bytes) | 2 bytes | 46-1500 bytes | 4 bytes |

There are a few interesting things to note here:

1. Each MAC address is 6 bytes long. So we can write MAC addresses as 12 hex characters and we usually put a : or a - between each byte. So MAC addresses look something like 01:23:45:67:89:12
2. The frame has both a source and destination MAC address.
3. Each frame has a CRC32 checksum, using which, the destination can check to see if there was any corruption in the data that was sent.
4. The 802.1Q tag field is optional, but when it is used, it is for creating virtual LANs, where you can have multiple distinct data-link networks operating on the same physical network infrastructure. To make sure the correct data packets go to the correct networks, you also need to have your network equipment, like switches, understand and act on these tags.
5. The data that the frame can contain is variable length. So if we just want to send 3 bytes, we set the `Length` value to 0x3 and put the 3 bytes as the payload right behind it.
:::

Remember that the data carried in an Ethernet frame is nothing more than the data packet passed to the Data-Link layer from the layer above, which is the Network layer. That layer we will cover in our [next part]({% link _pages/part4.md %})

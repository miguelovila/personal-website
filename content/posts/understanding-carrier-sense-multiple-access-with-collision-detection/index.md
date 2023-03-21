---
title: 'Understanding Carrier Sense Multiple Access with Collision Detection'
date: '2023-01-02'
author: Miguel Vila
description: 'This article explains the CSMA/CD method, which is used to minimize the probability of packet collisions in a network. It discusses how the method works, its limitations, and how it addresses the problem of collisions.'
draft: false
tags:
  - networks
  - collisions
---
When a network has multiple connected clients that are always communicating, the probability of packet collision increases. Hence, the need to develop a method that can reduce the likelihood of this happening: Carrier Sense Multiple Access (CSMA).

## Carrier Sense Multiple Access

With this method, before the client starts communicating on the network, it first evaluates the current state of the network, i.e., whether the network is free or transmitting packets from other clients. Thus, by having this perception of what is happening in the network before transmitting, the number of collisions is minimized.

However, this method still does not completely solve the problem. In cases where clients are far apart from each other, the delay in signal propagation can be responsible for packet loss:

1. Client A, 500 meters away from client B, starts transmitting;
2. Client B, at the same time as client A initiates the transmission, evaluates the medium and checks that no one is transmitting (client A's signal still takes time to propagate in the network) and then begins to transmit;
3. Meanwhile, the transmission of B and the transmission of A collide in the network.

## Carrier Sense Multiple Access with Collision Detection

Carrier Sense Multiple Access with Collision Detection is a method that monitors the state of the network before initiating the transmission. If the network is free, it starts transmitting by sending a packet and then evaluating the state of the network to see if packet collision occurred or not. If it detects a collision, it stops the transmission.

Now let's take a closer look at how this method works:

When a client has a packet to send, it first checks the state of the network: if the network is free for a period of time IFS (Inter Frame Spacing), it initiates the transmission; if the network is busy, it waits for a period of time IFS and checks the network status again.

> Inter Frame Spacing (IFS) is an interval of time between the transmission of two consecutive data packets in a network with CSMA/CD. The goal of IFS is to allow each device on the network enough time to detect collisions and transmit a JAM signal.

When multiple clients initiate a transmission at the same time on the network, a collision occurs, i.e., multiple packets are being transmitted at the same time and, therefore, will not be received correctly by any client.

When this collision occurs, all devices involved in the collision stop the transmission and send a JAM signal to alert other clients that a collision has occurred. After the JAM signal, the devices involved in the collision wait for a random time before trying to initiate the transmission again.

> A JAM signal consists of small pulses of energy that are transmitted through the network to alert all other devices that a collision has occurred.

This random time is determined by the Truncated Binary Exponential Backoff algorithm. This algorithm sets a base time to wait and doubles it for each subsequent collision. For example, if the base time is set to 64, the waiting time for each collision will be 64, 128, 256, 512... To avoid excessive waiting times, this algorithm limits (truncates) the waiting time. The maximum waiting time depends on the size of the network and the speed at which devices are transmitting.
---
title: "Mining DETI coins across CPUs and GPUs"
description: "A C and CUDA performance project exploring SIMD, OpenMP, GPU search, and a TCP collector, with measurements from the original experiments."
language: en
translationKey: deti-coin-miner
draft: false
publishedDate: 2026-10-03
status: completed
featured: true
featuredOrder: 2
technologies: [C, CUDA, OpenMP, AVX2, AVX-512, WebAssembly]
tags: [high-performance-computing, parallel-computing, networking]
repositoryUrl: https://github.com/miguelovila/mining-deti-coins
coverImage: ../../assets/deti-coin-miner/cover-image.png
coverImageAlt: "Terminal capture from the project report showing a mining server receiving coins from AVX and AVX2/OpenMP clients."
---

A DETI coin is a 52-byte message whose MD5 hash ends in at least eight hexadecimal zeros. Finding one takes about 4.3 billion attempts on average. The assignment gave us a small loop with a lot of work to do: generate a candidate, hash it, check the result, and repeat.

I did most of the implementation for this 2024 High Performance Architectures project at the University of Aveiro, submitted with Matilde Teixeira. We extended reference code supplied by Tomás Oliveira e Silva with more search implementations, wider vectors, multicore execution, a CUDA miner, and a TCP collector. The original experiments ranged from about 9.76 million attempts per second on one CPU thread to 4.54 billion on a GTX 1050 Mobile.

## Eight messages in one vector

Each candidate is independent, which makes the search a good fit for parallel execution. With SIMD, one thread can advance several MD5 calculations at once: four candidates with the AVX version, eight with AVX2, and sixteen with AVX-512F.

The important part is the layout. An AVX2 vector holds the first 32-bit word of eight different messages. The next vector holds their second word, and so on. An addition or bitwise operation then performs the same step for all eight hashes.

The supplied MD5 core is specialized for 52-byte messages, so a candidate and its padding fit in one MD5 block. Macros define operations such as rotation and data access, allowing scalar, vector, and CUDA implementations to share the hash rounds.

OpenMP adds another layer: each CPU thread owns its candidate buffers and processes its own batch of vector lanes. Hashing stays outside critical sections; initialization and saving discoveries need coordination. At the end, reductions combine the attempt and coin counts.

## Keep unsuccessful candidates on the GPU

Most hashes lead nowhere. Copying every candidate to the GPU and every result back would move a lot of data to learn that almost all of it can be discarded.

Our CUDA kernel generates candidates on the device, combining random bytes, thread-derived values, and a counter supplied by the host. Each GPU thread checks 95 candidates per launch. When a candidate passes, an `atomicAdd` reserves room for its message in a shared output buffer.

The CPU retrieves that 4 KiB buffer, saves or forwards discoveries, and launches another batch. Candidate generation and the unsuccessful hashes remain on the GPU. The small transfer is possible because the result we care about is rare.

## What the measurements say

These rates come from the attempt counts in our original 120-second runs. They are historical results from the project report, not new benchmarks.

| Search               | Hardware               | Approximate attempts/second |
| -------------------- | ---------------------- | --------------------------: |
| Scalar, one thread   | Intel Core i7-7700HQ   |                9.76 million |
| AVX, one thread      | Intel Core i7-7700HQ   |               28.06 million |
| AVX2, one thread     | Intel Core i7-7700HQ   |               50.94 million |
| AVX-512F, one thread | AMD Ryzen 7 7745HX     |              134.98 million |
| CUDA                 | NVIDIA GTX 1050 Mobile |                4.54 billion |

The cleanest comparison is on the same CPU: AVX2 tested about **5.2 times as many candidates** as the scalar baseline. The AVX-512 result also includes a change of machine. Attempt counts measure work performed, so repeated candidates still count.

The report's separate AVX2/OpenMP comparison reached 79.936 billion attempts in 120 seconds with debugging disabled. The debug build reached 13.559 billion. That difference includes both diagnostic output and a compiler change from `-O0` to `-O2`; it cannot be credited to removing print statements alone.

## A phrase can change the cost of searching

One variant finds coins containing text supplied by the user. It preserves the phrase, adds four random bytes, and increments the remaining printable characters. When that counter runs out, it generates fresh random bytes and starts again.

In 120 seconds, the phrase `AAD!` allowed roughly 75.38 billion attempts. The longer `Arquiteturas Alto Desempenho 24/25!!` allowed about 713 million. It uses all 36 available text bytes, leaving one counter byte after the random prefix. Each lane needs reinitialization after only 95 candidates.

The hash calculation did not change. The amount of work around it did. This was a useful example of why optimizing the MD5 rounds alone could not explain the whole search.

## Several machines, one vault

The TCP collector lets different backends report to the same server. A client sends `HELLO` with its hostname, backend, and thread count; the server returns `CONFIG`; discoveries arrive as `COIN_FOUND`. The screenshot above comes from the original report and shows clients using different search modes together.

The server recomputes the hash before storing a submitted coin. It does not allocate disjoint search ranges, so separate workers can repeat work. That is a clear next step for longer distributed runs, alongside synchronization around the shared vault.

There is also a separate Emscripten build of the scalar search. It runs in a browser, independently of the native workers. The report records one billion attempts on both a laptop and a Pixel 8; the committed version uses a smaller fixed attempt count.

The [repository](https://github.com/miguelovila/mining-deti-coins) includes build instructions and correctness checks against `md5sum`. The [original report](https://github.com/miguelovila/mining-deti-coins/blob/main/report.pdf) contains the measurements, and the [assignment](https://github.com/miguelovila/mining-deti-coins/blob/main/proposal.pdf) documents the reference code we started from.

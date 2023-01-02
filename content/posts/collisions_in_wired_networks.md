---
title: "Collisions in Wired Networks"
date: 2023-01-02T11:48:07Z
draft: false
authors: ["Miguel Vila"]
description: "Understanding how CSMA and CSMA/CD works."

categories: ["network"]
---
Quando uma rede passa a ter múltiplos clientes conectados que estão sempre a comunicar, a probabilidade de haver colisão de pacotes aumenta. Por isso, houve a necessidade de desenvolver um método que fosse capaz de reduzir a probabilidade disso acontecer: Carrier Sense Multiple Access (CSMA).

## Carrier Sense Multiple Access

Com este método, antes do cliente começar a comunicar na rede, avalia primeiro o estado atual da rede, ou seja, se a rede está livre ou a transmitir pacotes de outros clientes. Assim, ao ter esta percepção do que se passa na rede antes de transmitir, o número de colizões é minimizado.

Porém, este método ainda não resolve completamente o problema. Em casos em que os clientes estão distânciados uns dos outros o atraso da propagação do sinal pode ser responsável pela perda de pacotes:

- Um cliente A a uma distância de 500 metros de outro cliente B começa a transmitir;
- O cliente B, ao mesmo tempo que o cliente A inicia a transmissão, avalia o meio e verifica que ninguém está a transmitir (o sinal do cliente A ainda demora a propagar-se na rede) e então começa a transmitir;
- Entretanto a transmissão de B e a transmissão de A encontram-se na rede e colidem.

## Carrier Sense Multiple Access with Collision Detection

Este método monitora o estado da rede antes de iniciar a transmissão. Se a rede estiver livre, inicia a trasmissão enviando um pacote e depois avalia o estado da rede para ver se ocorreu ou não uma colisão de pacotes. Se detetar uma colisão, para a transmissão.

Agora vejamos em mais detalhe o funcinamento deste método:

Quando um cliente tem um pacote a enviar, primeiro verifica o estado da rede: se a rede estiver livre durante um período de tempo IFS (Inter Frame Spacing), inicia a transmissão; se a rede estiver ocupda, espera por um peíodo de tempo IFS  e volta a verificar o estado da rede.

Quando múltiplos clientes iniciam uma transmissão ao mesmo tempo na rede acontece uma colisão, ou seja, múltiplos pacotes estão a ser transmitidos ao mesmo tempo e, por isso, não serão recebidos corretamente por nenhum cliente.

Quando essa colisão ocorre, todos os dispositivos envolvido nessa colisão param a transmissão e enviam um sinal JAM para alertar outros clientes de que uma colisão ocorreu. Após o sinal JAM, os dispositivos envolvidos na colisão esperam um tempo aleatório antes de tentar iniciar a transmissão outra vez.

Este tempo aleatório é determinado pelo algoritmo _Truncated Binary Exponential Backoff_. Este algoritmo define um tempo base para esperar e duplica-o para cada colisão subconsequente. Por exempo, se o tempo base está definido para 64, o tempo de espera para cada colisão será 64, 128, 256, 512... Para evitar tempos de espera excessivos, este algoritmo limita (trunca) o tempo de espera. O tempomáximo de espera depende do tamanho da rede e da velocidade a que os dispositivos estão a transmitir.

> Inter Frame Spacing (IFS) é um intervalo de tempo entre a transmissão de dois pacotes de dados consecutivos numa rede com CSMA/CD. O objetivo do IFS é permitir que cada dispositivo na rede tenha tempo suficiente para detetar colisões e transmitir um sinal JAM.
> Um sinal JAM consiste em pequenos pulsos de energia que são transmitidos pela rede para alertar todos os outros dispositivos de que ocorreu uma colisão.

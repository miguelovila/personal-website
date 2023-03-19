---
title: "Colisões em Redes Wireless"
date: 2023-01-16T11:48:07Z
draft: true
authors: ["Miguel Vila"]
description: "Compreender como as redes wireless evitam colisões."

categories: ["Redes e Comunicações"]
---

## Componentes de uma Rede Wireless

- _Station_ (STA): conhecido também por cliente, é um dispositivo sem fios que se conecta a um _access point_.
- _Access Point_ (AP): é um dispositivo ao qual dispositivos sem fios se conectam para terem acesso à rede ethernet. Consiste num transmissor e recetor de radiofrequência geralmente com uma ou mais antenas.
- _Basic Service Set_ (BSS): é o conjunto de pelo menos uma _station_ IEEE 802.11 associada a um _access point_ com uma SSID definida.
- _Extended Service Set_ (ESS): é o conjunto de pelo menos duas _basic service sets_.

> Um SSID corresponde simplesmente ao nome de uma rede wireless, por exemplo, "eduroam".

## Wireless vs. Ethernet

 Ao contrário das redes ethernet, que conseguem detetar a colisão, uma rede wireless não consegue detetar colisões já que funcionam em _half-duplex_.

> Full-duplex: transmite e recebe informação simultâneamente.
> Half-duplex: a transmissão e receção ocorrem de forma alternada.

 Além disso, como a potência do sinal diminui a cada metro quadrado, o dispositivo emissor pode até aplicar a CS e CD, mas essas colisões podem acontecer no recetor, ou o emissor, memso com CD aplicada, pode não perceber que houve uma colisão de pacotes.

### O Problema dos _Hidden Nodes_

 A deteção de colisão pode também não funcionar para _hidden nodes_. Numa rede wireless _hidden nodes_ são dispositivos que podem comunicar com outros dispositivos nessa rede, mas como não estão ao alcance uns dos outros, comunicam através de outros dispositivos.

 Por exemplo, imaginemos 3 dispositivos sem fios: A, B e C. O Dispositivo A está ao alcance do Dispositivo B e o Dispositivo C está ao alcace do Dispositivo A, mas não está ao alcance do Dispositivo B. Neste caso, C é um _hidden node_ em relação a B já que consegue comunicar com B através de A, mas não consegue comunicar diretamente com B.

 Se B e C comunicarem ao mesmo tempo com A, ocorre uma colisão em A e nem B nem C sabem que a colisão ocorreu porque estão fora do alcance.

 A solução para este problema será detetar estas colisões no recetor e criar um _carrier senser_  virtual em que o emissor pergunta ao recetor se está a receber tráfico. Na falta de uma resposta, assume que o meio está ocupado.

### O Problema dos _Exposed Nodes_

 Os _Exposed Nodes_ também não funcionam bem com a deteção de colisão: imaginemos uma rede wireless em que temos 4 terminais: A, B, C e D. Sabe-se que A está ao alcance de B, B está ao alcance de C e C está ao alcance de D. Sabe-se que A está fora do alcance de D.

 O terminal B inicia uma transmissão com A. O terminal C quer iniciar uma transmissão para o terminal D, mas não a inicia porque identifica que o meio está ocupado (neste caso por B). Aqui, como D não está ao alcance de B nem A está ao alcance de C, estas transmissões poderiam ocorrer em paralelo sem ocorrer qualquer tipo de colisão.

> Como D não está ao alcance de B nem A está ao alcance de C, A e D são _exposed nodes_.

 Assim, numa rede wireless não faz sentido os terminais usarem o método CSMA/CD já que o _carrier sense_ em zonas com muitas redes wireless iria congestionar a rede e o _collision detection_ não iria funcionar para _hidden nodes_.

## _Multiple Access_ com _Collision Avoidance_

 _Multiple Access with Collision Avoidance_ (MACA) é um tipo de protocolo de comunicação que permite que vários dispositivos sem fio transmitam e recebam informação num mesmo canal de comunicação evitando colisões entre os sinais transmitidos. Este protocolo resolve os problemas que vimos anteriormente com os _hidden nodes_ e com os _exposed nodes_.

 Este protocolo evita colisões usando dois tipos de pacotes especiais:

- _Request To Send_ (RTS): enviado antes de iniciar a transmissão;
- _Clear to Send_ (CTS): O recetor do RTS envia este pacote a indicar que está pronto para receber uma transmissão.

 Estes dois pacotes especiais contêm o endereço do emissor, o endereço do recetor e o tamanho do pacote a ser transmitido.

### _Hidden Nodes_

 Este protocolo resolve o problema dos _hidden nodes_ criado pela _collision detection_ falada anteriormente.

 Imaginemos trẽs dispositivos: A, B, C. Sabe-se que A está ao alcance de B, C está ao alcance de B, mas A e C estão fora do alcance entre si.

 1. O dispositivo A pretende transmitir para o dispositivo B, então envia um pacote RTS para B;
 2. O dispositivo B, como está livre, envia um pacote CTS para A;
 3. O dispositivo C pretende enviar um pacote para B, mas como deteta o CTS que B enviou a A, aguarda para não criar uma colisão. (isto trata-se de um _virtual carrier sense_);

### _Exposed Nodes_

 Este procolo também resolve o problema dos _exposed nodes_ criado pelo _carrier sense_, que inibe um cliente de iniciar uma transmissão, mesmo quando essa transmissão não iria originar uma colisão.

 Imaginemos quatro dispositivos: A, B, C e D. O dispositivo A está ao alcance de B. O dispositivo B está ao alcance de C. O dispositivo C está ao alcance de D. Os dispositivos A e D estão fora do alcance entre si.

 1. O dispositivo B quer iniciar uma transmissão para A, então envia um RTS. Imediatamente após, o dispositivo C pretende iniciar uma transmissão para D.
 2. O dispositivo A, como está livre, responde a B com um CTS.
 3. O dispositivo C ouviu o RTS que B enviou a A, mas como está fora do alcance de A não ouve o CTS que A envia a B, então envia um RTS para D.

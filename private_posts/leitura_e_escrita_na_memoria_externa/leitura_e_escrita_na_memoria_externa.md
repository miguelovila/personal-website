---
title: "Leitura e Escrita na Memoria Externa"
date: 2023-01-14T11:26:05Z
draft: true
authors: ["Miguel Vila"]
description: "Compreender como a informação é lida e guardada na memória externa na aqruitetura MIPS."

categories: ["Arquitetura de Computadores"]
---

A arquitetura do MIPS é do tipo _load-store_, ou seja, só é possível operar sobre valores armazenados nos registos internos do CPU. Para que seja possível operar sobre valores armazenados na memória externa, é necessário que estes sejam carregados para os registos internos do CPU. O processo de carregar valores da memória externa para os registos internos do CPU é chamado de _load_ e o processo de guardar valores dos registos internos do CPU para a memória externa é chamado de _store_.

## Modos de Endereçamento

O método usado pela arquitetura para aceder ao elemento que contém a informação é designado por "modo de endereçamento".

No caso das instruções artiméticas e lógicas (codificadas com o formato R), os operandos residem diretamente em registos internos. Este modo de endereçamento é chamado de "endereçamento tipo registo".

No caso das instruções de _load_ e _store_, os operandos residem na memória externa. O espaço de endereçamento da memória externa no MIPS é de 32 bits, pelo que o endereço de memória é representado por 32 bits. Sabendo que as instruções no MIPS são codificadas em 32 bits para codificar o endereço de memória já seriam necessários 32 bits.

A solução para este problema é em vez da instrução conter o endereço de memória, a instrução indica um registo interno que contém o endereço de memória externa a ser acedido. Este modo de endereçamento é chamado de "endereçamento indireto por registo".

Este endereçamento indireto por registo pode ainda conter um offset, que é um valor de 16 bits em complemento para dois, que é adicionado ao endereço de memória indicado pelo registo. Este modo de endereçamento é chamado de "endereçamento indireto por registo com offset".

## Instruções de _Load_ e _Store_

As instruções de _load_ e _store_ são instruções do tipo I, ou seja, são instruções que têm 32 bits de comprimento e são codificadas da seguinte forma:

| opcode |   r1   |   r2   |  offset |
|:------:|:------:|:------:|:-------:|
| 6 bits | 5 bits | 5 bits | 16 bits |

- opcode: indica o tipo de instrução (_load_ ou _store_).
- r1: indica o registo interno do CPU que contém o endereço de memória externa a ser acedido.
- r2: indica o registo interno do CPU onde o valor lido da memória externa é guardado (_load_) ou o registo interno do CPU que contém o valor a ser escrito na memória externa (_store_).
- offset: indica um valor de 16 bits em complemento para dois que é adicionado ao endereço de memória indicado pelo registo r2.

### Leitura da Memória Externa (_load_)

A instrução lw (_load word_) é usada para ler um valor de 4 bytes (32 bits) da memória externa e guardá-lo num registo interno do CPU. A instrução lw é codificada da seguinte forma:

```asm
lw $5, 4($2)      # copia para $5 o valor de 4 bytes que está na posição de memória indicada por $2 + 4
```

### Escrita na Memória Externa (_store_)

A instrução sw (_store word_) é usada para escrever um valor de 4 bytes (32 bits) de um registo interno do CPU para a memória externa. A instrução sw é codificada da seguinte forma:

```asm
sw $7, -8($4)      # copia para a posição de memória indicada por $4 - 8 o valor de 4 bytes que está em $7
```

## Exemplo de Codificação

```asm
sw $8,12($19)
```

A instrução acima é codificada da seguinte forma:

| Campos | opcode |   r1   |   r2   |        offset      |
|:------:|:------:|:------:|:------:|:------------------:|
| Decimal|   43   |   19   |   8    |          12        |
| Binário| 101011 | 10011  | 01000  |  0000000000001100  |

| Binário|    1010 1110 0110 1000 0000 0000 0000 1100    |
|:------:|:---------------------------------------------:|
| Hexa   |                   0xAE68000C                  |

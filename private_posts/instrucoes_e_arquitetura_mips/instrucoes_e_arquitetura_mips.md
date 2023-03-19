---
title: "Instruções e Arquitetura MIPS"
date: 2023-01-11T23:42:51Z
draft: true
authors: ["Miguel Vila"]
description: "Compreender a ISA do MIPS e as instruções da arquitetura."

categories: ["Arquitetura de Computadores"]
---
## Instruções e Implementação em Hardware

No desenho de um processador, a definição do conjunto de instruções a implementar exige um equilíbrio entre as facilidades oferecidas aos programadores e a complexidade do hardware necessário para a sua implementação.

## Diferentes ISA's, Diferentes Abordagens

### Formato e Codificação das Instruções

- Em algumas ISA's opta-se pela codificação das instruções com um número de bits variável, o que leva a um código mais pequeno, a uma maior flexibilidade e a uma _instruction fetch_ em vários passos.

- Outras arquiteturas, como é o caso do MIPS, optam pela codificação de instruções com um número fixo de bits. Assim, a fase de _fetch_ e _decode_ torna-se mais simples. É também mais simples de implementar em _pipeline_.

{{< admonition type=note title="Nota" open=false >}}
Como visto no artigo escrito anteriormente, _intruction fetch_ consiste na fase de leitura do código de máquina da instrução a partir da memória. Já _decode_ corresponde à fase em que a unidade de controlo descodifica a instrução. Informação mais detalhada [aqui](../../../posts/arquitetura_basica_de_um_sistema_computacional/arquitetura_basica_de_um_sistema_computacional/).
{{< /admonition >}}

### Número de Registos Internos do CPU

- Algumas ISA's optam por um número pequeno de registos internos. Assim, exige menos hardware, leva a um acesso mais rápido e faz com que possam ser usados menos bits para a identificação dos registos.

- Outras optam por oferecer um maior número de registos internos, o que leva a que não seja necessário acessar a memória com tanta frequência, faz com que certas variáveis de um programa possam residir nos registos e permite a criação de registos com restrições de utilização.

### Localização dos Operandos das Instruções

Existem essencialmente dois tipos de arquiteturas: as baseadas num acumulador e as baseadas numa pilha (_stack_).

- Acumulador: um dos operandos é implicitamente o acumulador;
- Pilha: os operandos encontram-se no topo da stack.

Vejamos o seguinte exemplo em que queremos realizar: C = A + B

|  Pilha | Acumulador |
|:------:|:----------:|
| PUSH A |   LOAD A   |
| PUSH B |    ADD B   |
|   ADD  |   STORE C  |
|  POP C |            |

Estas arquiteturas podem ainda ser do tipo _register-memory_ e to tipo _load-store_.

- _Register-Memory_: os operandos podem tanto residir na memória como nos registos internos.
- _Load-Store_: os operandos residem apenas nos registos internos e, como tal, têm de ser carregados a partir da memória através de operações _load_ e _store_.

## Convenções da ISA do MIPS

- 32 registos de uso geral, cada um com 32 bits. Como 1 word = 4 bytes = 4 * 8 bits = 32 bits, então cada registo pode armazenar uma word;
- baseada em instruções de dimensão fixa (32 bits);
- arquitetura _load-store_;
- memória _byte addressable_, ou seja, a quantidade mínima de infromação que se consegue manipular corresponde a 1 byte;
- espaço de endereçamento de 32 bits, consegue referenciar um máximo de 2³² endereços;
- barramento de dados externo de 32 bits.

Com um espaço de endereçamento de 32 bits, será possível referenciar apenas 2³² endereços. 4 GB = 4 \* 1024 MB = 4 \* 1024000000 B = 4096000000 B <= 2³². Assim, uma memória de 4 GB poderá ser usada num sistema computacional com arquitetura MIPS.

{{< admonition type=question title="Questão" open=false >}}
Com um espaço de endereçamento de 32 bits, será possível usar uma memória de 5 GB?
{{< /admonition >}}

{{< admonition type=success title="Resposta" open=false >}}
Com um espaço de endereçamento de 32 bits, será possível referenciar apenas 2³² endereços. 5 GB = 5 \* 1024 MB = 5 \* 1024000000 B = 5120000000 B >= 2³². Assim, uma memória de 5 GB não poderá ser usada num sistema computacional.
{{< /admonition >}}

## Registos Internos

- $0: registo de uso geral, contém o valor 0. Apenas pode ser lido, não pode ser escrito;
- $HI e $LO: registos de uso geral, contêm o resultado de operações aritméticas de 64 bits. HI contém os bits mais significativos do resultado e LO os menos significativos;
- $PC: program counter, contém o endereço da próxima instrução a ser executada;

Geralmente os registos têm associado um nome virtual. Por exemplo, o registo $0 é conhecido como $zero. $29 é conhecido como $sp (stack pointer) e $31 é conhecido como $ra (return address).

## Codificação de Instruções no MIPS - Formato R

Existem três tipos de formatos de instruções no MIPS, "R" é um deles. Instruções codificadas em formato R são instruções que usam a unidade aritmética e lógica para realizar as operações. Estas instruções incluem operações aritméticas, lógicas e de deslocamento.

O formato "R" usa 6 bits para o opcode, 5 bits para o registo de destino, 5 bits para o primeiro operando, 5 bits para o segundo operando e 5 bits para o registo de destino.

O "opcode" é sempre zero nas instruções de formato "R". "shamt" corresponde ao número de bits para deslocar. "funct" corresponde à operação a realizar.

### Instruções Aritméticas

#### Soma

```asm
add a,b,c # Soma b com c e armazena o resultado em a
```

#### Subtração

```asm
sub a,b,c # Subtrai c a b e armazena o resultado em a
```

#### Multiplicação

```asm
mult a,b,c # Multiplica b com c e armazena o resultado em a
```

#### Divisão

```asm
div a,b,c # Divide b por c e armazena o resultado em a
```

### Instruções Lógicas

```asm
and Rdst,Rsrc1,Rsrc2 # Rdst = Rsrc1 & Rsrc2
or Rdst,Rsrc1,Rsrc2 # Rdst = Rsrc1 | Rsrc2
xor Rdst,Rsrc1,Rsrc2 # Rdst = Rsrc1 ^ Rsrc2
nor Rdst,Rsrc1,Rsrc2 # Rdst = ~(Rsrc1 | Rsrc2)
```

{{< admonition type=note title="Nota" open=true >}}
No MIPS, o operador lógico `not` não existe. Em vez disso, usa-se o operador `nor`. Por exemplo, `not Rdst,Rsrc1` é equivalente a `nor Rdst,Rsrc1,Rsrc1`.
{{< /admonition >}}

### Instruções de Deslocamento

```asm
sll Rdst,Rsrc,shamt # Rdst = Rsrc << shamt
srl Rdst,Rsrc,shamt # Rdst = Rsrc >> shamt
sra Rdst,Rsrc,shamt # Rdst = Rsrc >> shamt (com sinal)
```

## Instruções de Transferência Entre Registos

Já sabemos que $0 é um registo especial que contém sempre o valor 0. Então para passar o valor num registo Rsrc para um registo Rdst poderá fazer-se isto:

```asm
or Rdst,Rsrc,$0
```

Para melhorar a legibilidade dos programas foi criada uma instrução virtual (um alias) que faz a mesma coisa: move.

```asm
move Rdst,Rsrc
```

No processo de geração de código de máquina, o assembler substitui move pela instrução nativa or.

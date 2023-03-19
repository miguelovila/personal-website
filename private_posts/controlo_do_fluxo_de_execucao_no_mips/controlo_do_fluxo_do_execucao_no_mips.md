---
title: "Controlo do Fluxo de Execução no MIPS"
date: 2023-01-12T10:25:10Z
draft: true
authors: ["Miguel Vila"]
description: "Aprender quais as instruções que o MIPS tem para controlar o fluxo de execução e perceber como estas funcionam."

categories: ["Arquitetura de Computadores"]
---

Durante a execução de um programa pode haver a necessidade de executar certas instruções com base em valores calculados durante a execução do programa. Assim, no MIPS existem várias instruções que controlam o fluxo do programa.

## Instruções de Controlo de Fluxo Básicas

```asm
beq $t0, $t1, label # Branch if equal
bne $t0, $t1, label # Branch if not equal
```

No caso de 'beq' se os registos $t0 e $t1 forem iguais, a próxima instrução a ser executada será a que está no endereço da label. O mesmo acontece no caso de 'bne' se os registos não forem iguais. Já se a condição não se verificar, a execução do programa continua normalmente para a próxima instrução.

{{< admonition type=note title="Nota" open=true >}}
O endereço para onde o salto é efetuado no caso de se verificar a condição chama-se endereço alvo (_branch target address_).
{{< /admonition >}}

## Outras Instruções de Controlo de Fluxo

O MIPS possui ainda outras instruções que comparam diretamente com zero, nestas instruções o registo $0 está implícito como o segundo registo a comparar.

```asm
bltz $t0, label # Branch if less than zero
blez $t0, label # Branch if less than or equal to zero
bgtz $t0, label # Branch if greater than zero
bgez $t0, label # Branch if greater than or equal to zero
```

## Instrução SLT (Set on Less Than)

O MIPS possui ainda uma fução de comparação que permite comparar dois registos e guardar o resultado numa flag. Esta função é a instrução slt.

```asm
slt $t0, $t1, $t2 # Se $t1 < $t2 então $t0 = 1, caso contrário $t0 = 0
slti $t0, $t1, 5 # Se $t1 < 5 então $t0 = 1, caso contrário $t0 = 0
```

Assim, com as instruções bne, beq, slt e slti é possível criar instruções de controlo de fluxo mais complexas.

## Instruções de Controlo de Fluxo Virtuais

Estas instruções não existem nativamente no MIPS, mas são decompostas pelo assembler em instruções nativas.

```asm
blt $t0, $t1, label # Branch if less than
ble $t0, $t1, label # Branch if less than or equal to
bgt $t0, $t1, label # Branch if greater than
bge $t0, $t1, label # Branch if greater than or equal to
```

{{< admonition type=note title="Nota" open=true >}}
É importante notar que as instruções blt, ble, bgt e bge são virtuais, enquanto as instruções bltz, blez, bgtz e bgez são instruções reais do MIPS.
{{< /admonition >}}

## Decomposição das Instruções Virtuais

|     Virtual    | Nativa Linha 1 | Nativa Linha 2   |
|:--------------:|:--------------:|:----------------:|
| bge $4,$7,exit |  slt $1,$4,$7  |  beq $1,$0,exit  |
| bgt $4,$7,exit |  slt $1,$7,$4  |  bne $1,$0,exit  |
| ble $4,$7,exit |  slt $1,$7,$4  |  beq $1,$0,exit  |
| blt $4,$7,exit |  slt $1,$4,$7  |  bne $1,$0,exit  |

## Instruções de Salto Incondicional

Se até agora vimos as instruções responsáveis por alterar o fluxo do programa com base em decisões tomadas durante a execução do programa, agora vamos ver as instruções que alteram o fluxo do programa independentemente do que aconteça durante a sua execução.

```asm
j label # Salto para a instrução que está no endereço da label
```

## Estrutura If-Then-Else

O salto icondicional é usado para a codificação deste tipo de estruturas. Caso a condição se verifique ( a>= n ) apenas deverá ser executado o primeito bloco de instruções, por isso tem-se de dar jump para o final da estrutura mal este bloco seja executado.

Código em C:

```c
if (a >= n) {
    b = c + d;
} else {
    b = d;
}
```

Tradução em MIPS assembly:

```asm
      blt $t0,$t1,else      #    if (a >= n) {
      add $t3,$t2,$t4       #        b = c + d;
      j   endif             #    }
else:                       #    else {
      or  $t3,$t4,$0        #        b = d;
endif:                      #    }
```

## Estrutura For e While

A codificação de estruturas for e while é feita através de instruções de controlo de fluxo. O código seguinte é um exemplo de uma estrutura for. O mesmo seria feito para a estrutura while, já que são muito semelhantes.

Código em C:

```c
int b = 10;
for (int i = 0; i < 100; i++) {
    b = b + 1;
}
```

Código em MIPS assembly:

```asm
      li   $t2,10            # int b = 10;
      li   $t0,0             # i = 0;
for:
      bgt  $t0,100,endfor    # if (i >= 100) goto endfor;
      addi $t2,$t2,1         # b = b + 1;
      J    for               # goto for;
endfor:
```

## Estrutura Do-While

Ao contrário das estruturas if-then-else, for e while, nas estruturas do-while não se faz a negação da condição já que o bloco de instruções é primeiro executado e só depois é que se verifica a condição. O código seguinte é um exemplo de uma estrutura do-while.

Código em C:

```c
int n, a = 0;
do {
  a = a + (n*2);
  n++;
} while (n < 100)
```

Código em MIPS assembly:

```asm
      li   $t0,0             # a = 0;
      li   $t1,0             # n = 0;
dowhile:
      add  $t2,$t1,$t1       # (n*2)
      add  $t0,$t0,$t2       # a = a + (n*2);
      addi $t1,$t1,1         # n++;
      blt  $t1,100,dowhile   # if (n < 100) goto dowhile;
enddowhile:                  # Esta label não é necessária 
```

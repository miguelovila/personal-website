---
title: "Conceitos Básicos da Arquitetura de Computadores"
date: 2023-01-11T15:47:07Z
draft: false
authors: ["Miguel Vila"]
description: "Compreender os princípios básicos da arquitetura dos computadores atuais."

categories: ["Arquitetura de Computadores"]
---
Nos computadores atuais, as instruções são representadas da mesma forma que dados. Os programas são armazenados em memória para serem lidos e escritos tais como os dados. São estes dois princípios que formam os fundamentos do conceito da aquitetura "_stored-program_".

{{< admonition type=note title="Nota" open=true >}}
O conceito "_stored-program_" permite que tanto o código fonte, como um editor de texto, como o próprio programa sejam armazenados ao mesmo tempo na memória.
{{< /admonition >}}

## Arquitetura Básica de um Sistema Computacional

Os computadores são constituídos por três unidades fundamentais:

1. CPU: responsável pelo processamento de dados através da execução de uma sequência de instruções (programa);
2. Memória: responsável pelo armazenamento das sequências de instruções (programas), pelo armazenamento dos dados para processamento e pelo armazenamento dos resultados;
3. I/O: responsável pela entrada de dados (_input_) e pela saída de dados (_output_).

> TODO: Adicionar imagem ilustrativa

## Conceitos Básicos

1. Endereço (_address_): é um número único que identifica cada registo de memória. São contados sequencialmente a partir do 0.

2. Espaço de endereçamento (address space): a gama total de endereços que um CPU consegue referenciar. A gama depende da dimensão do barramento de endereços. Um barramento de endereços de 16 bits pode gerar endereços de 0x0000 a 0xFFFF (de 0 a 2¹⁶-1).

    {{< admonition type=question title="Questão" open=false >}}
Quantos endereços poderá um processador com um barramento de 32 bits referenciar?
    {{< /admonition >}}
    {{< admonition type=success title="Resposta" open=false >}}
Se um processador tiver um barramento de endereços de 32 bits poderá referenciar 2³². Os endereços refrenciados estarão entre 0x00000000 e 0xFFFFFFFF (de 0 a 2³²-1).
    {{< /admonition >}}

3. Secção de dados (_datapath_): elementos funcionais para encaminhamento, processamento e armazenamento de dados. (multiplexers, unidade aritmética, registos internos do CPU,...)

4. Unidade de controlo (_control unit_): é responsável por controlar a comunicação entre o CPU e os outros componentes do computador, como a memória e dispositivos de entrada/saída.

{{< admonition type=note title="Nota" open=true >}}
Independente da unidade de controlo ser combinatória ou sequencial, o CPU é sempre uma máquina de estados síncrona.
{{< /admonition >}}

{{< admonition type=note title="Nota" open=true >}}
É importante notar que CPU é um componente diferente da UC (unidade de controlo) embora trabalhem juntos. O CPU realiza operações matemáticas e lógicas, enquanto a CU controla o fluxo de dados no computador.
{{< /admonition >}}

## Ciclo-base de Execução de uma Instrução

A execução de um programa consiste num ciclo de várias fases:

- Intruction fetch: leitura do código de máquina da instrução a partir da memória;
- Instruction decode: a unidade de controlo descodifica a instrução;
- Operand fetch: lê os operandos;
- Execute: execução da operação especificada pela instrução;
- Store result: armazenamento do resultado da operação no destino especificado na instrução.

Com este processo concluído, é carregada uma nova instrução e volta-se a repetir estes passos.

## Codificação das Instruções

A codificação de uma instrução num número expresso em binário, terá que ter toda a informação que o CPU necessita para a executar:

- Qual a operação a realizar;
- Qual a localização dos operandos e do resultado;
    {{< admonition type=note title="Nota" open=true >}}
Os operandos que residam nos registos internos do CPU, deverão ser especificados pelo número do registo. Já os operandos que residam na memória deverão ser especificados pelo seu endereço na memória.
    {{< /admonition >}}
- Qual a próxima instrução a executar. Em casos normais é a instrução seguinte, mas quando instruções alteram a sequência de execução, na codificação da instrução deverá constar o endereço da próxima instrução a ser executada.

## Arquitetura do Conjunto de Instruções

- Instruction set: conjunto de todas a instruções suportadas pelo processador.
- Instruction set architecture (ISA): especifica não só as instruções suportadas, mas também o seu formato. Como é independente do desenho lógico e da implementação física, serve como uma abstração que permite que os desenvolvedores escrevam código que funcione em diferentes plataformas desde que estas suportem a ISA em questão.

Por outras palavras, serve como um modelo de programação que descreve tudo o que o programador necessita de saber para programar corretamente em assembly um detereminado processdor.

{{< admonition type=note title="Nota" open=true >}}
Existem várias famílias ISA, por exemplo: x86, ARM, MIPS, SPARC e PowerP. A mesma ISA pode ter várias implementações físicas distintas, por exemplo, processadores Intel e AMD são compatíveis com a ISA x86.
{{< /admonition >}}

## Classes de Instruções

Uma dada aquitetura pode ter centenas de instruções, no entanto essas instruções podem pertencer a classes de instruções que são comuns à generalidade das arquiteturas:

- Processamento: artimético e lógico;
- Transferência de informação: cópia entre registos internos e entre registos internos e memória.
- Controlo de fluxo e execução: alteração da sequência de execução através de estruturas condicionais, ciclos e chamadas a sub-rotinas.

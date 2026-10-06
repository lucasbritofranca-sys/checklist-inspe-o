# Checklist de Inspeção de Equipamentos

## Visão Geral

Este projeto tem como objetivo digitalizar e organizar o processo de inspeção de equipamentos, permitindo que operadores registrem condições de uso, identifiquem não conformidades e acompanhem o histórico de manutenção de forma centralizada.

O sistema foi pensado para apoiar a rotina de inspeção de ativos, reduzir falhas de registro em papel e facilitar a revisão por supervisores e equipe de manutenção.

## Objetivo

O sistema deve permitir:

- registrar inspeções de equipamentos;
- validar itens do checklist;
- registrar não conformidades;
- acompanhar o status das ocorrências;
- manter histórico de inspeções e ações realizadas;
- controlar acesso por perfil de usuário.

## Contexto do Problema

A inspeção manual de equipamentos pode gerar inconsistências, perda de informações, dificuldade de acompanhamento e demora na resolução de ocorrências. O sistema proposto busca padronizar esse processo e melhorar a rastreabilidade das inspeções.

## Usuários e Perfis

### Operador
- realiza inspeções;
- registra condições dos itens do checklist;
- inclui observações e evidências;
- finaliza a inspeção.

### Supervisor
- consulta inspeções;
- identifica ocorrências não conformes;
- acompanha não conformidades;
- altera status de pendências.

### Manutenção
- consulta ocorrências encaminhadas;
- registra ações corretivas;
- informa data de atendimento.

### Administrador
- cadastra usuários;
- define perfis de acesso;
- configura permissões do sistema.

## Funcionalidades Principais

- Cadastro de equipamentos;
- Login com autenticação;
- Início de inspeção por equipamento;
- Checklist com itens de avaliação;
- Registro de observações;
- Registro de evidências;
- Finalização da inspeção;
- Consulta de histórico;
- Identificação de não conformidades;
- Acompanhamento do status das ocorrências;
- Registro de atendimento pela manutenção;
- Geração de relatórios.

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite |
| --- | --- | --- | --- |
| RF01 | O sistema deve permitir que o operador inicie uma inspeção para um equipamento identificado. | Alta | Ao selecionar um equipamento, o operador consegue iniciar uma nova inspeção. |
| RF02 | O sistema deve permitir que o operador verifique o nível de óleo do equipamento. | Alta | O checklist apresenta o item de nível de óleo e permite registrar o resultado. |
| RF03 | O sistema deve permitir que o operador registre a condição de cada item do checklist. | Alta | Cada item permite registrar uma situação definida, como conforme ou não conforme. |
| RF04 | O sistema deve permitir que o operador registre observações durante a inspeção. | Média | O operador consegue inserir texto de observação em uma inspeção. |
| RF05 | O sistema deve permitir que o operador registre evidências de uma irregularidade. | Média | O operador consegue anexar uma evidência ao item correspondente. |
| RF06 | O sistema deve registrar automaticamente a data e o horário da inspeção. | Alta | Após salvar a inspeção, a data e a hora ficam registradas sem preenchimento manual. |
| RF07 | O sistema deve identificar o operador responsável pela inspeção. | Alta | A inspeção salva contém o usuário responsável. |
| RF08 | O sistema deve permitir que o operador finalize uma inspeção. | Alta | O operador consegue finalizar a inspeção somente após preencher os campos obrigatórios. |
| RF09 | O sistema deve permitir que o supervisor consulte as inspeções realizadas. | Alta | O supervisor consegue visualizar inspeções anteriores dos equipamentos. |
| RF10 | O sistema deve permitir que o supervisor identifique equipamentos com itens não conformes. | Alta | Inspeções com não conformidades são identificadas na consulta. |
| RF11 | O sistema deve permitir que o supervisor acompanhe as não conformidades registradas. | Alta | O supervisor consegue consultar as ocorrências e seus respectivos equipamentos. |
| RF12 | O sistema deve permitir que o supervisor altere o status de uma não conformidade. | Média | O supervisor consegue registrar a mudança de status da ocorrência. |
| RF13 | O sistema deve permitir que a manutenção consulte as não conformidades encaminhadas para atendimento. | Alta | A equipe de manutenção consegue visualizar as ocorrências destinadas à manutenção. |
| RF14 | O sistema deve permitir que a manutenção registre o atendimento de uma não conformidade. | Alta | A manutenção consegue registrar uma ação realizada para solucionar a ocorrência. |
| RF15 | O sistema deve permitir que a manutenção registre a data do atendimento. | Média | A data do atendimento fica registrada na ocorrência. |
| RF16 | O sistema deve manter o histórico das inspeções realizadas. | Alta | Inspeções finalizadas permanecem disponíveis para consulta. |
| RF17 | O sistema deve permitir consultar o histórico por equipamento. | Alta | Ao selecionar um equipamento, o usuário consegue visualizar suas inspeções anteriores. |
| RF18 | O sistema deve permitir consultar inspeções por período. | Média | O usuário consegue informar um período e visualizar as inspeções correspondentes. |
| RF19 | O sistema deve permitir cadastrar e identificar os equipamentos que serão inspecionados. | Alta | Um equipamento cadastrado pode ser selecionado durante uma inspeção. |
| RF20 | O sistema deve permitir cadastrar usuários com diferentes perfis de acesso. | Alta | Usuários podem ser associados aos perfis de operador, supervisor e manutenção. |
| RF21 | O sistema deve restringir as funcionalidades conforme o perfil do usuário. | Alta | Cada perfil acessa somente as funcionalidades autorizadas. |
| RF22 | O sistema deve permitir gerar um relatório das inspeções realizadas. | Média | O usuário autorizado consegue gerar um relatório contendo os dados da inspeção. |
| RF23 | O sistema deve registrar alterações realizadas nas informações das inspeções. | Média | Alterações relevantes ficam registradas com usuário, data e horário. |
| RF24 | O sistema deve alertar os responsáveis quando uma não conformidade exigir manutenção. | Média | Ao registrar uma ocorrência configurada como encaminhamento para manutenção, o responsável recebe o alerta definido. |

## Requisitos Não Funcionais

| ID | Requisito | Prioridade | Critério de aceite |
| --- | --- | --- | --- |
| RNF01 | O sistema deve exigir autenticação para acesso às funcionalidades protegidas. | Alta | Usuários não autenticados não conseguem acessar as funcionalidades internas. |
| RNF02 | O sistema deve controlar o acesso às informações conforme o perfil do usuário. | Alta | Um usuário não consegue executar uma operação não autorizada para seu perfil. |
| RNF03 | O sistema deve registrar data, horário e usuário nas operações críticas. | Alta | Os dados ficam disponíveis no histórico de auditoria. |
| RNF04 | O sistema deve manter os registros das inspeções armazenados de forma persistente. | Alta | Uma inspeção salva permanece disponível após o encerramento e reabertura do sistema. |
| RNF05 | O sistema deve apresentar as telas de inspeção de forma adequada para computadores e dispositivos móveis. | Média | O checklist pode ser utilizado sem perda de informações ou funcionalidades essenciais em telas suportadas. |
| RNF06 | O sistema deve apresentar mensagens de erro claras quando uma operação não puder ser concluída. | Média | O usuário recebe uma mensagem indicando o problema e como corrigi-lo, quando possível. |
| RNF07 | O sistema deve validar os campos obrigatórios antes da finalização da inspeção. | Alta | Uma inspeção incompleta não pode ser finalizada. |
| RNF08 | O sistema deve proteger os dados armazenados contra acesso não autorizado. | Alta | Usuários sem permissão não conseguem consultar ou alterar dados protegidos. |
| RNF09 | O sistema deve realizar cópias de segurança dos dados conforme uma periodicidade definida. | Alta | Existe uma rotina configurada de backup e é possível verificar sua execução. |
| RNF10 | O sistema deve manter disponibilidade compatível com o horário de operação definido pela empresa. | Alta | O sistema atende ao percentual de disponibilidade acordado, por exemplo, 99% no período definido. |

## Regras de Negócio

- Todo equipamento deve estar cadastrado antes de receber uma inspeção.
- A inspeção deve conter o identificador do equipamento, o operador responsável e a data/hora da realização.
- Itens obrigatórios do checklist não podem ser deixados em branco.
- Ocorrências não conformes devem ser registradas com descrição, evidência e responsável.
- A manutenção só pode visualizar ocorrências encaminhadas para seu setor.
- Inspeções concluídas devem permanecer em histórico para consulta posterior.
- Alterações relevantes devem ser auditadas com usuário, data e horário.

## Critérios de Aceitação do MVP

O MVP do sistema deve incluir:

1. cadastro de equipamentos;
2. autenticação de usuários;
3. início e finalização de inspeção;
4. registro de condições e observações;
5. identificação de não conformidades;
6. consulta de histórico;
7. controle de acesso por perfil;
8. registro de atendimento pela manutenção.

## Observações

Este documento representa uma primeira versão de requisitos. Para a implementação em produção, ainda será necessário detalhar:

- itens exatos do checklist;
- valores aceitáveis para nível de óleo e outros parâmetros;
- regras para equipamentos críticos;
- prazos de atendimento;
- fluxo de aprovação e encerramento de ocorrências;
- métricas de disponibilidade e backup;
- critérios quantitativos de desempenho do sistema.

## Próximos Passos

- definir o checklist completo;
- validar regras de negócio com os usuários finais;
- mapear fluxos de supervisão e manutenção;
- detalhar casos de uso;
- iniciar a modelagem do banco de dados;
- definir arquitetura da aplicação e tecnologias.

## Status

Status atual: documento inicial de requisitos em evolução.

---

Este README foi estruturado para servir como base para análise, validação e desenvolvimento do sistema.
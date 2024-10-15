# Documentação da API

# API - Listagem das requisições

## Descrição

Essa API permite buscar requisições de usuários filtrando pelos parâmetros de `reqIdCodigo` e `chapa`, além de possibilitar paginação e ordenação dos resultados.

## Endpoint

```http
GET /usureq
```

## Parâmetros de Consulta (Query Parameters)

| Parâmetro     | Tipo   | Obrigatório | Descrição                                          | Exemplo         |
| ------------- | ------ | ----------- | -------------------------------------------------- | --------------- |
| `reqIdCodigo` | Number | Não         | Código da requisição.                              | `292237`        |
| `chapa`       | String | Não         | Número da chapa do funcionário.                    | `000081`        |
| `page`        | Number | Não         | Número da página para paginação dos resultados.    | `1`             |
| `limit`       | Number | Não         | Número máximo de resultados por página.            | `50`            |
| `order`       | String | Não         | Campo pelo qual os resultados devem ser ordenados. | `"reqIdCodigo"` |
| `orderBy`     | String | Não         | Direção da ordenação.                              | `"ASC"`         |

## Exemplo de Requisição

```http
GET /usureq?reqIdCodigo=1&chapa=000600&page=1&limit=50&order=reqIdCodigo&orderDirection=ASC
```

## Exemplo de Resposta

```json
[
  {
    "reqIdCodigo": 292237,
    "chapa": "000081",
    "municipio": 351020,
    "oriMunicipio": "CAPAO BONITO",
    "reqDtReq": "14/02/2022 12:39:38",
    "reqDtSaida": "2022-03-07 00:00:00",
    "reqHSaida": "08:00:00",
    "reqDtRetorno": "17:00:00",
    "reqMotivo": "Levantamento topográico",
    "reqHRet": "17:00:00",
    "reqKm": 300,
    "reqStatus": "REQUISICAO NOVA",
    "reqDiaria": "0",
    "reqIntegral": "4",
    "reqParcial": "20",
    "reqEspecial": "0",
    "reqPacote": 0,
    "reqGovernador": "N",
    "transmeio": 1,
    "desLocal": "Assentamento Pirituba",
    "desMunIdCodigo": 6535,
    "desMunNme": "ITABERA",
    "diariaIntegral": 814.52,
    "diariaParcial": 40.73,
    "diariaBase": 203.63,
    "saqueMes": 492.34,
    "valorSolicitado": 855.25,
    "salario50Porcento": 615.69,
    "saldoDisponivel": -731.9,
    "regDescricao": "SUDOESTE - SOROCABA",
    "traDescricao": "VEICULO"
  }
]
```

---

# API - Listagem de Saques para Viagens

## Descrição

Esta API permite listar os saques realizados para viagens dos funcionários.

## Endpoint

```http
GET /saque?CHAPA=000081&SQE_ID_CODIGO&REQ_ID_CODIGO&STS_DESCRICAO&REQ_STATUS&STATUS&usePrestDate=true&startDate=22%2F08%2F2008&endDate=22%2F08%2F2008&page=1&limit=100&orderBy=SQE_ID_CODIGO&orderDirection=ASC
```

## Parâmetros da Query String:

| campo            | Tipo    | Obrigatório | Descrição                                                                                  |
| ---------------- | ------- | ----------- | ------------------------------------------------------------------------------------------ |
| `SQE_ID_CODIGO`  | Number  | Não         | Código do saque.                                                                           |
| `CHAPA`          | String  | Não         | Número da chapa do funcionário.                                                            |
| `REQ_ID_CODIGO`  | Number  | Não         | Código da requisição de viagem.                                                            |
| `STS_DESCRICAO`  | String  | Não         | Descrição do status da solicitação de recurso (ex.: "SOLICITACOES DE RECURSO").            |
| `REQ_STATUS`     | String  | Não         | Status da requisição de viagem (ex.: "AUTORIZADA", "PLANEJAMENTO").                        |
| `usePrestDate`   | boolean | Não         | Se verdadeiro, filtrar pela data de Prestação; caso contrário, filtrar pela data do Saque. |
| `startDate`      | String  | Não         | Início da data                                                                             |
| `endDate`        | String  | Não         | fim da data (orderBy ='SQE_DTSAQUE' OU orderBy ='SQE_DTPREST')                             |
| `REQ_STATUS`     | String  | Não         | Valor total de diárias integral (ex: AUTORIZADA PELO DIRETOR EXECUTIVO)                    |
| `page`           | number  | Não         | numero da página atual                                                                     |
| `limit`          | number  | Não         | limit de páginas                                                                           |
| `orderBy`        | String  | Não         | Campo para ordenar o resultado (ex.: "SQE_DTSAQUE").                                       |
| `orderDirection` | String  | Não         | Direção da ordenação (ex.: "ASC" para ascendente ou "DESC" para descendente).              |

## Exemplo de Resposta

```json
[
  {
    "SQE_DTPEDIDO": "05/10/12",
    "SQE_DTSAQUE": "15/10/12",
    "SQE_DTPREST": "11/10/2012 14:54:54",
    "NOME": "Fulano",
    "REQ_ID_CODIGO": 144864,
    "SQE_ID_CODIGO": 57785,
    "TDE_DESCRICAO": "DIARIAS",
    "SQE_VLSAQUE": 387.24,
    "SQE_VLPREST": 0,
    "VL_COMPLEMENTAR": 0,
    "VL_EXTORNO": 387.24,
    "STATUS": "Realizada",
    "REQ_STATUS": "AUTORIZADA PELO DIRETOR EXECUTIVO",
    "CHAPA": "000081",
    "STS_DESCRICAO": "SAQUE EFETUADO"
  }
]
```

## Parâmetros da Resposta String:

| Campo             | Tipo    | Descrição                                                |
| ----------------- | ------- | -------------------------------------------------------- |
| `SQE_ID_CODIGO`   | Inteiro | Código único do saque.                                   |
| `SQE_DTPEDIDO`    | string  | Data de pedido do saque.                                 |
| `SQE_DTSAQUE`     | string  | Data em que o saque foi realizado (pode ser nulo).       |
| `SQE_VLSAQUE`     | number  | Valor do saque realizado.                                |
| `SQE_VLPREST`     | number  | Valor da prestação realizado.                            |
| `VL_COMPLEMENTAR` | number  | Resultado da subtração entre o SQE_VLSAQUE - SQE_VLPREST |
| `VL_EXTORNO`      | number  | Se o SQE_VLSAQUE for maior que SQE_VLPREST               |
| `NOME`            | string  | Nome do funcionário                                      |
| `SQE_DTPREST`     | Date    | Data de prestação de contas (pode ser nulo).             |
| `REQ_ID_CODIGO`   | Inteiro | Código único da requisição de viagem.                    |
| `REQ_STATUS`      | String  | Status da requisição de viagem.                          |
| `STATUS`          | String  | Status da prestação de conta                             |
| `CHAPA`           | String  | Número da chapa do funcionário.                          |
| `STS_DESCRICAO`   | String  | Descrição do status da solicitação de recurso.           |
| `TDE_DESCRICAO`   | String  | Descrição do tipo de despesa (ex.: diárias).             |

---

```http
POST /saque/solicitar
```

## Descrição:

Essa API é utilizada para solicitar o saque de diárias de viagem, contendo as informações sobre o código de requisição, a chapa do usuário e os valores referentes às diárias integral e parcial.

## Endpoint:

```http
POST http://_baseurl/saque/solicitar`
```

## Body (JSON):

```json
{
  "reqIdCodigo": 66223,
  "chapa": "000081",
  "reqpacote": "N",
  "reqStatus": "AUTORIZADA",
  "diariaIntegral": 0,
  "diariaParcial": 49.5,
  "diariaBase": 247.52
}
```

| campo            | Tipo   | Obrigatório | Descrição                               |
| ---------------- | ------ | ----------- | --------------------------------------- |
| `reqIdCodigo`    | Number | Sim         | Código da requisição.                   |
| `chapa`          | String | Sim         | Número da chapa do funcionário.         |
| `reqpacote`      | string | Sim         | Se ha pacote ou não.                    |
| `reqStatus`      | Number | Sim         | Número máximo de resultados por página. |
| `diariaIntegral` | Number | Sim         | Valor total de diárias integral         |
| `diariaParcial`  | Number | Sim         | Valor total de diárias parcial          |
| `diariaBase`     | Number | Sim         | Valor base para calculo da diária       |

## Exemplo de Resposta:

```json
{
  "sqeIdCodigo": "9162317"
}
```

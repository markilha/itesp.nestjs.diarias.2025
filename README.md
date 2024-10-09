# Documentação da API
---

## **GET /usureq**

## Descrição

Essa API permite buscar requisições de usuários filtrando pelos parâmetros de `reqIdCodigo` e `chapa`, além de possibilitar paginação e ordenação dos resultados.

## Endpoint

GET http://\_baseurl/usureq

## Parâmetros de Consulta (Query Parameters)

| Parâmetro     | Tipo   | Obrigatório | Descrição                                          | Exemplo         |
| ------------- | ------ | ----------- | -------------------------------------------------- | --------------- |
| `reqIdCodigo` | Number | Não         | Código da requisição.                              | `1`             |
| `chapa`       | String | Não         | Número da chapa do funcionário.                    | `000600`        |
| `page`        | Number | Não         | Número da página para paginação dos resultados.    | `1`             |
| `limit`       | Number | Não         | Número máximo de resultados por página.            | `50`            |
| `order`       | String | Não         | Campo pelo qual os resultados devem ser ordenados. | `"reqIdCodigo"` |
| `orderBy`     | String | Não         | Direção da ordenação.                              | `"ASC"`         |

## Exemplo de Requisição

GET http://_baseurl/usureq?reqIdCodigo=1&chapa=000600&page=1&limit=50&order=reqIdCodigo&orderDirection=ASC

## Exemplo de Resposta

````json
[
    	{
		"reqIdCodigo": 7796,
		"chapa": "000081",
		"municipio": 351020,
		"oriMunicipio": "CAPAO BONITO",
		"reqDtReq": "02/07/2004 15:20:01",
		"reqDtSaida": "2004-07-06 00:00:00",
		"reqHSaida": "08:00:00",
		"reqDtRetorno": "17:00:00",
		"reqMotivo": "Atualização do Plano Geral - Barão de Antonina",
		"reqHRet": "17:00:00",
		"reqKm": 50,
		"reqStatus": "CANCELADA AUTO",
		"reqDiaria": "0",
		"reqIntegral": "0",
		"reqParcial": "1",
		"reqEspecial": "0",
		"reqPacote": 0,
		"reqGovernador": null,
		"transmeio": 3,
		"desLocal": null,
		"desMunIdCodigo": 6201,
		"desMunNme": "BARAO DE ANTONINA",
		"diariaIntegral": 0,
		"diariaParcial": 49.5,
		"diariaBase": 247.52,
		"salario50Porcento": 615.69,
		"saldoDisponivel": 566.19
	}
]

````

# Documentação da API
---

## **POST /saque/solicitar**

### Descrição:
Essa API é utilizada para solicitar o saque de diárias de viagem, contendo as informações sobre o código de requisição, a chapa do usuário e os valores referentes às diárias integral e parcial.

### Exemplo de Requisição:

POST http://_baseurl/saque/solicitar`

Body (JSON):
````json
{
  "reqIdCodigo": 66223,
  "chapa": "000081",
  "reqpacote": "N",
  "reqStatus": "AUTORIZADA",
  "diariaIntegral": 0,
  "diariaParcial": 49.5,
  "diariaBase": 247.52
}
````

| campo         | Tipo   | Obrigatório | Descrição                                          |
| ------------- | ------ | ----------- | -------------------------------------------------- |
| `reqIdCodigo` | Number | Sim         | Código da requisição.                              |
| `chapa`       | String | Sim         | Número da chapa do funcionário.                    |
| `reqpacote`   | string | Sim         | Se ha pacote ou não.                          |
| `reqStatus`   | Number | Sim         | Número máximo de resultados por página.        |
| `diariaIntegral`| Number | Sim        | Valor total de diárias integral            |
| `diariaParcial` | Number | Sim         | Valor total de diárias parcial               |
| `diariaBase`    | Number | Sim        | Valor base para calculo da diária                |


## Exemplo de Resposta:
````json
{
  "sqeIdCodigo": "9162317"
}
````

# API - Listagem de Saques para Viagens

Esta API permite listar os saques realizados para viagens dos funcionários.

## **Endpoint**
## **GET /saque?SQE_ID_CODIGO=9162317&CHAPA=000081&REQ_ID_CODIGO=66223&STS_DESCRICAO=SOLICITACOES%20DE%20RECURSO&REQ_STATUS=AUTORIZADA&orderBy=SQE_DTSAQUE&orderDirection=ASC**

Parâmetros da Query String:
|Campo|Tipo|Obrigatório|Descrição|
|SQE_ID_CODIGO|Number|Não|Código do saque.|
|CHAPA|String|Não|Número da chapa do funcionário.|
|REQ_ID_CODIGO|Number|Não|Código da requisição de viagem.|
|STS_DESCRICAO|String|Não|Descrição do status da solicitação de recurso (ex.: "SOLICITACOES DE RECURSO").|
|REQ_STATUS|String|Não|Status da requisição de viagem (ex.: "AUTORIZADA", "PLANEJAMENTO").|
|orderBy|String|Não|Campo para ordenar o resultado (ex.: "SQE_DTSAQUE").|
|orderDirection|String|Não|Direção da ordenação (ex.: "ASC" para ascendente ou "DESC" para descendente).|




## **Exemplo de Resposta**

```json
[
  {
    "SQE_ID_CODIGO": 9162318,
    "SQE_DTSAQUE": null,
    "SQE_VLSAQUE": "675.00",
    "SQE_DTPREST": null,
    "REQ_ID_CODIGO": 66223,
    "REQ_STATUS": "PLANEJAMENTO AUTORIZADO",
    "CHAPA": "000081",
    "STS_DESCRICAO": "SOLICITACOES DE RECURSO",
    "TDE_DESCRICAO": "DIARIAS"
  },
  {
    "SQE_ID_CODIGO": 9162317,
    "SQE_DTSAQUE": null,
    "SQE_VLSAQUE": "675.00",
    "SQE_DTPREST": null,
    "REQ_ID_CODIGO": 66223,
    "REQ_STATUS": "PLANEJAMENTO AUTORIZADO",
    "CHAPA": "000081",
    "STS_DESCRICAO": "SOLICITACOES DE RECURSO",
    "TDE_DESCRICAO": "DIARIAS"
  }
]

````
|Campo|	Tipo|Descrição|
|SQE_ID_CODIGO|	Inteiro	|Código único do saque.|
|SQE_DTSAQUE|	Date	|Data em que o saque foi realizado (pode ser nulo).||
|SQE_VLSAQUE|	|String	|Valor do saque realizado.|
|SQE_DTPREST|	Date	|Data de prestação de contas (pode ser nulo).|
|REQ_ID_CODIGO|	Inteiro |Código único da requisição de viagem.|
|REQ_STATUS|	String	|Status da requisição de viagem.|
|CHAPA|	String	        |Número da chapa do funcionário.|
|STS_DESCRICAO|	String  |Descrição do status da solicitação de recurso.|
|TDE_DESCRICAO|	String	|Descrição do tipo de despesa (ex.: diárias).|
















# Documentação da API: **GET /usureq**

## Descrição
Essa API permite buscar requisições de usuários filtrando pelos parâmetros de `reqIdCodigo` e `chapa`, além de possibilitar paginação e ordenação dos resultados.

## Endpoint

GET http://_baseurl/usureq

## Parâmetros de Consulta (Query Parameters)

| Parâmetro        | Tipo     | Obrigatório | Descrição                                         | Exemplo     |
|-------------------|----------|-------------|---------------------------------------------------|-------------|
| `reqIdCodigo`     | Number   | Não         | Código da requisição.                             | `1`         |
| `chapa`           | String   | Não         | Número da chapa do funcionário.                   | `000600`    |
| `page`            | Number   | Não         | Número da página para paginação dos resultados.   | `1`         |
| `limit`           | Number   | Não         | Número máximo de resultados por página.           | `50`        |
| `order`           | String   | Não         | Campo pelo qual os resultados devem ser ordenados.| `"reqIdCodigo"` |
| `orderBy`         | String   | Não         | Direção da ordenação.                             | `"ASC"`     |

## Exemplo de Requisição

GET http://_baseurl/usureq?reqIdCodigo=1&chapa=000600&page=1&limit=50&order=reqIdCodigo&orderDirection=ASC


## Exemplo de Resposta
```json
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
   




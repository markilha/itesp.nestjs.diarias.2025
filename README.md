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
        "reqIdCodigo": 1,
        "chapa": "000600",
        "municipio": 355030,
        "oriMunicipio": "SAO PAULO",
        "reqDtReq": "11/07/2002, 14:39:35",
        "reqDtSaida": "2002-06-28 00:00:00",
        "reqHSaida": "  :  ",
        "reqDtRetorno": "  :  ",
        "reqMotivo": null,
        "reqHRet": "  :  ",
        "reqKm": null,
        "reqStatus": "FINALIZADA",
        "reqDiaria": null,
        "reqIntegral": null,
        "reqParcial": null,
        "reqEspecial": null,
        "reqPacote": 1,
        "reqGovernador": null,
        "transmeio": 1,
        "desLocal": "PALACIO DOS BANDEIRANTES -",
        "desMunIdCodigo": 7107,
        "desMunNme": "SAO PAULO"
    },
    {
        "reqIdCodigo": 2,
        "chapa": "000667",
        "municipio": 355030,
        "oriMunicipio": "SAO PAULO",
        "reqDtReq": "11/07/2002, 14:37:37",
        "reqDtSaida": "2002-06-28 00:00:00",
        "reqHSaida": "15:00",
        "reqDtRetorno": "15:30",
        "reqMotivo": "RETIRAR MATERIAL",
        "reqHRet": "15:30",
        "reqKm": null,
        "reqStatus": "CANCELADA",
        "reqDiaria": null,
        "reqIntegral": null,
        "reqParcial": null,
        "reqEspecial": null,
        "reqPacote": 1,
        "reqGovernador": null,
        "transmeio": 1,
        "desLocal": "FUNDUNESP -",
        "desMunIdCodigo": 7107,
        "desMunNme": "SAO PAULO"
    }
]




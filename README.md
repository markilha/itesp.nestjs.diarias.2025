## Requisição `GET /requisicao`

### Descrição

Essa rota permite buscar requisições com filtros opcionais e suporta paginação. Os parâmetros de consulta (`query params`) podem ser utilizados para filtrar os resultados com base nos atributos da requisição.

### Parâmetros de Consulta

- `reqIdCodigo` (opcional): Filtra as requisições pelo código de identificação da requisição.
- `codMunicipio` (opcional): Filtra as requisições pelo código do município.
- `reqStatus` (opcional): Filtra as requisições pelo status (`CANCELADA`, `FINALIZADA`, etc.).
- `page` (opcional): Especifica a página dos resultados que será retornada (default: `1`).
- `limit` ou `take` (opcional): Especifica o número máximo de registros que serão retornados por página (default: `10`).


### Exemplo de Requisição

```bash
GET http://endereço_api/requisicao?reqIdCodigo=1148&codMunicipio=355030&reqStatus=FINALIZADA&page=1&limit=50

Exemplo de Resposta:

[
  {
    "reqIdCodigo": 1148,
    "regIdCodigo": 8,
    "codMunicipio": 355030,
    "traIdCodigo": 1,
    "reqDtReq": "27/11/2002 11:46:53",
    "reqDtSaida": "2002-02-18",
    "reqMotorista": "S",
    "reqHSaida": "09:15",
    "reqDtRetorno": "2002-02-18",
    "reqMotivo": null,
    "reqHRet": "17:00",
    "reqKm": 100,
    "reqStatus": "FINALIZADA",
    "reqDiaria": null,
    "reqIntegral": null,
    "reqParcial": null,
    "reqEspecial": null,
    "reqPacote": "1",
    "reqGovernador": null
  }
]


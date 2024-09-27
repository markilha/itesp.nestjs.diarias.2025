## Requisição `/usureq`

### Descrição

Esta API permite consultar as requisiçoes do transporte, filtrando por reqIdCodigo e chapa, além de suportar paginação.

### Endpoint

- `reqIdCodigo` (opcional): Filtra as requisições pelo código de identificação da requisição.
- `chapa` (opcional): Filtra as requisições pelo código da chapa do funcionário.
- `page` (opcional): Especifica a página dos resultados que será retornada (default: `1`).
- `limit` ou `take` (opcional): Especifica o número máximo de registros que serão retornados por página (default: `10`).

### Exemplo de Requisição

```bash
GET http://localhost:3000/usureq?reqIdCodigo=13&chapa=000383&page=1&limit=10

Exemplo de Resposta:
[
	{
		"reqIdCodigo": 13,
		"chapa": "000383",
		"codMunicipio": 355030,
		"ori_municipio": "SAO PAULO                                         ",
		"reqDtReq": "12/07/2002, 09:55:44",
		"reqDtSaida": "2002-06-27 00:00:00.000",
		"reqHSaida": "06:00",
		"reqDtRetorno": "2002-06-28 00:00:00.000",
		"reqMotivo": "??/////////////////////////",
		"reqHRet": "21:00",
		"reqKm": null,
		"reqStatus": "FINALIZADA",
		"reqDiaria": "",
		"reqIntegral": "",
		"reqParcial": "",
		"reqEspecial": "",
		"reqPacote": 1,
		"reqGovernador": "",
		"transmeio": 1,
		"municipio": 355030,
		"des_local": "",
		"des_mun_id_codigo": 6165,
		"des_mun_nme": "ARARAS",
		"usuMov": "O"
	}
]



## Requisição `/usureq/saque`

### Descrição

Esta API permite consultar as requisiçoes do transporte com calculo, filtrando por reqIdCodigo e chapa,.

### Endpoint

- `reqIdCodigo` (obrigatório): Filtra as requisições pelo código de identificação da requisição.
- `chapa` (obrigatorio): Filtra as requisições pelo código da chapa do funcionário.


### Exemplo de Requisição

```bash
GET http://localhost:3000/usureq/saque?reqIdCodigo=13&chapa=000428

Exemplo de Resposta:
{
	"reqIdCodigo": 13,
	"chapa": "000428",
	"codMunicipio": 355030,
	"ori_municipio": "SAO PAULO",
	"reqDtReq": "12/07/2002, 09:55:44",
	"reqDtSaida": "2002-06-27 00:00:00.000",
	"reqHSaida": "06:00",
	"reqDtRetorno": "2002-06-28 00:00:00.000",
	"reqMotivo": "RECEBER SEMENTES NO IPEF,REUNIAO DE IMPLANTACAO DE SAF AS 13HS",
	"reqHRet": "21:00",
	"reqKm": null,
	"reqStatus": "FINALIZADA",
	"reqDiaria": "",
	"reqIntegral": "",
	"reqParcial": "",
	"reqEspecial": "",
	"reqPacote": 1,
	"reqGovernador": "",
	"transmeio": 1,
	"municipio": 355030,
	"des_local": "",
	"des_mun_id_codigo": 6165,
	"des_mun_nme": "ARARAS",
	"diariaIntegral": 0,
	"diariaParcial20": 0,
	"diariaParcial40": 0,
	"diariaBase": 159.12,
	"excedeu50Porcento": false,
	"salario": 7118.78,
	"totalNumerario": 0,
	"usuMov": "R"
}

## Requisição do transporte  `/requisicao`

### Descrição

Esta API permite consultar as requisiçoes do transporte , filtrando por reqIdCodigo, codMunicipio,reqStatus.

### Endpoint

- `reqIdCodigo` (opcional): Filtra as requisições pelo código de identificação da requisição.
- `codMunicipio` (opcional): Filtra as requisições pelo código de identificação do municipio de origem.
- `reqStatus` (opcional): Filtra as requisições pelo status da requisicao.



### Exemplo de Requisição

```bash
GET http://localhost:3000/requisicao?reqIdCodigo=29&codMunicipio=355030&reqStatus=CANCELADA&page=1&limit=10

Exemplo de Resposta:
[
	{
		"reqIdCodigo": 29,
		"reqDtReq": "17/07/2002, 09:45:43",
		"reqDtSaida": "2002-06-25 00:00:00.000",
		"reqHSaida": "14:30",
		"reqDtRetorno": "2002-06-25 00:00:00.000",
		"reqMotivo": "EXPOSICAO CERAMICA E CADADANIA",
		"reqHRet": "17:00",
		"reqKm": null,
		"reqStatus": "CANCELADA",
		"reqDiaria": "",
		"reqIntegral": "",
		"reqParcial": "",
		"reqEspecial": "",
		"reqPacote": 1,
		"reqGovernador": "",
		"transmeio": 1,
		"municipio": 355030,
		"des_local": "ASSEMBLEIA LEGISLATIVA",
		"des_mun_id_codigo": 7107,
		"des_mun_nme": "SAO PAULO",
		"useReq": [
			{
				"reqIdCodigo": 29,
				"codColigada": 1,
				"chapa": "000101",
				"usuMov": "R"
			}
		]
	}
]

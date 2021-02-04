## Eye Measure

### Requisitos
- Node.js na versão 10 ou superior
- NPM versão 6 ou superior

### Sobre
- Eye Measure sistema de medição da Id Safety

## Setup do projeto
```
npm install
```

### Compilar e acesso como desenvolvedor
```
npm run serve
```

### Compilar e produção
```
npm run build
```

### Executar testes
```
npm run test
```

### Configurações
- API - Para configurar o endereço da API 
``` src/constants/config.js ```


## Api

### Link repositório
https://github.com/lucassilvajs/orcamento_api

### Configurações
#### Banco de dados
``` application/config/database.php ```

#### Config
``` application/config/config.php ```

### Rotas
Você pode configurar suas rotas dentro do arquivo
``` application/config/routes.php ```

### Rest
Para rotas que não necessitam autenticação, você deve coloca-las na lista de rotas em
``` application/config/rest.php ```

## Banco de dados
- MySql

## Linguagem de programação
- PHP

## Servidor
### Aplicativo 
Path para configurar no servidor no endereço ``` /www/dp/ ```

### API 
Path para configurar no servidor no endereço ``` /www/api/ ```

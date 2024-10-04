# OPERAND

![image](https://github.com/user-attachments/assets/f55523b2-319a-4f2a-bd2d-1a24d36ce8f2)

Este projeto é um monolito para uma aplicação full-stack que representa uma págida de tarefas. Foi feito um deploy em uma vps particular da contaboo para acesso rápido, está disponível em: https://operand.vinion.dev.

## Destaques e decisões técnicas

- **Nest.js** com uso de **Prisma** ao lado de um banco de dados não relacional (**Redis**). O Redis utilizado é a versão LTS para maior estabilidade.
- Uso do banco realtime database do firebase.
- Testes de unidade e integração para maior confiabilidade do codigo.
- Página web feita com o uso do **Vue.js** versão 3.
- Autenticação com firebase auth com funcionalidades de recuperação de senha.
- Todos os serviços (Frontend, Backend)

## Primeiros passos

Para rodar o projeto, siga estes passos:

### Docker

Para iniciar a aplicação com Docker, certifique-se de que o Docker está instalado juntamente com o Docker Compose.

1. **Clone o repositório:**

    ```sh
    git clone git@github.com:viniciusjosedev/operand.git
    cd operand
    ```

2. **Configure suas credenciais:**

    Crie um arquivo `.env` em `/backend` com o seguinte conteúdo para o backend:

    ```sh
    # prod OR dev OR test
	NODE_ENV=
	
	# DEFAULT 8080
	NODE_PORT=
	
	# PLEASE CHANGE THIS
	JWT_SECRET=
	FRONTEND_URL=
	
	# FIREBASE CONFIG
	FIREBASE_PROJECT_ID=<project-id>
	FIREBASE_DATABASE_URL=https://<project-id>.firebaseio.com
	FIREBASE_APP_KEY=<app-key>
	
	# TEST 
	# (CAN BE SAME AS FIREBASE_DATABASE_URL)
	TEST_DATABASE_URL=https://<project-id>.firebaseio.com
	# DEFAULT EMAIL FOR TESTING, BY DEFAULT VALUE IS test@operand.com. THIS EMAIL NOT CAN BE USED IN PRODUCTION BECAUSE ACCOUNT WILL DELETED BEFORE AND AFTER TEST.
	TEST_EMAIL_MOCK=
	
	# REDIS
	REDIS_HOST=
	REDIS_PORT=
	REDIS_PASSWORD=
    ```

    E para o frontend, crie um arquivo `.env` dentro de `/frontend`:

    **OBS:** A porta da URL do backend deve ser a mesma que está configurada na `.env` do `/backend`.

    ```sh
    # URL FOR THE BACKEND API
	VITE_BACKEND_URL=
	
	VITE_PORT=
    ```

3. Com as credenciais feitas, inicie o Docker em ambos os diretórios.

    Em um terminal, execute:
    ```sh
    cd frontend
    npm run docker:up
    ```
    Em outro terminal, execute:
    ```sh
    cd backend
    npm run docker:up
    ```

	OBS: Caso o container do frontend dê algum erro de falta de depêndencias na hora da inicialização do vite, execute "npm install" em /frontend e em seguida suba o container novamente com o comando "npm run up".

## Execução dos Testes

Para executar os testes de integração, siga estes passos:

1. COnfigure o arquivo `.env` em `/backend` o email de testes que deseja juntamente com a url do realtime  database (pode ser a mesma de produção).

    ```sh
    # TEST 
	# (CAN BE SAME AS FIREBASE_DATABASE_URL)
	TEST_DATABASE_URL=
	# DEFAULT EMAIL FOR TESTING, BY DEFAULT VALUE IS test@operand.com. THIS EMAIL NOT CAN BE USED IN PRODUCTION BECAUSE ACCOUNT WILL DELETED BEFORE AND AFTER TEST.
	TEST_EMAIL_MOCK=
    ```


2. **Entre no container do backend:**

    ```sh
    docker exec -it operand-app sh
    ```

3. **Execute todos os testes:**

    ```sh
    npm run test:cov
    ```

Certifique-se de que o container do backend está rodando corretamente antes de executar os testes.

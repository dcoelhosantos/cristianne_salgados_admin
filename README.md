PROETO CRISTIANNE SALGADOS VERSÃO ADMIN

Lembre-se de alterar os atributos da application.properties para configurar sua conexão com o banco de dados.
Os usuários e senhas padrão para rodar a aplicação são user e password, você pode alterar isso no SecurityConfig.java

No salgadoController.java estamos usando o banco de dados online https://imgbb.com/, se você desejar usar o mesmo banco de dados basta gerar uma key e preencher na váriavel String apiKey.
Se for usar outro banco, lembre de fazer os ajustes necessários para a conexão e gerenciamento do mesmo ;)

## Configuração do Banco de Dados
Após configurar o MySQL, execute os seguintes comandos para criar ou atualizar o usuário:

```sql
ALTER USER 'usuario' IDENTIFIED WITH mysql_native_password BY 'senha';
FLUSH PRIVILEGES;

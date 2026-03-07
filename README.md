# Volt 

Backend de uma aplicação de análise e sugestão de treinos, combinando musculação e corrida.

## Tecnologias
- Java 21 + Spring Boot 3
- PostgreSQL
- Spring Security + JWT
- Maven

## Funcionalidades
- Cadastro de usuários com objetivo de treino (hipertrofia, emagrecimento, etc)
- Registro de treinos de musculação e corrida
- Grupos musculares com tempo de recuperação
- Motor de sugestões baseado em:
  - Recuperação muscular
  - Histórico de treinos
  - Objetivo do usuário
  - Músculos com dor informados pelo usuário

## Como rodar
1. Clone o repositório
2. Crie o banco PostgreSQL: `CREATE DATABASE volt;`
3. Copie `application.properties.example` para `application.properties` e preencha as variáveis
4. Rode com `mvn spring-boot:run`

## Endpoints principais
- `POST /auth/login` — autenticação
- `POST /users` — cadastro de usuário
- `POST /strength-workouts` — registrar treino de musculação
- `POST /run-workouts` — registrar treino de corrida
- `POST /suggestions/{userId}` — obter sugestão de treino

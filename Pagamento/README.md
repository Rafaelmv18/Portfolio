# Pagamentos com Idempotência

API de pagamentos que garante que **um mesmo pagamento nunca seja cobrado duas vezes**, mesmo com
clique duplo no botão "Pagar", retry automático, queda de internet ou refresh da página.

> 🚧 **Em desenvolvimento.** O ambiente (Laravel + PostgreSQL + Docker) está pronto. As rotas da API
> estão sendo construídas com TDD, um passo por vez (veja [Roadmap](#roadmap)).

## O problema

Imagine que o cliente clica em "Pagar", a requisição chega ao servidor e o cartão é cobrado, mas a
resposta se perde no caminho (a internet caiu, por exemplo). O cliente não sabe se deu certo e tenta
de novo. Sem nenhum cuidado, o servidor cobra **duas vezes**.

## A solução: Idempotency-Key

Toda tentativa de pagamento nasce no cliente com uma **chave única (UUID)**, enviada no header
`Idempotency-Key`. O servidor usa essa chave como **chave primária** de uma tabela de controle:

- **Primeira vez** com a chave → processa o pagamento e **guarda a resposta**.
- **Mesma chave de novo** → não processa outra vez, devolve **exatamente a mesma resposta** salva
  (com o header `Idempotent-Replayed: true`).
- **Mesma chave com outro corpo** → `422`: a chave não pode ser reaproveitada para outro pagamento.
- **Duas requisições com a mesma chave ao mesmo tempo** → a PK do PostgreSQL só deixa uma passar,
  a outra recebe `409`.

```
[Cliente] ──POST + Idempotency-Key──► [Servidor] ──mesma chave──► [Gateway (simulado)]
    ▲                                     │
    └──────── resposta (igual sempre) ────┴──► [PostgreSQL]
```

Detalhes completos (tabelas, fluxo no servidor, todos os códigos de resposta e estornos) em
**[ARQUITETURA.md](./ARQUITETURA.md)**. O diagrama visual está em
[`arquitetura.excalidraw`](./arquitetura.excalidraw) (abra em [excalidraw.com](https://excalidraw.com)).

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | PHP 8.4 + Laravel |
| Banco | PostgreSQL 17 |
| Testes | PHPUnit (TDD) |
| Ambiente | Docker + Docker Compose |
| Frontend | React (checkout, em breve) |

## Como iniciar

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando.

Não é preciso ter PHP, Composer nem PostgreSQL instalados na máquina: tudo roda dentro dos containers.

### 1. Subir o projeto

Na pasta `Pagamento/`:

```bash
docker compose up -d --build
```

Na primeira execução o container do backend faz tudo sozinho:

1. instala as dependências (`composer install`);
2. cria o `.env` a partir do `.env.example`;
3. gera a `APP_KEY`;
4. roda as migrations.

Pode levar alguns minutos na primeira vez. Para acompanhar:

```bash
docker compose logs -f backend
```

Quando aparecer `Server running on [http://0.0.0.0:8000]`, a API está disponível em
**http://localhost:8000**.

### 2. Rodar os testes

```bash
docker compose exec backend php artisan test
```

Os testes usam um banco separado (`pagamentos_test`), então nunca apagam os dados do banco principal.

### 3. Parar o projeto

```bash
docker compose down        # para os containers (mantém os dados)
docker compose down -v     # para e apaga o banco (começa do zero)
```

## Acessando o banco (pgAdmin, DBeaver etc.)

| Campo | Valor |
|---|---|
| Host | `localhost` |
| Porta | `5434` |
| Banco | `pagamentos` (testes: `pagamentos_test`) |
| Usuário | `app` |
| Senha | `app` |

> A porta é **5434** (e não a padrão 5432) para não conflitar com um PostgreSQL já instalado na máquina.
> Essas credenciais são apenas para desenvolvimento local.

## Estrutura

```
Pagamento/
├── backend/               # aplicação Laravel (API + testes)
├── docker/
│   ├── php/               # Dockerfile e entrypoint do backend
│   └── postgres/init.sql  # cria o banco de testes
├── docker-compose.yml
├── ARQUITETURA.md         # decisões de design e fluxo detalhado
└── arquitetura.excalidraw # diagrama da arquitetura
```

## Roadmap

Cada item começa por um teste que falha (TDD):

- [x] Ambiente Docker com Laravel e PostgreSQL
- [ ] `POST /api/pagamentos` sem `Idempotency-Key` → `400`
- [ ] Primeiro pagamento aprovado → `201`
- [ ] Mesma chave e mesmo corpo → mesma resposta, uma cobrança só
- [ ] Mesma chave com corpo diferente → `422`
- [ ] Gateway recusa → `402` (e o retry recebe `402` sem chamar o gateway)
- [ ] Gateway fora do ar → `503`, e o retry com a mesma chave aprova
- [ ] Validação do corpo
- [ ] Estornos (total, parcial e acima do saldo)
- [ ] Teste de concorrência: requisições simultâneas com a mesma chave
- [ ] Checkout em React

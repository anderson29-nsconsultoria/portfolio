# Portfólio Pessoal — Anderson Santos de Souza

Site pessoal construído como demonstração técnica: não é só uma vitrine
*sobre* Docker/Kubernetes, é *feito com* Docker e Kubernetes, de ponta a
ponta. O próprio site tem uma aba "Arquitetura" que explica como ele
funciona, alimentada por um endpoint da própria API (`/api/architecture`).

## Stack

- **Frontend**: HTML/CSS/JS estático, servido por Nginx (que também faz
  proxy reverso para a API em `/api`)
- **Backend**: Python 3.12 + FastAPI (documentação automática em `/docs`)
- **Banco**: PostgreSQL 16
- **Orquestração**: Docker Compose (local) e Kubernetes (produção)
- **Registry**: [Docker Hub](https://hub.docker.com/u/docker4linux26) (`docker4linux26/portfolio-backend`, `docker4linux26/portfolio-frontend`)
- **Repositório**: https://github.com/anderson-souza-tech/portfolio

## Estrutura

```
portfolio/
├── README.md
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/ (index.html, style.css, script.js)
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/ (main.py, database.py)
├── db-init/
│   └── 01-init.sql
├── k8s/manifests/       (namespace, secret, db, backend + HPA, frontend, ingress)
└── .github/workflows/   (CI de build das imagens)
```

## Rodando localmente (Docker Compose)

```bash
docker compose up -d
```

Acesse **http://localhost:8080**. A documentação interativa da API fica em
**http://localhost:8080/docs**.

## Rodando em Kubernetes (Docker Desktop)

Os manifests em `k8s/manifests/` já apontam para as imagens publicadas no
Docker Hub (`docker4linux26/portfolio-backend:1.0` e
`docker4linux26/portfolio-frontend:1.0`), com `imagePullPolicy: IfNotPresent`.

```bash
# 1. (Opcional) Build e push manual, sem depender do CI —
#    normalmente isso é feito pelo GitHub Actions a cada push na main
docker login
docker build -t docker4linux26/portfolio-backend:1.0 ./backend
docker build -t docker4linux26/portfolio-frontend:1.0 ./frontend
docker push docker4linux26/portfolio-backend:1.0
docker push docker4linux26/portfolio-frontend:1.0

# 2. Aplicar os manifests
kubectl apply -f k8s/manifests/

# 3. Acompanhar os pods
kubectl get pods -n portfolio -w
```

> Para testar mudanças locais sem publicar no registry a cada vez, buildar
> as imagens localmente com a mesma tag (`docker build -t
> docker4linux26/portfolio-backend:1.0 ./backend`) e trocar
> `imagePullPolicy` para `Never` nos manifests — assim o Kubernetes usa a
> imagem já existente no daemon local em vez de tentar puxar do Docker Hub.

Para acessar via navegador, adicione `127.0.0.1 anderson.nsconsultoria.cloud` ao
arquivo `hosts` do Windows e acesse `http://anderson.nsconsultoria.cloud` (ou
teste via `curl -H "Host: anderson.nsconsultoria.cloud" http://localhost/`).

## Recursos de Kubernetes usados (propositalmente, como demonstração)

- **Namespace** dedicado
- **Secret** para credenciais do banco
- **PersistentVolumeClaim** para dados do PostgreSQL
- **Deployments** com liveness/readiness probes em todos os serviços
- **HorizontalPodAutoscaler** no backend (escala por uso de CPU — requer
  `metrics-server` no cluster para funcionar de verdade)
- **Ingress** com proxy interno para a API via Nginx

## Publicando de verdade

- [ ] Trocar as credenciais placeholder (`TROCAR_ANTES_DE_SUBIR`) por segredos reais
- [x] Definir um registry de destino — Docker Hub (`docker4linux26`)
- [ ] Configurar `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` nos Secrets do
      repositório GitHub (Settings > Secrets and variables > Actions) para
      o CI conseguir publicar as imagens automaticamente
- [ ] Configurar TLS no Ingress (cert-manager ou certificado manual)
- [ ] Preencher o conteúdo real (seção "Sobre", skills, projetos) — hoje
      tem dados de exemplo no `db-init/01-init.sql`
- [ ] Instalar `metrics-server` no cluster se quiser o HPA funcionando de fato
- [x] Completar o workflow de CI com push para o registry escolhido

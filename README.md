# Biblioteca

API REST educativa para administrar una biblioteca. Utiliza Node.js, Express y
PostgreSQL, cuya estructura y datos iniciales se encuentran en `init.sql`.

## Funcionalidades

- Operaciones CRUD para usuarios, autores, libros y préstamos.
- Verificación de disponibilidad de la API mediante `/api/health`.
- Base de datos PostgreSQL inicializada automáticamente con Docker.
- Prueba de carga con Grafana k6 y 20 usuarios virtuales.
- Sin autenticación, pensada para fines educativos.

## Iniciar con Docker

```bash
docker compose up -d
```

La API queda disponible en `http://localhost:8080/api` y PostgreSQL en
`localhost:5432`.

Para detener los contenedores:

```bash
docker compose down
```

### Error de DNS durante la instalación de npm

Si la construcción falla con `EAI_AGAIN` o `getaddrinfo` al acceder a
`registry.npmjs.org`, configure servidores DNS para Docker en la máquina
virtual Debian:

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json >/dev/null <<'EOF'
{
  "dns": ["1.1.1.1", "8.8.8.8"]
}
EOF

sudo systemctl restart docker
docker compose build --no-cache api
docker compose up -d
```

Como alternativa temporal, puede construir usando la red del sistema anfitrión:

```bash
docker compose build --no-cache --network host api
docker compose up -d
```

## Iniciar la API localmente

Con PostgreSQL ejecutándose mediante Docker:

```bash
npm install
npm start
```

## Recursos REST

| Recurso | Operaciones |
|---|---|
| `/api/users` | `GET`, `POST` |
| `/api/users/:id` | `GET`, `PUT`, `DELETE` |
| `/api/authors` | `GET`, `POST` |
| `/api/authors/:id` | `GET`, `PUT`, `DELETE` |
| `/api/books` | `GET`, `POST` |
| `/api/books/:id` | `GET`, `PUT`, `DELETE` |
| `/api/loans` | `GET`, `POST` |
| `/api/loans/:id` | `GET`, `PUT`, `DELETE` |

Las operaciones `POST` y `PUT` reciben datos en formato JSON. Ejemplo:

```bash
curl -X POST http://localhost:8080/api/authors \
  -H 'Content-Type: application/json' \
  -d '{"name":"Jorge Luis Borges"}'
```

## Prueba de carga

La prueba utiliza Grafana k6 para ejecutar solicitudes simultáneas a los
endpoints de salud y consulta con 20 usuarios virtuales durante 10 segundos:

```bash
docker compose --profile loadtest run --rm k6
```

## Reiniciar la base de datos

Para borrar los datos y ejecutar `init.sql` nuevamente:

```bash
docker compose down -v
docker compose up -d
```

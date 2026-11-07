# Biblioteca

Base de datos PostgreSQL para una biblioteca, inicializada automáticamente con `init.sql`.

## Iniciar

```bash
docker compose up -d
npm start
```

La API queda disponible en `http://localhost:8080/api`.

Recursos REST disponibles:

- `GET|POST /users`
- `GET|PUT|DELETE /users/:id`
- `GET|POST /authors`
- `GET|PUT|DELETE /authors/:id`
- `GET|POST /books`
- `GET|PUT|DELETE /books/:id`
- `GET|POST /loans`
- `GET|PUT|DELETE /loans/:id`

Los endpoints `POST` y `PUT` reciben JSON. Ejemplo:

```bash
curl -X POST http://localhost:8080/api/authors \
  -H 'Content-Type: application/json' \
  -d '{"name":"Jorge Luis Borges"}'
```

La conexión queda disponible en `localhost:5432` con:

- Base de datos: `biblioteca`
- Usuario: `biblioteca`
- Contraseña: `biblioteca`

Para borrar la base y ejecutar `init.sql` nuevamente:

```bash
docker compose down -v
docker compose up -d
```

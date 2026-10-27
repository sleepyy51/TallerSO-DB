# Biblioteca

Base de datos PostgreSQL para una biblioteca, inicializada automáticamente con `init.sql`.

## Iniciar

```bash
docker compose up -d
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

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE authors (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE books (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(17) NOT NULL UNIQUE,
    published_year INTEGER CHECK (published_year > 0),
    author_id BIGINT NOT NULL REFERENCES authors(id)
);

CREATE TABLE loans (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    book_id BIGINT NOT NULL REFERENCES books(id),
    borrowed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    returned_at TIMESTAMPTZ,
    CHECK (returned_at IS NULL OR returned_at >= borrowed_at)
);

INSERT INTO users (name, email) VALUES
    ('Ana García', 'ana.garcia@example.com'),
    ('Luis Pérez', 'luis.perez@example.com'),
    ('María López', 'maria.lopez@example.com');

INSERT INTO authors (name) VALUES
    ('Gabriel García Márquez'),
    ('Isabel Allende'),
    ('Julio Cortázar');

INSERT INTO books (title, isbn, published_year, author_id) VALUES
    ('Cien años de soledad', '978-0307474728', 1967, 1),
    ('El amor en los tiempos del cólera', '978-0307389732', 1985, 1),
    ('La casa de los espíritus', '978-1501117015', 1982, 2),
    ('Rayuela', '978-0394757681', 1963, 3);

INSERT INTO loans (user_id, book_id, borrowed_at, returned_at) VALUES
    (1, 1, '2026-10-01 10:00:00-06', '2026-10-10 15:30:00-06'),
    (2, 3, '2026-10-15 09:00:00-06', NULL),
    (3, 4, '2026-10-20 14:00:00-06', NULL);

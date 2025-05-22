-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('mestre', 'comum'))
);

-- Tabela de combustíveis
CREATE TABLE IF NOT EXISTS combustiveis (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  tempo_exibicao INTEGER NOT NULL
);

-- Inserir dados iniciais de combustíveis
INSERT INTO combustiveis (tipo, preco, tempo_exibicao) VALUES 
('Gasolina', 5.79, 5),
('Etanol', 4.29, 5),
('Diesel', 4.99, 5)
ON CONFLICT DO NOTHING;

-- Inserir usuário mestre inicial (senha: admin123)
INSERT INTO usuarios (nome, email, senha_hash, tipo) VALUES 
('Admin Mestre', 'admin@posto.com', '$2a$10$xD7vZ5.5bJh5X5U5v5n5QO5v5n5QO5v5n5QO5v5n5QO5v5n5QO5v5n5QO', 'mestre')
ON CONFLICT (email) DO NOTHING;
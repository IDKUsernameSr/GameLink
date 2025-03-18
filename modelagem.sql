CREATE DATABASE puramoda;
USE puramoda;

CREATE TABLE Carrinhos (
    CarrinhoID INT AUTO_INCREMENT PRIMARY KEY,
    ProdutoID INT,
    ClienteID INT,
    Nome VARCHAR(100),
    Preco FLOAT,
    Tamanho VARCHAR(4),
    Quantidade INT
);

CREATE TABLE Clientes (
    ClienteID INT AUTO_INCREMENT PRIMARY KEY,
    CarrinhoID INT,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Senha VARCHAR(20) NOT NULL,
    Celular VARCHAR(20) NOT NULL,
    Endereco VARCHAR(100) NOT NULL,
    FOREIGN KEY (CarrinhoID) REFERENCES Carrinhos(CarrinhoID),
    UNIQUE (CarrinhoID)
);

CREATE TABLE CarrinhoItems (
    CarrinhoItemsID INT AUTO_INCREMENT PRIMARY KEY,
    ClienteID INT,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    tamanho VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    img VARCHAR(200),
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID) ON DELETE CASCADE
);
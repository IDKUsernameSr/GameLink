const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('Puramoda', 'root', 'aluno123', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
      timestamps: false,
    }
  });

// Pegando Tabela Clientes para Sequelize
const Clientes = sequelize.define('Clientes', {
    ClienteID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    Nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    Senha: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    Celular: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    Endereco: {
        type: DataTypes.STRING,
        allowNull: false
      },
  });

// Pegando Tabela Carrinho para Sequelize
const Carrinhos = sequelize.define('Carrinhos', {
  ProdutoID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ClienteID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },    
    Nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Preco: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    Tamanho: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
});

// Pegando Tabela CarrinhoItems para Sequelize
const CarrinhoItems = sequelize.define('CarrinhoItems', {
  CarrinhoItemsID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  ClienteID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preco: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tamanho: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
    },
});

  (async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado ao banco de dados!');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
})();

// Testa a conexão com o banco de dados
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Conectado ao banco de dados!');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }
}

// Sincroniza os modelos com o banco de dados
async function syncDatabase() {
    try {
        await sequelize.sync();
        console.log('Tabelas sincronizadas com sucesso!');
    } catch (err) {
        console.error('Erro ao sincronizar as tabelas:', err);
    }
}

module.exports = {
    sequelize,
    Clientes,
    Carrinhos,
    CarrinhoItems,
    testConnection,
    syncDatabase
};

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Clientes, CarrinhoItems, testConnection, syncDatabase, sequelize } = require('./db');

const app = express();
const PORT = 3000;

const sessionStore = new SequelizeStore({
  db: sequelize,  // Use your Sequelize instance
});

// Configura o middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.static(path.join(__dirname)));
app.use(express.static('public'));
app.use(express.json());

app.use(
  session({
      secret: 'your-secret-key', // Replace with a secure secret key
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
          maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
  })
);
app.use(cors({
  credentials: true // Allow cookies (session)
}));

// Testa a conexão com o banco de dados
testConnection();
sessionStore.sync();

// Responde a pagina home
app.get('/', (req, res) => {
  res.sendFile(path.join (__dirname, '/home.html'));
});

// Responde a pagina dos produtos
app.get('/produtos', (req, res) => {
  res.sendFile(__dirname + '/produtos.html');
});

// Responde as paginas das categorias
app.get('/categoria-blusa', (req, res) => {
  res.sendFile(__dirname + '/produtos-categoria-blusa.html');
});
app.get('/categoria-jeans', (req, res) => {
  res.sendFile(__dirname + '/produtos-categoria-jeans.html');
});
app.get('/categoria-vestidos', (req, res) => {
  res.sendFile(__dirname + '/produtos-categoria-vestidos.html');
});

// Responde a pagina dos produtos
app.get('/produto-individual', (req, res) => {
  res.sendFile(__dirname + '/produto-individual-template.html');
});

// Responde a pagina do carrinho
app.get('/carrinho', (req, res) => {
  res.sendFile(__dirname + '/carrinho.html');
});

// Responde a pagina do checkout
app.get('/checkout', (req, res) => {
  res.sendFile(__dirname + '/checkout.html');
});

// Página 404
app.get('/404', (req, res) => {
  res.sendFile(__dirname + '/404.html');
});

// Responde a pagina register
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

// Responde a pagina login
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Responde a pagina logout
app.get('/logout', (req, res) => {
  res.sendFile(__dirname + '/logout.html');
});

// Responde a pagina perfil
app.get('/perfil', (req, res) => {
  // Check if the user is logged in by checking the session
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.sendFile(path.join(__dirname, 'perfil.html'));
});

//comeco dos html dos produtos
app.get('/calca-jeans-preta', (req, res) => {
  res.sendFile(__dirname + '/produto-calca-jeans-preta.html');
});
app.get('/cropped-preto-e-branco', (req, res) => {
  res.sendFile(__dirname + '/produto-cropped-preto-e-branco.html');
});
app.get('/vestido-azul', (req, res) => {
  res.sendFile(__dirname + '/produto-vestido-azul.html');
});
app.get('/saia-jeans', (req, res) => {
  res.sendFile(__dirname + '/produto-saia-jeans.html');
});
app.get('/vestido-de-verao', (req, res) => {
  res.sendFile(__dirname + '/produto-vestido-de-verao.html');
});
app.get('/vestido-azul-marinho', (req, res) => {
  res.sendFile(__dirname + '/produto-vestido-azul-marinho.html');
});
app.get('/short-jeans-flor', (req, res) => {
  res.sendFile(__dirname + '/produto-shorts-jeans-flor.html');
});
app.get('/cropped-frio-preto', (req, res) => {
  res.sendFile(__dirname + '/produto-cropped-frio-preto.html');
});
app.get('/cropped-de-amarracao', (req, res) => {
  res.sendFile(__dirname + '/produto-cropped-de-amarracao.html');
});
app.get('/jaqueta-cropped-branca', (req, res) => {
  res.sendFile(__dirname + '/produto-jaqueta-cropped-branca.html');
});
app.get('/calca-jeans-azul', (req, res) => {
  res.sendFile(__dirname + '/produto-calca-jeans-azul.html');
});
app.get('/vestido-rosa', (req, res) => {
  res.sendFile(__dirname + '/produto-vestido-rosa.html');
});
app.get('/cropped-preta', (req, res) => {
  res.sendFile(__dirname + '/produto-cropped-preto.html');
});
app.get('/short-jeans', (req, res) => {
  res.sendFile(__dirname + '/produto-shorts-jeans.html');
});
app.get('/vestido-branco-rodado', (req, res) => {
  res.sendFile(__dirname + '/produto-vestido-branco-rodado.html');
});
app.get('/jeans', (req, res) => {
  res.sendFile(__dirname + '/produtos-categoria-jeans.html');
});
app.get('/vestidos-template', (req, res) => {
  res.sendFile(__dirname + '/produtos-categoria-vestidos.html');
});
app.get('/blusas', (req, res) => {
  res.sendFile(__dirname + '/produtos-categoria-blusa.html');
});

// Login e register

// Registro de usuário
app.post('/register', async (req, res) => {
  const { Nome, Email, Senha, Celular, Endereco } = req.body;

  try {

    // registrar novo usuario e carrinho
    const novoCliente = await Clientes.create({ Nome, Email, Senha, Celular, Endereco });

    req.session.user = {
      id: novoCliente.ClienteID,
      email: novoCliente.Email,
    };
    req.session.Carrinho = []; // Carrinho vazio associado ao usuário

    res.status(200).send({ message: 'Usuário registrado com sucesso', user: Clientes  });
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao registrar usuário');
  }
});

// Login do Cliente
app.post('/login', async (req, res) => {
  const { Email, Senha } = req.body;

  if (!Email || !Senha) {
    return res.status(400).send({ message: 'Email e senha são obrigatórios.' });
  }

  try {

    // achar email do cliente
    const cliente = await Clientes.findOne({ where: { Email } })

    if (!cliente)  {
      return res.status(400).send({ message: 'Cliente não encontrado' });
    }

    if (cliente.Senha === Senha) {

        req.session.user = {
          id: cliente.ClienteID,
          email: cliente.Email,
        };

        if (!req.session.Carrinho) {
          req.session.Carrinho = [];
        }

        res.status(200).send({ message: 'Login bem-sucedido!' });
    } else {
        res.status(400).send({ message: 'Senha incorreta' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erro ao fazer login.' });
  }
});


// logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: 'Erro ao fazer logout.' });
    }
    res.clearCookie('connect.sid');  // limpar cookies
    res.send({ message: 'Logout bem-sucedido!' });  // mensagem de sucesso
  });
});

// adicionar carrinho
app.post('/addcarrinho', async (req, res) => {
    try {
      const { nome, preco, tamanho, quantidade, imgLink } = req.body;
      const ClienteID = req.session.user.id;
      const img = imgLink || '';
      console.log('ClienteID:', ClienteID);

      if (!ClienteID) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

      req.session.Carrinhos = req.session.Carrinhos || [];
      req.session.Carrinhos.push({ nome, preco, tamanho, quantidade, img });

      const CartItems = await CarrinhoItems.create({ nome, preco, tamanho, quantidade, img, ClienteID });

      res.status(200).send({ message: 'Adicionado ao carrinho!'});

      } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        res.status(500).json({ message: 'Erro interno do servidor. Por favor, tente novamente mais tarde.' });
      }
  });

  app.get('/api/carrinho', async (req, res) => {
    try {
        const ClienteID = req.session.user.id;
        console.log(ClienteID);

        if (!ClienteID) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        const cartItems = await CarrinhoItems.findAll({ where: { ClienteID } });
        res.json(cartItems); // mandar items do carrinho como json
    } catch (error) {
        console.error('Erro ao carregar itens do carrinho:', error);
        res.status(500).json({ message: 'Erro ao carregar o carrinho.' });
    }
});

app.delete('/api/carrinho', async (req, res) => {
  try {
    const { CarrinhoItemsID } = req.body; // pegar id do carrinho
    const ClienteID = req.session.user.id;
    const cartItems = await CarrinhoItems.findAll({ where: { ClienteID } });
    console.log(cartItems);
    console.log('Request body:', req.body);
    console.log('Item ID:', CarrinhoItemsID);

    // encontrar o item baseado no item
    const itemIndex = cartItems.findIndex(item => item.CarrinhoItemsID === parseInt(CarrinhoItemsID));
    console.log(itemIndex);

    // se não encontrado retornar erro
    if (itemIndex === -1) {
        return res.status(404).json({ message: "Item não encontrado" });
    }
      // Remover item do carrinho
      cartItems.splice(itemIndex, 1);

      await CarrinhoItems.destroy({ where: { CarrinhoItemsID } });

      // responder com uma mensagem, remocao do item
      res.status(200).json({ message: "Item removido com sucesso", cartItems });
      } catch (error) {
        console.error('Erro ao carregar itens do carrinho:', error);
        res.status(500).json({ message: 'Erro ao carregar o carrinho.' });
    }
  });

  app.delete('/api/carrinho/clear', async (req, res) => {
    try {
      const ClienteID = req.session.user.id; // pegar clienteid
  
      if (!ClienteID) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }
  
      // remover os items do clienteid
      await CarrinhoItems.destroy({ where: { ClienteID } });
  
      res.status(200).json({ message: "Todos os itens foram removidos do carrinho." });
    } catch (error) {
      console.error('Erro ao limpar o carrinho:', error);
      res.status(500).json({ message: "Erro ao limpar o carrinho." });
    }
  });

  app.get('/api/profile', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        const ClienteID = req.session.user.id;
        const user = await Clientes.findOne({ where: { ClienteID } });
        console.log(user)

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({
          Email: user.Email,
          Nome: user.Nome,
          Celular: user.Celular,
          Endereco: user.Endereco,
        });
    } catch (error) {
        console.error('Erro ao buscar informações do perfil:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`servidor rodando na porta http://localhost:${PORT}/`);
  });
});
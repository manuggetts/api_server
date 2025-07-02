const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const promClient = require('prom-client');

const app = express();
app.use(express.json());

const PORT = 3333;

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Retorna todos os usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 */
app.get('/usuarios', (req, res) => {
  res.json([{ id: 1, nome: 'Manuella' }]);
});

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                   type: string
 */
app.post('/usuarios', (req, res) => {
  const novoUsuario = req.body;
  res.status(201).json(novoUsuario);
});

// registrador de métricas padrão
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

// contador de requisições
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'route', 'status_code'],
});

// Middleware
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsTotal.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/usuarios', (req, res) => {
  res.json([{ id: 1, nome: 'Manuella' }]);
});

app.post('/usuarios', (req, res) => {
  const novoUsuario = req.body;
  res.status(201).json(novoUsuario);
});

// prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Swagger http://localhost:${PORT}/api-docs`);
  console.log(`Métricas http://localhost:${PORT}/metrics`);
});
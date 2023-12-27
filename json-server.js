const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const PORT = 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom route to fetch and send posts
server.get('/posts', (req, res) => {
  const posts = router.db.get('posts').value();
  res.json(posts);
});

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});

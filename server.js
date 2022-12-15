const express = require("express");
const ejs = require("ejs");

const app = express();
const port = 8000;

ejs.configure("views", { ejs: app });
app.use(express.static("public"));
app.use(express.json());

//render the index.html template passing it the list of recipes returned by the getAllRecipes().
app.get("/", async (req, res) => {
  res.render("index.html", { recipes: await getAllRecipes() });
});

//render the recipe.html template passing it the details of the recipe returned by the getRecipeDetail(recipe_id)
app.get("/recipes/:recipe_id", async (req, res) => {
  const recipe = await getRecipeDetail(req.params.recipe_id);

  res.render("recipe.html", { recipe });
});

//send a JSON encoding of the list of comments returned by the getComments(recipe_id).
app.get("/recipes/:recipe_id/comments", async (req, res) => {
  const comments = await getComments(req.params.recipe_id);

  return res.json(comments);
});

//extract the comment from the form request. Send a JSON encoding of the metadata returned by the addComment(recipe_id,comment)
app.post("/recipes/:recipe_id/comments", async (req, res) => {
  const { comment, author } = req.body;

  const commentObj = {
    author,
    text: comment,
  };

  const metadata = await addComment(req.params.recipe_id, commentObj);

  return res.json(metadata);
});

app.listen(port, function () {
  console.log(`Server listening on port http://127.0.0.1:${port} !`);
});

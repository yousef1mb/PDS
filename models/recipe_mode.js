//importing the sqlite packages
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

//returns the data of all packages (Packages table)
const getAllPackages = async () => {
  const db = await sqlite.open({
    filename: "pckg_dlv.db",
    driver: sqlite3.Database,
  });

  const packages = await db.all("select * from Packages");
  await db.close();
  return packages;
};

//return information of users
const getAllUser = async () => {
  const db = await sqlite.open({
    filename: "pckg_dlv.db",
    driver: sqlite3.Database,
  });

  const users = await db.all("select * from sysUser");
  await db.close();
  return users;
};

//query the database to return one object holding all the details of the recipe with the id given. Return data from the recipes, ingredients, and method table.
const getRecipeDetail = async (recipe_id) => {
  const db = await sqlite.open({
    filename: "pckg_dlv",
    driver: sqlite3.Database,
  });

  const recipe_detail = await db.get(
    `SELECT * FROM recipes WHERE id = $recipe_id`,
    { $recipe_id: recipe_id }
  );
  const ingreds = await db.all(
    "SELECT item FROM ingredients WHERE recipe_id = $recipe_id",
    { $recipe_id: recipe_id }
  );
  const method = await db.all(
    "SELECT step FROM method WHERE recipe_id = $recipe_id",
    { $recipe_id: recipe_id }
  );

  await db.close();

  const items = ingreds.map((item) => item.item);
  const steps = method.map((step) => step.step);

  const recipe = { ...recipe_detail, items, steps };

  return recipe;
};

//query the comments table to return a list of all the comments for the recipe with the given id.
const getComments = async (recipe_id) => {
  const db = await sqlite.open({
    filename: "pckg_dlv",
    driver: sqlite3.Database,
  });

  const comments = await db.all(
    "SELECT * FROM comments WHERE recipe_id = $recipe_id",
    { $recipe_id: recipe_id }
  );
  await db.close();
  return comments;
};

//inserts in the comments table the comment given. Note the comment parameter is an object that holds the author and the text. And returns metadata about the inserted row.
const updateUser = async (recipe_id, comment) => {
  const db = await sqlite.open({
    filename: "pckg_dlv",
    driver: sqlite3.Database,
  });

  const metadata = await db.run(
    "UPDATE sysUser set Fname, Mname, Lname, Phone, Email, Password WHERE VALUES ($Fname, $Mname, $Lname, $Phone, $Email, $Password)",
    {
      $Fname: comment.author,
      $text: comment.text,
      $recipe_id: recipe_id,
      $author: comment.author,
      $text: comment.text,
      $recipe_id: recipe_id,
    }
  );
  await db.close();
  return metadata;
};

//export the functions we need that returns data from the db
module.exports = {
  getAllPackages,
  getAllUser,
  getComments,
  updateUser,
  addComment,
};

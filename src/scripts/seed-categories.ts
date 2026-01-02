import { db } from "@/drizzle/db";
import { CategoryTable } from "@/drizzle/schema";

const categoryNames = [
  "Cars and vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Film and animation",
  "How-to and style",
  "Music",
  "News and politics",
  "People and blogs",
  "Pets and animals",
  "Science and technology",
  "Sports",
  "Travel and events",
];

const main = async () => {
  console.log("Seeding categories");

  const values = categoryNames.map((name) => ({
    name,
    description: `Videos related to ${name.toLowerCase()}`,
  }));

  await db.insert(CategoryTable).values(values);

  console.log("Categories seeded successfully!");
  try {
  } catch (error) {
    console.error("Error seeding categories: ", error);
    process.exit(1);
  }
};

main();

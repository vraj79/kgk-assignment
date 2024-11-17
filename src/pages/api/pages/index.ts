// pages/api/pages/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import Page from "@/models/Page";
import sequelize from "@/lib/db";

// Generate a unique slug for a page
const generateSlug = async (title: string) => {
  let slug = title.toLowerCase().replace(/ /g, "-");
  const existingPage = await Page.findOne({ where: { slug } });

  if (existingPage) {
    slug = `${slug}-${Date.now()}`;
  }

  return slug;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await sequelize.sync(); // Ensure the DB is synced
  const { method } = req;

  switch (method) {
    case "GET":
      const pages = await Page.findAll();
      return res.status(200).json({ pages });

    case "POST":
      const { title, content } = req.body;
      if (!title || !content) {
        return res
          .status(400)
          .json({ error: "Title and content are required" });
      }

      try {
        const slug = await generateSlug(title);
        const newPage = await Page.create({ title, content, slug });
        return res.status(201).json(newPage);
      } catch (error) {
        console.error("Error creating new page:", error);
        return res.status(500).json({ error: "Failed to create new page" });
      }

    case "PUT":
      const { id, updatedTitle, updatedContent } = req.body;
      if (!id || !updatedTitle || !updatedContent) {
        return res
          .status(400)
          .json({ error: "ID, title, and content are required" });
      }

      try {
        const pageToUpdate = await Page.findByPk(id);
        if (!pageToUpdate) {
          return res.status(404).json({ error: "Page not found" });
        }

        const updatedSlug = await generateSlug(updatedTitle);
        await pageToUpdate.update({
          title: updatedTitle,
          content: updatedContent,
          slug: updatedSlug,
        });
        return res.status(200).json(pageToUpdate);
      } catch (error) {
        console.error("Error updating page:", error);
        return res.status(500).json({ error: "Failed to update page" });
      }

    case "DELETE":
      const { id: deleteId } = req.query;
      if (!deleteId) {
        return res.status(400).json({ error: "ID is required" });
      }

      try {
        const pageToDelete = await Page.findByPk(deleteId as string);
        if (!pageToDelete) {
          return res.status(404).json({ error: "Page not found" });
        }

        await Page.destroy({ where: { id: deleteId } });
        return res.status(204).end();
      } catch (error) {
        console.error("Error deleting page:", error);
        return res.status(500).json({ error: "Failed to delete page" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

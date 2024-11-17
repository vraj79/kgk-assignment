import { NextApiRequest, NextApiResponse } from "next";
import Post from "@/models/Post";
import sequelize from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await sequelize.sync(); // Ensure database sync
  const { method } = req;

  switch (method) {
    case "GET":
      const posts = await Post.findAll();
      return res.status(200).json({ posts });

    case "POST":
      const { title, content } = req.body;
      const slug = title.toLowerCase().replace(/ /g, "-");
      const newPost = await Post.create({ title, content, slug });
      return res.status(201).json(newPost);

    case "PUT":
      const { id, title: updatedTitle, content: updatedContent } = req.body;
      const postToUpdate = await Post.findByPk(id);
      if (!postToUpdate) {
        return res.status(404).json({ error: "Post not found" });
      }
      const updatedSlug = updatedTitle.toLowerCase().replace(/ /g, "-");
      await postToUpdate.update({
        title: updatedTitle,
        content: updatedContent,
        slug: updatedSlug,
      });
      return res.status(200).json(postToUpdate);

    case "DELETE":
      const { id: deleteId } = req.query;
      await Post.destroy({ where: { id: deleteId } });
      return res.status(204).end();

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { Plugin } from "@/models/Plugin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET": {
      const plugins = await Plugin.findAll();
      return res.status(200).json(plugins);
    }
    case "POST": {
      const { name, version } = req.body;
      const plugin = await Plugin.create({ name, version, isActive: true });
      return res.status(201).json(plugin);
    }
    case "PUT": {
      const { id, isActive } = req.body;
      await Plugin.update({ isActive }, { where: { id } });
      return res.status(200).json({ message: "Plugin updated." });
    }
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

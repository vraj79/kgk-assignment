import React, { useState, useEffect } from "react";

interface Plugin {
  id: number;
  name: string;
  version: string;
  isActive: boolean;
}

const Plugin: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [newPlugin, setNewPlugin] = useState<{ name: string; version: string }>(
    {
      name: "",
      version: "",
    }
  );

  // Fetch plugins from the API
  const fetchPlugins = async () => {
    try {
      const response = await fetch("/api/plugins", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch plugins.");
      }
      const data: Plugin[] = await response.json();
      setPlugins(data);
    } catch (error) {
      console.error("Error fetching plugins:", error);
    }
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  // Toggle plugin activation
  const togglePlugin = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch("/api/plugins", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update plugin status.");
      }

      // Update plugin state in UI
      setPlugins((prev) =>
        prev.map((plugin) =>
          plugin.id === id ? { ...plugin, isActive: !isActive } : plugin
        )
      );
    } catch (error) {
      console.error("Error toggling plugin:", error);
    }
  };

  // Add or update a plugin
  const savePlugin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/plugins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlugin),
      });

      if (!response.ok) {
        throw new Error("Failed to add or update the plugin.");
      }

      fetchPlugins();

      setNewPlugin({ name: "", version: "" }); // Reset form
    } catch (error) {
      console.error("Error saving plugin:", error);
    }
  };

  return (
    <div className="p-2 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Plugin Manager
      </h1>

      <form
        onSubmit={savePlugin}
        className="bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Add or Update Plugin
        </h2>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-600 font-medium mb-2"
          >
            Plugin Name:
          </label>
          <input
            type="text"
            id="name"
            value={newPlugin.name}
            onChange={(e) =>
              setNewPlugin({ ...newPlugin, name: e.target.value })
            }
            required
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="version"
            className="block text-gray-600 font-medium mb-2"
          >
            Version:
          </label>
          <input
            type="text"
            id="version"
            value={newPlugin.version}
            onChange={(e) =>
              setNewPlugin({ ...newPlugin, version: e.target.value })
            }
            required
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
        >
          Save Plugin
        </button>
      </form>

      {/* Plugin List */}
      <ul className="bg-white shadow-md rounded-lg p-3">
        {plugins?.map((plugin) => (
          <li
            key={plugin.id}
            className="flex items-center justify-between border-b border-gray-200 py-2 last:border-none"
          >
            <div>
              <span className="text-lg font-medium text-gray-800">
                {plugin.name}
              </span>{" "}
              <span className="text-sm text-gray-500">({plugin.version})</span>
            </div>
            <button
              onClick={() => togglePlugin(plugin.id, plugin.isActive)}
              className={`px-2 py-1 font-medium rounded-md transition ${
                plugin.isActive
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {plugin.isActive ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Plugin;

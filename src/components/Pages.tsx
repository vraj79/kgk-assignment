"use client";

import { useState, useEffect } from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
}

export default function Pages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pageId, setPageId] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  async function fetchPages() {
    const res = await fetch("/api/pages");
    const data = await res.json();
    setPages(data?.pages);
  }

  useEffect(() => {
    fetchPages();
  }, []);

  const handleFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isEditing) {
      await fetch(`/api/pages`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: pageId,
          updatedTitle: title,
          updatedContent: content,
        }),
      });
      setIsEditing(false);
      setPageId(0);
    } else {
      await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    }
    setTitle("");
    setContent("");
    fetchPages();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/pages?id=${id}`, {
      method: "DELETE",
    });
    fetchPages();
  };

  const handleEdit = (page: Page) => {
    setPageId(page.id);
    setTitle(page.title);
    setContent(page.content);
    setIsEditing(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-2">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-3">
        Manage Pages
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-6 rounded-lg shadow-lg mb-6"
      >
        <input
          type="text"
          required
          placeholder="Page Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={(_event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
        />
        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isEditing ? "Update Page" : "Create Page"}
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pages</h2>
        {pages.length > 0 ? (
          <div className="space-y-4">
            {pages.map((page) => (
              <div
                key={page.id}
                className="p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex justify-between items-start bg-gray-50"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    Title: {page.title}
                  </p>
                  <div className="">
                    Content:
                    <div
                      className="text-gray-600 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(page)}
                    className="text-blue-500 border border-blue-500 px-3 py-1 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="text-red-500 border border-red-500 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No pages available.</p>
        )}
      </div>
    </div>
  );
}

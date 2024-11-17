import { useState, useEffect } from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postId, setPostId] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  async function fetchPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data?.posts);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isEditing) {
      await fetch(`/api/posts`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: postId,
          title,
          content,
        }),
      });
      setIsEditing(false);
      setPostId(0);
    } else {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    }
    setTitle("");
    setContent("");
    fetchPosts();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/posts?id=${id}`, {
      method: "DELETE",
    });
    fetchPosts();
  };

  const handleEdit = (post: Post) => {
    setPostId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setIsEditing(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-2">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-3">
        Manage Posts
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-6 rounded-lg shadow-lg mb-6"
      >
        <input
          type="text"
          required
          placeholder="Post Title"
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
          {isEditing ? "Update Post" : "Create Post"}
        </button>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Posts</h2>
        {posts.length > 0 && (
          <div className="space-y-2">
            <ul className="list-decimal space-y-4">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow flex justify-between items-start"
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-800 mb-1">
                      Title: {post.title}
                    </p>
                    <div>
                      Content:
                      <div
                        className="text-gray-600 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </div>
                  </div>
                 
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-500 border border-blue-500 px-3 py-1 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 border border-red-500 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

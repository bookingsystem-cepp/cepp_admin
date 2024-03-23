import Layout from "@/components/Layout";
import axios from "axios";
import { useState, useEffect } from "react";
import { withSwal } from "react-sweetalert2";
import { useSession } from "next-auth/react";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const { data: session } = useSession();
  useEffect(() => {
    fetchCategories();
    console.log(session.user.id);
  }, []);
  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setParentCategory("");
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    const dataInfo = {
      name,
      parentCategory,
      location,
      owner: session.user.id,
      description,
    };
    console.log(dataInfo);
    if (editedCategory) {
      dataInfo._id = editedCategory._id;
      await axios.put("/api/categories", dataInfo);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", dataInfo);
    }
    setName("");
    setLocation("");
    setDescription("");
    fetchCategories();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setLocation(category.location);
    setDescription(category.description);
    setParentCategory(category.parent?._id);
  }
  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonTitle: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          const result = await axios.delete("/api/categories?_id=" + _id);
          if (result.data === "error") {
            swal.fire({
              title: "Can' Delete!",
              text: `Might have items in this category or child category`,
              confirmButtonColor: "primary",
            });
          }
          fetchCategories();
        }
      });
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"category name"}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <input
            type="text"
            placeholder={"location"}
            onChange={(ev) => setLocation(ev.target.value)}
            value={location}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Description</label>
          <textarea
            placeholder="description"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-default mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="btn-red"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);

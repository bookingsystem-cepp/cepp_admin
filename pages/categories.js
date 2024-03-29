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
  const [categories, setCategories] = useState([]);
  const { data: session } = useSession();

  async function fetchCategories() {
    await axios.get('https://backend.tirk101.online/api/category/get-by-owner/'+session?.user?.id)
    .then((result) => {
      setCategories(result.data);
    })
    .catch((err)=>{console.log(err)});
  }

  useEffect(() => {
    console.log(session?.user?.id)
    fetchCategories();
  }, [session?.user?.id]);

  async function saveCategory(ev) {
    ev.preventDefault();
    if (editedCategory) {
      await axios.put('https://backend.tirk101.online/api/category/update', {
        id: editedCategory._id,
        name: name,
        location: location,
        description: description,
      });
      setEditedCategory(null);
    } else {
      await axios.post("https://backend.tirk101.online/api/category/create", {
        name: name,
        location: location,
        ownerId: session?.user?.id,
        description: description,
      });
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
    //setParentCategory(category.parent?._id);
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
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("https://backend.tirk101.online/api/category/delete/" + _id);
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
            categories.map((category, key) => (
              <tr key={index}>
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

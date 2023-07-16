import React, { Component } from "react";
import "./style.css";
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      name: "",
      cities: [],
    };
  }

  componentDidMount() {
    this.fetchAllStores();
  }

  fetchAllStores = async () => {
    try {
      const response = await fetch("https://some-data.onrender.com/stores");
      if (!response.ok) {
        throw new Error("Failed to fetch stores");
      }
      const stores = await response.json();
      this.setState({ stores });
    } catch (error) {
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCitiesChange = (event) => {
    const selectedCities = Array.from(event.target.options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    this.setState({ cities: selectedCities });
  };

  createNewStore = async (event) => {
    event.preventDefault(); // Prevents the page from refreshing

    const { name, cities } = this.state;
    const newStore = { name, cities };

    try {
      const response = await fetch("https://some-data.onrender.com/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStore),
      });
      if (!response.ok) {
        throw new Error("Failed to create store");
      }
      const createdStore = await response.json();
      this.setState((prevState) => ({
        stores: [...prevState.stores, createdStore],
        name: "",
        cities: [],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  deleteStore = async (id) => {
    try {
      const response = await fetch(
        `https://some-data.onrender.com/stores/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete store");
      }
      this.setState((prevState) => ({
        stores: prevState.stores.filter((store) => store.id !== id),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { stores, name, cities } = this.state;

    return (
      <div>
        <h2>Stores</h2>

        {/* Table */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Cities</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.id}</td>
                <td>{store.name}</td>
                <td>{store.cities.join(", ")}</td>
                <td>
                  <button
                    onClick={() => this.deleteStore(store.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="form-view">
          <h3>Create New Store</h3>
          <form onSubmit={this.createNewStore}>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="cities">Cities:</label>
              <input
                type="text"
                id="cities"
                name="cities"
                value={cities}
                onChange={this.handleInputChange}
              />
            </div>

            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    );
  }
}

export default index;

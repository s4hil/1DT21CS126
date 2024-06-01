//FilterForm.js
import React from 'react';

const FilterForm = ({ filters, setFilters, onSubmit }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <form className="mb-4" onSubmit={onSubmit}>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
      <button type="submit" className="btn btn-primary">Filter</button>
    </form>
  );
};

export default FilterForm;

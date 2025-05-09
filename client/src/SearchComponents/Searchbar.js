import React, { useState } from "react";
import { MDBBtn, MDBIcon, MDBInputGroup } from "mdb-react-ui-kit";

export default function Searchbar() {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const newUrl = `/results?query=${encodeURIComponent(input)}`;
    window.location.href = newUrl;
  };

  return (
    <div>
      <MDBInputGroup tag="form" onSubmit={onSubmit} className="mx-3 my-1">
        <input
          className="form-control"
          placeholder="Type query"
          aria-label="Search"
          type="search"
          value={input}
          onChange={handleChange}
        />
        <MDBBtn rippleColor="dark">
          <MDBIcon icon="search" />
        </MDBBtn>
      </MDBInputGroup>
    </div>
  );
}

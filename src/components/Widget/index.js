import { useState } from "react";
import Search from "../Search";
import NavComponent from "../NavComponent";
import Chart from "../Chart";
import "./Widget.css";
import { Divider } from "antd";

const Widget = () => {
  localStorage.setItem(
    "favList",
    localStorage.getItem("favList") || JSON.stringify([])
  );

  return (
    <div id="widget">
      <div>
        <h1 className="page-title">Market</h1>
        <Divider />
        <NavComponent />
      </div>
      <Section />
    </div>
  );
};

const Section = () => {
  const [selectedValue, setSelectedValue] = useState("change");
  const [search, setSearch] = useState("");

  function searchOptionsOnChange(e) {
    setSelectedValue(e.target.value);
  }
  return (
    <div>
      <Search
        selectedValue={selectedValue}
        searchOptionsOnChange={searchOptionsOnChange}
        search={search}
        setSearch={setSearch}
      />
      <Chart search={search} selectedValue={selectedValue} />
    </div>
  );
};

export default Widget;

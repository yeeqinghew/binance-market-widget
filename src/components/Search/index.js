import { Col, Input, Radio, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const Search = (props) => {
  const { selectedValue, searchOptionsOnChange, search, setSearch } = props;

  return (
    <Row justify="middle">
      <Col flex="auto" className="search">
        <Input
          type="search"
          className="input"
          placeholder="Search"
          value={search}
          onChange={(evt) => setSearch(evt.target.value)}
          prefix={<SearchOutlined />}
        ></Input>
      </Col>
      <Col className="search-options">
        <Radio.Group value={selectedValue} onChange={searchOptionsOnChange}>
          <Radio value="change">Change</Radio>
          <Radio value="volume">Volume</Radio>
        </Radio.Group>
      </Col>
    </Row>
  );
};

export default Search;

import { Button, Table, Typography } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { useContext } from "react";
import { DataContext } from "../../DataContext";
const { Text } = Typography;

const Chart = (props) => {
  const { marketProducts } = useContext(DataContext);
  const { search, selectedValue } = props;

  function favHandler(item) {
    const favList = JSON.parse(localStorage.getItem("favList"));
    if (!favList.find((i) => i === item.s)) {
      favList.push(item.s);
      localStorage.setItem("favList", JSON.stringify(favList));
    }
  }

  function unfavHandler(item) {
    const favList = JSON.parse(localStorage.getItem("favList"));

    const newFavList = favList.filter((fav) => {
      return fav !== item.s;
    });
    localStorage.setItem("favList", JSON.stringify(newFavList));
  }

  const filtered = !search
    ? marketProducts
    : marketProducts.filter((item) =>
        item.s.includes(search.toUpperCase().replace("/", ""))
      );

  const columns = [
    {
      key: "1",
      title: "Pair",
      sorter: (a, b) => a.s.localeCompare(b.s),
      render: (pair, item) => {
        const favList = JSON.parse(localStorage.getItem("favList"));
        return (
          <>
            <Button
              type="text"
              onClick={() => {
                favList.length && favList.find((i) => i === item.s)
                  ? unfavHandler(item)
                  : favHandler(item);
              }}
              icon={
                favList.length && favList.find((i) => i === item.s) ? (
                  <StarFilled />
                ) : (
                  <StarOutlined />
                )
              }
            ></Button>
            <Text>
              {item.b}/{item.q}
            </Text>
          </>
        );
      },
    },
    {
      key: "2",
      title: "Last Price",
      sorter: (a, b) => a.c - b.c,
      render: (lastPrice, item) => {
        return Number(item.c) > 9 && Number(item.c) < 99.99 ? (
          <>{Number(item.c).toFixed(6)}</>
        ) : Number(item.c) > 99.99 && Number(item.c) < 999.99 ? (
          <>{Number(item.c).toFixed(5)}</>
        ) : Number(item.c) > 999.99 && Number(item.c) < 9999.99 ? (
          <>{Number(item.c).toFixed(4)}</>
        ) : Number(item.c) > 9999.99 && Number(item.c) < 99999.99 ? (
          <>{Number(item.c).toFixed(3)}</>
        ) : (
          <>{Number(item.c).toFixed(7)}</>
        );
      },
    },
    {
      key: "3",
      title: selectedValue === "change" ? "Change" : "Volume",
      sorter: (a, b) => {
        if (selectedValue === "change") {
          return a.c / a.o - b.c / b.o;
        } else {
          return a.v - b.v;
        }
      },
      render: (change, item) => {
        return selectedValue === "change" ? (
          ((item.c / item.o) * 100 - 100).toFixed(2) < 0 ? (
            <Text type="danger">
              {((item.c / item.o) * 100 - 100).toFixed(2)}%
            </Text>
          ) : (
            <Text type="success">
              +{((item.c / item.o) * 100 - 100).toFixed(2)}%
            </Text>
          )
        ) : (
          <Text>{item.v}</Text>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        size="small"
        columns={columns}
        dataSource={filtered}
        pagination={false}
        scroll={{ y: 500 }}
      ></Table>
    </div>
  );
};

export default Chart;

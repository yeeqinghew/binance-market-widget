import { Menu } from "antd";
import { StarFilled, CaretDownOutlined } from "@ant-design/icons";
import { useRef, useContext } from "react";
import { DataContext } from "../../DataContext";
const { SubMenu } = Menu;

const NavComponent = () => {
  const selectedKey = useRef(["BTC"]);
  const { setMarketProducts } = useContext(DataContext);

  async function prodFilter(product) {
    selectedKey.current = product;
    try {
      const response = await fetch(
        "https://www.binance.com/exchange-api/v1/public/asset-service/product/get-products"
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      let result;
      if (product === "BTC" || product === "BNB") {
        result = await json.data.filter((item) => item.pm === product);
      } else if (product === "FAV") {
        let res = [];
        JSON.parse(localStorage.getItem("favList")).forEach((item) => {
          for (let index = 0; index < json.data.length; index++) {
            if (item === json.data[index].s) {
              res.push(json.data[index]);
            }
          }
          return res;
        });
        result = res;
      } else {
        result = await json.data.filter((item) => item.q === product);
      }

      setMarketProducts(result);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Menu selectedKeys={selectedKey.current} mode="horizontal">
        <Menu.Item
          key="FAV"
          icon={<StarFilled />}
          onClick={() => prodFilter("FAV")}
        ></Menu.Item>
        <Menu.Item key="BNB" onClick={() => prodFilter("BNB")}>
          BNB
        </Menu.Item>
        <Menu.Item key="BTC" onClick={() => prodFilter("BTC")}>
          BTC
        </Menu.Item>
        <SubMenu
          key="altsSubmenu"
          title={
            <>
              ALTS
              <CaretDownOutlined />
            </>
          }
        >
          <Menu.Item key="XRP" onClick={() => prodFilter("XRP")}>
            XRP
          </Menu.Item>
          <Menu.Item key="ETH" onClick={() => prodFilter("ETH")}>
            ETH
          </Menu.Item>
          <Menu.Item key="TRX" onClick={() => prodFilter("TRX")}>
            TRX
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="usdSubmenu"
          title={
            <>
              USDⓈ
              <CaretDownOutlined />
            </>
          }
        >
          <Menu.Item key="BUSD" onClick={() => prodFilter("BUSD")}>
            BUSD
          </Menu.Item>
          <Menu.Item key="USDT" onClick={() => prodFilter("USDT")}>
            USDT
          </Menu.Item>
          <Menu.Item key="USDC" onClick={() => prodFilter("USDC")}>
            USDC
          </Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  );
};

export default NavComponent;

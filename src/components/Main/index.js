import { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { DataContext } from "../../DataContext";

const Main = (props) => {
  const socket = useRef(null);
  const [marketProducts, setMarketProducts] = useState([]);
  const [websocketOpen, setWebsocketOpen] = useState(true);

  useEffect(() => {
    async function run() {
      try {
        const response = await fetch(
          "https://www.binance.com/exchange-api/v1/public/asset-service/product/get-products"
        );
        if (!response.ok) {
          throw Error(response.statusText);
        }
        const json = await response.json();
        const result = await json.data.filter((item) => item.pm === "BTC");
        setMarketProducts([...result]);
      } catch (error) {
        console.error(error);
      }
    }

    run();
  }, []);

  useEffect(() => {
    socket.current = new WebSocket(
      "wss://stream.binance.com/stream?streams=!miniTicker@arr"
    );

    socket.current.onopen = () => {
      setWebsocketOpen(true);
      console.log("open");
    };
    socket.current.onclose = () => {
      setWebsocketOpen(false);
      console.log("close");
    };

    const wsCurrent = socket.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    if (!socket.current) return;

    socket.current.onmessage = (evt) => {
      if (!websocketOpen) return;
      console.log("******", websocketOpen);
      let result = JSON.parse(evt.data);
      let updatedData = marketProducts.map((item) => {
        for (let index = 0; index < result.data.length; index++) {
          if (item.s === result.data[index].s) {
            if (item.c < 1) {
              item = {
                ...item,
                c: Number(result.data[index].c).toFixed(7),
                v: Number(result.data[index].v).toFixed(2),
              };
            } else if (Number.isInteger(item.c)) {
              item = {
                ...item,
                c: Math.round(Number(result.data[index].c)),
                v: Number(result.data[index].v).toFixed(2),
              };
            } else {
              item = {
                ...item,
                c: Number(result.data[index].c).toFixed(2),
                v: Number(result.data[index].v).toFixed(2),
              };
            }
          }
        }
        return item;
      });
      setMarketProducts([...updatedData]);
    };
  }, [websocketOpen, marketProducts]);

  return (
    <>
      <DataContext.Provider value={{ marketProducts, setMarketProducts }}>
        {websocketOpen ? (
          <div>
            <Button
              type="primary"
              className="button-websocket"
              size="small"
              onClick={() => setWebsocketOpen(!websocketOpen)}
            >
              Restart WebSocket
            </Button>
            WebSocket connection open
          </div>
        ) : (
          <div>
            <Button
              type="primary"
              className="button-websocket"
              size="small"
              onClick={() => setWebsocketOpen(!websocketOpen)}
            >
              Restart WebSocket
            </Button>
            WebSocket connection closed
          </div>
        )}
        {props.children}
      </DataContext.Provider>
    </>
  );
};

export default Main;

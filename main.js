import { OpenRouter } from "@openrouter/sdk";
import { restClient } from "@massive.com/client-js";
import { AreaSeries, createChart } from 'lightweight-charts';
import "dotenv/config";
const openrouter = new OpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY
});

// FinancialDataAPI_Key = process.env.FINANCIAL_DATA_API_KEY_BY_MASSIVE;

const RestClientDataAPI = restClient(process.env.FINANCIAL_DATA_API_KEY_BY_MASSIVE, 'https://api.massive.com');

// making a request for historic stock data.
async function getHistoricStockData(ticker) {
  try{
    const response = await RestClientDataAPI.getStocksAggregates(
      {
        stocksTicker:ticker,
        multiplier:"1",
        timespan:"day",
        from:"2025-12-01",
        to:"2025-12-25",
        adjusted:"true",
        sort:"asc",
        limit: "120"
      }
    );
    console.log(response);
  }catch(e){
    console.log('An error happened: ' ,e);
  }
}


//Time and close price data;
let DatePriceObjectList = []
let priceData = getHistoricStockData("AAPL").results;
for(const priceObject in priceData){
  DatePriceObjectList.push({time:new Date(priceObject.t), value:priceObject.c});
}

const chartOptions = { layout: { textColor: 'white', background: { type: 'solid', color: 'black' } } };
const chart = createChart(document.querySelector('.content'),chartOptions);
const areaSeries = chart.addSeries(AreaSeries,{lineColor: '#2962FF', topColor: '#2962FF',
    bottomColor: 'rgba(41, 98, 255, 0.28)',});
    areaSeries.setData(DatePriceObjectList);
chart.timeScale().fitContent();

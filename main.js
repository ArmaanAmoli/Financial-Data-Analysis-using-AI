import { OpenRouter } from "@openrouter/sdk";
import { restClient } from "@massive.com/client-js";
import "dotenv/config";
// import { stream } from "@openrouter/sdk/lib/matchers.js";
const openrouter = new OpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY
});

// FinancialDataAPI_Key = process.env.FINANCIAL_DATA_API_KEY_BY_MASSIVE;
const RestClientDataAPI = restClient(process.env.FINANCIAL_DATA_API_KEY_BY_MASSIVE, 'https://api.massive.com');
// making a request for historic stock data.
async function getHistoricStockData(ticker, DateToday , DateYearAgo) {
  try{
    const response = await RestClientDataAPI.getStocksAggregates(
      {
        stocksTicker:ticker,
        multiplier:"1",
        timespan:"day",
        from:DateYearAgo,
        to:DateToday,
        adjusted:"true",
        sort:"asc",
        limit: "120"
      }
    );
    return response;
  }catch(e){
    return e;
  }
}

async function LLM(tick , data , today , YearBack){
  const response = await openrouter.chat.send({
    model:"xiaomi/mimo-v2-flash:free",
    messages:[
      {"role":"user",
        "content":`Stock Ticker: ${tick}\nFrom Date ${YearBack} to ${today}\nProvide analysis and Investment Advice for the given data\n${data}`
      }
    ],
    stream:false}
  )
  // return response.choices[0]?.delta?.content;
  return response;
  
}

function FormatDate(date){
    return date.toISOString().slice(0,10);
}

async function generate(Tick){
  let todayDate = new Date();
  let OneYearAgo = new Date(todayDate);
  OneYearAgo.setFullYear(todayDate.getFullYear()-1);
  todayDate = FormatDate(todayDate);
  OneYearAgo= FormatDate(OneYearAgo);
  const StockData = await getHistoricStockData(Tick,todayDate,OneYearAgo);
  const responseFromAi = await LLM(Tick , StockData , todayDate , OneYearAgo)
  const para = document.querySelector(".ResponsePara");
  para.textContent = responseFromAi.choices[0].message.content;
}

const AnalyseButton = document.querySelector(".submit-button");
const Ticker = document.querySelector(".ticker");
AnalyseButton.addEventListener("click" , function(){
  let Tick = Ticker.ariaValueMax;
  generate(Tick);
});

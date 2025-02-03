/* 

    真下にあるapiKeyの左辺を
    取得したAPIキーに置き換えてください（ダブルクォーテーションの間に）
    API取得方法の記事（https://auto-worker.com/blog/?p=1612#toc_id_4）

*/

var apiKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// 天気予報データの処理

// 都市のデータ
/*
データ構造
    cityName: htmlで使用するid
    displayName: 表示する文字列
    lat: 緯度(Google Mapの左の数値)
    lon: 経度(Google Mapの右の数値)
*/

let localDatas = [
    {
        cityName: "Sapporo",
        displayName: "札幌",
        lat: 43.07579931130803,
        lon: 141.35486686261726,
    },
    {
        cityName: "Sendai",
        displayName: "仙台",
        lat: 38.28154933433309,
        lon: 140.86705410133413,
    },
    {
        cityName: "Tokyo",
        displayName: "東京",
        lat: 35.688126732985125,
        lon: 139.76939345848703,
    },
    {
        cityName: "Kanazawa",
        displayName: "金沢",
        lat: 36.580664669560086,
        lon: 136.65969926711716,
    },
    {
        cityName: "Nagoya",
        displayName: "名古屋",
        lat: 35.257094766996595,
        lon: 136.91392774706733,
    },
    {
        cityName: "Osaka",
        displayName: "大阪",
        lat: 34.724827141227856,
        lon: 135.51354211321944,
    },
    {
        cityName: "Okayama",
        displayName: "岡山",
        lat: 34.68943160430332,
        lon: 133.92754628644,
    },
    {
        cityName: "Fukuoka",
        displayName: "福岡",
        lat: 33.56735024709979,
        lon: 130.36474036426256,
    },
];

// スライドアニメーションのイージングの計算
let slideAnime = `@keyframes slideAnime
                 { 0% { top : -100%;}
                 ${(100 / localDatas.length) * 0.1}% { top: 0;}
                 ${(100 / localDatas.length) * 0.9}% { top: 0;}
                 ${100 / localDatas.length}% { top: 100%;}
                 100% { top: 100%;}`;

let css = document
    .getElementById("css")
    .insertAdjacentHTML("afterbegin", slideAnime);

let weatherList = document.getElementById("weather-list");
const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const targetDateString = tomorrow.toISOString().split("T")[0];

localDatas.forEach((city, idx) => {
    // 天気APIリクエスト
    const query_params = new URLSearchParams({
        appid: apiKey,
        lat: city.lat,
        lon: city.lon,
        lang: "ja",
        units: "metric",
        exclude: "current,minutely,alerts",
        // , "minutely", "daily", "alerts"
    });

    fetch("https://api.openweathermap.org/data/2.5/forecast?" + query_params)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            responsedWeather = data;
            console.log(responsedWeather);
            const forecastsForDay = data.list.filter(forecast =>
                forecast.dt_txt.startsWith(targetDateString)
            );
            const aggregatedMin = Math.min(...forecastsForDay.map(f => f.main.temp_min));
            const aggregatedMax = Math.max(...forecastsForDay.map(f => f.main.temp_max));
            // at 6am, noon, 6pm
            weatherList.innerHTML += `<div class="weather" id=${city.cityName}>
                                        <div class="text-data">
                                            <div class="local-label">${
                                                city.displayName
                                            }</div>
                                                <div class="weather-values">
                                                    <div class="min-temp">${
                                                        Math.round(
                                                            aggregatedMin
                                                        ) + "℃"
                                                    }</div>
                                                    <div class="max-temp">${
                                                        Math.round(
                                                            aggregatedMax
                                                        ) + "℃"
                                                    }</div>
                                                </div>
                                        </div>
                                        <img
                                            class="weather-icon"
                                            id=${"img-" + city.cityName + '9am'}
                                            src=${
                                                "https://openweathermap.org/img/w/" +
                                                forecastsForDay[2].weather[0]
                                                    .icon +
                                                ".png"
                                            }
                                            alt="Weather icon 6"
                                        />
                                        <img
                                            class="weather-icon"
                                            id=${"img-" + city.cityName + 'noon'}
                                            src=${
                                                "https://openweathermap.org/img/w/" +
                                                forecastsForDay[4].weather[0]
                                                    .icon +
                                                ".png"
                                            }
                                            alt="Weather icon noon"
                                        />
                                        <img
                                            class="weather-icon"
                                            id=${"img-" + city.cityName + '6pm'}
                                            src=${
                                                "https://openweathermap.org/img/w/" +
                                                forecastsForDay[6].weather[0]
                                                    .icon +
                                                ".png"
                                            }
                                            alt="Weather icon 6"
                                        />
                                    </div>`;
            // 数に応じたCSSの調整
            weatherBlock = document.getElementById(city.cityName);
            weatherBlock.style.animation = `slideAnime ${
                localDatas.length * 4
            }s ease infinite`;
            weatherBlock.style.animationDelay = 4 * idx + "s";
        });
});

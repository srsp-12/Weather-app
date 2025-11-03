import React, { useState } from "react";

const apiKey = "27dbddea8d63d0fc43b3c30d32c4168c";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  async function searchCity() {
    if (!city) return;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("City not found.");
      const data = await response.json();
      setWeatherData(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    }
  }

  function getHourlyHTML(hourlyData) {
    return hourlyData.map((item) => {
      const time = item.dt_txt.split(" ")[1].slice(0, 5);
      const icon = item.weather[0].icon;
      return (
        <div
          className="hourly-entry"
          key={item.dt}
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "12px",
            textAlign: "center",
            minWidth: "100px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            transition: "transform 0.25s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <div style={{ fontWeight: "600", marginBottom: "6px", color: "#005f8a" }}>
            {time}
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt="icon"
            style={{ width: "55px", height: "55px" }}
          />
          <div
            style={{
              background: "linear-gradient(135deg, #0077b6, #00b4d8)",
              color: "white",
              borderRadius: "20px",
              padding: "4px 10px",
              marginTop: "6px",
              display: "inline-block",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            {Math.round(item.main.temp)}°C
          </div>
        </div>
      );
    });
  }

  function toggleHourly(day) {
    // placeholder for expanding hourly forecast for that day
  }

  const forecastsByDay = {};
  if (weatherData) {
    weatherData.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!forecastsByDay[date]) forecastsByDay[date] = [];
      forecastsByDay[date].push(item);
    });
  }

  const days = weatherData ? Object.keys(forecastsByDay) : [];

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        background: "linear-gradient(120deg, #f0f8ff, #d0e7ff)",
        minHeight: "100vh",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#edaaaacc",
          backdropFilter: "blur(8px)",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          width: "90%",
          maxWidth: "950px",
        }}
      >
        <h1
          style={{
            color: "#000000ff",
            textAlign: "center",
            fontWeight: "700",
            marginBottom: "20px",
          }}
        >
          🌤 Weather Forecast
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "25px",
          }}
        >
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              padding: "10px 14px",
              width: "240px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
          <button
            onClick={searchCity}
            style={{
              padding: "10px 18px",
              background: "#6f5027ff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        {error && (
          <p style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        {weatherData && days.length > 0 && (
          <>
            {/* Today forecast */}
            <div
              className="forecast-today"
              style={{
                background: "linear-gradient(135deg, #000000ff, #2a7da6ff)",
                padding: "20px",
                marginBottom: "25px",
                borderRadius: "12px",
                boxShadow: "inset 0 0 8px rgba(0,0,0,0.05)",
              }}
            >
              <h2
                style={{
                  marginBottom: "15px",
                  textAlign: "center",
                  color: "#add7f5ff",
                }}
              >
                Today — {days[0]}
              </h2>

              {/* Hourly forecast scroll box */}
              <div
                className="hourly-forecast"
                style={{
                  display: "flex",
                  gap: "16px",
                  overflowX: "auto",
                  padding: "10px 0",
                  scrollBehavior: "smooth",
                }}
              >
                {getHourlyHTML(forecastsByDay[days[0]])}
              </div>
            </div>

            {/* Other days forecast grid */}
            <div
              className="forecast-grid"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "center",
              }}
            >
              {days.slice(1).map((day) => {
                const weatherIcon = forecastsByDay[day][0].weather[0].icon;
                const avgTemp = (
                  forecastsByDay[day].reduce(
                    (sum, item) => sum + item.main.temp,
                    0
                  ) / forecastsByDay[day].length
                ).toFixed(1);
                return (
                  <div
                    key={day}
                    className="forecast-card"
                    onClick={() => toggleHourly(day)}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "14px",
                      padding: "15px",
                      width: "150px",
                      height: "160px",
                      boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "transform 0.25s, box-shadow 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.06)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 18px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 3px 12px rgba(0,0,0,0.1)";
                    }}
                  >
                    <strong>{day}</strong>
                    <br />
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
                      alt="icon"
                      style={{ width: "60px", height: "60px" }}
                    />
                    <br />
                    {avgTemp}°C
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

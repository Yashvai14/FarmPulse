import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location') || 'Nagpur'
  
  const apiKey = process.env.WEATHER_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ error: 'Weather API key not configured' }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    )
    
    if (!response.ok) {
      throw new Error('Weather API request failed')
    }
    
    const data = await response.json()
    
    const weatherData = {
      location: `${data.name}, ${data.sys.country}`,
      temp: `${Math.round(data.main.temp)}°C`,
      condition: data.weather[0].main,
      humidity: `${data.main.humidity}%`,
      description: data.weather[0].description,
      windSpeed: `${data.wind.speed} m/s`,
      pressure: `${data.main.pressure} hPa`,
      advice: getWeatherAdvice(data.weather[0].main, data.main.temp)
    }
    
    return NextResponse.json(weatherData)
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}

function getWeatherAdvice(condition: string, temp: number): string {
  if (condition === 'Rain') {
    return 'Good for irrigation, avoid harvesting'
  } else if (temp > 35) {
    return 'Very hot, ensure adequate irrigation'
  } else if (temp < 10) {
    return 'Cold weather, protect sensitive crops'
  } else {
    return 'Ideal conditions for farming activities'
  }
}
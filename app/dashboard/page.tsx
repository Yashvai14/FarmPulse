"use client"

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import NavBar from '@/components/navBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return null
  }

  const features = [
    {
      title: "Crop Suggestions",
      description: "Get AI-powered crop recommendations",
      href: "/features/crop-suggestions",
      icon: "🌱"
    },
    {
      title: "Weather Forecast",
      description: "Check weather conditions for your area",
      href: "/features/weather",
      icon: "🌤️"
    },
    {
      title: "Market Prices",
      description: "View current market prices for crops",
      href: "/features/market-price",
      icon: "💰"
    },
    {
      title: "Farming Calendar",
      description: "Track your farming activities",
      href: "/features/farming-calendar",
      icon: "📅"
    },
    {
      title: "Geo Mapping",
      description: "Visualize your farmland",
      href: "/features/mapping",
      icon: "🗺️"
    },
    {
      title: "Disease Predictor",
      description: "Identify crop diseases using AI",
      href: "/features/predictor",
      icon: "🔬"
    }
  ]

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {session.user?.name}!
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your farm with our smart tools
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <a href={feature.href}>Open {feature.title}</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
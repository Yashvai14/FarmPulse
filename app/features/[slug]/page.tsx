import { notFound } from 'next/navigation'
import CropSuggestionForm from '@/app/(pages)/crop-suggestions/page'
import WeatherPage from '@/app/(pages)/weather/page'
import MarketSearch from '@/app/(pages)/market-price/page'
import FarmingCalendarPage from '@/app/(pages)/farming-calendar/page'
import GeoMappingPage from '@/app/(pages)/mapping/page'
import PredictorPage from '@/app/(pages)/predictor/page'

const featureComponents = {
  'crop-suggestions': CropSuggestionForm,
  'weather': WeatherPage,
  'market-price': MarketSearch,
  'farming-calendar': FarmingCalendarPage,
  'mapping': GeoMappingPage,
  'predictor': PredictorPage,
}

interface FeaturePageProps {
  params: {
    slug: string
  }
}

export default function FeaturePage({ params }: FeaturePageProps) {
  const Component = featureComponents[params.slug as keyof typeof featureComponents]
  
  if (!Component) {
    notFound()
  }
  
  return <Component />
}

export function generateStaticParams() {
  return Object.keys(featureComponents).map((slug) => ({
    slug,
  }))
}
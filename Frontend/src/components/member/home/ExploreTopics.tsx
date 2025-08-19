import React from 'react'
import {
  LuPodcast,
  LuGamepad2,
  LuMusic,
  LuAppWindow,
  LuPalette,
  LuClapperboard,
  LuHeartHandshake,
  LuLightbulb,
  LuSprout,
} from 'react-icons/lu'
import TopicCard from './TopicCard'
import { FaPenToSquare } from 'react-icons/fa6'

const topics = [
  { title: 'Podcasts & shows', Icon: LuPodcast, color: 'bg-red-500' },
  { title: 'Tabletop games', Icon: LuGamepad2, color: 'bg-blue-500' },
  { title: 'Music', Icon: LuMusic, color: 'bg-orange-500' },
  { title: 'Writing', Icon: FaPenToSquare, color: 'bg-pink-500' },
  { title: 'Apps & software', Icon: LuAppWindow, color: 'bg-indigo-500' },
  { title: 'Visual arts', Icon: LuPalette, color: 'bg-sky-500' },
  { title: 'Video games', Icon: LuClapperboard, color: 'bg-purple-500' },
  { title: 'Lifestyle', Icon: LuSprout, color: 'bg-green-500' },
  { title: 'Handicrafts', Icon: LuHeartHandshake, color: 'bg-yellow-500' },
  { title: 'Social Impact', Icon: LuLightbulb, color: 'bg-rose-500' },
]

const ExploreTopics: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="mb-4 text-2xl font-bold text-[rgb(var(--color-text-primary))]">
        Explore topics
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {topics.map((topic) => (
          <TopicCard key={topic.title} {...topic} />
        ))}
      </div>
    </div>
  )
}

export default ExploreTopics

import React from 'react'
import { IconType } from 'react-icons'

interface TopicCardProps {
  title: string
  Icon: IconType
  color: string
}

const TopicCard: React.FC<TopicCardProps> = ({ title, Icon, color }) => {
  return (
    <a
      href="#"
      className={`group relative flex h-32 items-end overflow-hidden rounded-xl p-4 text-white transition-transform duration-300 hover:scale-105 ${color}`}
    >
      <Icon className="absolute -right-4 -top-4 h-24 w-24 text-white/10 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
      <h3 className="text-lg font-bold">{title}</h3>
    </a>
  )
}

export default TopicCard

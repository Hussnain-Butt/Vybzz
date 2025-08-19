import React from 'react'
import Header from '../../components/member/home/Header'
import CategoryFilters from '../../components/member/home/CategoryFilters'
import RecentlyVisited from '../../components/member/home/RecentlyVisited'
import CreatorCarousel from '../../components/member/home/CreatorCarousel'
import ExploreTopics from '../../components/member/home/ExploreTopics'

const creatorsForYou = [
  {
    name: 'Alexey Melnikov',
    description: 'creating MISTerFPGA...',
    image:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    name: 'Jane Doe',
    description: 'Creating podcasts',
    image:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    name: 'nxgamer',
    description: 'Game & Hardware analysis',
    image:
      'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    name: 'Last Stand Media',
    description: 'Longform gaming content',
    image:
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    name: 'RetroRGB',
    description: 'All things retro gaming',
    image:
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    name: 'Lingus Mafia',
    description: 'The best comedy podcasts',
    image:
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
]

const popularThisWeek = [
  {
    name: 'The Art Corner',
    description: 'Digital painting tutorials',
    image:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    name: 'Tech Unpacked',
    description: 'Weekly tech news',
    image:
      'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    name: 'Food Lab',
    description: 'Creating amazing recipes',
    image:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    name: 'Minimalist Homes',
    description: 'Interior design inspiration',
    image:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    name: 'The Welsh Twins',
    description: 'Robert and James Welsh',
    image:
      'https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
]

const MemberHome: React.FC = () => {
  return (
    <div className="h-full w-full overflow-y-auto bg-[rgb(var(--color-background-dark))] text-[rgb(var(--color-text-primary))] custom-scrollbar">
      <Header />
      <main>
        <CategoryFilters />
        <RecentlyVisited />
        <CreatorCarousel title="Creators for you" creators={creatorsForYou} />
        <CreatorCarousel title="Popular this week" creators={popularThisWeek} />
        <ExploreTopics />
      </main>
    </div>
  )
}

export default MemberHome

import React from 'react';
import StoryCard from './StoryCard';

const stories = [
	{
		id: '1',
		name: 'Elon Musk',
		src: 'https://links.papareact.com/4zn',
		profile: 'https://links.papareact.com/kxk'
	},
	{
		id: '2',
		name: 'Bill Gates',
		src: 'https://links.papareact.com/4u4',
		profile: 'https://links.papareact.com/zvy'
	},
	{
		id: '3',
		name: 'Elon Musk',
		src: 'https://links.papareact.com/4zn',
		profile: 'https://links.papareact.com/kxk'
	},
	{
		id: '4',
		name: 'Mark Zuckemberg',
		src: 'https://links.papareact.com/xql',
		profile: 'https://links.papareact.com/snf'
	},
	{
		id: '5',
		name: 'Jeff Bezoz',
		src: 'https://links.papareact.com/k2j',
		profile: 'https://links.papareact.com/f0p'
	}
];

export default function Stories() {
	return (
		<div className="flex justify-center space-x-3 mx-auto">
			{stories.map((story) => {
				return <StoryCard key={story.id} name={story.name} src={story.src} profile={story.profile} />;
			})}
		</div>
	);
}

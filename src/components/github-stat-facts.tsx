import { Octokit } from '@octokit/rest'
import axios from 'axios'
import { BookUp, Star, Users } from 'lucide-react'
import React, { useState } from 'react'
import GitHubCalendar from 'react-github-calendar'
import { Button } from './ui/button'
import { Card, CardContent, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Skeleton } from './ui/skeleton'

interface UserData {
	username: string
	avatar: string
	profileUrl: string
	repositories: number
	followers: number
	stars: number
	commits?: number
}

const GitHubStatTistics: React.FC = () => {
	const [username, setUsername] = useState<string>('ghana7989')
	const [funnyStats, setFunnyStats] = useState<
		{
			for: string
			fact: string
			count: number
		}[]
	>([])
	const [userData, setUserData] = useState<UserData | null>(null)
	const [generateClicked, setGenerateClicked] = useState(false)

	const fetchGitHubData = async (
		username: string
	): Promise<UserData | null> => {
		const octokit = new Octokit({
			// auth: personalAccessToken,
		})

		try {
			const { data: user } = await octokit.users.getByUsername({ username })
			const { data: repos } = await octokit.repos.listForUser({
				username,
				per_page: 100,
			})

			const stars = repos.reduce(
				(total, repo) => total + (repo.stargazers_count || 0),
				0
			)
			return {
				username: user.login,
				avatar: user.avatar_url,
				profileUrl: user.html_url,
				repositories: user.public_repos,
				followers: user.followers,
				stars,
			}
		} catch (error) {
			console.error('Error fetching GitHub data:', error)
			return null
		}
	}

	const fetchNumberFact = async (
		number: number,
		type: 'trivia' | 'math' | 'date' | 'year' = 'trivia'
	): Promise<string> => {
		try {
			const response = await axios.get(
				`https://numbersapi.com/${number}/${type}?json`
			)
			return response.data.text
		} catch (error) {
			console.error('Error fetching number fact:', error)
			return `No interesting fact found for number ${number}`
		}
	}

	const generateFunnyStatistics = async (
		data: UserData
	): Promise<
		{
			for: string
			fact: string
			count: number
		}[]
	> => {
		const repoFact = await fetchNumberFact(data.repositories, 'math')
		// const commitFact = await fetchNumberFact(data.commits, 'math')
		const followerFact = await fetchNumberFact(data.followers, 'math')
		const starFact = await fetchNumberFact(data.stars, 'math')

		return [
			{
				for: 'Repositories',
				fact: `With ${data.repositories} repositories, ${repoFact}`,
				count: data.repositories,
			},

			{
				for: 'Followers',
				fact: `Having ${data.followers} followers is impressive, considering ${followerFact}`,
				count: data.followers,
			},
			{
				for: 'Stars',
				fact: `Your ${data.stars} stars shine bright because ${starFact}`,
				count: data.stars,
			},
		]
	}

	const handleGenerate = async () => {
		setGenerateClicked(true)
		const data = await fetchGitHubData(username)
		if (data) {
			setUserData(data)
			const stats = await generateFunnyStatistics(data)
			setFunnyStats(stats)
		} else {
			setFunnyStats([])
		}
	}
	if (!userData) {
		return (
			<div className='container w-1/3 px-4 py-8 flex flex-col justify-center items-center'>
				{/* <div className='flex flex-col align-middle justify-center'> */}
				<h2 className='text-2xl font-bold mb-4 text-center'>
					Let's see Facts about your Stats
				</h2>
				<Input
					type='text'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder='username'
					className='border p-2 w-full mb-4'
				/>
				<Button onClick={handleGenerate} disabled={generateClicked}>
					Generate Facts
				</Button>
			</div>
		)
	}
	return (
		<div
			className={`container flex flex-col justify-center items-center min-h-screen gap-6 p-16`}
		>
			<div className='text-center'>
				<img
					src={userData.avatar}
					alt='Avatar'
					className='rounded-full w-24 h-24 mx-auto'
				/>
				<h2 className='text-xl font-bold mt-4'>{userData.username}</h2>
				<p>
					<a href={userData.profileUrl} className='text-blue-500'>
						github.com/{userData.username}
					</a>
				</p>
			</div>
			<div className='mt-6 max-w-max'>
				<GitHubCalendar username={userData.username} />
			</div>
			<div className='mt-6 flex gap-6'>
				<div className='flex items-baseline gap-4'>
					<BookUp size={24} />
					<span className='text-3xl text-green-400'>
						{userData.repositories}
					</span>
				</div>
				<Separator orientation='vertical' />
				<div className='flex items-baseline gap-4'>
					<Star size={24} />
					<span className='text-3xl text-yellow-400'>{userData.stars}</span>
				</div>
				<Separator orientation='vertical' />
				<div className='flex items-baseline gap-4'>
					<Users size={24} />
					<span className='text-3xl text-orange-400'>{userData.followers}</span>
				</div>
			</div>
			{funnyStats ? (
				<div className='mt-6 text-center'>
					<h2 className='font-bold mb-6'>Funny Statistics:</h2>
					<div className='container flex flex-row gap-4 flex-wrap'>
						{funnyStats.map((stat) => (
							<Card className='w-64' key={stat.for}>
								<CardTitle className='p-3'>
									{stat.for}- {stat.count}
								</CardTitle>
								<Separator />
								<CardContent className='p-3'>{stat.fact}</CardContent>
							</Card>
						))}
					</div>
				</div>
			) : (
				<Skeleton className='w-64 h-64' />
			)}
			<Button
				onClick={() => {
					setFunnyStats([])
					setUserData(null)
					setGenerateClicked(false)
				}}
			>
				Check Another User
			</Button>
		</div>
	)
}

export default GitHubStatTistics

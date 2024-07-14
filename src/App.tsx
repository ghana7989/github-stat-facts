import GithubStatFacts from './components/github-stat-facts'
import { SiteFooter } from './components/site-footer'

function App() {
	return (
		<>
			<div
				className='container flex flex-col justify-center items-center gap-6 p-16'
				style={{
					height: '90vh',
				}}
			>
				<GithubStatFacts />
			</div>
			<SiteFooter />
		</>
	)
}

export default App

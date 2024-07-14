export function SiteFooter() {
	return (
		<footer className='py-6 md:px-8 md:py-0'>
			<div className='container flex flex-col items-center w-max justify-between gap-4 md:h-24 md:flex-row'>
				<p className='text-balance text-center text-sm leading-loose text-muted-foreground md:text-left'>
					Built by{' '}
					<a
						href='https://www.github.com/ghana7989'
						target='_blank'
						rel='noreferrer'
						className='font-medium underline underline-offset-4'
					>
						Chindukuri Pavan
					</a>
					. The source code is available on{' '}
					<a
						href='https://www.github.com/ghana7989/github-stat-facts'
						target='_blank'
						rel='noreferrer'
						className='font-medium underline underline-offset-4'
					>
						GitHub
					</a>
					.
				</p>
			</div>
		</footer>
	)
}

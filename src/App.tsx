import { Calendar } from "./pages/calendar/calendar";

export default function Home() {
	return (
		<div className='flex flex-col justify-between min-h-screen bg-gray-50 p-4'>
			<div className='flex justify-center items-center flex-grow'>
				<Calendar />
			</div>
			<footer className='text-center p-4'>
				<a
					href='https://github.com/AdityaBhate'
					target='_blank'
					rel='noopener noreferrer'>
					made by Aditya Bhate
				</a>
			</footer>
		</div>
	);
}

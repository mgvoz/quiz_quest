import logo from './banner.png';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Quiz from './Quiz.js';

function App() {
	const [showQuiz, setShowQuiz] = useState(false);
	return (
		<div className='page-container'>
			{showQuiz === false ? (
				<center>
					<div className='logo-container'>
						<img
							className='logo-image'
							src={logo}
							alt='quiz_quest logo'
						></img>
					</div>
					<div className='secondary-page-container'>
						<h1 className='main-page-heading'>
							Welcome to quiz_quest!
						</h1>
						<h2 className='main-page-heading-2'>
							Click the start button to begin your 15 question
							general knowledge quiz
						</h2>
					</div>
					<button
						className='start-button'
						onClick={() => setShowQuiz(true)}
					>
						start
					</button>
				</center>
			) : (
				<Quiz />
			)}
		</div>
	);
}

export default App;

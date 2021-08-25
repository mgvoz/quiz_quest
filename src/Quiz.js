import { useState, useEffect } from 'react';
import logo from './banner.png';
import { Fireworks } from 'fireworks-js/dist/react';

function Quiz() {
	//set varibles
	const [score, setScore] = useState(0);
	const [questionNum, setQuestionNum] = useState(1);
	const [questionList, setQuestionList] = useState([]);
	const [startFireworks, setStartFireworks] = useState(false);
	let selected;

	//api call for questions
	useEffect(() => {
		fetch('https://opentdb.com/api.php?amount=16&category=9')
			.then((res) => res.json())
			.then((data) => {
				setQuestionList(data.results);
			});
	}, []);

	//fireworks animation
	const options = {
		speed: 5,
		boundaries: {
			x: 50,
			y: 50,
			width: '100%',
			height: '100%',
		},
		delay: { min: 0, max: 10 },
	};
	const style = {
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
		position: 'fixed',
	};

	//buttons
	const answerChoices = document.getElementsByName('answer-choices');

	const checkAnswer = () => {
		for (var i = 0; i < answerChoices.length; i++) {
			if (answerChoices[i].checked) {
				selected = answerChoices[i].value;
			}
		}
		if (selected === questionList[questionNum]?.correct_answer) {
			setScore(score + 1);
			setStartFireworks(true);
		} else {
			if (questionNum === 15) {
				alert('Incorrect! Your final score is...');
			} else {
				alert('Incorrect! Next question...');
			}
			nextQuestion();
		}
	};

	const nextQuestion = () => {
		for (var h = 0; h < answerChoices.length; h++) {
			if (answerChoices[h].checked === true) {
				setStartFireworks(false);
				if (questionNum < 16) {
					setQuestionNum(questionNum + 1);
				}
				//clear radio button selections
				for (var j = 0; j < answerChoices.length; j++) {
					answerChoices[j].checked = false;
				}
			} else {
				alert('Must select an answer.');
			}
		}
	};
	console.log(answerChoices);
	const finalScore = (score / 15).toFixed(2).split('.')[1];

	//RANDOMIZE ANSWER CHOICES, make sure one answer choice is required

	return (
		<div className='page-container'>
			<center>
				<div className='logo-container'>
					<img
						className='logo-image'
						src={logo}
						alt='quiz_quest logo'
					></img>
				</div>
				{questionNum <= 15 ? (
					<>
						{startFireworks && (
							<Fireworks options={options} style={style} />
						)}
						<h1 className='quiz-page-heading'>
							General Knowledge Quiz
						</h1>
						<div className='question-container'>
							<h2>Question {questionNum}</h2>
							<p>{questionList[questionNum]?.question}</p>
							<form>
								{questionList[
									questionNum
								]?.incorrect_answers.map((ans, key) => {
									return (
										<div key={key}>
											<input
												name='answer-choices'
												className='radio-buttons'
												type='radio'
												id={ans}
												value={ans}
												required
											></input>
											<label htmlFor={ans}>{ans}</label>
											<br />
										</div>
									);
								})}
								<input
									name='answer-choices'
									className='radio-buttons'
									type='radio'
									id={
										questionList[questionNum]
											?.correct_answer
									}
									value={
										questionList[questionNum]
											?.correct_answer
									}
									required
								></input>
								<label
									htmlFor={
										questionList[questionNum]
											?.correct_answer
									}
								>
									{questionList[questionNum]?.correct_answer}
								</label>
								<br />
								<button
									onClick={() => checkAnswer()}
									type='button'
									className='check-answer-button'
								>
									check answer
								</button>

								<button
									onClick={() => nextQuestion()}
									type='button'
									className='next-question-button'
								>
									{questionNum === 15
										? 'see score'
										: 'next question'}
								</button>
							</form>
						</div>
						<p className='score'>Correct answers: {score}</p>
					</>
				) : (
					<>
						<h1 className='quiz-page-heading'>
							General Knowledge Quiz
						</h1>
						<Fireworks options={options} style={style} />
						<div className='question-container'>
							<center>
								<h2>Quiz Complete!</h2>
								<h3>Your score:</h3>
								<h4>{score}/15</h4>
								<h4>{finalScore}%</h4>
							</center>
						</div>
						<button
							onClick={() => window.location.reload()}
							type='button'
							className='start-over-button'
						>
							start over?
						</button>
					</>
				)}
			</center>
		</div>
	);
}

export default Quiz;

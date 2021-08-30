import { useState, useEffect } from 'react';
import logo from './banner.png';
import { Fireworks } from 'fireworks-js/dist/react';
var he = require('he');

function Quiz() {
	//set varibles
	const [score, setScore] = useState(0);
	const [questionNum, setQuestionNum] = useState(1);
	const [questionList, setQuestionList] = useState([]);
	const [startFireworks, setStartFireworks] = useState(false);
	let selected;
	const [loading, setLoading] = useState(true);

	//set loading screen
	useEffect(() => {
		setTimeout(() => setLoading(false), 3000);
	}, []);

	//randomize answer choices
	const randomize = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	};

	//api call for questions
	useEffect(() => {
		fetch('https://opentdb.com/api.php?amount=16&category=9')
			.then((res) => res.json())
			.then((data) => {
				setQuestionList(data.results);
				const questions = data.results.map(
					(q) => `${he.decode(q.question)};`,
				);

				const answers = data.results.map(
					(a) =>
						`${randomize(
							Array.of(
								a.incorrect_answers.map((a) => he.decode(a)),
								he.decode(a.correct_answer),
							).flat(),
						)}*`,
				);
				localStorage.setItem('questions', questions);
				localStorage.setItem('answers', answers);
			})
			.catch((e) => console.log(e));
	}, []);

	const questions = localStorage.getItem('questions')?.split(';,');
	const answers = localStorage.getItem('answers')?.split('*,');

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

	const checkAnswer = (e) => {
		e.preventDefault();
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
				alert(
					`Incorrect! The correct answer was ${he.decode(
						questionList[questionNum]?.correct_answer,
					)}. Your final score is...`,
				);
			} else {
				alert(
					`Incorrect! The correct answer was ${he.decode(
						questionList[questionNum]?.correct_answer,
					)}. Next question...`,
				);
			}
			nextQuestion();
		}
	};

	const nextQuestion = () => {
		const choicesArray = Array.from(answerChoices);
		if (choicesArray.filter((c) => c.checked).length === 0) {
			alert('Must select and check an answer.');
		} else {
			setStartFireworks(false);
			if (questionNum < 16) {
				setQuestionNum(questionNum + 1);
			}
			//clear radio button selections
			for (var j = 0; j < answerChoices.length; j++) {
				answerChoices[j].checked = false;
			}
		}
	};

	const finalScore = (score / 15).toFixed(2).split('.')[1];

	return (
		<>
			{loading === false ? (
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
									<Fireworks
										options={options}
										style={style}
									/>
								)}
								<h1 className='quiz-page-heading'>
									General Knowledge Quiz
								</h1>
								<p className='instructions'>
									Instructions: Read the question and select
									your answer. You must check your answer in
									order to earn points!
								</p>
								<div className='question-container'>
									<h2>Question {questionNum}</h2>
									<p>
										{questions[questionNum].includes(';')
											? questions[questionNum].replace(
													';',
													'',
											  )
											: questions[questionNum]}
									</p>
									<form>
										{answers[questionNum]
											.split(',')
											.map((ans) => {
												return (
													<div key={ans}>
														<input
															name='answer-choices'
															className='radio-buttons'
															type='radio'
															id={ans}
															value={ans}
														></input>
														<label htmlFor={ans}>
															{ans.includes('*')
																? ans.replace(
																		'*',
																		'',
																  )
																: ans}
														</label>
														<br />
													</div>
												);
											})}
										<div className='button-container'>
											<button
												onClick={(e) => checkAnswer(e)}
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
											<button
												onClick={() =>
													window.location.reload()
												}
												type='button'
												className='check-answer-button'
											>
												start over
											</button>
										</div>
									</form>
								</div>
								<p className='score'>
									Correct answers: {score}
								</p>
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
										<h4>
											{score === 15
												? '100%'
												: finalScore + '%'}
										</h4>
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
			) : (
				<h1 className='loading'>Loading your quiz...</h1>
			)}
		</>
	);
}

export default Quiz;

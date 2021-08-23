import React, { useState, useEffect } from 'react';
import logo from './banner.png';

function Quiz() {
	const [score, setScore] = useState(0);
	const [questionNum, setQuestionNum] = useState(1);
	const [questionList, setQuestionList] = useState([]);
	const [questionIndex, setQuestionIndex] = useState(0);

	useEffect(() => {
		fetch('https://opentdb.com/api.php?amount=15&category=9')
			.then((res) => res.json())
			.then((data) => {
				setQuestionList(data.results);
			});
	}, []);

	const submitButton = (e) => {
		e.preventDefault();
		if (questionNum <= 14) {
			setQuestionNum(questionNum + 1);
		}
		//check if answer correct, change score:
		setScore(score + 1);
		setQuestionIndex(questionIndex + 1);
		//clear radio button selections
	};

	console.log(questionList);

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
				<h1>General Knowledge Quiz</h1>
				<div className='question-container'>
					<h2>Question {questionNum}</h2>
					<p>{questionList[questionIndex]?.question}</p>
					<form onSubmit={submitButton}>
						{questionList[questionIndex]?.incorrect_answers.map(
							(ans, key) => {
								return (
									<div key={key}>
										<input
											name='answer-choices'
											type='radio'
											id={ans}
											value={ans}
										></input>
										<label htmlFor={ans}>{ans}</label>
										<br />
									</div>
								);
							},
						)}
						<input
							name='answer-choices'
							type='radio'
							id='option4'
							value='option from db'
						></input>
						<label htmlFor='option4'>
							{questionList[questionIndex]?.correct_answer}
						</label>
						<br />
						<button type='submit' className='submit-button'>
							submit
						</button>
					</form>
				</div>
				<p className='score'>Correct answers: {score}</p>
			</center>
		</div>
	);
}

export default Quiz;

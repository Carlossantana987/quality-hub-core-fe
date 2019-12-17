import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { CREATE_REVIEW } from '../Resolvers';
import Rating from './2_Rating';
import './ReviewForm.scss';

const ReviewForm = props => {
  const [fields, setFields] = useState({rating: 0, review: ""})
  const [fieldsError, setError] = useState({rating: ""})
  const [hoverIdx, setHover] = useState();
  const messages = [
    '',
    'Never again!',
    'Meh.',
    'Not bad.',
    'Solid!',
    'Super great!'
  ]

  const handleHover = (e, index) => {
    setHover(index);
  }

  const handleChange = e => {
    e.preventDefault();
    setFields({...fields, [e.target.name]: e.target.value})
  }

  const handleClick = (e, index) => {
    setFields({...fields, rating: index })
    setHover(index);
    checkError(index);
  }

  const handleSubmit = e => {
    e.preventDefault();
    let id = props.id;
    if (checkError(fields.rating)) {
      submitReview({variables: { review: fields.review, rating: Number(fields.rating), uniqueBooking: id}})
    }
  }

  const checkError = (rating) => {
    if (!rating) {
      setError({...fieldsError, rating: "Rating must be at least one star"})
      return false
    } else {
      setError({...fieldsError, rating: ""})
      return true
    }
  }

  let stars = [];

  for (let i = 0; i < 5; i++) {
    stars.push(<Rating hoverIdx={hoverIdx} handleHover={handleHover} handleClick={handleClick} index={i + 1} fields={fields} />)
  }

  const [submitReview, { called, error }] = useMutation(CREATE_REVIEW);

  useEffect(() => {
    if (called && !error) {
      props.setOpen(true);
    }
  }, [called])

	return (
		<form className='review-form' onChange={handleChange} onSubmit={handleSubmit}>
      <div className='review-container'>
        <div className='rating-form'>
          <p className='label'>How did {props.location.state.firstName} do? </p>
          {fieldsError.rating && <p>{fieldsError.rating}</p>}
          <div className='rating-container'>
            <div className={`stars-container ${fieldsError.rating ? 'error' : ''}`}>
              {stars}
            </div>
            <p className='message'>{messages[hoverIdx]}</p>
          </div> 
        </div>
        <div className='review-text'>
          <p className='label'>Any feedback you want to share?</p>
          <textarea className='review-text-area' name='review' placeholder='I thought the interview was...' value={fields.review}/>
        </div>
      </div>
      <div className='button-container'>
        <Link to ='/interviewq/history' className='review-button button cancel'><button>Cancel</button></Link>
        <p className='review-button button submit'><button>Submit</button></p>
      </div>
		</form>
	);
};

export default ReviewForm;

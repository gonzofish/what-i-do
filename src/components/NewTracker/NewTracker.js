import React from 'react'
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NewTracker = ({ onSubmit }) => {
  return (
    <form
      autoComplete="off"
      className="input-group"
      onSubmit={(event) => {
        const { elements } = event.target;

        event.preventDefault();
        onSubmit(elements.newTracker.value);
        elements.newTracker.value = '';
      }}
    >
      <input
        name="newTracker"
        type="text"
      />
      <button
        title="Add Tracker"
        type="submit"
      >
        <FontAwesomeIcon icon="plus" />
      </button>
    </form>
  )
}

NewTracker.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default NewTracker


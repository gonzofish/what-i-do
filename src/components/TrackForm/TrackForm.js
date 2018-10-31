import React from 'react'
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  formatDate,
  formatTime,
} from '../../shared/dates';

const TrackForm = ({ onCancel, onSave }) => {
  const now = new Date();
  const defaultDate = formatDate(now);
  const defaultTime = formatTime(now);

  return (
    <form onSubmit={(event) => { save(event, onSave); }}>
      {renderInput('date', 'date', defaultDate)}
      {renderInput('time', 'time', defaultTime)}
      {renderInput('value', 'number', 0)}

      <div className="buttons">
        <button
          title="Save Tracking Data"
          type="submit"
        >
          <FontAwesomeIcon icon="save" />
          <span>Save</span>
        </button>

        <button
          onClick={onCancel}
          title="Cancel Tracking Data"
          type="button"
        >
          <FontAwesomeIcon icon="ban" />
          <span>Cancel</span>
        </button>
      </div>
    </form>
  )
};

const save = (event, onSave) => {
  event.preventDefault();

  const {
    date,
    time,
    value,
  } = event.target.elements;
  const dateTime = `${date.value} ${time.value}`;

  onSave(new Date(dateTime), value.value);
};

const renderInput = (name, type, defaultValue) => (
  <label htmlFor="trackValue">
    {`${name[0].toUpperCase()}${name.slice(1)}`}:
    <input
      defaultValue={defaultValue}
      id={name}
      name={name}
      type={type}
    />
  </label>
)

TrackForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default TrackForm


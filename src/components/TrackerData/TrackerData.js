import React from 'react'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { formatDateTime } from '../../shared/dates';

const TrackerData = ({ data, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Value</th>
          <th>&nbsp;</th>
        </tr>
      </thead>

      <tbody>
        {data.map((point, index) => (
          renderRow(point, index, onDelete)
        ))}
      </tbody>
    </table>
  )
};

const renderRow = (point, index, onDelete) => (
  <tr key={point.date.valueOf()}>
    <td>{formatDateTime(point.date)}</td>
    <td>{point.value}</td>
    <th>
      <button
        onClick={() => onDelete(index)}
        title="Delete data point"
        type="button"
      >
        <FontAwesomeIcon icon="trash" />
      </button>
    </th>
  </tr>
)

TrackerData.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TrackerData


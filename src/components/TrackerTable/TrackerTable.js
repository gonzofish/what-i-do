import React from 'react'
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TrackerTable = ({ onAction, trackers }) => {
  return (
    <table>
      {renderHead()}

      <tbody>
        {trackers.map((tracker, index) => (
          <tr key={tracker.id}>
            <td>{tracker.name}</td>
            <td>{tracker.data.length}</td>
            <td>
              {renderButtons(tracker, index, onAction)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
};

const renderHead = () => (
  <thead>
    <tr>
      <th>Tracker</th>
      <th>Data Points</th>
      <th>&nbsp;</th>
    </tr>
  </thead>
);

const renderButtons = (tracker, index, onAction) => (
  <div className="button-group">
    <button
      onClick={() => { onAction('track', tracker.id); }}
      title={`Track "${tracker.name}"`}
      type="button"
    >
      <FontAwesomeIcon icon="pencil-alt" />
    </button>

    <button
      onClick={() => { onAction('view', tracker.id); }}
      title={`View "${tracker.name}" Data`}
      type="button"
    >
      <FontAwesomeIcon icon={['far', 'eye']} />
    </button>

    <button
      onClick={() => { onAction('remove', tracker.id); }}
      title={`Remove "${tracker.name}"`}
      type="button"
    >
      <FontAwesomeIcon icon="trash" />
    </button>
  </div>
);

TrackerTable.propTypes = {
  onAction: PropTypes.func.isRequired,
  trackers: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default TrackerTable

